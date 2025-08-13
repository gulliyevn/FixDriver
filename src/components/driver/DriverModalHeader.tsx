import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Driver = {
  first_name?: string;
  last_name?: string;
  vehicle_brand?: string;
  vehicle_model?: string;
  vehicle_number?: string;
};

export type DriverModalHeaderProps = {
  styles: any;
  role?: 'client' | 'driver';
  driver?: Driver | null;
  childName?: string;
  childAge?: string;
  slideProgress?: number; // прогресс свайпа для анимации
  isPaused?: boolean; // состояние паузы
  pauseStartTime?: number | null; // время начала паузы
  formatTime?: (seconds: number) => string; // функция форматирования времени
};

const DriverModalHeader: React.FC<DriverModalHeaderProps> = ({ 
  styles, 
  role = 'client', 
  driver, 
  childName, 
  childAge, 
  slideProgress = 0,
  isPaused = false,
  pauseStartTime = null,
  formatTime = () => '00:00'
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Обновление таймера каждую секунду при паузе
  useEffect(() => {
    if (isPaused && pauseStartTime === 0) {
      const interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPaused) {
      setElapsedSeconds(0); // сбрасываем при выходе из паузы
    }
  }, [isPaused, pauseStartTime]);

  return (
    <View style={styles.avatarAndInfoRow}>
      {/* Таймер при паузе */}
      {isPaused && role === 'driver' ? (
        <View style={[
          styles.timerContainer,
          {
            opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
          }
        ]}>
          <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        </View>
      ) : (
        <>
          <View style={[
            styles.avatarContainer,
            {
              opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
            }
          ]}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#FFFFFF" />
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          <View style={[
            styles.driverMainInfo,
            {
              opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
            }
          ]}>
            <View style={styles.nameContainer}>
              <Text style={styles.driverName}>{`${driver?.first_name ?? ''} ${driver?.last_name ?? ''}`}</Text>
              <Ionicons name="diamond" size={16} color="#9CA3AF" style={styles.premiumIcon} />
            </View>
            <View style={styles.vehicleExpandRow}>
              <View style={styles.vehicleInfoContainer}>
                {role === 'driver' && (
                  <Ionicons name="football" size={16} color="#9CA3AF" style={styles.childIcon} />
                )}
                <Text style={styles.vehicleInfo}>
                  {role === 'driver'
                    ? `${childName ?? ''} • ${childAge ?? ''} лет`
                    : `${driver?.vehicle_brand ?? ''} ${driver?.vehicle_model ?? ''} • ${driver?.vehicle_number ?? ''}`}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
      
      {/* Фото машины для клиентской роли */}
      {role === 'client' && driver?.vehicle_brand && driver?.vehicle_model && (
        <View style={styles.vehiclePhotoContainer}>
          <Image 
            source={require('../../../assets/vehicles/toyota-camry.jpg')} 
            style={styles.vehiclePhoto}
            resizeMode="contain"
          />
        </View>
      )}
      
      {/* FixDrive текст для водительской роли */}
      {role === 'driver' && (
        <View style={[
          styles.fixDriveContainer,
          {
            opacity: Math.max(0, (Math.abs(slideProgress) - 40) / 20), // плавное появление после 40
          }
        ]}>
          <Text style={styles.fixDriveText}>FixDrive</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(DriverModalHeader);


