import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../../../context/ThemeContext";
import { useLanguage } from "../../../../context/LanguageContext";
import { getCurrentColors } from "../../../../constants/colors";
import FixDriveDropdown from "../../../../components/FixDriveDropdown";
import FixDriveMapInput from "../../../../components/FixDriveMapInput";
import UnifiedDateTimePickerModal from "./UnifiedDateTimePickerModal";
import { useFixDriveFamilyMembers } from "../../../../hooks/useFixDriveFamilyMembers";
import { fixwaveOrderService } from "../../../../services/fixwaveOrderService";
import { AddressData } from "../types/fix-wave.types";

interface AddressPageProps {
  onNext: (data: AddressData) => void;
  initialData?: AddressData;
}

const AddressPage: React.FC<AddressPageProps> = ({ onNext, initialData }) => {
  const { isDark } = useTheme();
  const colors = getCurrentColors(isDark);
  const { t } = useLanguage();

  const { getFamilyMemberOptions, getFamilyMemberById, loading } =
    useFixDriveFamilyMembers();

  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string>(
    initialData?.familyMemberId || "",
  );
  const [selectedPackage, setSelectedPackage] = useState<string>(
    initialData?.packageType || "",
  );
  const [addresses, setAddresses] = useState<any[]>(
    initialData?.addresses || [],
  );
  const [isSaving, setIsSaving] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  // Загружаем данные из сессии при инициализации и при изменении initialData
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionData = await fixwaveOrderService.loadSessionData();
        console.log("Session data loaded:", sessionData); // Добавляем лог для отладки
        if (sessionData?.addressData) {
          const { addressData } = sessionData;
          setSelectedFamilyMember(addressData.familyMemberId || "");
          setSelectedPackage(addressData.packageType || "");
          setAddresses(addressData.addresses || []);
          console.log("Addresses restored:", addressData.addresses); // Добавляем лог для отладки
        }
      } catch (error) {
        console.warn('Failed to load session data:', error);
      }
    };
    loadSessionData();
  }, [initialData]); // Добавляем зависимость от initialData

  const familyMemberOptions = getFamilyMemberOptions();
  const packageOptions = [
    {
      key: "standard",
      label: t("premium.packages.standard"),
      value: "standard",
    },
    { key: "plus", label: t("premium.packages.plus"), value: "plus" },
    { key: "premium", label: t("premium.packages.premium"), value: "premium" },
  ];

  const handleFamilyMemberSelect = (value: string) => {
    setSelectedFamilyMember(value);
    // Сохраняем в сессию при изменении участника семьи
    saveToSession(addresses);
  };

  const handlePackageSelect = (value: string) => {
    setSelectedPackage(value);
    // Сохраняем в сессию при изменении пакета
    saveToSession(addresses);
  };

  const handleAddressesChange = (newAddresses: any[]) => {
    console.log("Addresses changed:", newAddresses); // Добавляем лог для отладки
    setAddresses(newAddresses);
    // Сохраняем адреса в сессию при каждом изменении
    saveToSession(newAddresses);
  };

  const saveToSession = async (newAddresses: any[]) => {
    try {
      const selectedMember = getFamilyMemberById(selectedFamilyMember);
      const familyMemberName = selectedMember
        ? `${selectedMember.name} ${selectedMember.surname}`
        : "";

      // Сначала загружаем существующие данные сессии
      const existingSession = await fixwaveOrderService.loadSessionData();

      const sessionData = {
        ...existingSession, // Сохраняем существующие данные
        currentPage: "addresses",
        addressData: {
          familyMemberId: selectedFamilyMember,
          familyMemberName,
          packageType: selectedPackage,
          addresses: newAddresses.map((addr) => ({
            id: addr.id,
            type: addr.type,
            address: addr.address,
            coordinates: addr.coordinate,
          })),
        },
      };
      await fixwaveOrderService.saveSessionData(sessionData);
      console.log("Session saved:", sessionData); // Добавляем лог для отладки
    } catch (error) {
      console.warn('Failed to save session data:', error);
    }
  };

  const handleSaveAndNext = async () => {
    try {
      setIsSaving(true);

      const selectedMember = getFamilyMemberById(selectedFamilyMember);
      const familyMemberName = selectedMember
        ? `${selectedMember.name} ${selectedMember.surname}`
        : "";

      const addressData: AddressData = {
        familyMemberId: selectedFamilyMember,
        familyMemberName,
        packageType: selectedPackage,
        addresses: addresses.map((addr) => ({
          id: addr.id,
          type: addr.type,
          address: addr.address,
          coordinates: addr.coordinate || addr.coordinates, // Используем оба формата
        })),
      };

      // Валидируем данные
      const validation = fixwaveOrderService.validateOrderData(addressData);
      if (!validation.isValid) {
        Alert.alert("Ошибка валидации", validation.errors.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }

      // Сохраняем данные в заказ (финальное сохранение)
      await fixwaveOrderService.saveOrderData({
        ...addressData,
        status: "draft",
      });

      // Переходим к следующей странице
      onNext(addressData);
    } catch (error) {
      Alert.alert(
        "Ошибка",
        "Не удалось сохранить данные заказа. Попробуйте еще раз.",
        [{ text: "OK" }],
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={{ marginTop: 10 }}>
      {/* Выбор участника семьи */}
      {loading ? (
        <Text
          style={{
            color: colors.primary,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Загрузка участников семьи...
        </Text>
      ) : (
        <FixDriveDropdown
          label={t("common.fixDrive.selectFamilyMember")}
          placeholder={t("common.fixDrive.familyMemberPlaceholder")}
          options={familyMemberOptions}
          selectedValue={selectedFamilyMember}
          onSelect={handleFamilyMemberSelect}
        />
      )}

      {/* Выбор пакета */}
      <FixDriveDropdown
        label={t("common.fixDrive.selectPackage")}
        placeholder={t("common.fixDrive.packagePlaceholder")}
        options={packageOptions}
        selectedValue={selectedPackage}
        onSelect={handlePackageSelect}
      />

      {/* Дата начала (контейнер, открывающий модалку даты+времени) */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            marginBottom: 8,
            color: colors.text,
          }}
        >
          {t("new.dateStart")}
        </Text>
        <TouchableOpacity
          onPress={() => setPickerVisible(true)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 8,
            backgroundColor: colors.surface,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: startDateTime ? colors.text : colors.textSecondary,
            }}
          >
            {startDateTime
              ? `${String(startDateTime.getDate()).padStart(2, "0")}.${String(startDateTime.getMonth() + 1).padStart(2, "0")}.${startDateTime.getFullYear()} ${String(startDateTime.getHours()).padStart(2, "0")}:${String(startDateTime.getMinutes()).padStart(2, "0")}`
              : "00 00 00 00 00"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ввод адреса через карту */}
      <FixDriveMapInput
        onAddressesChange={handleAddressesChange}
        initialAddresses={addresses}
      />

      <UnifiedDateTimePickerModal
        visible={pickerVisible}
        title={t("new.dateStart")}
        value={startDateTime}
        onCancel={() => setPickerVisible(false)}
        onConfirm={(d) => {
          setStartDateTime(d);
          setPickerVisible(false);
        }}
        colors={colors}
        t={t}
        isDark={isDark}
      />

      {/* Кнопка Сохранить и Продолжить */}
      <TouchableOpacity
        style={{
          backgroundColor: isSaving ? colors.textSecondary : colors.primary,
          paddingVertical: 12,
          marginHorizontal: 20,
          marginTop: 8,
          marginBottom: 20,
          borderRadius: 8,
          opacity: isSaving ? 0.7 : 1,
        }}
        onPress={handleSaveAndNext}
        disabled={isSaving}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {isSaving ? "Сохранение..." : t("common.save")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressPage;
