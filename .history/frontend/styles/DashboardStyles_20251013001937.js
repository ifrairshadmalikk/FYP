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
    paddingVertical: 40,
  },
  logo: {
    width: 320,
    height: 140,
    marginBottom: 30,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  input: {
    backgroundColor: "#aed8268b",
    borderColor: "#111827",
    borderWidth: 2,
    color: "#111827",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    width: "100%",
  },
  pickerBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderColor: "#111827",
    borderWidth: 2,
    marginBottom: 20,
    width: width * 0.85,
    overflow: "hidden",
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
    backgroundColor: "#fef2f2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    width: width * 0.85,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: {
    backgroundColor: "#aed8268b",
    shadowOpacity: 0,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  sectionBox: {
    marginBottom: 20,
  },
});