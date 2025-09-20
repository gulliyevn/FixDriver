import React from 'react';
import { View, Text } from 'react-native';

interface EarningsStatsProps {
  period: 'today' | 'week' | 'month' | 'year';
  isDark: boolean;
}

const EarningsStats: React.FC<EarningsStatsProps> = ({ period, isDark }) => {
  return (
    <View>
      <Text>EarningsStats Component - {period}</Text>
    </View>
  );
};

export default EarningsStats;
