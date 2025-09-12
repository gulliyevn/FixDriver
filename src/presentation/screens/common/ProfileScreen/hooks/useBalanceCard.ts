/**
 * useBalanceCard hook
 * Logic for balance card animations and interactions
 */

import { useRef, useState } from 'react';
import { Animated } from 'react-native';
import { Clipboard } from 'react-native';
import { useLanguage } from '../../../../../context/LanguageContext';

export const useBalanceCard = () => {
  const { t } = useLanguage();
  
  // Animation refs
  const flipAnim = useRef(new Animated.Value(0)).current;
  const isFlippedRef = useRef(false);
  
  // CVV animation refs
  const cvvOpacity = useRef(new Animated.Value(0)).current;
  const stickerOpacity = useRef(new Animated.Value(1)).current;
  const stickerTranslateX = useRef(new Animated.Value(0)).current;
  const stickerTranslateY = useRef(new Animated.Value(0)).current;
  const stickerRotate = useRef(new Animated.Value(0)).current;
  
  // State
  const [showCopied, setShowCopied] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  
  // Mock balance data - TODO: Replace with real data from context
  const userBalance = 1250.50;
  const totalBalance = 1250.50;
  const earnings = 0;
  
  const handleFlip = () => {
    const toValue = isFlippedRef.current ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      isFlippedRef.current = !isFlippedRef.current;
    });
  };
  
  const handleCopyCardNumber = async () => {
    try {
      await Clipboard.setString('9876 5432 1098 7654');
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (error) {
      // Error copying - silently ignore
    }
  };
  
  const handleToggleCVV = () => {
    const toValue = showCVV ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(cvvOpacity, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(stickerOpacity, {
        toValue: showCVV ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(stickerTranslateX, {
        toValue: showCVV ? 0 : 50,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(stickerTranslateY, {
        toValue: showCVV ? 0 : -20,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(stickerRotate, {
        toValue: showCVV ? 0 : 180,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCVV(!showCVV);
    });
  };
  
  // Interpolations
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '180deg'],
  });
  
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['180deg', '90deg', '0deg'],
  });
  
  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  return {
    flipAnim,
    isFlippedRef,
    handleFlip,
    frontInterpolate,
    backInterpolate,
    frontOpacity,
    backOpacity,
    handleCopyCardNumber,
    showCopied,
    handleToggleCVV,
    showCVV,
    cvvOpacity,
    stickerOpacity,
    stickerTranslateX,
    stickerTranslateY,
    stickerRotate,
    userBalance,
    totalBalance,
    earnings
  };
};
