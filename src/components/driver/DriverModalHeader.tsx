import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type DriverModalHeaderProps = {
  styles: {
    avatarAndInfoRow: StyleProp<ViewStyle>;
    timerContainer: StyleProp<ViewStyle>;
    timerText: StyleProp<TextStyle>;
    avatarContainer: StyleProp<ViewStyle>;
    avatar: StyleProp<ViewStyle>;
    onlineIndicator: StyleProp<ViewStyle>;
    driverMainInfo: StyleProp<ViewStyle>;
    nameContainer: StyleProp<ViewStyle>;
    driverName: StyleProp<TextStyle>;
    premiumIcon: StyleProp<ViewStyle>;
    vehicleExpandRow: StyleProp<ViewStyle>;
    vehicleInfoContainer: StyleProp<ViewStyle>;
    childIcon: StyleProp<ViewStyle>;
    vehicleInfo: StyleProp<TextStyle>;
    vehiclePhotoContainer: StyleProp<ViewStyle>;
    vehiclePhoto: StyleProp<ImageStyle>;
    fixDriveContainer: StyleProp<ViewStyle>;
    fixDriveText: StyleProp<TextStyle>;
  };
  role?: "client" | "driver";
  driver?: {
    first_name?: string;
    last_name?: string;
    vehicle_brand?: string;
    vehicle_model?: string;
    vehicle_number?: string;
  } | null;
  childName?: string;
  childAge?: string;
  slideProgress?: number;
  isPaused?: boolean;
  pauseStartTime?: number | null;
  formatTime?: (seconds: number) => string;
  // Новые пропсы для таймера в статусе 2
  buttonColorState?: number;
  isTripTimerActive?: boolean;
  tripStartTime?: number | null;
};

const DriverModalHeader: React.FC<DriverModalHeaderProps> = ({
  styles,
  role = "client",
  driver,
  childName,
  childAge,
  slideProgress = 0,
  isPaused = false,
  pauseStartTime = null,
  formatTime = () => "00:00",
  buttonColorState = 0,
  isTripTimerActive = false,
  tripStartTime = null,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tripElapsedSeconds, setTripElapsedSeconds] = useState(0);

  // Обновление таймера каждую секунду при паузе (статус 4)
  useEffect(() => {
    if (isPaused && pauseStartTime === 0) {
      const interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isPaused) {
      setElapsedSeconds(0); // сбрасываем при выходе из паузы
    }
  }, [isPaused, pauseStartTime]);

  // Обновление таймера каждую секунду при активной поездке (статус 2)
  useEffect(() => {
    if (isTripTimerActive && tripStartTime === 0) {
      const interval = setInterval(() => {
        setTripElapsedSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (!isTripTimerActive) {
      setTripElapsedSeconds(0); // сбрасываем при остановке таймера
    }
  }, [isTripTimerActive, tripStartTime]);

  return (
    <View style={styles.avatarAndInfoRow}>
      {/* Таймер при паузе (статус 4) */}
      {isPaused && role === "driver" ? (
        <View
          style={[
            styles.timerContainer,
            {
              opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
            },
          ]}
        >
          <Text style={styles.timerText}>{formatTime(elapsedSeconds)}</Text>
        </View>
      ) : (
        <>
          {/* Таймер при активной поездке (статус 2) */}
          {isTripTimerActive && buttonColorState === 2 && role === "driver" ? (
            <View
              style={[
                styles.timerContainer,
                {
                  opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
                },
              ]}
            >
              <Text style={styles.timerText}>
                {formatTime(tripElapsedSeconds)}
              </Text>
            </View>
          ) : (
            <>
              <View
                style={[
                  styles.avatarContainer,
                  {
                    opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
                  },
                ]}
              >
                <View style={styles.avatar}>
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <View
                style={[
                  styles.driverMainInfo,
                  {
                    opacity: Math.max(0, 1 - Math.abs(slideProgress) / 50),
                  },
                ]}
              >
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.driverName}
                  >{`${driver?.first_name ?? ""} ${driver?.last_name ?? ""}`}</Text>
                  <Ionicons
                    name="star"
                    size={16}
                    color="#9CA3AF"
                    style={styles.premiumIcon}
                  />
                </View>
                <View style={styles.vehicleExpandRow}>
                  <View style={styles.vehicleInfoContainer}>
                    {role === "driver" && (
                      <Ionicons
                        name="football"
                        size={16}
                        color="#9CA3AF"
                        style={styles.childIcon}
                      />
                    )}
                    <Text style={styles.vehicleInfo}>
                      {role === "driver"
                        ? `${childName ?? ""} • ${childAge ?? ""} лет`
                        : `${driver?.vehicle_brand ?? ""} ${driver?.vehicle_model ?? ""} • ${driver?.vehicle_number ?? ""}`}
                    </Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </>
      )}

      {/* Фото машины для клиентской роли */}
      {role === "client" && driver?.vehicle_brand && driver?.vehicle_model && (
        <View style={styles.vehiclePhotoContainer}>
          <Image
            source={require("../../../assets/vehicles/toyota-camry.jpg")}
            style={styles.vehiclePhoto}
            resizeMode="contain"
          />
        </View>
      )}

      {/* FixDrive текст для водительской роли */}
      {role === "driver" && (
        <View
          style={[
            styles.fixDriveContainer,
            {
              opacity: Math.max(0, (Math.abs(slideProgress) - 40) / 20), // плавное появление после 40
            },
          ]}
        >
          <Text style={styles.fixDriveText}>FixDrive</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(DriverModalHeader);
