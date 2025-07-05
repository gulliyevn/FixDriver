import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ClientStackParamList } from '../../types/navigation';
import { MapService } from '../../services/MapService';
import { MapScreenStyles } from '../../styles/screens/MapScreen.styles';
import MapViewComponent from '../../components/MapView';

interface MapLocation {
  latitude: number;
  longitude: number;
}

type NavigationProp = StackNavigationProp<ClientStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [currentLocation, setCurrentLocation] = useState<MapLocation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await MapService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось получить ваше местоположение');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location: MapLocation) => {
    console.log('Выбрана локация:', location);
    // Здесь можно добавить логику для выбора точки назначения
  };

  const handleMenuPress = () => {
    navigation.navigate('Drivers');
  };

  const handleChatPress = () => {
    navigation.navigate('ChatList');
  };

  const handlePlusPress = () => {
    navigation.navigate('Plus');
  };

  return (
    <SafeAreaView style={[MapScreenStyles.container, { backgroundColor: isDark ? '#111827' : '#F8FAFC' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[MapScreenStyles.header, { backgroundColor: isDark ? '#1F2937' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={MapScreenStyles.menuButton}
          onPress={handleMenuPress}
        >
          <Ionicons name="menu" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
        </TouchableOpacity>
        
        <Text style={[MapScreenStyles.title, { color: isDark ? '#F9FAFB' : '#1F2937' }]}>
          Карта
        </Text>
        
        <View style={MapScreenStyles.headerRight}>
          <TouchableOpacity
            style={MapScreenStyles.chatButton}
            onPress={handleChatPress}
          >
            <Ionicons name="chatbubbles-outline" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={MapScreenStyles.plusButton}
            onPress={handlePlusPress}
          >
            <Ionicons name="add-circle" size={24} color={isDark ? '#F9FAFB' : '#1F2937'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map */}
      <View style={MapScreenStyles.mapContainer}>
        <MapViewComponent
          initialLocation={currentLocation || undefined}
          onLocationSelect={handleLocationSelect}
          showNearbyDrivers={true}
        />
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={MapScreenStyles.loadingOverlay}>
          <Text style={MapScreenStyles.loadingText}>Загрузка карты...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default MapScreen;
