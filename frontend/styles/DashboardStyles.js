import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Pure white background
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Title
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
  },

  // Input fields
  input: {
    backgroundColor: "#ffffff",
    borderColor: "#111827", // Dark border for clear visibility
    borderWidth: 1.5,
    color: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    width: "100%",
  },

  // Picker box
  pickerBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderColor: "#111827", // Same border as input
    borderWidth: 1.5,
    marginBottom: 16,
    width: "100%",
  },

  // Error msg
  error: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },

  // Button
  submitBtn: {
    backgroundColor: "#afd826", // InDrive green
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    width: width * 0.9,
    alignSelf: "center",
  },
  submitText: {
    color: "#ffffff", // White text on green button
    fontWeight: "700",
    fontSize: 16,
  },
});