import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { useLanguage } from "../../../context/LanguageContext";
import { getCurrentColors } from "../../../constants/colors";
import { createFixWaveScreenStyles } from "./styles";
import { useFixWaveNavigation } from "./hooks/useFixWaveNavigation";
import { useSessionCleanup } from "../../../hooks/useSessionCleanup";
import ProgressBar from "./components/ProgressBar";
import AddressPage from "./components/AddressPage";
import TimeSchedulePage from "./components/TimeSchedulePage";
import {
  AddressData,
  TimeScheduleData,
  FixWavePage,
} from "./types/fix-wave.types";

interface FixWaveScreenProps {
  isChild?: boolean;
}

const FixWaveScreen: React.FC<FixWaveScreenProps> = ({ isChild = false }) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const styles = useMemo(() => createFixWaveScreenStyles(isDark), [isDark]);
  const { t } = useLanguage();

  // Хук для навигации между страницами
  const {
    currentPage,
    progress,
    sessionData,
    nextPage,
    previousPage,
    goToPage,
  } = useFixWaveNavigation();

  // Хук для автоматической очистки сессии
  const { forceClearSession } = useSessionCleanup();

  // Состояния для данных
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [timeScheduleData, setTimeScheduleData] =
    useState<TimeScheduleData | null>(null);

  // Обновляем данные при изменении sessionData
  useEffect(() => {
    if (sessionData?.addressData) {
      setAddressData(sessionData.addressData);
    }
    if (sessionData?.timeScheduleData) {
      setTimeScheduleData(sessionData.timeScheduleData);
    }
  }, [sessionData]);

  // Обработчики навигации между страницами
  const handleAddressPageNext = (data: AddressData) => {
    setAddressData(data);
    nextPage({ addressData: data });
  };

  const handleTimeScheduleNext = (data: TimeScheduleData) => {
    setTimeScheduleData(data);
    nextPage({ timeScheduleData: data });
  };

  const handleTimeScheduleBack = () => {
    previousPage();
  };

  const handleProgressStepPress = (page: FixWavePage) => {
    // Переходим к выбранной странице
    goToPage(page);
  };

  const handleInfoPress = () => {
    Alert.alert(t("common.info"), t("common.scheduleInfo"), [
      { text: t("common.ok") },
    ]);
  };

  const Content = () => (
    <ScrollView
      style={{ flex: 1, padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <ProgressBar
        currentPage={currentPage}
        onStepPress={handleProgressStepPress}
      />

      {/* Контейнеры страниц */}
      <View style={{ marginTop: 10 }}>
        {currentPage === "addresses" && (
          <AddressPage
            onNext={handleAddressPageNext}
            initialData={addressData}
          />
        )}

        {currentPage === "timeSchedule" && (
          <TimeSchedulePage
            onNext={handleTimeScheduleNext}
            onBack={handleTimeScheduleBack}
            initialData={timeScheduleData}
          />
        )}

        {currentPage === "confirmation" && (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: colors.text,
                textAlign: "center",
              }}
            >
              Подтверждение заказа
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.textSecondary,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Здесь будет страница подтверждения
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <>
      {isChild ? (
        <Content />
      ) : (
        <View style={styles.container}>
          <SafeAreaView style={{ flex: 1 }}>
            <Content />
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default FixWaveScreen;
