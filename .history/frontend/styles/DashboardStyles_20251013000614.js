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
    width: 280,
    height: 120,
    marginBottom: 8,
  },
  title: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 32,
    textAlign: "center",
  },
  pickerBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#111827",
    borderWidth: 1.5,
    marginBottom: 20,
    width: width * 0.85,
    overflow: "hidden",
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: width * 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});