import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import JWTService from '../services/JWTService';

interface AuthStatusIndicatorProps {
  showDetails?: boolean;
  onRefresh?: () => void;
}

const AuthStatusIndicator: React.FC<AuthStatusIndicatorProps> = ({ 
  showDetails = false, 
  onRefresh 
}) => {
  const { user, isAuthenticated, refreshAuth } = useAuth();
  const { isDark } = useTheme();
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  useEffect(() => {
    checkTokenStatus();
    // Проверяем статус токена каждые 5 минут
    const interval = setInterval(checkTokenStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkTokenStatus = async () => {
    try {
      const token = await JWTService.getAccessToken();
      if (token) {
        const isExpired = JWTService.isTokenExpired(token);
        setTokenStatus(isExpired ? 'expired' : 'valid');
      } else {
        setTokenStatus('unknown');
      }
      setLastCheck(new Date());
    } catch (error) {
      console.error('Error checking token status:', error);
      setTokenStatus('unknown');
    }
  };

  const handleRefreshToken = async () => {
    try {
      const success = await refreshAuth();
      if (success) {
        Alert.alert('✅ Успешно', 'Токен обновлен');
        checkTokenStatus();
        onRefresh?.();
      } else {
        Alert.alert('⚠️ Внимание', 'Не удалось обновить токен. Попробуйте войти заново.');
      }
    } catch (error) {
      Alert.alert('❌ Ошибка', 'Произошла ошибка при обновлении токена');
    }
  };

  const getStatusColor = () => {
    switch (tokenStatus) {
      case 'valid':
        return '#10B981'; // green
      case 'expired':
        return '#F59E0B'; // amber
      case 'unknown':
        return '#6B7280'; // gray
      default:
        return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'Токен действителен';
      case 'expired':
        return 'Токен истек';
      case 'unknown':
        return 'Статус неизвестен';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusIcon = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'checkmark-circle';
      case 'expired':
        return 'warning';
      case 'unknown':
        return 'help-circle';
      default:
        return 'help-circle';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.statusRow}>
        <View style={styles.statusInfo}>
          <Ionicons 
            name={getStatusIcon() as any} 
            size={16} 
            color={getStatusColor()} 
          />
          <Text style={[styles.statusText, isDark && styles.statusTextDark]}>
            {getStatusText()}
          </Text>
        </View>
        
        {tokenStatus === 'expired' && (
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefreshToken}
          >
            <Ionicons name="refresh" size={16} color="#3B82F6" />
            <Text style={styles.refreshText}>Обновить</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            Пользователь: {user?.name} {user?.surname}
          </Text>
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            Email: {user?.email}
          </Text>
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            Роль: {user?.role === 'client' ? 'Клиент' : 'Водитель'}
          </Text>
          <Text style={[styles.detailText, isDark && styles.detailTextDark]}>
            Последняя проверка: {lastCheck.toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  containerDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  statusTextDark: {
    color: '#D1D5DB',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  refreshText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailTextDark: {
    color: '#9CA3AF',
  },
});

export default AuthStatusIndicator; 