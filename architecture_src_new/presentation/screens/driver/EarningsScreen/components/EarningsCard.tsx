import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EarningsProgressLine from './EarningsProgressLine';

interface EarningsCardProps {
  styles: any;
  isDark: boolean;
  currentData: any;
  driverLevel: any;
  vipMonthlyPreviewBonus: number;
  vipQualifiedDays: number;
  vipRidesToday: number;
  vipCurrentHours: number;
  circleColor: string;
  textColor: string;
  getLevelDisplayName: () => string;
  getLevelIcon: () => string;
  onLevelPress: () => void;
  onBalancePress: () => void;
}

const EarningsCard: React.FC<EarningsCardProps> = ({
  styles,
  isDark,
  currentData,
  driverLevel,
  vipMonthlyPreviewBonus,
  vipQualifiedDays,
  vipRidesToday,
  vipCurrentHours,
  circleColor,
  textColor,
  getLevelDisplayName,
  getLevelIcon,
  onLevelPress,
  onBalancePress,
}) => {
  return (
    <TouchableOpacity style={styles.earningsCard} onPress={onBalancePress}>
      <View style={styles.earningsHeader}>
        <View style={styles.earningsLeft}>
          <TouchableOpacity style={{ alignItems: 'center', marginRight: 12 }} onPress={onLevelPress}>
            <View style={{ 
              backgroundColor: circleColor,
              borderRadius: 25,
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 32 }}>{getLevelIcon()}</Text>
            </View>
          </TouchableOpacity>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.earningsAmount}>{currentData.total}</Text>
              {driverLevel.isVIP ? (
                <Text style={[styles.earningsReward, { color: '#10B981' }]}>+{vipMonthlyPreviewBonus} AFc</Text>
              ) : (
                <Text style={styles.earningsReward}>+{parseInt(driverLevel.nextReward)} AFc</Text>
              )}
            </View>
            <Text style={{ fontSize: 10, color: textColor, marginTop: 4, fontWeight: '600', marginLeft: 14 }}>
              {getLevelDisplayName()}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#6B7280" />
      </View>
      <EarningsProgressLine 
        vipQualifiedDays={vipQualifiedDays}
        vipRidesToday={vipRidesToday}
        vipCurrentHours={vipCurrentHours}
      />
    </TouchableOpacity>
  );
};

export default EarningsCard;
