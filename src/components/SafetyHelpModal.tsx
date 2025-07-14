import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RulesModalStyles as styles } from '../styles/components/RulesModal.styles';
import { RulesSlidesStyles as slideStyles } from '../styles/components/RulesSlides.styles';
import { getSafetyHelpSlides, SafetyHelpSlide } from '../mocks/safetyHelpMock';
import { createSlideAnimation, slideAnimationConfig } from '../styles/animations';

interface SafetyHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const SafetyHelpModal: React.FC<SafetyHelpModalProps> = ({ visible, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slides: SafetyHelpSlide[] = getSafetyHelpSlides();

  // Мемоизируем функции анимации
  const openSlide = useCallback((slideIndex: number) => {
    setActiveSlide(slideIndex);
    Animated.spring(slideAnim, slideAnimationConfig.open).start();
  }, [slideAnim]);

  const closeSlide = useCallback(() => {
    Animated.spring(slideAnim, slideAnimationConfig.close).start(() => {
      setActiveSlide(0);
    });
  }, [slideAnim]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.modalCloseButton}
          >
            <Ionicons name="close" size={24} color="#003366" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Безопасность</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {slides.map((slide, index) => (
            <TouchableOpacity 
              key={slide.id}
              style={slideStyles.slideItem}
              onPress={() => openSlide(index)}
              activeOpacity={0.7}
            >
              <View style={slideStyles.slideIcon}>
                <Ionicons name={slide.icon as any} size={24} color="#003366" />
              </View>
              <View style={slideStyles.slideInfo}>
                <Text style={slideStyles.slideTitle}>{slide.title}</Text>
                <Text style={slideStyles.slideDescription}>{slide.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Подокно слайда */}
        <Animated.View 
          style={[
            slideStyles.slideOverlay,
            createSlideAnimation(slideAnim)
          ]}
        >
          {activeSlide >= 0 && (
            <View style={slideStyles.slideContent}>
              <View style={slideStyles.slideHeader}>
                <TouchableOpacity onPress={closeSlide} style={slideStyles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#003366" />
                </TouchableOpacity>
                <Text style={slideStyles.slideHeaderTitle}>{slides[activeSlide]?.title}</Text>
                <View style={styles.placeholder} />
              </View>
              <ScrollView style={slideStyles.slideScroll}>
                <Text style={slideStyles.slideText}>
                  {slides[activeSlide]?.content}
                </Text>
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default SafetyHelpModal; 