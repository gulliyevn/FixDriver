import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RulesModalStyles as styles, getRulesModalStyles } from '../styles/components/RulesModal.styles';
import { RulesSlidesStyles as slideStyles } from '../styles/components/RulesSlides.styles';
import { createSlideAnimation, slideAnimationConfig } from '../styles/animations';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../hooks/useI18n';

interface RuleSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

interface RulesModalProps {
  visible: boolean;
  onClose: () => void;
}

const rulesSlides: RuleSlide[] = [
  {
    id: 1,
    title: 'help.rules.booking.title',
    icon: 'document-text',
    content: 'help.rules.booking.content',
    description: 'help.rules.booking.description',
  },
  {
    id: 2,
    title: 'help.rules.payment.title',
    icon: 'card',
    content: 'help.rules.payment.content',
    description: 'help.rules.payment.description',
  },
  {
    id: 3,
    title: 'help.rules.safety.title',
    icon: 'shield-checkmark',
    content: 'help.rules.safety.content',
    description: 'help.rules.safety.description',
  },
  {
    id: 4,
    title: 'help.rules.support.title',
    icon: 'chatbubbles',
    content: 'help.rules.support.content',
    description: 'help.rules.support.description',
  },
];

const RulesModal: React.FC<RulesModalProps> = ({ visible, onClose }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getRulesModalStyles(isDark);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slides = useMemo(() => rulesSlides, []);

  const openSlide = useCallback(
    (slideIndex: number) => {
      setActiveSlide(slideIndex);
      Animated.spring(slideAnim, slideAnimationConfig.open).start();
    },
    [slideAnim]
  );

  const closeSlide = useCallback(() => {
    Animated.spring(slideAnim, slideAnimationConfig.close).start(() => {
      setActiveSlide(0);
    });
  }, [slideAnim]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, dynamicStyles.modalContainer]}>
        <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Ionicons name="close" size={24} color={isDark ? '#fff' : '#003366'} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>{t('help.rulesTitle')}</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {slides.map((slide, index) => (
            <TouchableOpacity
              key={slide.id}
              style={[slideStyles.slideItem, dynamicStyles.slideItem]}
              onPress={() => openSlide(index)}
              activeOpacity={0.7}
            >
              <View style={[slideStyles.slideIcon, dynamicStyles.slideIcon]}>
                <Ionicons name={slide.icon as any} size={24} color={isDark ? '#fff' : '#003366'} />
              </View>
              <View style={slideStyles.slideInfo}>
                <Text style={[slideStyles.slideTitle, dynamicStyles.slideTitle]}>{t(slide.title)}</Text>
                <Text style={[slideStyles.slideDescription, dynamicStyles.slideContent]}>{t(slide.description)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={isDark ? '#666' : '#ccc'} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Animated.View
          style={[slideStyles.slideOverlay, dynamicStyles.slideOverlay, createSlideAnimation(slideAnim)]}
        >
          {activeSlide >= 0 && (
            <View style={slideStyles.slideContent}>
              <View style={[slideStyles.slideHeader, dynamicStyles.slideHeader]}>
                <TouchableOpacity onPress={closeSlide} style={slideStyles.backButton}>
                  <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#003366'} />
                </TouchableOpacity>
                <Text style={[slideStyles.slideHeaderTitle, dynamicStyles.slideHeaderTitle]}>
                  {t(slides[activeSlide]?.title)}
                </Text>
                <View style={styles.placeholder} />
              </View>
              <ScrollView style={slideStyles.slideScroll}>
                <Text style={[slideStyles.slideText, dynamicStyles.slideText]}>
                  {t(slides[activeSlide]?.content)}
                </Text>
              </ScrollView>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default RulesModal;