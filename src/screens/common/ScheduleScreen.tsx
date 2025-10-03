import React, { useState, useMemo } from "react";
import { View, SafeAreaView } from "react-native";
import ToggleButton from "../../components/ToggleButton";
import FixWaveScreen from "./FixWaveScreen";
import FixDriveScreen from "./FixDriveScreen";
import { useTheme } from "../../context/ThemeContext";
import { getCurrentColors } from "../../constants/colors";

const ScheduleScreen: React.FC = () => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getCurrentColors(isDark), [isDark]);

  const [isLeft, setIsLeft] = useState(true);

  const handleToggle = () => {
    setIsLeft(!isLeft);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* ToggleButton в хедере */}
        <ToggleButton isLeft={isLeft} onToggle={handleToggle} />

        {/* Контент страниц */}
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, display: isLeft ? "flex" : "none" }}>
            <FixDriveScreen isChild={true} />
          </View>
          <View style={{ flex: 1, display: isLeft ? "none" : "flex" }}>
            <FixWaveScreen isChild={true} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ScheduleScreen;
