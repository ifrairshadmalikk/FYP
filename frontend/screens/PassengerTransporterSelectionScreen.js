// screens/PassengerTransporterSelectionScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/PassengerTransporterStyles"; // ✅ correct import

const transporters = [
  { id: "1", name: "Sadabahar Transporters", zone: "Islamabad Zone A", active: true },
  { id: "2", name: "Al-Careem Group", zone: "Rawalpindi Zone B", active: false },
  { id: "3", name: "Satti Travelers", zone: "Islamabad Zone C", active: true },
  { id: "4", name: "Green Line Vans", zone: "Rawalpindi Zone D", active: true },
  { id: "5", name: "Metro Movers", zone: "Islamabad Zone E", active: false },
];

export default function PassengerTransporterSelectionScreen({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("All"); // All | Active | Inactive | AZ | ZA

  const handleContinue = () => {
    if (!selected) {
      setErrorMsg("Please select a Transporter to continue.");
      setSuccessMsg("");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);
    setSuccessMsg("Transporter selected successfully. Redirecting to your dashboard...");

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("PassengerApp");
    }, 2000);
  };

  // ✅ Filtering + Sorting logic
  const filteredTransporters = useMemo(() => {
    let list = [...transporters];

    if (searchText.trim()) {
      list = list.filter((t) =>
        t.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (filter === "Active") list = list.filter((t) => t.active);
    if (filter === "Inactive") list = list.filter((t) => !t.active);

    if (filter === "AZ") list.sort((a, b) => a.name.localeCompare(b.name));
    if (filter === "ZA") list.sort((a, b) => b.name.localeCompare(a.name));

    return list;
  }, [searchText, filter]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, selected === item.id && styles.selectedCard]}
      onPress={() => setSelected(item.id)}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconWrapper}>
          <Ionicons name="bus" size={22} color="#0f172a" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.zoneRow}>
            <Ionicons name="location" size={14} color="#7e8185" />
            <Text style={styles.zone}>{item.zone}</Text>
          </View>
          <Text
            style={[
              styles.badge,
              item.active ? styles.activeBadge : styles.inactiveBadge,
            ]}
          >
            {item.active ? "Active" : "Inactive"}
          </Text>
        </View>

        {selected === item.id && (
          <Ionicons name="checkmark-circle" size={22} color="#afd826" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0a0a0a" />
        </TouchableOpacity>
        <Text style={styles.title}>Select a Transporter</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#7e8185" />
        <TextInput
          placeholder="Search transporter..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color="#7e8185" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {["All", "Active", "Inactive", "AZ", "ZA"].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text
              style={[
                styles.filterBtnText,
                filter === f && styles.filterBtnTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredTransporters}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Messages */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}

      {/* Continue Button */}
      <TouchableOpacity
        style={[styles.button, isLoading && { opacity: 0.7 }]}
        onPress={handleContinue}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
      </TouchableOpacity>

      {/* Helper */}
      <Text style={styles.helperText}>
        Select a transporter to proceed with your booking
      </Text>
    </View>
  );
}
