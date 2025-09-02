import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  t: (k: string) => string;
  styles: any;
  agree: boolean;
  setAgree: (flag: boolean) => void;
  onOpen: (type: 'terms' | 'privacy') => void;
}

const AgreementRow: React.FC<Props> = ({ t, styles, agree, setAgree, onOpen }) => (
  <View style={styles.agreementContainer}>
    <TouchableOpacity style={styles.checkbox} onPress={() => setAgree(!agree)}>
      <Ionicons 
        name={agree ? 'checkbox' : 'square-outline'} 
        size={28} 
        color={agree ? '#3B82F6' : '#64748B'} 
      />
    </TouchableOpacity>
    <View style={styles.agreementTextContainer}>
      <Text style={styles.agreementText}>{t('auth.register.agreePrefix') + ' '}</Text>
      <TouchableOpacity onPress={() => onOpen('terms')}>
        <Text style={styles.agreementLink}>{t('auth.register.terms')}</Text>
      </TouchableOpacity>
      <Text style={styles.agreementText}>{' ' + t('auth.register.and') + ' '}</Text>
      <TouchableOpacity onPress={() => onOpen('privacy')}>
        <Text style={styles.agreementLink}>{t('auth.register.privacy')}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default AgreementRow;


