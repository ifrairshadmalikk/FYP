// frontend/styles/OnboardingStyles.js
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",  // InDrive-like dark / deep theme
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    color: "#0f0f0fff",  // accent color
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    color: "#070707ff",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    color: "#7e8185ff",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#afd826",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  nextText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "600",
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: "#f3f3f3ff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  welcomeTitle: {
    color: "#0a0a0aff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#afd826",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  startText: {
    color: "#121212ff",
    fontSize: 18,
    fontWeight: "600",
  },
});
