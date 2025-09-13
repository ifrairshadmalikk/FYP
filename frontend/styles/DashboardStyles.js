// frontend/styles/DashboardStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff", padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#ffffffff",
    borderColor: "#000000ff",
    borderWidth: 1,
    color: "#0d0c0cff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  pickerBox: {
    backgroundColor: "#f8f8f8ff",
    borderRadius: 8,
    borderColor: "#060606ff",
    borderWidth: 2,
    marginBottom: 12,
  },
  error: { color: "#f87171", marginBottom: 10, textAlign: "center" },
  submitBtn: { backgroundColor: "#afd826", padding: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#001219", fontWeight: "700" },
});
