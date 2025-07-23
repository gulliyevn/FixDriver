import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, Image, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { EditClientProfileScreenStyles as styles, getEditClientProfileScreenColors } from '../../styles/screens/profile/EditClientProfileScreen.styles';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { mockUsers, mockDrivers } from '../../mocks/users';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, StackActions, CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../../hooks/useProfile';

const EditClientProfileScreen: React.FC<ClientScreenProps<'EditClientProfile'>> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { logout, login } = useAuth();
  const rootNavigation = useNavigation();
  const dynamicStyles = getEditClientProfileScreenColors(isDark);
  const currentColors = isDark ? { dark: { primary: '#3B82F6' } } : { light: { primary: '#083198' } };
  
  const { updateProfile } = useProfile();
  const user = mockUsers[0];
  
  // Состояние формы
  const [formData, setFormData] = useState({
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: '1990-01-01',
  });

  // Исходные данные для сравнения
  const originalData = {
    firstName: user.name,
    lastName: user.surname,
    phone: user.phone,
    email: user.email,
    birthDate: '1990-01-01',
  };

  const [familyMembers] = useState([
    { id: '1', name: 'Анна Петрова', type: 'child', age: 8 },
    { id: '2', name: 'Михаил Петров', type: 'spouse', age: 35 },
  ]);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Функция для проверки изменений
  const hasChanges = () => {
    return (
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phone !== originalData.phone ||
      formData.email !== originalData.email ||
      formData.birthDate !== originalData.birthDate
    );
  };

  // Асинхронная функция сохранения профиля
  const saveProfile = async () => {
    try {
      // Используем хук для обновления профиля
      const success = await updateProfile({
        name: formData.firstName,
        surname: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        birthDate: formData.birthDate,
      });
      
      if (success) {
        // Обновляем исходные данные для следующего сравнения
        originalData.firstName = formData.firstName;
        originalData.lastName = formData.lastName;
        originalData.phone = formData.phone;
        originalData.email = formData.email;
        originalData.birthDate = formData.birthDate;
      }
      
      return success;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  };





  const handleCirclePress = () => {
    // Анимация вращения
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      
      // После завершения анимации проверяем, есть ли уже аккаунт водителя
      // TODO: Здесь должна быть проверка статуса водителя
      const hasDriverAccount = false; // Заглушка, нужно заменить на реальную проверку
      
      if (hasDriverAccount) {
        // Если уже есть аккаунт водителя, переключаемся на профиль водителя
        navigation.navigate('DriverProfile' as any);
      } else {
        // Если нет аккаунта водителя, показываем уведомление
        Alert.alert(
          t('profile.becomeDriverModal.title') || 'Стать водителем',
          t('profile.becomeDriverModal.message') || 'Открыть страницу водителя?',
          [
            { text: t('profile.becomeDriverModal.cancel') || 'Отмена', style: 'cancel' },
            { 
              text: t('profile.becomeDriverModal.proceed') || 'Перейти',
              onPress: async () => {
                // Автоматически входим как водитель
                const success = await login('driver@example.com', 'password123');
                if (!success) {
                  Alert.alert('Ошибка', 'Не удалось войти как водитель');
                }
              }
            }
          ]
        );
      }
    });
  };

  const requestCameraPermissions = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.cameraAccess'),
        t('profile.cameraAccessRequired'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.settings'), onPress: () => {} }
        ]
      );
      return false;
    }
    return true;
  };

  const requestGalleryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('profile.galleryAccess'),
        t('profile.galleryAccessRequired'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('profile.settings'), onPress: () => {} }
        ]
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('profile.photoError'), t('profile.photoTakeError'));
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestGalleryPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(t('profile.photoError'), t('profile.photoPickError'));
    }
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={dynamicStyles.backButton.color} />
        </TouchableOpacity>
        <Text style={[styles.title, dynamicStyles.title]}>{t('profile.editProfile')}</Text>
        <TouchableOpacity 
          onPress={() => {
            if (isEditingPersonalInfo) {
              // Если в режиме редактирования, проверяем изменения
              if (hasChanges()) {
                // Если есть изменения, показываем подтверждение
                Alert.alert(
                  t('profile.saveProfileConfirm.title'),
                  t('profile.saveProfileConfirm.message'),
                  [
                    { 
                      text: t('profile.saveProfileConfirm.cancel'), 
                      style: 'cancel' 
                    },
                    { 
                      text: t('profile.saveProfileConfirm.save'), 
                      onPress: async () => {
                        const success = await saveProfile();
                        if (success) {
                          setIsEditingPersonalInfo(false);
                          // Показываем уведомление об успешном сохранении
                          Alert.alert(
                            t('profile.saveProfileSuccess.title'),
                            t('profile.saveProfileSuccess.message'),
                            [{ text: 'OK' }]
                          );
                        } else {
                          // Показываем ошибку
                          Alert.alert(
                            t('profile.saveProfileError.title'),
                            t('profile.saveProfileError.message'),
                            [{ text: 'OK' }]
                          );
                        }
                      }
                    }
                  ]
                );
              } else {
                // Если изменений нет, просто выключаем режим редактирования
                setIsEditingPersonalInfo(false);
              }
            } else {
              // Если в режиме просмотра, включаем редактирование
              setIsEditingPersonalInfo(true);
            }
          }}
          style={styles.backButton}
        >
          <Ionicons 
            name={isEditingPersonalInfo ? "checkmark" : "create-outline"} 
            size={24} 
            color={isDark ? currentColors.dark.primary : currentColors.light.primary} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Фото профиля */}
        <View style={styles.avatarSection}>
          <View style={[styles.profileNameBox, dynamicStyles.profileNameBox]}>
            <View style={styles.avatar}>
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarText}>{user.name[0]}{user.surname[0]}</Text>
              )}
              <TouchableOpacity 
                style={[styles.addPhotoButton, dynamicStyles.addPhotoButton]}
                onPress={() => {
                  if (profilePhoto) {
                    Alert.alert(
                      t('profile.changePhoto'),
                      t('profile.changePhotoMessage'),
                      [
                        { text: t('common.cancel'), style: 'cancel' },
                        { text: t('profile.takePhoto'), onPress: handleTakePhoto },
                        { text: t('profile.chooseFromGallery'), onPress: handleChooseFromGallery },
                        { 
                          text: t('profile.deletePhoto'), 
                          style: 'destructive',
                          onPress: () => {
                            Alert.alert(
                              t('profile.deletePhotoConfirm'),
                              t('profile.deletePhotoMessage'),
                              [
                                { text: t('common.cancel'), style: 'cancel' },
                                { 
                                  text: t('common.delete'), 
                                  style: 'destructive',
                                  onPress: () => setProfilePhoto(null)
                                }
                              ]
                            );
                          }
                        }
                      ]
                    );
                  } else {
                    Alert.alert(
                      t('profile.addPhoto'),
                      t('profile.addPhotoMessage'),
                      [
                        { text: t('common.cancel'), style: 'cancel' },
                        { text: t('profile.takePhoto'), onPress: handleTakePhoto },
                        { text: t('profile.chooseFromGallery'), onPress: handleChooseFromGallery }
                      ]
                    );
                  }
                }}
                accessibilityLabel={profilePhoto ? t('profile.changePhoto') : t('profile.addPhoto')}
              >
                <Ionicons name={profilePhoto ? "camera" : "add"} size={10} color={isDark ? '#3B82F6' : '#083198'} />
              </TouchableOpacity>
            </View>
            <Text 
              style={[styles.profileName, dynamicStyles.profileName]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {user.name} {user.surname}
            </Text>
            <TouchableOpacity 
              style={[styles.rightCircle, dynamicStyles.rightCircle]}
              onPress={handleCirclePress}
              activeOpacity={0.7}
            >
              <Animated.View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg']
                    })
                  }]
                }}
              >
                <Ionicons name="sync" size={20} color={isDark ? '#9CA3AF' : '#666666'} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

                {/* Основные поля профиля */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t('profile.personalInfo')}
          </Text>
          
          {/* Имя */}
          <View style={[styles.infoRow, dynamicStyles.infoRow, isEditingPersonalInfo && styles.infoRowEditing]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>{t('profile.firstName')}:</Text>
            {isEditingPersonalInfo ? (
              <TextInput
                style={[styles.infoValue, dynamicStyles.infoValue, styles.infoInput]}
                value={formData.firstName}
                onChangeText={(text) => setFormData({...formData, firstName: text})}
                placeholder={t('profile.firstNamePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
              />
            ) : (
              <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{formData.firstName}</Text>
            )}
          </View>

          {/* Фамилия */}
          <View style={[styles.infoRow, dynamicStyles.infoRow, isEditingPersonalInfo && styles.infoRowEditing]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>{t('profile.lastName')}:</Text>
            {isEditingPersonalInfo ? (
              <TextInput
                style={[styles.infoValue, dynamicStyles.infoValue, styles.infoInput]}
                value={formData.lastName}
                onChangeText={(text) => setFormData({...formData, lastName: text})}
                placeholder={t('profile.lastNamePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
              />
            ) : (
              <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{formData.lastName}</Text>
            )}
          </View>

          {/* Телефон */}
          <View style={[styles.infoRow, dynamicStyles.infoRow, isEditingPersonalInfo && styles.infoRowEditing]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>{t('profile.phone')}:</Text>
            {isEditingPersonalInfo ? (
              <TextInput
                style={[styles.infoValue, dynamicStyles.infoValue, styles.infoInput]}
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                placeholder={t('profile.phonePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{formData.phone}</Text>
            )}
          </View>

          {/* Email */}
          <View style={[styles.infoRow, dynamicStyles.infoRow, isEditingPersonalInfo && styles.infoRowEditing]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>{t('profile.email')}:</Text>
            {isEditingPersonalInfo ? (
              <TextInput
                style={[styles.infoValue, dynamicStyles.infoValue, styles.infoInput]}
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                placeholder={t('profile.emailPlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                keyboardType="email-address"
              />
            ) : (
              <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{formData.email}</Text>
            )}
          </View>

          {/* Дата рождения */}
          <View style={[styles.infoRow, dynamicStyles.infoRow, isEditingPersonalInfo && styles.infoRowEditing]}>
            <Text style={[styles.infoLabel, dynamicStyles.infoLabel]}>{t('profile.birthDate')}:</Text>
            {isEditingPersonalInfo ? (
              <TextInput
                style={[styles.infoValue, dynamicStyles.infoValue, styles.infoInput]}
                value={formData.birthDate}
                onChangeText={(text) => setFormData({...formData, birthDate: text})}
                placeholder={t('profile.birthDatePlaceholder')}
                placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
              />
            ) : (
              <Text style={[styles.infoValue, dynamicStyles.infoValue]}>{formData.birthDate}</Text>
            )}
          </View>
        </View>

        {/* Семейная информация */}
        <View style={styles.familySection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t('profile.familyInfo')}
          </Text>
          
          {familyMembers.map((member) => (
            <View key={member.id} style={[styles.familyItem, dynamicStyles.familyItem]}>
              <View style={styles.familyInfo}>
                <Text style={[styles.familyName, dynamicStyles.familyName]}>
                  {member.name}
                </Text>
                <Text style={[styles.familyType, dynamicStyles.familyType]}>
                  {t(`profile.familyTypes.${member.type}`)} • {member.age} {t('profile.years')}
                </Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={20} color={dynamicStyles.familyType.color} />
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity style={[styles.addFamilyButton, dynamicStyles.addFamilyButton]}>
            <Text style={[styles.addFamilyText, dynamicStyles.addFamilyText]}>
              {t('profile.addFamilyMember')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* VIP статус */}
        <View style={styles.vipSection}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
            {t('profile.vipStatus')}
          </Text>
          
          <View style={styles.vipCard}>
            <Text style={styles.vipTitle}>{t('profile.vipTitle')}</Text>
            <Text style={styles.vipDescription}>{t('profile.vipDescription')}</Text>
            <TouchableOpacity style={styles.vipButton}>
              <Text style={styles.vipButtonText}>{t('profile.upgradeToVip')}</Text>
            </TouchableOpacity>
          </View>
        </View>




      </ScrollView>
    </View>
  );
};

export default EditClientProfileScreen;
