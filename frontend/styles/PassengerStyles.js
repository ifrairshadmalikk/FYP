// screens/styles/DriverStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffffff", marginTop: 10, padding: 20 },
  title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#f3f3f3ff",
    borderColor: "#0c0c0cff",
    borderWidth: 1,
    color: "#0a0909ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: { color: "#f87171", marginBottom: 10, textAlign: "center" },
  success: { color: "#afd826", marginBottom: 10, textAlign: "center" },
  submitBtn: { backgroundColor: "#afd826", padding: 14, borderRadius: 8, alignItems: "center" },
  submitText: { color: "#001219", fontWeight: "700" },
});
