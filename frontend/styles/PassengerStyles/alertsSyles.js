import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#f6f7f8" },
  title: { fontSize: 20, fontWeight: "700", color: "#111", marginBottom: 12 },

  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  alertInfo: { marginLeft: 10 },
  alertText: { fontSize: 14, color: "#222", fontWeight: "600" },
  alertTime: { fontSize: 12, color: "#777", marginTop: 4 },
});
