import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import JWTService from '../services/JWTService';
import { AuthStatusIndicatorStyles } from '../styles/components/AuthStatusIndicator.styles';

interface AuthStatusIndicatorProps {
  showDetails?: boolean;
  onRefresh?: () => void;
}

export default function AuthStatusIndicator({
  showDetails = false,
  onRefresh,
}: AuthStatusIndicatorProps) {
  const { isAuthenticated } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired' | 'unknown'>('unknown');
  const [tokenDetails, setTokenDetails] = useState<Record<string, unknown> | null>(null);

  const checkTokenStatus = async () => {
    if (!isAuthenticated) {
      setTokenStatus('unknown');
      return;
    }

    try {
      const token = await JWTService.getAccessToken();
      if (token) {
        const isExpired = JWTService.isTokenExpired(token);
        setTokenStatus(isExpired ? 'expired' : 'valid');
        
        if (!isExpired) {
          const decoded = JWTService.verifyToken(token);
          setTokenDetails(decoded as unknown as Record<string, unknown>);
        }
      } else {
        setTokenStatus('unknown');
      }
    } catch {
      setTokenStatus('unknown');
    }
  };

  useEffect(() => {
    checkTokenStatus();
  }, [isAuthenticated]);

  const handleRefreshToken = async () => {
    try {
      const success = await JWTService.refreshAccessToken();
      if (success) {
        await checkTokenStatus();
        onRefresh?.();
      }
    } catch {
      console.error('Ошибка обновления токена');
    }
  };

  const getStatusText = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'Токен действителен';
      case 'expired':
        return 'Токен истек';
      case 'unknown':
        return 'Проверка токена...';
      default:
        return 'Неизвестный статус';
    }
  };

  const getContainerStyle = () => {
    switch (tokenStatus) {
      case 'valid':
        return [AuthStatusIndicatorStyles.container, AuthStatusIndicatorStyles.containerAuthenticated];
      case 'expired':
        return [AuthStatusIndicatorStyles.container, AuthStatusIndicatorStyles.containerUnauthenticated];
      case 'unknown':
        return [AuthStatusIndicatorStyles.container, AuthStatusIndicatorStyles.containerLoading];
      default:
        return AuthStatusIndicatorStyles.container;
    }
  };

  const getIconStyle = () => {
    switch (tokenStatus) {
      case 'valid':
        return [AuthStatusIndicatorStyles.icon, AuthStatusIndicatorStyles.iconAuthenticated];
      case 'expired':
        return [AuthStatusIndicatorStyles.icon, AuthStatusIndicatorStyles.iconUnauthenticated];
      case 'unknown':
        return [AuthStatusIndicatorStyles.icon, AuthStatusIndicatorStyles.iconLoading];
      default:
        return AuthStatusIndicatorStyles.icon;
    }
  };

  const getTextStyle = () => {
    switch (tokenStatus) {
      case 'valid':
        return [AuthStatusIndicatorStyles.text, AuthStatusIndicatorStyles.textAuthenticated];
      case 'expired':
        return [AuthStatusIndicatorStyles.text, AuthStatusIndicatorStyles.textUnauthenticated];
      case 'unknown':
        return [AuthStatusIndicatorStyles.text, AuthStatusIndicatorStyles.textLoading];
      default:
        return AuthStatusIndicatorStyles.text;
    }
  };

  const getIconName = (): string => {
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
    return (
      <View style={AuthStatusIndicatorStyles.container}>
        <Ionicons
          name="alert-circle"
          size={20}
          style={AuthStatusIndicatorStyles.icon}
        />
        <Text style={AuthStatusIndicatorStyles.text}>
          Необходима авторизация
        </Text>
      </View>
    );
  }

  return (
    <View style={getContainerStyle()}>
      <Ionicons
        name={getIconName() as keyof typeof Ionicons.glyphMap}
        size={20}
        style={getIconStyle()}
      />
      <Text style={getTextStyle()}>
        {getStatusText()}
      </Text>

      {tokenStatus === 'expired' && (
        <TouchableOpacity 
          style={AuthStatusIndicatorStyles.refreshButton}
          onPress={handleRefreshToken}
        >
          <Ionicons name="refresh" size={16} color={AuthStatusIndicatorStyles.refreshText.color} />
          <Text style={AuthStatusIndicatorStyles.refreshText}>Обновить</Text>
        </TouchableOpacity>
      )}

      {showDetails && tokenDetails && (
        <View style={AuthStatusIndicatorStyles.detailsContainer}>
          <Text style={AuthStatusIndicatorStyles.detailText}>
            User ID: {String(tokenDetails.userId)}
          </Text>
          <Text style={AuthStatusIndicatorStyles.detailText}>
            Role: {String(tokenDetails.role)}
          </Text>
          <Text style={AuthStatusIndicatorStyles.detailText}>
            Expires: {new Date((tokenDetails.exp as number) * 1000).toLocaleString()}
          </Text>
        </View>
      )}
    </View>
  );
} 