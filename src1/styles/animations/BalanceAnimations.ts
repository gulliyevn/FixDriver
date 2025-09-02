import { Animated } from 'react-native';

export interface CVVAnimationRefs {
  cvvOpacity: Animated.Value;
  stickerOpacity: Animated.Value;
  stickerTranslateX: Animated.Value;
  stickerTranslateY: Animated.Value;
  stickerRotate: Animated.Value;
}

export const createCVVStickAnimation = (
  refs: CVVAnimationRefs,
  onComplete: (showCVV: boolean) => void
) => {
  const { cvvOpacity, stickerOpacity, stickerTranslateX, stickerTranslateY, stickerRotate } = refs;

  return (showCVV: boolean) => {
    if (showCVV) {
      // Приклеиваем стикер обратно
      Animated.parallel([
        Animated.timing(cvvOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stickerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stickerTranslateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stickerTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stickerRotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        onComplete(false);
      });
    } else {
      // Отклеиваем стикер - настоящий отрыв от угла
      Animated.sequence([
        // Отрыв от угла (рывок влево-вверх)
        Animated.parallel([
          Animated.timing(stickerTranslateX, {
            toValue: -15,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(stickerTranslateY, {
            toValue: -20,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(stickerRotate, {
            toValue: 0.2,
            duration: 100,
            useNativeDriver: true,
          })
        ]),
        // Падение и полет вправо
        Animated.parallel([
          Animated.timing(stickerTranslateX, {
            toValue: 60,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(stickerTranslateY, {
            toValue: 15,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(stickerRotate, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(stickerOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(cvvOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        onComplete(true);
      });
    }
  };
}; 