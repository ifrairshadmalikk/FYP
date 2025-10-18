import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  centerBox: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
    paddingVertical: 60,
  },
  headerSection: {
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  logo: {
    width: width * 0.7,
    height: 140,
    marginBottom: 24,
  },
  title: {
    color: "#111827",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
  },
  roleContainer: {
    width: "100%",
    marginBottom: 24,
  },
  sectionLabel: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    height: 56,
    color: "#111827",
  },
  roleDescription: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#afd826",
  },
  roleDescriptionText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  errorContainer: {
    width: "100%",
    marginBottom: 20,
  },
  error: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  actionSection: {
    width: "100%",
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#afd826",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  submitBtnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.3,
  },
  helpText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});