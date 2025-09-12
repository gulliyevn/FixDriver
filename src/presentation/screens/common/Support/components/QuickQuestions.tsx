import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../../../../shared/hooks/useI18n';
import { styles } from '../styles/SupportChatScreen.styles';

/**
 * Quick Questions Component
 * 
 * Displays quick question buttons for common support queries
 */

interface QuickQuestionsProps {
  onSelectQuestion: (question: string) => void;
  isDark: boolean;
}

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({
  onSelectQuestion,
  isDark
}) => {
  const { t } = useI18n();

  const quickQuestions = [
    { id: 'q1', question: t('support.quickQuestion1') },
    { id: 'q2', question: t('support.quickQuestion2') },
    { id: 'q3', question: t('support.quickQuestion3') },
  ];

  return (
    <View style={styles.quickQuestionsContainer}>
      <Text style={[
        styles.quickQuestionsTitle,
        isDark && styles.quickQuestionsTitleDark
      ]}>
        {t('support.quickQuestions')}:
      </Text>
      {quickQuestions.map((question, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.quickQuestionButton,
            isDark && styles.quickQuestionButtonDark
          ]}
          onPress={() => onSelectQuestion(question.question)}
        >
          <Text style={[
            styles.quickQuestionText,
            isDark && styles.quickQuestionTextDark
          ]}>
            {question.question}
          </Text>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={isDark ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
