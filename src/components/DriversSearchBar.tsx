import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useI18n } from "../hooks/useI18n";

type DriversSearchBarStyles = {
  searchContainer: StyleProp<ViewStyle>;
  searchInput: StyleProp<TextStyle>;
};

type DriversSearchBarProps = {
  styles: DriversSearchBarStyles;
  isDark: boolean;
  value: string;
  onChange: (text: string) => void;
};

const DriversSearchBar: React.FC<DriversSearchBarProps> = ({
  styles,
  isDark,
  value,
  onChange,
}) => {
  const { t } = useI18n();
  return (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color={isDark ? "#9CA3AF" : "#6B7280"}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={t("client.driversScreen.searchPlaceholder")}
        placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
        value={value}
        onChangeText={onChange}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")}>
          <Ionicons
            name="close-circle"
            size={20}
            color={isDark ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default React.memo(DriversSearchBar);
