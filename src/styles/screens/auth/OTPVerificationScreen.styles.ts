import { StyleSheet } from "react-native";

export const OTPVerificationScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  scrollContent: {
    flex: 1,
  },
  otpContainer: {
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    textAlign: "center",
    backgroundColor: "#F8F8F8",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: "#666666",
  },
  resendButton: {
    marginTop: 8,
  },
  resendButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  verifyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  changeNumberContainer: {
    alignItems: "center",
  },
  changeNumberText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  timerText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
});

export const getOTPVerificationScreenColors = (isDark: boolean) => ({
  container: {
    backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
  },
  title: {
    color: isDark ? "#ffffff" : "#000000",
  },
  subtitle: {
    color: isDark ? "#cccccc" : "#666666",
  },
  otpLabel: {
    color: isDark ? "#ffffff" : "#000000",
  },
  otpInput: {
    borderColor: isDark ? "#333333" : "#E0E0E0",
    backgroundColor: isDark ? "#2a2a2a" : "#F8F8F8",
    color: isDark ? "#ffffff" : "#000000",
  },
  resendText: {
    color: isDark ? "#cccccc" : "#666666",
  },
  changeNumberText: {
    color: isDark ? "#cccccc" : "#666666",
  },
  timerText: {
    fontSize: 16,
    color: isDark ? "#cccccc" : "#666666",
    textAlign: "center",
    marginTop: 16,
  },
});
