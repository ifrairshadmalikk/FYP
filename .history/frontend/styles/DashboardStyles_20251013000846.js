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
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: 280,
    height: 120,
    marginBottom: 24,
  },
  title: {
    color: "#111827",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  roleSection: {
    width: "100%",
    marginBottom: 32,
  },
  label: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#111827",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    marginBottom: 8,
  },
  picker: {
    height: 56,
  },
  roleHint: {
    color: "#4b5563",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
  },
  error: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: "#d1d5db",
    shadowOpacity: 0,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
  },
});