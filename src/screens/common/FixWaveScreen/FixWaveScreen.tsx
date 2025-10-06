import React, { useMemo, useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
} from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { getCurrentColors } from "../../../constants/colors";
import { createFixWaveScreenStyles } from "./styles";
import { useFixWaveNavigation } from "./hooks/useFixWaveNavigation";
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

  // Хук для навигации между страницами
  const {
    currentPage,
    sessionData,
    nextPage,
    goToPage,
  } = useFixWaveNavigation();


  // Состояния для данных
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [timeScheduleData, setTimeScheduleData] =
    useState<TimeScheduleData | null>(null);

  // Обновляем данные при изменении sessionData
  useEffect(() => {
    if (sessionData?.addressData) {
      // Приводим сессионные адреса к рабочему типу
      const a = sessionData.addressData;
      setAddressData({
        familyMemberId: a.familyMemberId || "",
        familyMemberName: "",
        packageType: a.packageType || "standard",
        addresses: (a.addresses || []).map((addr) => ({
          id: addr.id,
          type: addr.type,
          address: addr.address,
          coordinates: addr.coordinates ?? addr.coordinate,
        })),
      });
    }
    if (sessionData?.timeScheduleData) {
      const t = sessionData.timeScheduleData;
      setTimeScheduleData({
        date: t.date ? new Date(t.date) : new Date(),
        time: t.time || "",
        isRecurring: !!t.isRecurring,
        recurringDays: t.recurringDays,
        notes: t.notes,
        fromAddress: t.fromAddress,
        toAddress: t.toAddress,
        fixedTimes: t.fixedTimes,
        weekdayTimes: t.weekdayTimes,
        weekendTimes: t.weekendTimes,
        selectedDays: t.selectedDays,
        switchStates: t.switchStates,
      });
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


  const handleProgressStepPress = (page: FixWavePage) => {
    // Переходим к выбранной странице
    goToPage(page);
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
            initialData={addressData || undefined}
          />
        )}

        {currentPage === "timeSchedule" && (
          <TimeSchedulePage
            onNext={handleTimeScheduleNext}
            initialData={timeScheduleData || undefined}
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
