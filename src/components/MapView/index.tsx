import React, {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  memo,
} from "react";
import { View, Animated } from "react-native";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";
import { createMapViewStyles } from "../../styles/components/MapView.styles";
import DriverModal from "../DriverModal";

// Импорты из новой структуры
import { MapViewComponentProps, MapRef } from "./types/map.types";
import { useMapZoom } from "./hooks/useMapZoom";
import { useMapMarkers } from "./hooks/useMapMarkers";
import { useMapLocation } from "./hooks/useMapLocation";
import MapControls from "./components/MapControls";
import MapMarkersComponent from "./components/MapMarkers";
import { useDirections } from "./hooks/useDirections";
import { useOsrmDirections } from "./hooks/useOsrmDirections";

const MapViewComponent = forwardRef<MapRef, MapViewComponentProps>(
  (
    {
      initialLocation,
      onLocationSelect,
      onDriverVisibilityToggle,
      markers = [],
      role = "client",
      clientLocationActive = false,
      isDriverModalVisible = false,
      onDriverModalClose,
      mapType = "standard",
      routePoints = [],
    },
    ref,
  ) => {
    const mapRef = useRef<MapView>(null);
    const { isDark } = useTheme();
    const navigation = useNavigation();
    const styles = createMapViewStyles(isDark);

    const plannedArrivalAtMs = useMemo(() => {
      const end = routePoints && routePoints[routePoints.length - 1];
      return end?.plannedArrivalAtMs;
    }, [routePoints]);

    const googleKey = (
      process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    ).trim();
    const useGoogle = Boolean(googleKey);
    const { route: gRoute } = useDirections(
      routePoints,
      plannedArrivalAtMs,
      true,
      5,
      useGoogle,
    );
    const { route: oRoute } = useOsrmDirections(
      !useGoogle ? routePoints : undefined,
    );
    const routeCoordinates =
      (useGoogle ? gRoute?.coordinates : oRoute?.coordinates) ?? [];
    const fallbackRouteCoordinates = useMemo(() => {
      if (!routePoints || routePoints.length < 2)
        return [] as { latitude: number; longitude: number }[];
      return routePoints.map((p) => ({
        latitude: p.coordinate.latitude,
        longitude: p.coordinate.longitude,
      }));
    }, [routePoints]);
    const effectiveRouteCoordinates =
      routeCoordinates.length >= 2
        ? routeCoordinates
        : fallbackRouteCoordinates;

    const routeMarkers = useMemo(() => {
      if (!routePoints || routePoints.length === 0) return [] as { id: string; coordinate: { latitude: number; longitude: number }; title: string; description: string; type: "start" | "waypoint" | "end"; label: string }[];
      return routePoints.map((p, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === routePoints.length - 1;
        const type: "start" | "waypoint" | "end" = isFirst
          ? "start"
          : isLast
            ? "end"
            : "waypoint";
        const label = String.fromCharCode(65 + idx);
        return {
          id: `route_${p.id}`,
          coordinate: p.coordinate,
          title: label,
          description: type,
          type,
          label,
        };
      });
    }, [routePoints]);

    // Используем созданные хуки
    const { handleZoomIn, handleZoomOut } = useMapZoom(mapRef);
    const { region, updateRegion } = useMapLocation(initialLocation);
    const { mapMarkers, clientMarker, refreshMapMarkers, handleMarkerPress } =
      useMapMarkers(
        markers,
        role,
        clientLocationActive,
        initialLocation,
        onDriverVisibilityToggle,
      );

    const selectedDriverId = useMemo(() => {
      if (!isDriverModalVisible) {
        return null;
      }
      const driverMarker = markers.find((marker) => marker.type === "driver");
      return driverMarker?.id ?? null;
    }, [isDriverModalVisible, markers]);

    // Экспортируем методы карты через ref
    useImperativeHandle(ref, () => ({
      getCamera: () => mapRef.current!.getCamera(),
      animateCamera: (camera) => mapRef.current?.animateCamera(camera),
      animateToRegion: (region, duration?: number) =>
        mapRef.current?.animateToRegion(region, duration),
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
    }));

    // Анимации для кнопок (оставляем как есть, так как это UI логика)
    const buttonAnimations = useMemo(
      () => [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
      ],
      [],
    );

    const handleMapPress = useCallback(
      (event: {
        nativeEvent: { coordinate: { latitude: number; longitude: number } };
      }) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        const location = { latitude, longitude };

        if (onLocationSelect) {
          onLocationSelect(location);
        }
      },
      [onLocationSelect],
    );

    const handleDriverModalClose = useCallback(() => {
      if (onDriverModalClose) {
        onDriverModalClose();
      }
    }, [onDriverModalClose]);

    

    // Плавная анимация центрирования карты при изменении initialLocation
    React.useEffect(() => {
      if (
        initialLocation &&
        initialLocation.latitude &&
        initialLocation.longitude
      ) {
        const newRegion = {
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        updateRegion(newRegion);

        // Плавная анимация центрирования карты
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 500);
        }
      }
    }, [initialLocation]); // Убираем updateRegion из зависимостей

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
          showsScale={false}
          showsTraffic={true}
          showsBuildings={false}
          showsIndoors={false}
          showsIndoorLevelPicker={false}
          showsPointsOfInterest={false}
          mapType={mapType}
          customMapStyle={
            isDark && mapType === "standard"
              ? [
                  {
                    elementType: "geometry",
                    stylers: [{ color: "#242f3e" }],
                  },
                  {
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#746855" }],
                  },
                  {
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#242f3e" }],
                  },
                  {
                    featureType: "administrative.locality",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                  },
                  {
                    featureType: "poi",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "geometry",
                    stylers: [{ color: "#263c3f" }],
                  },
                  {
                    featureType: "poi.park",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#6b9a76" }],
                  },
                  {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{ color: "#38414e" }],
                  },
                  {
                    featureType: "road",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#212a37" }],
                  },
                  {
                    featureType: "road",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#9ca5b3" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry",
                    stylers: [{ color: "#746855" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "geometry.stroke",
                    stylers: [{ color: "#1f2835" }],
                  },
                  {
                    featureType: "road.highway",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#f3d19c" }],
                  },
                  {
                    featureType: "transit",
                    elementType: "geometry",
                    stylers: [{ color: "#2f3948" }],
                  },
                  {
                    featureType: "transit.station",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#d59563" }],
                  },
                  {
                    featureType: "water",
                    elementType: "geometry",
                    stylers: [{ color: "#17263c" }],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#515c6d" }],
                  },
                  {
                    featureType: "water",
                    elementType: "labels.text.stroke",
                    stylers: [{ color: "#17263c" }],
                  },
                ]
              : undefined
          }
          userLocationPriority="high"
          userLocationUpdateInterval={5000}
          userLocationFastestInterval={2000}
          followsUserLocation={true}
          toolbarEnabled={true}
          zoomEnabled={true}
          rotateEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
          minZoomLevel={5}
          maxZoomLevel={20}
          loadingEnabled={true}
          loadingIndicatorColor="#666666"
          loadingBackgroundColor="#ffffff"
          moveOnMarkerPress={true}
          liteMode={false}
          mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          {effectiveRouteCoordinates.length >= 2 && (
            <Polyline
              coordinates={effectiveRouteCoordinates}
              strokeColor={isDark ? "#60A5FA" : "#3B82F6"}
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
              geodesic
            />
          )}

          {/* Трафик показывается системно showsTraffic. Доп. красный дэш — больше не нужен */}

          <MapMarkersComponent
            markers={[...mapMarkers, ...routeMarkers]}
            clientMarker={clientMarker}
            onMarkerPress={handleMarkerPress}
          />
        </MapView>

        {/* Модальное окно водителя */}
        {selectedDriverId && (
          <DriverModal
            isVisible={isDriverModalVisible}
            onClose={handleDriverModalClose}
            onOverlayClose={handleDriverModalClose}
            role={role}
            onChat={(driverId: string) => {
              const driver = markers.find((m) => m.type === "driver" && m.id === driverId);
              if (!driver) return;
              // Навигация к чату по driverId
              try {
                handleDriverModalClose();
                (navigation as any).navigate("Chat");
                setTimeout(() => {
                  (navigation as any).navigate("Chat", {
                    screen: "ChatConversation",
                    params: { driverId },
                  });
                }, 100);
              } catch {
                (navigation as any).navigate("Chat");
              }
            }}
            driverId={selectedDriverId}
          />
        )}

        {/* Дополнительные кнопки управления */}
        <MapControls
          buttonAnimations={buttonAnimations}
          onRefresh={refreshMapMarkers}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />
      </View>
    );
  },
);

MapViewComponent.displayName = "MapViewComponent";

export default memo(MapViewComponent);
