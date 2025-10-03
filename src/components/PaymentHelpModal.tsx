import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  RulesModalStyles as styles,
  getRulesModalStyles,
} from "../styles/components/RulesModal.styles";
import { RulesSlidesStyles as slideStyles } from "../styles/components/RulesSlides.styles";
import {
  createSlideAnimation,
  slideAnimationConfig,
} from "../styles/animations";
import { useTheme } from "../context/ThemeContext";
import { useI18n } from "../hooks/useI18n";

interface PaymentHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

interface PaymentHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const paymentSlides: PaymentHelpSlide[] = [
  {
    id: 1,
    title: "help.payment.paymentMethods.title",
    icon: "card",
    content: "help.payment.paymentMethods.content",
    description: "help.payment.paymentMethods.description",
  },
  {
    id: 2,
    title: "help.payment.tariffCalculation.title",
    icon: "calculator",
    content: "help.payment.tariffCalculation.content",
    description: "help.payment.tariffCalculation.description",
  },
  {
    id: 3,
    title: "help.payment.tariffPlans.title",
    icon: "pricetag",
    content: "help.payment.tariffPlans.content",
    description: "help.payment.tariffPlans.description",
  },
  {
    id: 4,
    title: "help.payment.refund.title",
    icon: "refresh",
    content: "help.payment.refund.content",
    description: "help.payment.refund.description",
  },
];

const PaymentHelpModal: React.FC<PaymentHelpModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getRulesModalStyles(isDark);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slides = useMemo(() => paymentSlides, []);

  const openSlide = useCallback(
    (slideIndex: number) => {
      setActiveSlide(slideIndex);
      Animated.spring(slideAnim, slideAnimationConfig.open).start();
    },
    [slideAnim],
  );

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
      <View style={[styles.modalContainer, dynamicStyles.modalContainer]}>
        <View style={[styles.modalHeader, dynamicStyles.modalHeader]}>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
            <Ionicons
              name="close"
              size={24}
              color={isDark ? "#fff" : "#003366"}
            />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, dynamicStyles.modalTitle]}>
            {t("help.paymentAndRates")}
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          {slides.map((slide, index) => (
            <TouchableOpacity
              key={slide.id}
              style={[slideStyles.slideItem, dynamicStyles.slideItem]}
              onPress={() => openSlide(index)}
              activeOpacity={0.7}
            >
              <View style={[slideStyles.slideIcon, dynamicStyles.slideIcon]}>
                <Ionicons
                  name={slide.icon as any}
                  size={24}
                  color={isDark ? "#fff" : "#003366"}
                />
              </View>
              <View style={slideStyles.slideInfo}>
                <Text
                  style={[slideStyles.slideTitle, dynamicStyles.slideTitle]}
                >
                  {t(slide.title)}
                </Text>
                <Text
                  style={[
                    slideStyles.slideDescription,
                    dynamicStyles.slideContent,
                  ]}
                >
                  {t(slide.description)}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? "#666" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Animated.View
          style={[
            slideStyles.slideOverlay,
            dynamicStyles.slideOverlay,
            createSlideAnimation(slideAnim),
          ]}
        >
          {activeSlide >= 0 && (
            <View style={slideStyles.slideContent}>
              <View
                style={[slideStyles.slideHeader, dynamicStyles.slideHeader]}
              >
                <TouchableOpacity
                  onPress={closeSlide}
                  style={slideStyles.backButton}
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={isDark ? "#fff" : "#003366"}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    slideStyles.slideHeaderTitle,
                    dynamicStyles.slideHeaderTitle,
                  ]}
                >
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

export default PaymentHelpModal;
