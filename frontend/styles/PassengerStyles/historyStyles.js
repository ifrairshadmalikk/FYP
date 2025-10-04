import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#f6f7f8" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12, color: "#111" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  info: { marginLeft: 10 },
  date: { fontSize: 14, fontWeight: "600", color: "#222" },
  place: { fontSize: 13, color: "#666", marginTop: 2 },
});
