import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 120,
    marginBottom: 10,
  },
  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  pickerBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#111827",
    borderWidth: 1.5,
    marginBottom: 20,
    width: width * 0.8,
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    width: width * 0.8,
  },
  submitBtnDisabled: {
    backgroundColor: "#e5f0b5", // Light shade of #afd826
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});