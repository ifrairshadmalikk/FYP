// styles/PassengerStyles/drawerStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30, // top margin/padding for neat spacing
  },

  /* ===== Header ===== */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#afd826",
  },
  avatarBox: {
    backgroundColor: "#afd826",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  email: {
    fontSize: 13,
    color: "#777",
  },

  /* ===== Drawer Items ===== */
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4, // spacing between items
    borderRadius: 10,
  },
  itemText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  activeItem: {
    backgroundColor: "#e3fc89ff", // soft highlight when active
    borderLeftWidth: 4,
    borderLeftColor: "#afd826",
  },
  activeText: {
    color: "#afd826",
    fontWeight: "600",
  },
});
