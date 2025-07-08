import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/user';
import { AuthStackParamList } from '../../types/navigation';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import Select from '../../components/Select';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { Validators } from '../../utils/validators';
import { COUNTRIES } from '../../utils/countries';
import { DriverRegisterScreenStyles } from '../../styles/screens/DriverRegisterScreen.styles';
import { mockRegistrationData } from '../../mocks';

type DriverRegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'DriverRegister'>;

const DriverRegisterScreen: React.FC = () => {
  const navigation = useNavigation<DriverRegisterScreenNavigationProp>();
  const { register } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicleNumber: '',
    experience: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Options for selects
  const countryOptions = COUNTRIES.map(country => ({
    label: country.name,
    value: country.code,
  }));

  const { experienceOptions } = mockRegistrationData;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!Validators.validateEmail(formData.email).isValid) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!Validators.validatePhone(formData.phone).isValid) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!Validators.validatePassword(formData.password).isValid) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    if (!formData.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.licenseExpiry) {
      newErrors.licenseExpiry = 'License expiry date is required';
    }

    if (!formData.vehicleNumber) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }

    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        role: UserRole.DRIVER,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry,
        vehicleNumber: formData.vehicleNumber,
        experience: formData.experience,
      };

      const success = await register(userData, formData.password);

      if (success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      setIsLoading(true);
      // Handle social authentication
      console.log(`Social auth with ${provider}`);
      // Navigate to OTP verification or main app
    } catch (err) {
      Alert.alert('Error', `Failed to authenticate with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={DriverRegisterScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={DriverRegisterScreenStyles.scrollView}
        contentContainerStyle={DriverRegisterScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={DriverRegisterScreenStyles.header}>
          <Text style={DriverRegisterScreenStyles.title}>Become a Driver</Text>
          <Text style={DriverRegisterScreenStyles.subtitle}>Join FixDrive as a driver</Text>
        </View>

        <View style={DriverRegisterScreenStyles.form}>
          {/* Personal Information */}
          <View style={DriverRegisterScreenStyles.section}>
            <Text style={DriverRegisterScreenStyles.sectionTitle}>Personal Information</Text>
            
            <View style={DriverRegisterScreenStyles.row}>
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                error={errors.firstName}
                style={DriverRegisterScreenStyles.halfWidth}
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                error={errors.lastName}
                style={DriverRegisterScreenStyles.halfWidth}
              />
            </View>

            <InputField
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <PhoneInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              error={errors.phone}
            />

            <Select
              label="Country"
              value={formData.country}
              onSelect={(option) => handleInputChange('country', String(option.value))}
              options={countryOptions}
              error={errors.country}
            />
          </View>

          {/* Driver Information */}
          <View style={DriverRegisterScreenStyles.section}>
            <Text style={DriverRegisterScreenStyles.sectionTitle}>Driver Information</Text>
            
            <InputField
              label="License Number"
              value={formData.licenseNumber}
              onChangeText={(value) => handleInputChange('licenseNumber', value)}
              error={errors.licenseNumber}
            />

            <InputField
              label="License Expiry Date"
              value={formData.licenseExpiry}
              onChangeText={(value) => handleInputChange('licenseExpiry', value)}
              error={errors.licenseExpiry}
              placeholder="DD/MM/YYYY"
            />

            <InputField
              label="Vehicle Number"
              value={formData.vehicleNumber}
              onChangeText={(value) => handleInputChange('vehicleNumber', value)}
              error={errors.vehicleNumber}
            />

            <Select
              label="Driving Experience"
              value={formData.experience}
              onSelect={(option) => handleInputChange('experience', String(option.value))}
              options={experienceOptions}
              error={errors.experience}
            />
          </View>

          {/* Security */}
          <View style={DriverRegisterScreenStyles.section}>
            <Text style={DriverRegisterScreenStyles.sectionTitle}>Security</Text>
            
            <InputField
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              error={errors.password}
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <PasswordStrengthIndicator value={formData.password} />

            <InputField
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              error={errors.confirmPassword}
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>

          {/* Social Authentication */}
          <View style={DriverRegisterScreenStyles.section}>
            <Text style={DriverRegisterScreenStyles.sectionTitle}>Or continue with</Text>
            <SocialAuthButtons onPress={handleSocialAuth} />
          </View>

          {/* Register Button */}
          <Button
            title="Create Driver Account"
            onPress={handleRegister}
            loading={isLoading}
            style={DriverRegisterScreenStyles.registerButton}
          />

          {/* Login Link */}
          <View style={DriverRegisterScreenStyles.loginContainer}>
            <Text style={DriverRegisterScreenStyles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={DriverRegisterScreenStyles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DriverRegisterScreen;
