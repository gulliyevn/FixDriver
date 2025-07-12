import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

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
    console.log(`Test: Changing language from ${language} to ${newLang}`);
    try {
      await setLanguage(newLang);
      console.log(`Test: Language changed successfully to ${newLang}`);
    } catch (error) {
      console.error('Test: Language change failed:', error);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Language Test - Current: {language}
      </Text>
      
      {testKeys.map((key) => (
        <Text key={key} style={{ marginBottom: 5 }}>
          {key}: "{t(key)}"
        </Text>
      ))}
      
      <TouchableOpacity 
        onPress={handleLanguageChange}
        style={{ 
          backgroundColor: '#007AFF', 
          padding: 10, 
          borderRadius: 5, 
          marginTop: 10 
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Switch to {language === 'ru' ? 'English' : 'Russian'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageTest; 