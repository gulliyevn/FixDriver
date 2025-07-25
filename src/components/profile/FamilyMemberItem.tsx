import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import DatePicker from '../DatePicker';
import { calculateAge } from '../../utils/profileHelpers';

const familyTypes = [
  { key: 'husband', label: 'Муж' },
  { key: 'wife', label: 'Жена' },
  { key: 'son', label: 'Сын' },
  { key: 'daughter', label: 'Дочь' },
  { key: 'mother', label: 'Мать' },
  { key: 'father', label: 'Отец' },
  { key: 'grandmother', label: 'Бабушка' },
  { key: 'grandfather', label: 'Дедушка' },
  { key: 'brother', label: 'Брат' },
  { key: 'sister', label: 'Сестра' },
  { key: 'uncle', label: 'Дядя' },
  { key: 'aunt', label: 'Тетя' },
  { key: 'cousin', label: 'Двоюродный брат/сестра' },
  { key: 'nephew', label: 'Племянник' },
  { key: 'niece', label: 'Племянница' },
  { key: 'stepfather', label: 'Отчим' },
  { key: 'stepmother', label: 'Мачеха' },
  { key: 'stepson', label: 'Пасынок' },
  { key: 'stepdaughter', label: 'Падчерица' },
  { key: 'other', label: 'Другое' },
];

interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  type: string;
  birthDate: string;
  age: number;
  phone?: string;
  phoneVerified?: boolean;
}

interface FamilyMemberItemProps {
  member: FamilyMember;
  isExpanded: boolean;
  isEditing: boolean;
  phoneVerified: boolean;
  isVerifyingPhone: boolean;
  onToggle: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSave: (updatedData: Partial<FamilyMember>) => void;
  onDelete: () => void;
  onVerifyPhone: () => void;
  onResetPhoneVerification: () => void;
}

const FamilyMemberItem: React.FC<FamilyMemberItemProps> = ({
  member,
  isExpanded,
  isEditing,
  phoneVerified,
  isVerifyingPhone,
  onToggle,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
  onVerifyPhone,
  onResetPhoneVerification,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  
  const [editingData, setEditingData] = useState<Partial<FamilyMember>>({
    name: member.name,
    surname: member.surname,
    type: member.type,
    birthDate: member.birthDate,
    phone: member.phone || '',
  });

  // Обновляем editingData при изменении member или isEditing
  React.useEffect(() => {
    if (isEditing) {
      setEditingData({
        name: member.name,
        surname: member.surname,
        type: member.type,
        birthDate: member.birthDate,
        phone: member.phone || '',
      });
    }
  }, [isEditing, member]);

  const hasChanges = () => {
    const changes = (
      editingData.name !== member.name ||
      editingData.surname !== member.surname ||
      editingData.type !== member.type ||
      editingData.birthDate !== member.birthDate ||
      editingData.phone !== (member.phone || '')
    );
    console.log('hasChanges check:', {
      name: editingData.name !== member.name,
      surname: editingData.surname !== member.surname,
      type: editingData.type !== member.type,
      birthDate: editingData.birthDate !== member.birthDate,
      phone: editingData.phone !== (member.phone || ''),
      result: changes
    });
    return changes;
  };

  const handleSave = () => {
    if (hasChanges()) {
      Alert.alert(
        'Подтверждение',
        'Вы уверены, что хотите сохранить изменения?',
        [
          { text: 'Отмена', style: 'cancel' },
          { 
            text: 'Сохранить', 
            onPress: () => {
              const updatedData = {
                ...editingData,
                age: calculateAge(editingData.birthDate || member.birthDate),
              };
              onSave(updatedData);
            }
          }
        ]
      );
    } else {
      onCancelEditing();
    }
  };

  const handleCancel = () => {
    if (hasChanges()) {
      Alert.alert(
        'Несохраненные изменения',
        'У вас есть несохраненные изменения. Хотите их сохранить?',
        [
          { 
            text: 'Не сохранять', 
            style: 'destructive',
            onPress: () => {
              // Сбрасываем данные к исходным и выходим из режима редактирования
              setEditingData({
                name: member.name,
                surname: member.surname,
                type: member.type,
                birthDate: member.birthDate,
                phone: member.phone || '',
              });
              onCancelEditing();
            }
          },
          { 
            text: 'Сохранить', 
            onPress: () => {
              const updatedData = {
                ...editingData,
                age: calculateAge(editingData.birthDate || member.birthDate),
              };
              onSave(updatedData);
            }
          }
        ]
      );
    } else {
      onCancelEditing();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите удалить этого члена семьи?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: onDelete }
      ]
    );
  };

  return (
    <View>
      {/* Заголовок члена семьи */}
      <TouchableOpacity 
        style={[
          { 
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: isDark ? '#1F2937' : '#f9f9f9',
            borderRadius: 8,
            marginBottom: 8,
          }
        ]}
        onPress={() => {
          console.log('isEditing:', isEditing, 'hasChanges:', hasChanges());
          if (isEditing && hasChanges()) {
            console.log('Showing cancel dialog');
            handleCancel();
          } else {
            onToggle();
          }
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 16, 
            fontWeight: '500', 
            color: isDark ? '#F9FAFB' : '#003366' 
          }}>
            {member.name} {member.surname}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: isDark ? '#9CA3AF' : '#666666' 
          }}>
            {t(`profile.familyTypes.${member.type}`)} • {member.age} {t('profile.years')}
          </Text>
        </View>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#666666'}
          style={{ transform: [{ rotate: isExpanded ? '90deg' : '0deg' }] }}
        />
      </TouchableOpacity>
      
      {/* Расширенная информация */}
      {isExpanded && (
        <View style={{ 
          backgroundColor: isDark ? '#1F2937' : '#f9f9f9',
          borderRadius: 8,
          padding: 16,
          marginBottom: 8,
        }}>
          {isEditing ? (
            // Режим редактирования
            <View>
              {/* Имя */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: isDark ? '#F9FAFB' : '#003366',
                  marginBottom: 8 
                }}>
                  {t('profile.firstName')}:
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: isDark ? '#111827' : '#fff',
                    color: isDark ? '#F9FAFB' : '#003366',
                  }}
                  value={editingData.name}
                  onChangeText={(text) => setEditingData({...editingData, name: text})}
                  placeholder={t('profile.firstNamePlaceholder')}
                  placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                />
              </View>

                             {/* Фамилия */}
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ 
                   fontSize: 14, 
                   fontWeight: '500', 
                   color: isDark ? '#F9FAFB' : '#003366',
                   marginBottom: 8 
                 }}>
                   {t('profile.lastName')}:
                 </Text>
                 <TextInput
                   style={{
                     borderWidth: 1,
                     borderColor: isDark ? '#374151' : '#e0e0e0',
                     borderRadius: 8,
                     padding: 12,
                     fontSize: 16,
                     backgroundColor: isDark ? '#111827' : '#fff',
                     color: isDark ? '#F9FAFB' : '#003366',
                   }}
                   value={editingData.surname}
                   onChangeText={(text) => setEditingData({...editingData, surname: text})}
                   placeholder={t('profile.lastNamePlaceholder')}
                   placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                 />
               </View>

               {/* Тип члена семьи */}
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ 
                   fontSize: 14, 
                   fontWeight: '500', 
                   color: isDark ? '#F9FAFB' : '#003366',
                   marginBottom: 8 
                 }}>
                   {t('profile.familyType')}:
                 </Text>
                 <View style={{ position: 'relative' }}>
                   <TouchableOpacity
                     style={{
                       flexDirection: 'row',
                       alignItems: 'center',
                       justifyContent: 'space-between',
                       borderWidth: 1,
                       borderColor: isDark ? '#374151' : '#e0e0e0',
                       borderRadius: 8,
                       padding: 12,
                       backgroundColor: isDark ? '#111827' : '#fff',
                     }}
                     onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                   >
                     <Text style={{
                       fontSize: 16,
                       color: isDark ? '#F9FAFB' : '#003366',
                     }}>
                       {familyTypes.find(t => t.key === (editingData.type || member.type))?.label || 'Выберите тип'}
                     </Text>
                     <Ionicons 
                       name={showTypeDropdown ? "chevron-up" : "chevron-down"} 
                       size={16} 
                       color={isDark ? '#9CA3AF' : '#666666'} 
                     />
                   </TouchableOpacity>
                   
                   {/* Выпадающий список типов */}
                   {showTypeDropdown && (
                     <View style={{
                       position: 'absolute',
                       top: '100%',
                       left: 0,
                       right: 0,
                       backgroundColor: isDark ? '#111827' : '#fff',
                       borderWidth: 1,
                       borderColor: isDark ? '#374151' : '#e0e0e0',
                       borderRadius: 8,
                       marginTop: 4,
                       maxHeight: 200,
                       elevation: 10,
                       shadowColor: '#000',
                       shadowOffset: { width: 0, height: 4 },
                       shadowOpacity: 0.2,
                       shadowRadius: 5,
                       zIndex: 1000,
                     }}>
                       <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                         {familyTypes.map((type, index) => (
                           <TouchableOpacity
                             key={type.key}
                             style={{
                               flexDirection: 'row',
                               alignItems: 'center',
                               justifyContent: 'space-between',
                               paddingVertical: 12,
                               paddingHorizontal: 16,
                               borderBottomWidth: type.key === 'other' ? 0 : 1,
                               borderBottomColor: isDark ? '#374151' : '#f0f0f0',
                               backgroundColor: (editingData.type || member.type) === type.key ? (isDark ? '#1F2937' : '#f8f9fa') : 'transparent',
                             }}
                             onPress={() => {
                               setEditingData({...editingData, type: type.key});
                               setShowTypeDropdown(false);
                             }}
                           >
                             <Text style={{
                               fontSize: 16,
                               color: isDark ? '#F9FAFB' : '#003366',
                               fontWeight: (editingData.type || member.type) === type.key ? '600' : '400',
                             }}>
                               {type.label}
                             </Text>
                             {(editingData.type || member.type) === type.key && (
                               <Ionicons name="checkmark" size={16} color={isDark ? '#3B82F6' : '#083198'} />
                             )}
                           </TouchableOpacity>
                         ))}
                       </ScrollView>
                     </View>
                   )}
                 </View>
               </View>

              {/* Дата рождения */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: isDark ? '#F9FAFB' : '#003366',
                  marginBottom: 8 
                }}>
                  {t('profile.birthDate')}:
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: isDark ? '#374151' : '#e0e0e0',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: isDark ? '#111827' : '#fff',
                }}>
                  <DatePicker
                    value={editingData.birthDate || member.birthDate}
                    onChange={(date) => setEditingData({...editingData, birthDate: date})}
                    placeholder={t('profile.birthDatePlaceholder')}
                    inline={true}
                    readOnly={false}
                  />
                </View>
              </View>

              {/* Телефон */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '500', 
                  color: isDark ? '#F9FAFB' : '#003366',
                  marginBottom: 8 
                }}>
                  {t('profile.phone')}:
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: isDark ? '#374151' : '#e0e0e0',
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: isDark ? '#111827' : '#fff',
                }}>
                  <TextInput
                    style={{
                      flex: 1,
                      borderWidth: 0,
                      backgroundColor: 'transparent',
                      padding: 0,
                      margin: 0,
                      fontSize: 16,
                      color: isDark ? '#F9FAFB' : '#003366',
                    }}
                    value={editingData.phone}
                    onChangeText={(text) => {
                      setEditingData({...editingData, phone: text});
                      // Сбрасываем верификацию при изменении номера
                      if (text !== member.phone) {
                        onResetPhoneVerification();
                      }
                    }}
                    placeholder={t('profile.phonePlaceholder')}
                    placeholderTextColor={isDark ? '#9CA3AF' : '#666666'}
                    keyboardType="phone-pad"
                  />
                  <TouchableOpacity
                    style={{ 
                      paddingHorizontal: 2, 
                      paddingVertical: 6, 
                      marginLeft: 4,
                      opacity: editingData.phone?.trim() ? 1 : 0.5
                    }}
                    onPress={onVerifyPhone}
                    disabled={isVerifyingPhone || !editingData.phone?.trim()}
                  >
                    <Ionicons 
                      name={phoneVerified ? "checkmark-circle" : "shield-checkmark-outline"} 
                      size={20} 
                      color={phoneVerified ? '#4CAF50' : (isDark ? '#3B82F6' : '#083198')} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Кнопки действий */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#dc3545',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={handleDelete}
                >
                  <Text style={{ fontSize: 16, color: '#fff', fontWeight: '500' }}>
                    {t('common.delete')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#3B82F6' : '#083198',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                  onPress={handleSave}
                >
                  <Text style={{ fontSize: 16, color: '#fff', fontWeight: '500' }}>
                    {t('common.save')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
                     ) : (
             // Режим просмотра
             <View>
               {/* Имя */}
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ 
                   fontSize: 14, 
                   fontWeight: '500', 
                   color: isDark ? '#F9FAFB' : '#003366',
                   marginBottom: 8 
                 }}>
                   {t('profile.firstName')}:
                 </Text>
                 <View style={{
                   borderWidth: 1,
                   borderColor: isDark ? '#374151' : '#e0e0e0',
                   borderRadius: 8,
                   padding: 12,
                   backgroundColor: isDark ? '#111827' : '#fff',
                 }}>
                   <Text style={{
                     fontSize: 16,
                     color: isDark ? '#F9FAFB' : '#003366',
                   }}>
                     {member.name}
                   </Text>
                 </View>
               </View>

                               {/* Фамилия */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: isDark ? '#F9FAFB' : '#003366',
                    marginBottom: 8 
                  }}>
                    {t('profile.lastName')}:
                  </Text>
                  <View style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: isDark ? '#111827' : '#fff',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: isDark ? '#F9FAFB' : '#003366',
                    }}>
                      {member.surname}
                    </Text>
                  </View>
                </View>

                {/* Тип члена семьи */}
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '500', 
                    color: isDark ? '#F9FAFB' : '#003366',
                    marginBottom: 8 
                  }}>
                    {t('profile.familyType')}:
                  </Text>
                  <View style={{
                    borderWidth: 1,
                    borderColor: isDark ? '#374151' : '#e0e0e0',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: isDark ? '#111827' : '#fff',
                  }}>
                    <Text style={{
                      fontSize: 16,
                      color: isDark ? '#F9FAFB' : '#003366',
                    }}>
                      {t(`profile.familyTypes.${member.type}`)}
                    </Text>
                  </View>
                </View>

               {/* Дата рождения */}
               <View style={{ marginBottom: 16 }}>
                 <Text style={{ 
                   fontSize: 14, 
                   fontWeight: '500', 
                   color: isDark ? '#F9FAFB' : '#003366',
                   marginBottom: 8 
                 }}>
                   {t('profile.birthDate')}:
                 </Text>
                 <View style={{
                   borderWidth: 1,
                   borderColor: isDark ? '#374151' : '#e0e0e0',
                   borderRadius: 8,
                   padding: 12,
                   backgroundColor: isDark ? '#111827' : '#fff',
                 }}>
                   <Text style={{
                     fontSize: 16,
                     color: isDark ? '#F9FAFB' : '#003366',
                   }}>
                     {new Date(member.birthDate).toLocaleDateString('ru-RU', {
                       day: '2-digit',
                       month: '2-digit',
                       year: 'numeric',
                     })} ({member.age} {t('profile.years')})
                   </Text>
                 </View>
               </View>

               {/* Телефон */}
               <View style={{ marginBottom: 20 }}>
                 <Text style={{ 
                   fontSize: 14, 
                   fontWeight: '500', 
                   color: isDark ? '#F9FAFB' : '#003366',
                   marginBottom: 8 
                 }}>
                   {t('profile.phone')}:
                 </Text>
                 <View style={{
                   flexDirection: 'row',
                   alignItems: 'center',
                   justifyContent: 'space-between',
                   borderWidth: 1,
                   borderColor: isDark ? '#374151' : '#e0e0e0',
                   borderRadius: 8,
                   padding: 12,
                   backgroundColor: isDark ? '#111827' : '#fff',
                 }}>
                   <Text style={{
                     flex: 1,
                     fontSize: 16,
                     color: isDark ? '#F9FAFB' : '#003366',
                   }}>
                     {member.phone || t('profile.noPhone')}
                   </Text>
                   {member.phone && (
                     <Ionicons 
                       name={member.phoneVerified ? "checkmark-circle" : "shield-checkmark-outline"} 
                       size={20} 
                       color={member.phoneVerified ? '#4CAF50' : (isDark ? '#3B82F6' : '#083198')} 
                     />
                   )}
                 </View>
               </View>

               <TouchableOpacity 
                 style={{
                   backgroundColor: isDark ? '#3B82F6' : '#083198',
                   paddingVertical: 12,
                   paddingHorizontal: 16,
                   borderRadius: 8,
                   alignItems: 'center',
                 }}
                 onPress={onStartEditing}
               >
                 <Text style={{ fontSize: 16, color: '#fff', fontWeight: '500' }}>
                   {t('profile.editFamilyMember')}
                 </Text>
               </TouchableOpacity>
             </View>
           )}
        </View>
      )}
    </View>
  );
};

export default FamilyMemberItem; 