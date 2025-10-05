import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../hooks/useI18n";

type EmptyDriversStateProps = {
  styles: Record<string, any>;
  isDark: boolean;
  loading: boolean;
};

const EmptyDriversState: React.FC<EmptyDriversStateProps> = ({
  styles,
  isDark,
  loading,
}) => {
  const { t } = useI18n();
  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="people-outline"
        size={64}
        color={isDark ? "#6B7280" : "#9CA3AF"}
      />
      <Text style={styles.emptyStateTitle}>
        {loading
          ? t("client.driversScreen.empty.loadingDrivers")
          : t("client.driversScreen.empty.noDrivers")}
      </Text>
      {!loading && (
        <Text style={styles.emptyStateSubtitle}>
          {t("client.driversScreen.empty.willAppear")}
        </Text>
      )}
    </View>
  );
};

export default React.memo(EmptyDriversState);
