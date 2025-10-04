import React, { useState, useRef, useEffect, useCallback } from "react";
import { usePackage } from "../../../context/PackageContext";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import type { Swipeable as RNSwipeable } from "react-native-gesture-handler";
import { useTheme } from "../../../context/ThemeContext";
import {
  EditDriverProfileScreenStyles as styles,
  getEditDriverProfileScreenColors,
} from "../../../styles/screens/profile/driver/EditDriverProfileScreen.styles";
import { Ionicons } from "@expo/vector-icons";
import { DriverScreenProps } from "../../../types/driver/DriverNavigation";
import { mockUsers } from "../../../mocks/users";
import APIClient from "../../../services/APIClient";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDriverProfile as useProfile } from "../../../hooks/driver/DriverUseProfile";
import { useVerification } from "../../../hooks/useVerification";
import {
  getDefaultDate,
  hasChanges,
  handleDriverCirclePress,
} from "../../../utils/profileHelpers";
import DatePicker from "../../../components/DatePicker";
import PersonalInfoSection from "../../../components/driver/DriverPersonalInfoSection";
import ProfileAvatarSection from "../../../components/driver/DriverProfileAvatarSection";
import VipSection from "../../../components/driver/DriverVipSection";
import ProfileHeader from "../../../components/driver/DriverProfileHeader";
import VehicleIdCard from "../../../components/driver/VehicleIdCard";
import { useI18n } from "../../../hooks/useI18n";
import { useDriverVehicles } from "../../../hooks/driver/useDriverVehicles";

const ACTION_WIDTH = 100; // Keep in sync with styles.swipeAction.width

const EditDriverProfileScreen: React.FC<
  DriverScreenProps<"EditDriverProfile">
> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const { logout, login, changeRole } = useAuth();
  const rootNavigation = useNavigation();
  const dynamicStyles = getEditDriverProfileScreenColors(isDark);
  const currentColors = isDark
    ? { primary: "#3B82F6" }
    : { primary: "#083198" };

  const { profile, updateProfile, loadProfile } =
    useProfile("current_driver_id");
  const { currentPackage } = usePackage();
  const user = profile || mockUsers[0];

  // Хук для работы с автомобилями
  const { vehicles, loadVehicles, deleteVehicle } = useDriverVehicles();

  // Keep refs to swipeable rows to close them programmatically
  const swipeRefs = useRef<Record<string, RNSwipeable | null>>({});
  const openSwipeRef = useRef<RNSwipeable | null>(null);

  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || "1990-01-01",
  });

  // Исходные данные для сравнения
  const originalDataRef = useRef({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: user.birthDate || "1990-01-01",
  });

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Хуки для верификации
  const {
    verificationStatus,
    isVerifying,
    loadVerificationStatus,
    resetVerificationStatus,
    verifyEmail,
    verifyPhone,
  } = useVerification();

  // Функция для проверки изменений
  const checkHasChanges = () => {
    return (
      formData.firstName !== originalDataRef.current.firstName ||
      formData.lastName !== originalDataRef.current.lastName ||
      formData.phone !== originalDataRef.current.phone ||
      formData.email !== originalDataRef.current.email
    );
  };

  // Функция валидации полей личной информации
  const validatePersonalInfo = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) {
      errors.push(t("profile.validation.firstNameRequired"));
    }

    if (!formData.lastName.trim()) {
      errors.push(t("profile.validation.lastNameRequired"));
    }

    // Телефон не обязателен
    // if (!formData.phone.trim()) {
    //   errors.push(t('profile.validation.phoneRequired'));
    // }

    if (!formData.email.trim()) {
      errors.push(t("profile.validation.emailRequired"));
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // Асинхронная функция сохранения профиля
  const saveProfile = async (): Promise<boolean> => {
    try {
      // Проверяем, есть ли изменения в форме
      const hasFormChanges =
        formData.firstName !== originalDataRef.current.firstName ||
        formData.lastName !== originalDataRef.current.lastName ||
        formData.phone !== originalDataRef.current.phone ||
        formData.email !== originalDataRef.current.email;

      if (hasFormChanges) {
        // Валидируем поля перед сохранением
        const validation = validatePersonalInfo();
        if (!validation.isValid) {
          Alert.alert(
            t("profile.validation.title"),
            validation.errors.join("\n"),
            [{ text: t("common.ok"), style: "default" }],
          );
          return false;
        }

        // Сохраняем изменения в форме
        const updateData: any = {};

        if (hasFormChanges) {
          updateData.name = formData.firstName.trim();
          updateData.surname = formData.lastName.trim();
          updateData.phone = formData.phone.trim();
          updateData.email = formData.email.trim();
        }

        const success = await updateProfile(updateData);

        if (success) {
          Alert.alert(
            t("profile.profileUpdateSuccess.title"),
            t("profile.profileUpdateSuccess.message"),
          );
          setIsEditingPersonalInfo(false);
          // Обновляем исходные данные
          originalDataRef.current = { ...formData };
          return true;
        } else {
          Alert.alert(
            t("profile.profileUpdateError.title"),
            t("profile.profileUpdateError.message"),
          );
          return false;
        }
      } else {
        // Если изменений нет, просто закрываем режим редактирования
        setIsEditingPersonalInfo(false);
        return true;
      }
    } catch (error) {
      Alert.alert(
        t("profile.profileUpdateGeneralError.title"),
        t("profile.profileUpdateGeneralError.message"),
      );
      return false;
    }
  };

  // Обработчик для перехвата swipe-back жеста
  const handleBackPress = useCallback(() => {
    const hasPersonalChanges = isEditingPersonalInfo && checkHasChanges();

    if (hasPersonalChanges) {
      Alert.alert(
        t("profile.saveChangesConfirm.title"),
        t("profile.saveChangesConfirm.message"),
        [
          {
            text: t("profile.saveChangesConfirm.cancel"),
            style: "cancel",
            onPress: () => navigation.goBack(),
          },
          {
            text: t("profile.saveChangesConfirm.save"),
            onPress: async () => {
              const success = await saveProfile();
              if (success) {
                navigation.goBack();
              }
            },
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  }, [isEditingPersonalInfo, checkHasChanges, saveProfile, navigation, t]);

  // Перехватываем swipe-back жест
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
        const hasPersonalChanges = isEditingPersonalInfo && checkHasChanges();

        if (hasPersonalChanges) {
          // Предотвращаем переход назад
          e.preventDefault();

          Alert.alert(
            t("profile.saveChangesConfirm.title"),
            t("profile.saveChangesConfirm.message"),
            [
              {
                text: t("profile.saveChangesConfirm.cancel"),
                style: "cancel",
                onPress: () => navigation.dispatch(e.data.action),
              },
              {
                text: t("profile.saveChangesConfirm.save"),
                onPress: async () => {
                  const success = await saveProfile();
                  if (success) {
                    navigation.dispatch(e.data.action);
                  }
                },
              },
            ],
          );
        }
      });

      return unsubscribe;
    }, [navigation, isEditingPersonalInfo, checkHasChanges, saveProfile, t]),
  );

  const handleCirclePressAction = () => {
    // Анимация вращения
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);

      // После завершения анимации вызываем функцию из утилит
      handleDriverCirclePress(rootNavigation, login, t, changeRole);
    });
  };

  // Загружаем данные только один раз при монтировании компонента
  useEffect(() => {
    loadProfile();
    loadVerificationStatus();
    loadVehicles();
  }, []); // Пустой массив зависимостей - выполняется только один раз

  // Обновляем данные при фокусе экрана
  useFocusEffect(
    useCallback(() => {
      loadVehicles(); // Перезагружаем автомобили при каждом фокусе
    }, [loadVehicles]),
  );

  // Функция для закрытия открытого свайпа
  const closeOpenSwipe = () => {
    if (openSwipeRef.current) {
      try {
        openSwipeRef.current.close();
      } catch (error) {
        console.warn('Failed to close swipe ref:', error);
      }
      openSwipeRef.current = null;
    }
  };

  // Функция удаления автомобиля
  const handleDeleteVehicle = (vehicleId: string) => {
    Alert.alert(
      t("profile.vehicles.deleteVehicle"),
      t("profile.vehicles.deleteVehicleConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("components.modal.delete"),
          style: "destructive",
          onPress: () => {
            deleteVehicle(vehicleId);
          },
        },
      ],
    );
  };

  // Рендер правых действий (кнопка удаления)
  const renderRightActions = (progress: any, dragX: any, vehicleId: string) => {
    const scale = dragX.interpolate({
      inputRange: [-ACTION_WIDTH, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const opacity = dragX.interpolate({
      inputRange: [-ACTION_WIDTH, -ACTION_WIDTH * 0.6, 0],
      outputRange: [1, 0.6, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.swipeActionsRight]}>
        <Animated.View style={{ transform: [{ scale }], opacity }}>
          <TouchableOpacity
            style={[
              styles.swipeAction,
              styles.deleteAction,
              styles.swipeActionInnerRight,
            ]}
            onPress={() => {
              handleDeleteVehicle(vehicleId);
              swipeRefs.current[vehicleId]?.close();
            }}
            accessibilityRole="button"
            accessibilityLabel="delete"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.85}
          >
            <Ionicons name="trash" size={28} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  // Обновляем форму при изменении профиля
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || "1990-01-01",
      });

      // Обновляем исходные данные
      originalDataRef.current = {
        firstName: profile.name,
        lastName: profile.surname,
        phone: profile.phone,
        email: profile.email,
        birthDate: profile.birthDate || "1990-01-01",
      };
    }
  }, [profile]);

  // Убираем автоматическое сохранение фото - теперь фото сохраняется только при явном сохранении

  // Автоматически сохраняем дату при её изменении
  useEffect(() => {
    if (
      profile &&
      formData.birthDate !== profile.birthDate &&
      formData.birthDate !== originalDataRef.current.birthDate
    ) {
      // Сохраняем только дату, не трогая остальные данные
      updateProfile({ birthDate: formData.birthDate });
    }
  }, [formData.birthDate]);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ProfileHeader
        onBackPress={handleBackPress}
        onEditPress={() => {
          if (isEditingPersonalInfo) {
            // Если в режиме редактирования, проверяем изменения
            const hasChanges = checkHasChanges();

            if (hasChanges) {
              // Если есть изменения, показываем подтверждение
              Alert.alert(
                t("profile.saveProfileConfirm.title"),
                t("profile.saveProfileConfirm.message"),
                [
                  {
                    text: t("profile.saveProfileConfirm.cancel"),
                    style: "cancel",
                  },
                  {
                    text: t("profile.saveProfileConfirm.save"),
                    onPress: async () => {
                      const success = await saveProfile();
                      if (success) {
                        setIsEditingPersonalInfo(false);
                      }
                    },
                  },
                ],
              );
            } else {
              // Если изменений нет, просто выключаем режим редактирования без подтверждения
              setIsEditingPersonalInfo(false);
            }
          } else {
            // Если в режиме просмотра, включаем редактирование
            setIsEditingPersonalInfo(true);
          }
        }}
        isEditing={isEditingPersonalInfo}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <ProfileAvatarSection
          key={`avatar-${currentPackage}`}
          userName={user.name}
          userSurname={user.surname}
          onCirclePress={handleCirclePressAction}
          rotateAnim={rotateAnim}
        />

        <PersonalInfoSection
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditingPersonalInfo}
          verificationStatus={verificationStatus}
          isVerifying={isVerifying}
          onVerifyEmail={verifyEmail}
          onVerifyPhone={verifyPhone}
          onResetVerification={resetVerificationStatus}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t("profile.vehicles.title")} ({vehicles.length})
          </Text>

          {/* Карточки автомобилей */}
          {vehicles.map((vehicle) => (
            <Swipeable
              key={vehicle.id}
              ref={(ref) => {
                swipeRefs.current[vehicle.id] = ref as RNSwipeable | null;
              }}
              renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, vehicle.id)
              }
              rightThreshold={60}
              friction={2}
              overshootRight={false}
              onSwipeableWillOpen={() => {
                if (
                  openSwipeRef.current &&
                  openSwipeRef.current !== swipeRefs.current[vehicle.id]
                ) {
                  try {
                    openSwipeRef.current.close();
                  } catch (error) {
                    console.warn('Failed to close swipe ref:', error);
                  }
                }
                openSwipeRef.current = swipeRefs.current[vehicle.id] ?? null;
              }}
              onSwipeableClose={() => {
                if (openSwipeRef.current === swipeRefs.current[vehicle.id]) {
                  openSwipeRef.current = null;
                }
              }}
            >
              <VehicleIdCard
                vehicleNumber={vehicle.vehicleNumber}
                brand={vehicle.carBrand}
                model={vehicle.carModel}
                year={vehicle.carYear}
                mileage={vehicle.carMileage}
                isVerified={vehicle.isVerified}
              />
            </Swipeable>
          ))}

          {vehicles.length < 2 && (
            <TouchableOpacity
              style={[styles.addVehicleButton, dynamicStyles.addVehicleButton]}
              onPress={() => navigation.navigate("DriverVehicles")}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <VipSection onVipPress={() => navigation.navigate("PremiumPackages")} />
      </ScrollView>
    </View>
  );
};

export default EditDriverProfileScreen;
