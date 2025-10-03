import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../types/navigation";
import Button from "../../components/Button";
import { OTPService } from "../../services/OTPService";
import { OTPVerificationScreenStyles as styles } from "../../styles/screens/OTPVerificationScreen.styles";
import { useI18n } from "../../hooks/useI18n";

type OTPVerificationScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "OTPVerification"
>;
type OTPVerificationScreenRouteProp = RouteProp<
  AuthStackParamList,
  "OTPVerification"
>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  navigation,
  route,
}) => {
  const { phone, type } = route.params;
  const { t } = useI18n();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const sendInitialOTP = useCallback(async () => {
    try {
      setIsLoading(true);
      await OTPService.sendOTP(phone);
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send OTP";
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    sendInitialOTP();
  }, [sendInitialOTP]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      await OTPService.resendOTP(phone);
      setTimeLeft(60);
      setCanResend(false);
      Alert.alert(t("common.success"), "OTP has been resent to your phone");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert(t("common.error"), "Please enter the OTP");
      return;
    }

    try {
      setIsLoading(true);
      const isValid = await OTPService.verifyOTP(phone, otp);

      if (isValid) {
        if (type === "register") {
          // Handle registration flow
          Alert.alert(t("common.success"), "Phone verified successfully");
          // Navigate to complete registration
        } else {
          // Handle forgot password flow
          Alert.alert(t("common.success"), "OTP verified successfully");
          // Navigate to reset password
        }
      } else {
        Alert.alert(t("common.error"), "Invalid OTP. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      Alert.alert(t("common.error"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a verification code to {phone}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <Text style={styles.subtitle}>Enter OTP</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="------"
            style={styles.otpInput}
          />

          <Button
            title="Verify OTP"
            onPress={handleVerifyOTP}
            loading={isLoading}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn&apos;t receive the code?{" "}
            </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOTP} disabled={isLoading}>
                <Text style={styles.resendButtonText}>Resend</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend in {formatTime(timeLeft)}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.subtitle}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen;
