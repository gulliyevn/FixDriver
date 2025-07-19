import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { LanguageTestStyles } from '../styles/components/LanguageTest.styles';

const LanguageTest: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  const testKeys = [
    'common.ok',
    'common.cancel',
    'profile.settings.title',
    'profile.settings.language.current'
  ];

  const handleLanguageChange = async () => {
    const newLang = language === 'ru' ? 'en' : 'ru';

    try {
      await setLanguage(newLang);
      
    } catch (error) {
      
    }
  };

  return (
    <View style={LanguageTestStyles.container}>
      <Text style={LanguageTestStyles.title}>
        Language Test - Current: {language}
      </Text>
      
      {testKeys.map((key) => (
        <Text key={key} style={LanguageTestStyles.testKey}>
          {key}: "{t(key)}"
        </Text>
      ))}
      
      <TouchableOpacity 
        onPress={handleLanguageChange}
        style={LanguageTestStyles.switchButton}
      >
        <Text style={LanguageTestStyles.switchButtonText}>
          Switch to {language === 'ru' ? 'English' : 'Russian'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageTest; 