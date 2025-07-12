import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientScreenProps } from '../../types/navigation';
import { ResidenceScreenStyles as styles } from '../../styles/screens/profile/ResidenceScreen.styles';

/**
 * Экран резиденции
 * 
 * TODO для интеграции с бэкендом:
 * 1. Заменить useState на useResidence hook
 * 2. Подключить ResidenceService для API вызовов
 * 3. Добавить обработку ошибок и загрузки
 * 4. Реализовать управление адресами
 * 5. Подключить геолокацию
 */

const ResidenceScreen: React.FC<ClientScreenProps<'Residence'>> = ({ navigation }) => {
  const [addresses] = useState([
    {
      id: '1',
      title: 'Дом',
      address: 'ул. Ленина, 123, кв. 45',
      isDefault: true
    },
    {
      id: '2',
      title: 'Работа',
      address: 'пр. Гейдара Алиева, 78, офис 15',
      isDefault: false
    }
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Резиденция</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#003366" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={styles.description}>
            Управляйте своими адресами для быстрого заказа поездок
          </Text>
        </View>
        
        {addresses.map((address) => (
          <View key={address.id} style={styles.addressItem}>
            <View style={styles.addressInfo}>
              <Text style={styles.addressTitle}>{address.title}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
            </View>
            <View style={styles.addressActions}>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>По умолчанию</Text>
                </View>
              )}
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="pencil" size={20} color="#003366" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ResidenceScreen; 