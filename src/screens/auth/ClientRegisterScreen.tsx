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
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import Select from '../../components/Select';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import SocialAuthButtons from '../../components/SocialAuthButtons';
import { Validators } from '../../utils/validators';
import { COUNTRIES } from '../../utils/countries';
import { ClientRegisterScreenStyles } from '../../styles/screens/ClientRegisterScreen.styles';

type ClientRegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ClientRegister'>;

const ClientRegisterScreen: React.FC = () => {
  const navigation = useNavigation<ClientRegisterScreenNavigationProp>();
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
    children: [] as Array<{ name: string; age: number; relationship: string }>,
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

  const relationshipOptions = [
    { label: 'Father', value: 'father' },
    { label: 'Mother', value: 'mother' },
    { label: 'Guardian', value: 'guardian' },
    { label: 'Grandparent', value: 'grandparent' },
  ];

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        role: UserRole.CLIENT,
        children: formData.children,
      }, formData.password);

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

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: 0, relationship: '' }],
    }));
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const updateChild = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      ),
    }));
  };

  return (
    <KeyboardAvoidingView
      style={ClientRegisterScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={ClientRegisterScreenStyles.scrollView}
        contentContainerStyle={ClientRegisterScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={ClientRegisterScreenStyles.header}>
          <Text style={ClientRegisterScreenStyles.title}>Create Account</Text>
          <Text style={ClientRegisterScreenStyles.subtitle}>Join FixDrive as a client</Text>
        </View>

        <View style={ClientRegisterScreenStyles.form}>
          {/* Personal Information */}
          <View style={ClientRegisterScreenStyles.section}>
            <Text style={ClientRegisterScreenStyles.sectionTitle}>Personal Information</Text>
            
            <View style={ClientRegisterScreenStyles.row}>
              <InputField
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange('firstName', value)}
                error={errors.firstName}
                style={ClientRegisterScreenStyles.halfWidth}
              />
              <InputField
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange('lastName', value)}
                error={errors.lastName}
                style={ClientRegisterScreenStyles.halfWidth}
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
              onSelect={(value) => handleInputChange('country', value)}
              options={countryOptions}
              error={errors.country}
            />
          </View>

          {/* Security */}
          <View style={ClientRegisterScreenStyles.section}>
            <Text style={ClientRegisterScreenStyles.sectionTitle}>Security</Text>
            
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

          {/* Children Information */}
          <View style={ClientRegisterScreenStyles.section}>
            <View style={ClientRegisterScreenStyles.sectionHeader}>
              <Text style={ClientRegisterScreenStyles.sectionTitle}>Children (Optional)</Text>
              <TouchableOpacity onPress={addChild} style={ClientRegisterScreenStyles.addButton}>
                <Text style={ClientRegisterScreenStyles.addButtonText}>+ Add Child</Text>
              </TouchableOpacity>
            </View>

            {formData.children.map((child, index) => (
              <View key={index} style={ClientRegisterScreenStyles.childCard}>
                <View style={ClientRegisterScreenStyles.childHeader}>
                  <Text style={ClientRegisterScreenStyles.childTitle}>Child {index + 1}</Text>
                  <TouchableOpacity
                    onPress={() => removeChild(index)}
                    style={ClientRegisterScreenStyles.removeButton}
                  >
                    <Text style={ClientRegisterScreenStyles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>

                <InputField
                  label="Name"
                  value={child.name}
                  onChangeText={(value) => updateChild(index, 'name', value)}
                  style={ClientRegisterScreenStyles.halfWidth}
                />

                <InputField
                  label="Age"
                  value={child.age.toString()}
                  onChangeText={(value) => updateChild(index, 'age', parseInt(value) || 0)}
                  keyboardType="numeric"
                  style={ClientRegisterScreenStyles.halfWidth}
                />

                <Select
                  label="Relationship"
                  value={child.relationship}
                  onSelect={(value) => updateChild(index, 'relationship', value)}
                  options={relationshipOptions}
                />
              </View>
            ))}
          </View>

          {/* Social Authentication */}
          <View style={ClientRegisterScreenStyles.section}>
            <Text style={ClientRegisterScreenStyles.sectionTitle}>Or continue with</Text>
            <SocialAuthButtons onPress={handleSocialAuth} />
          </View>

          {/* Register Button */}
          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={isLoading}
            style={ClientRegisterScreenStyles.registerButton}
          />

          {/* Login Link */}
          <View style={ClientRegisterScreenStyles.loginContainer}>
            <Text style={ClientRegisterScreenStyles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={ClientRegisterScreenStyles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ClientRegisterScreen;
