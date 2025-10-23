import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * Props expected:
 * - vans, setVans, selectedVan, setSelectedVan, setStats, passengerResponses, stopCoordinates, styles, COLORS
 *
 * Important: This component MUST NOT call parent setState during render.
 * All updates to parent state are done inside effects or event handlers.
 */
export default function LiveTrackingSection({
  vans = [],
  setVans,
  selectedVan,
  setSelectedVan,
  setStats,
  passengerResponses = [],
  stopCoordinates = {},
  styles,
  COLORS,
}) {
  // defensive vans array
  const currentVans = Array.isArray(vans) ? vans : [];

  const [isPlaying, setIsPlaying] = useState(false);
  const mapRef = useRef(null);

  // progress per-van (initialize defensively)
  const [vanProgress, setVanProgress] = useState(() =>
    (currentVans || []).reduce((acc, van) => ({ ...acc, [van.id]: 0 }), {})
  );

  // animated positions container (mutable ref)
  const vanPositions = useRef({});

  // ensure Animated.Values exist for each van
  useEffect(() => {
    currentVans.forEach((van) => {
      if (!vanPositions.current[van.id]) {
        vanPositions.current[van.id] = {
          latitude: new Animated.Value((van.currentLocation && van.currentLocation.latitude) || 0),
          longitude: new Animated.Value((van.currentLocation && van.currentLocation.longitude) || 0),
          rotation: new Animated.Value(0),
          scale: new Animated.Value(1),
        };
      }
    });

    // optional cleanup for removed vans
    Object.keys(vanPositions.current).forEach((id) => {
      if (!currentVans.find((v) => String(v.id) === String(id))) {
        delete vanPositions.current[id];
      }
    });
  }, [vans]); // depends on vans state only

  const stopsToCoords = useCallback(
    (stops = []) =>
      (stops || [])
        .map((s) => stopCoordinates[s])
        .filter((c) => c && typeof c.latitude === 'number' && typeof c.longitude === 'number'),
    [stopCoordinates]
  );

  const fitToRoute = useCallback(
    (van) => {
      if (!mapRef.current || !van) return;
      const coords = stopsToCoords(van.stops);
      if (coords.length > 1) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      } else if (coords.length === 1) {
        mapRef.current.animateToRegion(
          {
            latitude: coords[0].latitude,
            longitude: coords[0].longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      }
    },
    [stopsToCoords]
  );

  // Animation loop — runs in effect, so NOT during render
  useEffect(() => {
    if (!isPlaying) {
      // visual reset for en-route vans
      currentVans.forEach((van) => {
        const pos = vanPositions.current[van.id];
        if (pos && van.status === 'En Route') {
          Animated.parallel([
            Animated.timing(pos.scale, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(pos.rotation, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]).start();
        }
      });
      return;
    }

    const interval = setInterval(() => {
      // update vanProgress and vans in one async callback (safe)
      setVanProgress((prev) => {
        const newProgress = { ...prev };

        // build updatedVans array (we won't call setVans in the render path)
        const updatedVans = currentVans.map((van) => {
          if (van.status !== 'En Route') return van;

          const prevVal = prev[van.id] || 0;
          newProgress[van.id] = Math.min((prevVal + 0.005) % 1, 0.99);

          const stops = Array.isArray(van.stops) ? van.stops : [];
          const totalSegments = Math.max(stops.length - 1, 1);
          const segmentIndex = Math.floor(newProgress[van.id] * totalSegments);
          const segmentProgress = (newProgress[van.id] * totalSegments) % 1;

          if (segmentIndex >= totalSegments) {
            // mark completed (visual animation below)
            const pos = vanPositions.current[van.id];
            if (pos) {
              Animated.sequence([
                Animated.timing(pos.scale, { toValue: 1.3, duration: 300, useNativeDriver: true }),
                Animated.timing(pos.scale, { toValue: 1, duration: 300, useNativeDriver: true }),
              ]).start();
            }

            // update stats via parent setter (allowed — inside effect)
            if (typeof setStats === 'function') {
              setStats((s) => ({ ...s, completedTrips: (s.completedTrips || 0) + 1, ongoingTrips: Math.max((s.ongoingTrips || 1) - 1, 0) }));
            }

            return {
              ...van,
              status: 'Completed',
              eta: '0 min',
              currentStop: van.stops ? van.stops[van.stops.length - 1] : van.currentStop,
              completedStops: van.stops || van.completedStops || [],
              currentLocation: (van.stops && stopCoordinates[van.stops[van.stops.length - 1]]) || van.currentLocation,
              passengersList: (van.passengersList || []).map((p) => ({ ...p, status: 'picked', pickupTime: p.pickupTime || new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }) })),
            };
          }

          const startStop = stops[segmentIndex];
          const endStop = stops[segmentIndex + 1];
          const start = (startStop && stopCoordinates[startStop]) || van.currentLocation || { latitude: 0, longitude: 0 };
          const end = (endStop && stopCoordinates[endStop]) || van.currentLocation || start;

          const newLat = start.latitude + (end.latitude - start.latitude) * segmentProgress;
          const newLng = start.longitude + (end.longitude - start.longitude) * segmentProgress;

          const pos = vanPositions.current[van.id];
          if (pos) {
            // lat/lng must useNativeDriver:false
            Animated.parallel([
              Animated.timing(pos.latitude, { toValue: newLat, duration: 100, useNativeDriver: false }),
              Animated.timing(pos.longitude, { toValue: newLng, duration: 100, useNativeDriver: false }),
              Animated.sequence([Animated.timing(pos.scale, { toValue: 1.05, duration: 150, useNativeDriver: true }), Animated.timing(pos.scale, { toValue: 1, duration: 150, useNativeDriver: true })]),
              Animated.timing(pos.rotation, { toValue: Math.atan2(end.longitude - start.longitude, end.latitude - start.latitude) * (180 / Math.PI), duration: 100, useNativeDriver: true }),
            ]).start();
          }

          // passenger/completedStops update logic (safe)
          let updatedPassengers = Array.isArray(van.passengersList) ? van.passengersList : [];
          let updatedCompletedStops = Array.isArray(van.completedStops) ? van.completedStops : [];
          const nextStop = stops[segmentIndex] || van.currentStop;

          const distance = Math.sqrt(Math.pow(newLat - start.latitude, 2) + Math.pow(newLng - start.longitude, 2));
          if (distance < 0.0005 && startStop && !updatedCompletedStops.includes(startStop)) {
            updatedCompletedStops = [...updatedCompletedStops, startStop];
            updatedPassengers = updatedPassengers.map((p) => {
              const passenger = (passengerResponses || []).find((pr) => pr.name === p.name);
              if (passenger && passenger.pickupPoint === startStop) {
                return { ...p, status: 'picked', pickupTime: new Date().toLocaleTimeString('en-PK', { timeZone: 'Asia/Karachi' }) };
              }
              return p;
            });
            if (pos) {
              Animated.sequence([Animated.timing(pos.scale, { toValue: 1.4, duration: 200, useNativeDriver: true }), Animated.timing(pos.scale, { toValue: 1, duration: 200, useNativeDriver: true })]).start();
            }
          }

          const remainingDistance = (1 - newProgress[van.id]) * 15;
          const etaMinutes = Math.round((remainingDistance / 40) * 60);

          return {
            ...van,
            currentLocation: { latitude: newLat, longitude: newLng },
            currentStop: nextStop,
            completedStops: updatedCompletedStops,
            eta: `${etaMinutes} min`,
            speed: 40,
            passengersList: updatedPassengers,
            passengers: updatedPassengers.filter((p) => p.status === 'picked').length,
          };
        });

        // Now update parent vans state — important: this call happens inside an effect/interval,
        // not during render, so React won't throw the "setState in render" error.
        if (typeof setVans === 'function') {
          setVans((prevVans) => {
            // merge updates by id to avoid overwriting unrelated props
            return prevVans.map((pv) => {
              const upd = updatedVans.find((u) => u && u.id === pv.id);
              return upd ? { ...pv, ...upd } : pv;
            });
          });
        }

        // center map on selected van safely (also not in render)
        if (selectedVan && mapRef.current) {
          const found = updatedVans.find((v) => v.id === selectedVan.id);
          if (found && found.currentLocation) {
            mapRef.current.animateToRegion(
              { latitude: found.currentLocation.latitude, longitude: found.currentLocation.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 },
              500
            );
          }
        }

        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, vans, selectedVan, setVans, setStats, passengerResponses, stopCoordinates]);

  // when selectedVan changes, fit route
  useEffect(() => {
    if (selectedVan) fitToRoute(selectedVan);
  }, [selectedVan, fitToRoute]);

  // RENDER: purely returns JSX, no state updates here
  return (
    <ScrollView style={styles.section}>
      <Text style={styles.sectionTitle}>Live Driver Tracking</Text>

      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[styles.controlButton, isPlaying ? styles.pauseButton : styles.playButton]}
          onPress={() => {
            setIsPlaying((s) => !s);
            if (!isPlaying && selectedVan) fitToRoute(selectedVan);
          }}
        >
          <Icon name={isPlaying ? 'pause' : 'play-arrow'} size={20} color={COLORS.white} />
          <Text style={styles.controlButtonText}>{isPlaying ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isPlaying && styles.statusDotActive]} />
          <Text style={styles.statusText}>{isPlaying ? 'Live' : 'Paused'}</Text>
        </View>

        <Text style={styles.activeVansText}>Active Vans: <Text style={styles.activeVansCount}>{(currentVans || []).filter(v => v.status === 'En Route').length}</Text></Text>
      </View>

      {/* The rest of your existing detail/overview UI goes here — ensure it uses currentVans and vanPositions safely */}
      {/* For brevity I keep it minimal — you can paste your detailed JSX (guarded) here */}
      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={[styles.map, { height: 240 }]} initialRegion={{ latitude: 33.6, longitude: 73.1, latitudeDelta: 0.1, longitudeDelta: 0.1 }}>
        {(currentVans || []).map((van) => {
          const pos = vanPositions.current[van.id];
          // If pos exists, Marker.Animated can accept Animated.Values for coordinate
          const coordinate = pos ? { latitude: pos.latitude, longitude: pos.longitude } : (van.currentLocation || { latitude: 33.6, longitude: 73.1 });
          return (
            <Marker key={van.id} coordinate={van.currentLocation || coordinate} title={van.name} description={van.currentStop} onPress={() => { setSelectedVan && setSelectedVan(van); fitToRoute(van); }}>
              <Animated.View style={{ transform: [{ scale: pos ? pos.scale : 1 }, pos ? { rotate: pos.rotation.interpolate({ inputRange: [-180, 180], outputRange: ['-180deg', '180deg'] }) } : { rotate: '0deg' }] }}>
                <View style={styles.vanMarker}><Icon name="directions-car" size={24} color={van.status === 'Completed' ? COLORS.success : van.status === 'En Route' ? COLORS.warning : COLORS.gray} /></View>
              </Animated.View>
            </Marker>
          );
        })}
      </MapView>
    </ScrollView>
  );
}
