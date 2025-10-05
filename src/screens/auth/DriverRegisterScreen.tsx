import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import {
  createDriverRegisterScreenStyles,
  getPlaceholderColor,
} from "../../styles/screens/DriverRegisterScreen.styles";
import Select from "../../components/Select";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator";
import PhotoUpload from "../../components/PhotoUpload";
import AgreementCheckbox from "../../components/AgreementCheckbox";
import vehicleSegments from "../../utils/vehicleSegments.json";
import { COUNTRIES_FULL } from "../../utils/countries";
import {
  experienceOptions,
  carBrands,
  carModelsByBrand,
  getYearOptions,
  getTariffOptions,
} from "../../utils/driverData";
import DevRegistrationService from "../../services/DevRegistrationService";

const DriverRegisterScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t, isLoading } = useLanguage();
  const { isDark } = useTheme();

  // Создаем стили с учетом текущей темы
  const styles = createDriverRegisterScreenStyles(isDark);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    country: "",
    licenseNumber: "",
    licenseExpiry: "",
    vehicleNumber: "",
    experience: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    carMileage: "",
    tariff: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [brandOptions, setBrandOptions] = useState(carBrands);
  const [modelOptions, setModelOptions] = useState<
    { label: string; value: string; tariff?: string }[]
  >([]);
  const [licensePhoto, setLicensePhoto] = useState<string | null>(null);
  const [passportPhoto, setPassportPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState<
    "license" | "passport" | null
  >(null);

  useEffect(() => {
    if (form.tariff) {
      setBrandOptions(vehicleSegments[form.tariff]?.brands || carBrands);
      setModelOptions([]);
      setForm((prev) => ({ ...prev, carBrand: "", carModel: "" }));
    }
  }, [form.tariff]);

  const tariffOptions = getTariffOptions(t);
  const yearOptions = getYearOptions();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBrandChange = (brand: string) => {
    setForm((prev) => ({ ...prev, carBrand: brand, carModel: "" }));
    setModelOptions(vehicleSegments[form.tariff]?.models[brand] || []);
  };
  const handleModelChange = (model: string) => {
    setForm((prev) => ({ ...prev, carModel: model }));
    const selectedBrand = form.carBrand;
    const found = (carModelsByBrand[selectedBrand] || []).find(
      (m) => m.value === model,
    );
    if (found?.tariff) {
      setForm((prev) => ({ ...prev, tariff: found.tariff }));
    }
  };
  const handleTariffChange = (tariff: string) => {
    setForm((prev) => ({ ...prev, tariff }));
  };
  const handleExperienceChange = (option: {
    label: string;
    value: string | number;
  }) => {
    setForm((prev) => ({ ...prev, experience: option.value.toString() }));
    setErrors((prev) => ({ ...prev, experience: undefined }));
  };
  const handleCountryChange = (option: {
    label: string;
    value: string | number;
  }) => {
    setForm((prev) => ({ ...prev, country: option.value.toString() }));
    setErrors((prev) => ({ ...prev, country: undefined }));
  };
  const handleYearChange = (option: {
    label: string;
    value: string | number;
  }) => {
    setForm((prev) => ({ ...prev, carYear: option.value.toString() }));
    setErrors((prev) => ({ ...prev, carYear: undefined }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.firstName.trim())
      newErrors.firstName = t("register.firstNameRequired");
    if (!form.lastName.trim())
      newErrors.lastName = t("register.lastNameRequired");
    if (!form.email.trim()) newErrors.email = t("register.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = t("register.emailInvalid");
    if (!form.phone.trim()) newErrors.phone = t("register.phoneRequired");
    if (!form.password) newErrors.password = t("register.passwordRequired");
    else if (form.password.length < 8)
      newErrors.password = t("register.passwordShort");
    else if (!/(?=.*[a-z])/.test(form.password))
      newErrors.password = t("register.passwordLowercase");
    else if (!/(?=.*[A-Z])/.test(form.password))
      newErrors.password = t("register.passwordUppercase");
    else if (!/(?=.*\d)/.test(form.password))
      newErrors.password = t("register.passwordNumbers");
    else if (!/(?=.*[!@#$%^&*])/.test(form.password))
      newErrors.password = t("register.passwordSpecial");
    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = t("register.passwordsDontMatch");
    if (!form.country) newErrors.country = t("register.countryRequired");
    if (!form.licenseNumber.trim())
      newErrors.licenseNumber = t("register.licenseNumberRequired");
    if (!form.licenseExpiry)
      newErrors.licenseExpiry = t("register.licenseExpiryRequired");
    else if (form.licenseExpiry.length !== 10)
      newErrors.licenseExpiry = t("register.licenseExpiryInvalid");
    if (!licensePhoto)
      newErrors.licensePhoto = t("register.licensePhotoRequired");
    if (!passportPhoto)
      newErrors.passportPhoto = t("register.passportPhotoRequired");
    if (!form.vehicleNumber.trim())
      newErrors.vehicleNumber = t("register.vehicleNumberRequired");
    if (!form.experience)
      newErrors.experience = t("register.experienceRequired");
    if (!form.tariff) newErrors.tariff = t("register.tariffRequired");
    if (!form.carBrand) newErrors.carBrand = t("register.carBrandRequired");
    if (!form.carModel) newErrors.carModel = t("register.carModelRequired");
    if (!form.carYear) newErrors.carYear = t("register.carYearRequired");
    if (!form.carMileage.trim())
      newErrors.carMileage = t("register.carMileageRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      // ⚠️ DEV ONLY: Временная регистрация в AsyncStorage
      if (__DEV__) {
        const driver = await DevRegistrationService.saveDriverRegistration({
          email: form.email,
          phone: form.phone,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
          country: form.country,
          licenseNumber: form.licenseNumber,
          licenseExpiry: form.licenseExpiry,
          vehicleNumber: form.vehicleNumber,
          experience: form.experience,
          carBrand: form.carBrand,
          carModel: form.carModel,
          carYear: form.carYear,
          carMileage: form.carMileage,
          tariff: form.tariff,
          licensePhoto: licensePhoto || undefined,
          passportPhoto: passportPhoto || undefined,
        });

        // Создаем профиль для нового водителя
        const profile = {
          id: driver.id,
          email: driver.email,
          firstName: driver.firstName,
          lastName: driver.lastName,
          phone: driver.phone,
          role: driver.role,
          country: driver.country,
          licenseNumber: driver.licenseNumber,
          licenseExpiry: driver.licenseExpiry,
          vehicleNumber: driver.vehicleNumber,
          experience: driver.experience,
          carBrand: driver.carBrand,
          carModel: driver.carModel,
          carYear: driver.carYear,
          carMileage: driver.carMileage,
          tariff: driver.tariff,
          createdAt: driver.registeredAt,
        };
        await AsyncStorage.setItem(
          `@profile_${driver.id}`,
          JSON.stringify(profile),
        );

        // Показываем статистику
        await DevRegistrationService.logDevRegistrationStats();
      } else {
        // await AuthService.registerDriver(form);
      }

      Alert.alert(
        t("register.successTitle"),
        __DEV__
          ? "✅ Водитель зарегистрирован локально (DEV режим)"
          : t("register.successText"),
      );

      navigation.reset({ index: 0, routes: [{ name: "Login" as never }] });
    } catch (e) {
      Alert.alert(
        t("register.errorTitle"),
        e instanceof Error ? e.message : t("register.errorText"),
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text
                style={{ color: isDark ? "#60A5FA" : "#23408E", fontSize: 24 }}
              >
                {"←"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t("register.titleDriver")}</Text>
            <Text style={styles.subtitle}>{t("register.subtitle")}</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.firstName")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.firstName}
                onChangeText={(v) => handleChange("firstName", v)}
                placeholder={t("register.firstNamePlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                autoCapitalize="words"
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.lastName")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.lastName}
                onChangeText={(v) => handleChange("lastName", v)}
                placeholder={t("register.lastNamePlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                autoCapitalize="words"
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.email")} <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(v) => handleChange("email", v)}
                placeholder={t("register.emailPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.phone")} <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.phone}
                onChangeText={(v) => handleChange("phone", v)}
                placeholder={t("register.phonePlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.countryOfIssue")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.country}
                onSelect={handleCountryChange}
                options={COUNTRIES_FULL.map((country) => ({
                  label: country.name,
                  value: country.code,
                }))}
                placeholder={t("register.countryOfIssuePlaceholder")}
                searchable={true}
              />
              {errors.country && (
                <Text style={styles.errorText}>{errors.country}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.licenseNumber")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.licenseNumber}
                onChangeText={(v) => handleChange("licenseNumber", v)}
                placeholder={t("register.licenseNumberPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                autoCapitalize="characters"
                textContentType="none"
                autoComplete="off"
              />
              {errors.licenseNumber && (
                <Text style={styles.errorText}>{errors.licenseNumber}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.licenseExpiry")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.licenseExpiry}
                onChangeText={(v) => handleChange("licenseExpiry", v)}
                placeholder={t("register.licenseExpiryPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                textContentType="none"
                autoComplete="off"
              />
              {errors.licenseExpiry && (
                <Text style={styles.errorText}>{errors.licenseExpiry}</Text>
              )}
            </View>
            <PhotoUpload
              photo={licensePhoto}
              onPhotoChange={(uri) => setLicensePhoto(uri)}
              onError={(err) =>
                setErrors((prev) => ({ ...prev, licensePhoto: err }))
              }
              type="license"
              uploading={uploadingPhoto === "license"}
              onUploadingChange={(flag) =>
                setUploadingPhoto(flag ? "license" : null)
              }
            />
            {errors.licensePhoto && (
              <Text style={styles.errorText}>{errors.licensePhoto}</Text>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.vehicleNumber")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.vehicleNumber}
                onChangeText={(v) => handleChange("vehicleNumber", v)}
                placeholder={t("register.vehicleNumberPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                autoCapitalize="characters"
              />
              {errors.vehicleNumber && (
                <Text style={styles.errorText}>{errors.vehicleNumber}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.experience")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.experience}
                onSelect={handleExperienceChange}
                options={experienceOptions}
                placeholder={t("register.experienceRequired")}
              />
              {errors.experience && (
                <Text style={styles.errorText}>{errors.experience}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.tariff")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.tariff}
                onSelect={(option) => handleTariffChange(String(option.value))}
                options={tariffOptions}
                placeholder={t("register.tariffRequired")}
              />
              {errors.tariff && (
                <Text style={styles.errorText}>{errors.tariff}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.carBrand")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.carBrand}
                onSelect={(option) => handleBrandChange(String(option.value))}
                options={brandOptions}
                placeholder={t("register.carBrandRequired")}
                disabled={!form.tariff}
              />
              {errors.carBrand && (
                <Text style={styles.errorText}>{errors.carBrand}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.carModel")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.carModel}
                onSelect={(option) => handleModelChange(String(option.value))}
                options={modelOptions}
                placeholder={t("register.carModelRequired")}
                disabled={!form.carBrand}
              />
              {errors.carModel && (
                <Text style={styles.errorText}>{errors.carModel}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.carYear")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <Select
                value={form.carYear}
                onSelect={handleYearChange}
                options={yearOptions}
                placeholder={t("register.carYearRequired")}
              />
              {errors.carYear && (
                <Text style={styles.errorText}>{errors.carYear}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.carMileage")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.carMileage}
                onChangeText={(v) => handleChange("carMileage", v)}
                placeholder={t("register.carMileagePlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                keyboardType="numeric"
              />
              {errors.carMileage && (
                <Text style={styles.errorText}>{errors.carMileage}</Text>
              )}
            </View>
            <PhotoUpload
              photo={passportPhoto}
              onPhotoChange={(uri) => setPassportPhoto(uri)}
              onError={(err) =>
                setErrors((prev) => ({ ...prev, passportPhoto: err }))
              }
              type="passport"
              uploading={uploadingPhoto === "passport"}
              onUploadingChange={(flag) =>
                setUploadingPhoto(flag ? "passport" : null)
              }
            />
            {errors.passportPhoto && (
              <Text style={styles.errorText}>{errors.passportPhoto}</Text>
            )}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.password")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                placeholder={t("register.passwordPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                secureTextEntry
              />
              {form.password && (
                <PasswordStrengthIndicator
                  value={form.password}
                  showFeedback={true}
                />
              )}
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                {t("register.confirmPassword")}{" "}
                <Text style={styles.requiredStar}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(v) => handleChange("confirmPassword", v)}
                placeholder={t("register.confirmPasswordPlaceholder")}
                placeholderTextColor={getPlaceholderColor(isDark)}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
            <AgreementCheckbox
              agree={agree}
              onAgreeChange={setAgree}
              styles={styles}
            />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading || !agree}
            >
              <Text style={styles.registerButtonText}>
                {loading ? t("register.loading") : t("register.button")}
              </Text>
            </TouchableOpacity>
            <View style={styles.loginRow}>
              <Text style={styles.alreadyRegisteredText}>
                {t("register.alreadyRegistered")}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" as never }],
                  })
                }
              >
                <Text style={styles.loginLinkSmall}>
                  {t("register.loginLink")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DriverRegisterScreen;
