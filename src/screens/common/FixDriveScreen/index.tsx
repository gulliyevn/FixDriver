import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { getCurrentColors } from '../../../constants/colors';
import ProgressBar from './components/ProgressBar';
import ScheduleTypeSelector from './components/ScheduleTypeSelector';
import FixDriveAddressPage from './components/FixDriveAddressPage';
import { FixDrivePage, AddressData } from './types/fix-drive.types';

interface FixDriveScreenProps {
  isChild?: boolean;
}

const FixDriveScreen: React.FC<FixDriveScreenProps> = ({ isChild = false }) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState<FixDrivePage>('timeSchedule');
  const [selectedScheduleType, setSelectedScheduleType] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('');
  const [returnTripTime, setReturnTripTime] = useState<string>('');
  const [returnWeekdaysTime, setReturnWeekdaysTime] = useState<string>('');
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const handleProgressStepPress = (page: FixDrivePage) => {
    setCurrentPage(page);
  };

  const handleScheduleTypeSelect = (type: string) => {
    setSelectedScheduleType(type);
  };

  const handleAddressPageNext = (data: AddressData) => {
    setAddressData(data);
    setCurrentPage('confirmation');
  };

  const handleSaveAndNext = () => {
    // Логика сохранения и перехода к следующей странице
    if (currentPage === 'timeSchedule') {
      setCurrentPage('addresses');
    } else if (currentPage === 'addresses') {
      setCurrentPage('confirmation');
    }
  };

  const renderContent = () => (
    <ScrollView style={{ flex: 1, padding: 20 }} showsVerticalScrollIndicator={false}>
        
        {/* Прогресс-бар */}
        <ProgressBar 
          currentPage={currentPage} 
          onStepPress={handleProgressStepPress}
        />
        
        {/* Контейнеры страниц */}
        <View style={{ marginTop: 16 }}>
          {currentPage === 'addresses' && (
            <FixDriveAddressPage 
              onNext={handleAddressPageNext}
              initialData={addressData}
            />
          )}
          
          {currentPage === 'timeSchedule' && (
            <View style={{ padding: 0 }}>
              <ScheduleTypeSelector 
                onSelect={handleScheduleTypeSelect}
                selectedType={selectedScheduleType}
                selectedDays={selectedDays}
                onDaysChange={setSelectedDays}
                selectedTime={selectedTime}
                onTimeChange={setSelectedTime}
                returnTime={returnTime}
                onReturnTimeChange={setReturnTime}
                returnTripTime={returnTripTime}
                onReturnTripTimeChange={setReturnTripTime}
                returnWeekdaysTime={returnWeekdaysTime}
                onReturnWeekdaysTimeChange={setReturnWeekdaysTime}
                isReturnTrip={isReturnTrip}
                onReturnTripChange={setIsReturnTrip}
              />
              
              {/* Кнопка Сохранить */}
              <TouchableOpacity 
                style={{ 
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  marginHorizontal: 20,
                  marginTop: 24,
                  marginBottom: 20,
                  borderRadius: 8,
                }}
                onPress={handleSaveAndNext}
              >
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 16, 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {currentPage === 'confirmation' && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: '600', 
                color: colors.text,
                textAlign: 'center'
              }}>
                {t('fixDrive.confirmation.title')}
              </Text>
              <Text style={{ 
                fontSize: 16, 
                color: colors.textSecondary,
                marginTop: 10,
                textAlign: 'center'
              }}>
                {t('fixDrive.confirmation.description')}
              </Text>
              
              {/* Кнопка Сохранить */}
              <TouchableOpacity 
                style={{ 
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  marginHorizontal: 20,
                  marginTop: 24,
                  marginBottom: 20,
                  borderRadius: 8,
                }}
                onPress={handleSaveAndNext}
              >
                <Text style={{ 
                  color: '#FFFFFF', 
                  fontSize: 16, 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {t('common.save')}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
      </ScrollView>
  );

  return (
    <>
      {isChild ? (
        renderContent()
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <SafeAreaView style={{ flex: 1 }}>
            {renderContent()}
          </SafeAreaView>
        </View>
      )}
    </>
  );
};

export default FixDriveScreen;