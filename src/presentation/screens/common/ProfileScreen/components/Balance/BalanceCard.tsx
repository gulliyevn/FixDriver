/**
 * BalanceCard component
 * Animated balance card with flip functionality
 */

import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import { useLanguage } from '../../../../context/LanguageContext';
import { useAuth } from '../../../../context/AuthContext';
import { lightColors, darkColors } from '../../../../../shared/constants/colors';
import { useBalanceCard } from '../hooks/useBalanceCard';
import { BalanceCardDecoration } from './BalanceCardDecoration';
import { BalanceScreenStyles as styles } from '../styles/BalanceScreen.styles';

interface BalanceCardProps {
  isDriver: boolean;
  screenWidth: number;
  currentPackage: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ 
  isDriver, 
  screenWidth, 
  currentPackage 
}) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const { user } = useAuth();
  const currentColors = isDark ? darkColors : lightColors;
  
  const {
    flipAnim,
    isFlippedRef,
    handleFlip,
    frontInterpolate,
    backInterpolate,
    frontOpacity,
    backOpacity,
    handleCopyCardNumber,
    showCopied,
    handleToggleCVV,
    showCVV,
    cvvOpacity,
    stickerOpacity,
    stickerTranslateX,
    stickerTranslateY,
    stickerRotate
  } = useBalanceCard();
  
  const { userBalance, totalBalance, earnings } = useBalanceCard();
  
  const formatBalance = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2 });
  };

  return (
    <View style={styles.balanceContainer}>
      <View style={styles.cardContainer}>
        {/* Front side of card */}
        <Animated.View
          style={[
            styles.balanceCard,
            styles.balanceCardBorder,
            { backgroundColor: currentColors.card },
            {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
            },
          ]}
        >
          <BalanceCardDecoration 
            isDark={isDark} 
            packageType={currentPackage} 
          />
          <View style={styles.cardFrontContent}>
            <View style={styles.balanceInfo}>
              <Text style={[styles.balanceLabel, { color: currentColors.textSecondary }]}>
                {isDriver ? t('balance.totalBalance') : t('balance.currentBalance')}
              </Text>
              <View style={styles.balanceRow}>
                <Text style={[styles.balanceAmount, { color: currentColors.text }]}>
                  {formatBalance(totalBalance)}
                </Text>
                {!String(totalBalance).includes('AFc') && (
                  <Text style={[styles.balanceCurrency, { color: currentColors.textSecondary }]}>
                    AFc
                  </Text>
                )}
              </View>
              <Text style={[styles.balanceSubtext, { color: currentColors.textSecondary }]}>
                {isDriver 
                  ? `${t('balance.balance')}: ${formatBalance(userBalance)} | ${t('balance.earnings')}: ${formatBalance(earnings)}`
                  : `FixCash: ${user?.cashback || 0} AFc`
                }
              </Text>
            </View>
            <TouchableOpacity onPress={handleFlip} style={styles.flipButton}>
              <Ionicons name="swap-horizontal" size={32} color={currentColors.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Back side of card */}
        <Animated.View
          style={[
            styles.balanceCard,
            styles.balanceCardBorder,
            { backgroundColor: currentColors.card },
            {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
            },
          ]}
        >
          <BalanceCardDecoration 
            isDark={isDark} 
            packageType={currentPackage} 
            isBackSide={true} 
          />
          <View style={styles.cardBackContent}>
            <View style={styles.cardBackHeader}>
              <TouchableOpacity onPress={handleFlip} style={styles.flipButton}>
                <Ionicons name="swap-horizontal" size={32} color={currentColors.primary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.cardBackTitle, { color: currentColors.text }]}>
              {t('balance.digitalCard')}
            </Text>
            
            <View style={styles.cardNumberContainer}>
              <Text style={[styles.cardNumberText, { color: currentColors.text }]} numberOfLines={1}>
                9876 5432 1098 7654
              </Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCardNumber}>
                <Ionicons name="copy-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.cardDetailsContainer}>
              <Text style={[styles.cardDetailsText, { color: currentColors.text }]}>12/25</Text>
              <View style={styles.cvvContainer}>
                <TouchableOpacity onPress={handleToggleCVV}>
                  <Animated.Text 
                    style={[
                      styles.cardDetailsText, 
                      { color: currentColors.text },
                      { opacity: cvvOpacity }
                    ]}
                  >
                    123
                  </Animated.Text>
                </TouchableOpacity>
                <Animated.View 
                  style={[
                    styles.cvvSticker, 
                    {
                      opacity: stickerOpacity,
                      transform: [
                        { translateX: stickerTranslateX },
                        { translateY: stickerTranslateY },
                        { rotate: stickerRotate }
                      ]
                    }
                  ]}
                >
                  <TouchableOpacity onPress={handleToggleCVV}>
                    <Text style={styles.cvvStickerText}>AFc</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
            
            <View style={styles.cardNameContainer}>
              <Text style={[styles.cardNameText, { color: currentColors.text }]}>
                {t('balance.cardHolder')}
              </Text>
            </View>
            
            {showCopied && (
              <View style={styles.copiedNotification}>
                <View style={styles.copiedContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.copiedText}>{t('balance.copied')}</Text>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};
