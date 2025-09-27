import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from "react-native";

export default function CreateDailyPoll() {
    const [step, setStep] = useState(1);

    // States
    const [pollDate, setPollDate] = useState("09/27/2025");
    const [pollMessage, setPollMessage] = useState(
        "Please select your preferred time slot for tomorrow's transportation."
    );
    const [timeSlots, setTimeSlots] = useState([
        { type: "Morning Slot", start: "09:00 AM", end: "11:00 AM", max: 50 },
    ]);
    const [networks, setNetworks] = useState([
        { name: "Blue Area", passengers: 156, selected: false },
        { name: "Gulberg", passengers: 132, selected: false },
        { name: "DHA", passengers: 98, selected: false },
        { name: "Johar Town", passengers: 87, selected: false },
    ]);

    // 🔹 Custom Header
    const Header = ({ title }) => (
        <View style={styles.headerBar}>
            {step > 1 ? (
                <TouchableOpacity onPress={() => setStep(step - 1)}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
            ) : (
                <View style={{ width: 30 }} />
            )}
            <Text style={styles.headerTitle}>{title}</Text>
            <View style={{ width: 30 }} />
        </View>
    );

    // Step Screens
    const renderBasicInfo = () => (
        <View style={styles.card}>
            <Text style={styles.label}>Poll Date</Text>
            <TextInput
                style={styles.input}
                value={pollDate}
                onChangeText={setPollDate}
            />

            <Text style={styles.label}>Poll Message</Text>
            <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                multiline
                value={pollMessage}
                onChangeText={setPollMessage}
            />

            <TouchableOpacity style={styles.btn} onPress={() => setStep(2)}>
                <Text style={styles.btnText}>Next</Text>
            </TouchableOpacity>
        </View>
    );

    const renderTimeSlots = () => (
        <View style={styles.card}>
            {timeSlots.map((slot, i) => (
                <View key={i} style={styles.slotCard}>
                    {/* Slot Name + Delete */}
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.slotLabel}>Slot Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Slot Type"
                                value={slot.type}
                                onChangeText={(txt) => {
                                    const newSlots = [...timeSlots];
                                    newSlots[i].type = txt;
                                    setTimeSlots(newSlots);
                                }}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.deleteBox}
                            onPress={() => {
                                const newSlots = timeSlots.filter((_, idx) => idx !== i);
                                setTimeSlots(newSlots);
                            }}
                        >
                            <Text style={styles.deleteBoxText}>🗑</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Start & End Time same line */}
                    <View style={styles.rowBetween}>
                        <View style={{ flex: 1, marginRight: 6 }}>
                            <Text style={styles.slotLabel}>Start Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start Time (e.g. 09:00 AM)"
                                value={slot.start}
                                onChangeText={(txt) => {
                                    const newSlots = [...timeSlots];
                                    newSlots[i].start = txt;
                                    setTimeSlots(newSlots);
                                }}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 6 }}>
                            <Text style={styles.slotLabel}>End Time</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="End Time (e.g. 11:00 AM)"
                                value={slot.end}
                                onChangeText={(txt) => {
                                    const newSlots = [...timeSlots];
                                    newSlots[i].end = txt;
                                    setTimeSlots(newSlots);
                                }}
                            />
                        </View>
                    </View>

                    {/* Max Passengers */}
                    <View style={{ marginTop: 8 }}>
                        <Text style={styles.slotLabel}>Max Passengers</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Max Capacity"
                            keyboardType="numeric"
                            value={String(slot.max)}
                            onChangeText={(txt) => {
                                const newSlots = [...timeSlots];
                                newSlots[i].max = txt;
                                setTimeSlots(newSlots);
                            }}
                        />
                    </View>
                </View>
            ))}

            {/* Add New Slot Button */}
            <TouchableOpacity
                style={styles.addBtn}
                onPress={() =>
                    setTimeSlots([
                        ...timeSlots,
                        { type: "New Slot", start: "", end: "", max: 0 },
                    ])
                }
            >
                <Text style={styles.addBtnText}>+ Add Time Slot</Text>
            </TouchableOpacity>

            {/* Navigation */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => setStep(1)}
                >
                    <Text style={styles.btnTextSecondary}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => setStep(3)}>
                    <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderNetworks = () => (
        <View style={styles.card}>
            {networks.map((net, i) => (
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.checkboxRow,
                        net.selected && { backgroundColor: "#f2ffe0" },
                    ]}
                    onPress={() => {
                        const newNets = [...networks];
                        newNets[i].selected = !newNets[i].selected;
                        setNetworks(newNets);
                    }}
                >
                    <Text style={styles.checkboxText}>
                        {net.name} ({net.passengers} passengers)
                    </Text>
                    <Text>{net.selected ? "✅" : "⬜"}</Text>
                </TouchableOpacity>
            ))}

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.btnSecondary}
                    onPress={() => setStep(2)}
                >
                    <Text style={styles.btnTextSecondary}>Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => setStep(4)}>
                    <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSummary = () => {
        const selectedNets = networks.filter((n) => n.selected);
        const totalNetworks = selectedNets.length;
        const totalPassengers = selectedNets.reduce(
            (sum, net) => sum + net.passengers,
            0
        );

        return (
            <ScrollView style={styles.card}>
                <Text style={styles.summaryTitle}>Poll Summary</Text>

                {/* Main Summary Box */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryText}>📅 Date: {pollDate}</Text>
                    <Text style={styles.summaryText}>
                        🌐 Networks: {totalNetworks}
                    </Text>
                    <Text style={styles.summaryText}>
                        👥 Total Passengers: {totalPassengers}
                    </Text>
                    <Text style={styles.summaryText}>
                        ⏰ Time Slots: {timeSlots.length}
                    </Text>
                </View>

                {/* Detailed Selected Networks */}
                <Text style={styles.subHeader}>🚌 Selected Networks</Text>
                {selectedNets.length === 0 ? (
                    <Text style={{ color: "gray" }}>No networks selected</Text>
                ) : (
                    selectedNets.map((net, i) => (
                        <Text key={i} style={styles.selectedNet}>
                            • {net.name} ({net.passengers} passengers)
                        </Text>
                    ))
                )}

                {/* Detailed Time Slots */}
                <Text style={styles.subHeader}>⏰ Selected Time Slots</Text>
                {timeSlots.length === 0 ? (
                    <Text style={{ color: "gray" }}>No time slots selected</Text>
                ) : (
                    timeSlots.map((slot, i) => (
                        <Text key={i} style={styles.selectedNet}>
                            • {slot.start} - {slot.end}
                        </Text>
                    ))
                )}

                {/* Buttons */}
                <View style={styles.row}>
                    <TouchableOpacity
                        style={styles.btnSecondary}
                        onPress={() => setStep(3)}
                    >
                        <Text style={styles.btnTextSecondary}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Send Poll</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
            <StatusBar backgroundColor="#afd826" barStyle="light-content" />
            <Header title="Create Daily Poll" />
            <ScrollView contentContainerStyle={styles.container}>
                {step === 1 && renderBasicInfo()}
                {step === 2 && renderTimeSlots()}
                {step === 3 && renderNetworks()}
                {step === 4 && renderSummary()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flexGrow: 1 },

    // Header Styles
    headerBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: "#afd826",
        elevation: 4,
        marginTop: 5,
    },
    backArrow: { fontSize: 22, color: "#fff" },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },

    addBtn: {
        backgroundColor: "#e7f7d9",
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    addBtnText: { color: "#2a7", fontWeight: "bold", fontSize: 16 },

    card: {
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
    },
    label: { fontWeight: "600", marginTop: 10, marginBottom: 5, color: "#444" },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginVertical: 6,
        backgroundColor: "#fafafa",
    },
    btn: {
        backgroundColor: "#afd826",
        padding: 14,
        borderRadius: 10,
        marginTop: 15,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    btnSecondary: {
        backgroundColor: "#f1f1f1",
        padding: 14,
        borderRadius: 10,
        marginTop: 15,
        alignItems: "center",
        flex: 1,
        marginHorizontal: 5,
    },
    slotCard: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fefefe",
        elevation: 2,
    },
    slotLabel: { fontWeight: "600", marginTop: 6, marginBottom: 3, color: "#555" },

    deleteBox: {
        backgroundColor: "#ffdddd",
        padding: 12,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    deleteBoxText: { color: "#d00", fontSize: 18, fontWeight: "bold" },

    btnText: { color: "#000", fontWeight: "bold", fontSize: 16 },
    btnTextSecondary: { color: "#555", fontWeight: "600", fontSize: 16 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    checkboxRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#eee",
    },
    checkboxText: { fontSize: 16, color: "#333" },
    summaryTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
        color: "#222",
    },
    summaryBox: {
        backgroundColor: "#f7fbe9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
    },
    summaryText: { fontSize: 15, marginVertical: 3, color: "#333" },
    subHeader: { fontWeight: "600", marginTop: 15, fontSize: 16 },
    selectedNet: { marginVertical: 4, fontSize: 15, color: "#444" },
});
