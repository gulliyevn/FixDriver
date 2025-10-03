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

interface BookingHelpSlide {
  id: number;
  title: string;
  icon: string;
  content: string;
  description: string;
}

interface BookingHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

const bookingSlides: BookingHelpSlide[] = [
  {
    id: 1,
    title: "help.booking.routeSelection.title",
    icon: "map",
    content: "help.booking.routeSelection.content",
    description: "help.booking.routeSelection.description",
  },
  {
    id: 2,
    title: "help.booking.driverSelection.title",
    icon: "person",
    content: "help.booking.driverSelection.content",
    description: "help.booking.driverSelection.description",
  },
  {
    id: 3,
    title: "help.booking.orderConfirmation.title",
    icon: "checkmark-circle",
    content: "help.booking.orderConfirmation.content",
    description: "help.booking.orderConfirmation.description",
  },
  {
    id: 4,
    title: "help.booking.waitingDriver.title",
    icon: "time",
    content: "help.booking.waitingDriver.content",
    description: "help.booking.waitingDriver.description",
  },
];

const BookingHelpModal: React.FC<BookingHelpModalProps> = ({
  visible,
  onClose,
}) => {
  const { isDark } = useTheme();
  const { t } = useI18n();
  const dynamicStyles = getRulesModalStyles(isDark);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const slides = useMemo(() => bookingSlides, []);

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
            {t("help.howToOrder")}
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

export default BookingHelpModal;
