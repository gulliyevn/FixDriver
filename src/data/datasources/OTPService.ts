import AsyncStorage from '@react-native-async-storage/async-storage';
import { OTP_CONSTANTS } from '../../shared/constants';

export interface OTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  isValid: boolean;
}

export interface IOTPService {
  sendOTP(phoneNumber: string): Promise<OTPResponse>;
  verifyOTP(phoneNumber: string, code: string): Promise<VerifyOTPResponse>;
  resendOTP(phoneNumber: string): Promise<OTPResponse>;
  formatPhoneForDisplay(phoneNumber: string): string;
  isValidOTPFormat(code: string): boolean;
  syncWithBackend(): Promise<boolean>;
}

export class OTPService {

  /**
   * Sends OTP code to the specified phone number
   */
  static async sendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      // Generate mock OTP code for development
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // In real app, code will be sent via SMS API
      
      // Save to AsyncStorage for mock verification (in real app will be on server)
      await AsyncStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
        code: otpCode,
        timestamp: Date.now(),
        attempts: 0
      }));

      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, OTP_CONSTANTS.MOCK.SMS_DELAY));

      return {
        success: true,
        message: `OTP code sent to ${phoneNumber}`,
        otpId: `otp_${phoneNumber}`
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Error sending OTP code'
      };
    }
  }

  /**
   * Verifies the entered OTP code
   */
  static async verifyOTP(phoneNumber: string, code: string): Promise<VerifyOTPResponse> {
    try {
      // In development mode - special mock code
      if (__DEV__ && code === OTP_CONSTANTS.DEV_MOCK_CODE) {
        return {
          success: true,
          message: 'Phone successfully verified (DEV mock)',
          isValid: true
        };
      }

      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, OTP_CONSTANTS.MOCK.VERIFICATION_DELAY));

      const storedData = await AsyncStorage.getItem(`otp_${phoneNumber}`);
      
      if (!storedData) {
        return {
          success: false,
          message: 'OTP code not found. Request a new code.',
          isValid: false
        };
      }

      const { code: storedCode, timestamp, attempts } = JSON.parse(storedData);
      
      // Check expiration (10 minutes)
      const isExpired = Date.now() - timestamp > OTP_CONSTANTS.EXPIRY_MINUTES * 60 * 1000;
      
      if (isExpired) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: false,
          message: 'OTP code expired. Request a new code.',
          isValid: false
        };
      }

      // Check attempt limit (maximum 3)
      if (attempts >= OTP_CONSTANTS.MAX_ATTEMPTS) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: false,
          message: 'Maximum attempts exceeded. Request a new code.',
          isValid: false
        };
      }

      // Verify code
      if (code === storedCode) {
        await AsyncStorage.removeItem(`otp_${phoneNumber}`);
        return {
          success: true,
          message: 'Phone successfully verified',
          isValid: true
        };
      } else {
        // Increment attempt counter
        await AsyncStorage.setItem(`otp_${phoneNumber}`, JSON.stringify({
          code: storedCode,
          timestamp,
          attempts: attempts + 1
        }));

        return {
          success: false,
          message: `Invalid code. Attempts remaining: ${OTP_CONSTANTS.MAX_ATTEMPTS - 1 - attempts}`,
          isValid: false
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Error verifying code',
        isValid: false
      };
    }
  }

  /**
   * Resends OTP code
   */
  static async resendOTP(phoneNumber: string): Promise<OTPResponse> {
    try {
      // Remove old code
      await AsyncStorage.removeItem(`otp_${phoneNumber}`);
      
      // Send new one
      return this.sendOTP(phoneNumber);
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'Error resending code'
      };
    }
  }

  /**
   * Formats phone number for display (universal for all countries)
   */
  static formatPhoneForDisplay(phoneNumber: string): string {
    // Remove all characters except digits and +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Extract country code (1-3 digits after +)
    const countryCodeMatch = cleaned.match(/^(\+\d{1,3})/);
    const countryCode = countryCodeMatch ? countryCodeMatch[1] : '+XXX';
    
    // Get last 2 digits
    const lastDigits = cleaned.slice(-2);
    
    // Count asterisks needed (total length - country code - last 2 digits)
    const asterisksCount = cleaned.length - countryCode.length - 2;
    const asterisks = '*'.repeat(Math.max(0, asterisksCount));
    
    return `${countryCode} ${asterisks}${lastDigits}`;
  }

  /**
   * Validates OTP code format (6 digits)
   */
  static isValidOTPFormat(code: string): boolean {
    return /^\d{6}$/.test(code);
  }

  /**
   * Sync with backend via gRPC
   */
  static async syncWithBackend(): Promise<boolean> {
    // TODO: Implement gRPC call to sync OTP data with backend
    try {
      console.log('Syncing OTP data with backend...');
      // Mock implementation - replace with actual gRPC call
      return true;
    } catch (error) {
      console.error('Failed to sync with backend:', error);
      return false;
    }
  }
}

export default OTPService; 