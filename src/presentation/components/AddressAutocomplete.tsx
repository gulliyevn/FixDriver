import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getCurrentColors } from '../constants/colors';
import { placesService, PlacePrediction, PlaceDetails, AddressHistory } from '../services/placesService';
import { MapLocation } from './MapView/types/map.types';

interface AddressAutocompleteProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onAddressSelect: (address: string, coordinates: MapLocation) => void;
  onValidationChange: (isValid: boolean) => void;
  type: 'from' | 'to' | 'stop';
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  placeholder,
  value,
  onChangeText,
  onAddressSelect,
  onValidationChange,
  type,
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const colors = getCurrentColors(isDark);
  
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [history, setHistory] = useState<AddressHistory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<TextInput>(null);

  // Загрузка истории при монтировании
  useEffect(() => {
    loadHistory();
  }, []);

  // Загрузка истории адресов
  const loadHistory = async () => {
    try {
      const historyData = await placesService.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Debounced поиск предсказаний
  const searchPredictions = useCallback(async (input: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (input.trim().length < 2) {
        setPredictions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Поиск по всему миру
        const predictionsData = await placesService.getPlacePredictions(input);
        setPredictions(predictionsData);
      } catch (error) {
        console.error('Error searching predictions:', error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  // Обработка изменения текста
  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    // Валидация
    const validation = placesService.validateAddress(text);
    setValidationError(validation.error || null);
    onValidationChange(validation.isValid);
    
    // Поиск предсказаний
    if (text.trim().length >= 2) {
      setShowDropdown(true);
      searchPredictions(text);
    } else {
      setShowDropdown(false);
      setPredictions([]);
    }
  };

  // Обработка выбора адреса из предсказаний
  const handlePredictionSelect = async (prediction: PlacePrediction) => {
    try {
      setIsLoading(true);
      
      const details = await placesService.getPlaceDetails(prediction.place_id);
      if (!details) {
        Alert.alert('Ошибка', 'Не удалось получить координаты адреса');
        return;
      }

      const coordinates: MapLocation = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };

      // Сохраняем в историю
      await placesService.saveToHistory(
        details.formatted_address,
        details.place_id,
        coordinates
      );

      // Обновляем историю
      await loadHistory();

      // Вызываем callback
      onAddressSelect(details.formatted_address, coordinates);
      onChangeText(details.formatted_address);
      setShowDropdown(false);
      setPredictions([]);
      setValidationError(null);
      onValidationChange(true);
      
    } catch (error) {
      console.error('Error selecting prediction:', error);
      Alert.alert('Ошибка', 'Не удалось обработать выбранный адрес');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработка выбора адреса из истории
  const handleHistorySelect = (historyItem: AddressHistory) => {
    const coordinates: MapLocation = {
      latitude: historyItem.coordinates.latitude,
      longitude: historyItem.coordinates.longitude,
    };

    onAddressSelect(historyItem.address, coordinates);
    onChangeText(historyItem.address);
    setShowDropdown(false);
    setValidationError(null);
    onValidationChange(true);
  };

  // Быстрые опции
  const handleQuickOption = (option: string) => {
    setShowDropdown(false);
    // Здесь можно добавить логику для быстрых опций
    Alert.alert('Информация', `Функция "${option}" будет добавлена позже`);
  };

  // Определение цвета бордера
  const getBorderColor = () => {
    if (validationError) return colors.error;
    if (value.trim() && !validationError) {
      switch (type) {
        case 'from': return colors.success;
        case 'to': return colors.primary;
        case 'stop': return colors.textSecondary;
        default: return colors.border;
      }
    }
    return colors.border;
  };

  return (
    <View style={{ position: 'relative', zIndex: 1000 }}>
      <TextInput
        ref={inputRef}
        style={{
          fontSize: 12,
          color: colors.text,
          paddingVertical: 4,
          paddingHorizontal: 0,
          borderBottomWidth: 1,
          borderBottomColor: getBorderColor(),
        }}
        placeholder={placeholder}
        value={value}
        onChangeText={handleTextChange}
        placeholderTextColor={colors.textSecondary}
        onFocus={() => {
          if (value.trim().length >= 2 || history.length > 0) {
            setShowDropdown(true);
          }
        }}
        onBlur={() => {
          // Не скрываем сразу, чтобы пользователь мог кликнуть на опцию
          setTimeout(() => setShowDropdown(false), 200);
        }}
      />

      {/* Ошибка валидации */}
      {validationError && (
        <Text style={{
          fontSize: 10,
          color: colors.error,
          marginTop: 2,
        }}>
          {validationError}
        </Text>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <View style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: colors.surface,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 10,
          zIndex: 1000,
          maxHeight: 300,
          marginTop: 4,
        }}>
          <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
            
            {/* Быстрые опции */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
              onPress={() => handleQuickOption('Текущая локация')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="navigate" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, color: colors.text }}>
                  Текущая локация
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
              onPress={() => handleQuickOption('Недавние поездки')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, color: colors.text }}>
                  Недавние поездки
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
              onPress={() => handleQuickOption('Домашний адрес')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="home" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, color: colors.text }}>
                  Домашний адрес
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
              onPress={() => handleQuickOption('Рабочий адрес')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="business" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={{ fontSize: 16, color: colors.text }}>
                  Рабочий адрес
                </Text>
              </View>
            </TouchableOpacity>

            {/* Разделитель */}
            <View style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: 8,
            }} />

            {/* Предложения Google */}
            {predictions.length > 0 && (
              <>
                <View style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontWeight: '500',
                  }}>
                    Предложения Google:
                  </Text>
                </View>
                
                {predictions.map((prediction, index) => (
                  <TouchableOpacity
                    key={prediction.place_id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: index < predictions.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                    onPress={() => handlePredictionSelect(prediction)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, color: colors.text }}>
                        {prediction.structured_formatting.main_text}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                        {prediction.structured_formatting.secondary_text}
                      </Text>
                    </View>
                    {isLoading && (
                      <ActivityIndicator size="small" color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* История */}
            {history.length > 0 && (
              <>
                <View style={{
                  height: 1,
                  backgroundColor: colors.border,
                  marginVertical: 8,
                }} />
                
                <View style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}>
                  <Text style={{
                    fontSize: 12,
                    color: colors.textSecondary,
                    fontWeight: '500',
                  }}>
                    История:
                  </Text>
                </View>
                
                {history.map((historyItem, index) => (
                  <TouchableOpacity
                    key={historyItem.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderBottomWidth: index < history.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                    }}
                    onPress={() => handleHistorySelect(historyItem)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, color: colors.text }}>
                        {historyItem.address}
                      </Text>
                    </View>
                    <Ionicons name="time" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* Сообщение если нет результатов */}
            {predictions.length === 0 && history.length === 0 && !isLoading && value.trim().length >= 2 && (
              <View style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                }}>
                  Адрес не найден
                </Text>
              </View>
            )}

            {/* Индикатор загрузки */}
            {isLoading && predictions.length === 0 && (
              <View style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                alignItems: 'center',
              }}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginTop: 8,
                }}>
                  Поиск адресов...
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default AddressAutocomplete;
