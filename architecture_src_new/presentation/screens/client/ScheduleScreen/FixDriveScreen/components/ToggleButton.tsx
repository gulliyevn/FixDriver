import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../../../../../core/context/ThemeContext';
import { getCurrentColors } from '../../../../../../shared/constants/colors';

interface ToggleButtonProps {
  isLeft: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isLeft, onToggle }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const buttonPosition = useRef(new Animated.Value(isLeft ? 0 : 1)).current;

  // Обновляем позицию кнопки при изменении isLeft
  useEffect(() => {
    const toValue = isLeft ? 0 : 1;
    buttonPosition.setValue(toValue);
  }, [isLeft, buttonPosition]);

  const handlePress = () => {
    const toValue = isLeft ? 1 : 0;
    
    // Сначала обновляем состояние
    onToggle();
    
    // Затем запускаем анимацию
    Animated.timing(buttonPosition, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}>

      <View style={{
        width: 200,
        height: 30,
        backgroundColor: colors.surface,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Анимированная кнопка */}
        <Animated.View 
          style={{
            width: 100,
            height: 24,
            backgroundColor: colors.primary,
            borderRadius: 12,
            position: 'absolute',
            left: buttonPosition.interpolate({
              inputRange: [0, 1],
              outputRange: [4, 96], // 4px от левого края или 96px от левого края (200-100-4)
            }),
          }}
        >
          <TouchableOpacity 
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={handlePress}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: '600',
              textAlign: 'center',
            }}>
              {isLeft ? 'FixDrive' : 'FixWave'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {/* TouchableOpacity для клика по контейнеру */}
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
          onPress={handlePress}
          activeOpacity={1}
        />
      </View>
    </View>
  );
};

export default ToggleButton;
