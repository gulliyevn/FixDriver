import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { OTPService } from '../../services/OTPService';
import { OTPVerificationScreenStyles as styles } from '../../styles/screens/OTPVerificationScreen.styles';

type OTPVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type OTPVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
  route: OTPVerificationScreenRouteProp;
}

const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ navigation, route }) => {
  const { email, purpose } = route.params;

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    sendInitialOTP();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const sendInitialOTP = useCallback(async () => {
    try {
      setIsLoading(true);
      await OTPService.sendOTP(email);
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      setIsLoading(true);
      await OTPService.resendOTP(email);
      setTimeLeft(60);
      setCanResend(false);
      Alert.alert('Success', 'OTP has been resent to your email');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const isValid = await OTPService.verifyOTP(email, otp);

      if (isValid) {
        if (purpose === 'login') {
          // Handle login flow
          Alert.alert('Success', 'OTP verified successfully');
          // Navigate to main app
        } else {
          // Handle registration flow
          Alert.alert('Success', 'Email verified successfully');
          // Navigate to complete registration
        }
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify OTP';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We&apos;ve sent a verification code to {email}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <InputField
            label="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="000000"
            style={styles.otpInput}
          />

          <Button
            title="Verify OTP"
            onPress={handleVerifyOTP}
            loading={isLoading}
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive the code? </Text>
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
          <Text style={styles.changeNumberText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default OTPVerificationScreen; 