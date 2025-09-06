import { Animated, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface TransitionConfig {
  duration?: number;
  easing?: (value: number) => number;
}

export class ScreenTransitions {
  private slideAnim: Animated.Value;
  private fadeAnim: Animated.Value;
  private scaleAnim: Animated.Value;

  constructor() {
    this.slideAnim = new Animated.Value(0);
    this.fadeAnim = new Animated.Value(1);
    this.scaleAnim = new Animated.Value(1);
  }

  // Slide from right animation
  slideFromRight(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    this.slideAnim.setValue(screenWidth);
    return Animated.timing(this.slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  }

  // Instant slide (no animation)
  instantSlide() {
    this.slideAnim.setValue(0);
    return Animated.timing(this.slideAnim, {
      toValue: 0,
      duration: 0,
      useNativeDriver: true,
    });
  }

  // Modern slide with scale animation
  modernSlide(config: TransitionConfig = {}) {
    const { duration = 350 } = config;
    
    this.slideAnim.setValue(screenWidth * 0.3);
    this.scaleAnim.setValue(0.95);
    
    return Animated.parallel([
      Animated.timing(this.slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(this.scaleAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]);
  }

  // Slide from left animation
  slideFromLeft(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    this.slideAnim.setValue(-screenWidth);
    return Animated.timing(this.slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  }

  // Fade in animation
  fadeIn(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    this.fadeAnim.setValue(0);
    return Animated.timing(this.fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });
  }

  // Scale in animation
  scaleIn(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    this.scaleAnim.setValue(0.8);
    return Animated.timing(this.scaleAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    });
  }

  // Combined slide and fade animation
  slideAndFade(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    return Animated.parallel([
      this.slideFromRight({ duration }),
      this.fadeIn({ duration }),
    ]);
  }

  // Modal slide up animation
  slideUp(config: TransitionConfig = {}) {
    const { duration = 300 } = config;
    
    this.slideAnim.setValue(screenHeight);
    return Animated.timing(this.slideAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    });
  }

  // Get animation styles
  getSlideStyle() {
    return {
      transform: [{ translateX: this.slideAnim }],
    };
  }

  getFadeStyle() {
    return {
      opacity: this.fadeAnim,
    };
  }

  getScaleStyle() {
    return {
      transform: [{ scale: this.scaleAnim }],
    };
  }

  getCombinedStyle() {
    return {
      transform: [{ translateX: this.slideAnim }],
      opacity: this.fadeAnim,
    };
  }

  getModernStyle() {
    return {
      transform: [
        { translateX: this.slideAnim },
        { scale: this.scaleAnim }
      ],
    };
  }

  getModalStyle() {
    return {
      transform: [{ translateY: this.slideAnim }],
      opacity: this.fadeAnim,
    };
  }

  // Reset animations
  reset() {
    this.slideAnim.setValue(0);
    this.fadeAnim.setValue(1);
    this.scaleAnim.setValue(1);
  }
}

// Predefined transition types
export const TransitionTypes = {
  SLIDE_RIGHT: 'slideRight',
  SLIDE_LEFT: 'slideLeft',
  FADE: 'fade',
  SCALE: 'scale',
  SLIDE_AND_FADE: 'slideAndFade',
  MODAL: 'modal',
  MODERN: 'modern',
} as const;

export type TransitionType = typeof TransitionTypes[keyof typeof TransitionTypes];

// Helper function to get transition animation
export const getTransitionAnimation = (
  transitionType: TransitionType,
  config: TransitionConfig = {}
) => {
  const transitions = new ScreenTransitions();
  
  switch (transitionType) {
    case TransitionTypes.SLIDE_RIGHT:
      return transitions.slideFromRight(config);
    case TransitionTypes.SLIDE_LEFT:
      return transitions.slideFromLeft(config);
    case TransitionTypes.FADE:
      return transitions.fadeIn(config);
    case TransitionTypes.SCALE:
      return transitions.scaleIn(config);
    case TransitionTypes.SLIDE_AND_FADE:
      return transitions.slideAndFade(config);
    case TransitionTypes.MODAL:
      return transitions.slideUp(config);
    case TransitionTypes.MODERN:
      return transitions.modernSlide(config);
    default:
      return transitions.modernSlide(config);
  }
};
