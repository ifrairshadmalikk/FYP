// styles/PassengerStyles/homeStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  /* ===== Header ===== */
  header: {
    width: "100%",
    marginTop:"30",
    backgroundColor: "#afd826",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 18,
  },
  headerButton: {
    padding: 6,
  },

  /* ===== Cards ===== */
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardTitle: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  cardLine: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  cardTime: {
    fontSize: 13,
    color: "#666",
  },

  /* ===== Buttons ===== */
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  trackText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  buttonGreen: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    width: "30%",
    justifyContent: "center",
  },
  buttonRed: {
    marginLeft:"30",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
    width: "30%",
    justifyContent: "center",
  },

  /* ===== Status Rows ===== */
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  confirmedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  confirmedText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 8,
    fontWeight: "500",
  },
  hintText: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },

  /* ===== Quick Actions ===== */
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  quickBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    width: "45%",
  },
  quickText: {
    fontWeight: "600",
    fontSize: 15,
  },
  muted: {
    fontSize: 12,
    color: "#777",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
