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
import { DriverStackParamList } from '../../types/navigation';
import { MapService } from '../../services/MapService';
import { MapScreenStyles } from '../../styles/screens/MapScreen.styles';
import { colors } from '../../constants/colors';
import MapViewComponent from '../../components/MapView';

interface MapLocation {
  latitude: number;
  longitude: number;
}

type NavigationProp = StackNavigationProp<DriverStackParamList, 'Map'>;

const DriverMapScreen: React.FC = () => {
  const { isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const currentColors = isDark ? colors.dark : colors.light;
  
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

    // Здесь можно добавить логику для выбора точки назначения
  };

  const handleMenuPress = () => {
    navigation.navigate('Orders');
  };

  const handleChatPress = () => {
    navigation.navigate('ClientList');
  };

  const handlePlusPress = () => {
    navigation.navigate('Plus');
  };

  return (
    <SafeAreaView style={[MapScreenStyles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[MapScreenStyles.header, { backgroundColor: currentColors.card }]}>
        <TouchableOpacity
          style={MapScreenStyles.menuButton}
          onPress={handleMenuPress}
        >
          <Ionicons name="menu" size={24} color={currentColors.text} />
        </TouchableOpacity>
        
        <Text style={[MapScreenStyles.title, { color: currentColors.text }]}>
          Карта
        </Text>
        
        <View style={MapScreenStyles.headerRight}>
          <TouchableOpacity
            style={MapScreenStyles.chatButton}
            onPress={handleChatPress}
          >
            <Ionicons name="chatbubbles-outline" size={24} color={currentColors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={MapScreenStyles.plusButton}
            onPress={handlePlusPress}
          >
            <Ionicons name="add-circle" size={24} color={currentColors.primary} />
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
          <Text style={[MapScreenStyles.loadingText, { color: currentColors.text }]}>Загрузка карты...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};



export default DriverMapScreen;
