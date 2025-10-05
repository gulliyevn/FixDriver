import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../hooks/useI18n";

type DriversHeaderProps = {
  styles: any;
  isDark: boolean;
  filterExpandAnim: Animated.Value;
  onToggleFilter: () => void;
  onOpenNotifications: () => void;
  activeFilters?: {
    all?: boolean;
    online?: boolean;
    priceAsc?: boolean;
    priceDesc?: boolean;
    rating45?: boolean;
    vip?: boolean;
    nearby?: boolean;
    fastDispatch?: boolean;
    economy?: boolean;
    dailyTrips?: boolean;
  };
  onSelectFilter?: (
    key:
      | "all"
      | "online"
      | "priceAsc"
      | "priceDesc"
      | "rating45"
      | "vip"
      | "nearby"
      | "fastDispatch"
      | "economy"
      | "dailyTrips",
  ) => void;
};

const DriversHeader: React.FC<DriversHeaderProps> = ({
  styles,
  isDark,
  filterExpandAnim,
  onToggleFilter,
  onOpenNotifications,
  activeFilters = {},
  onSelectFilter = () => {},
}) => {
  const { t } = useI18n();

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: filterExpandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 16],
          }),
          paddingBottom: filterExpandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 12],
          }),
        },
      ]}
    >
      <View style={styles.headerTop}>
        <View style={[styles.headerRow, { marginTop: 4 }]}>
          <Text style={styles.headerTitle}>{t("client.drivers")}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.filterIconContainer}
              onPress={onToggleFilter}
              accessibilityLabel={t("client.notifications.filter")}
            >
              <Ionicons
                name="funnel-outline"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityLabel={t("client.notifications.title")}
              onPress={onOpenNotifications}
              style={styles.filterButton}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={isDark ? "#F9FAFB" : "#111827"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.filtersWrapper,
            {
              maxHeight: filterExpandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 60],
              }),
              opacity: filterExpandAnim.interpolate({
                inputRange: [0, 0.3, 1],
                outputRange: [0, 0, 1],
              }),
              overflow: "hidden",
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled
            alwaysBounceVertical={false}
            bounces={false}
            overScrollMode="never"
            scrollEventThrottle={16}
            style={styles.filtersContainer}
            contentContainerStyle={styles.filtersContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.all && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("all")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.all && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.all")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.online && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("online")}
            >
              <Ionicons
                name="radio-button-on"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.online && styles.filterChipTextActive,
                ]}
              >
                {t("client.chat.online")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.priceDesc && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("priceDesc")}
            >
              <Ionicons
                name="chevron-down-outline"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.priceDesc && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.price")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.priceAsc && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("priceAsc")}
            >
              <Ionicons
                name="chevron-up-outline"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.priceAsc && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.price")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.rating45 && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("rating45")}
            >
              <Ionicons
                name="star"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.rating45 && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.rating45")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.vip && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("vip")}
            >
              <Ionicons
                name="star"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.vip && styles.filterChipTextActive,
                ]}
              >
                {t("client.profile.vip.title")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.dailyTrips && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("dailyTrips")}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.dailyTrips && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.dailyTrips")}
              </Text>
            </TouchableOpacity>
            {/* Nearby and Fast dispatch removed per request */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilters.economy && styles.filterChipActive,
              ]}
              onPress={() => onSelectFilter("economy")}
            >
              <Ionicons
                name="wallet"
                size={16}
                color={isDark ? "#3B82F6" : "#083198"}
              />
              <Text
                style={[
                  styles.filterChipText,
                  activeFilters.economy && styles.filterChipTextActive,
                ]}
              >
                {t("client.driversScreen.filters.economy")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(DriversHeader);
