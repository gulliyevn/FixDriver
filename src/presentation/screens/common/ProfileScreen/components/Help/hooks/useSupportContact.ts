/**
 * useSupportContact hook
 * Handles support contact functionality with gRPC integration
 */

import { useState, useCallback, useMemo } from 'react';
import { Linking, Alert } from 'react-native';
import { useLanguage } from '../../../../../context/LanguageContext';
import { useAuth } from '../../../../../context/AuthContext';
import { SupportService } from '../../../../../../data/datasources/support/SupportService';
import { CreateTicketRequest } from '../../../../../../shared/types/support/SupportTypes';

export const useSupportContact = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize SupportService (currently using mock)
  const supportService = useMemo(() => {
    return new SupportService(undefined, true); // Use mock for now
  }, []);

  const handleSupportContact = useCallback(async () => {
    if (!user?.id) {
      Alert.alert(t('common.error'), 'User not authenticated');
      return;
    }

    setLoading(true);
    
    try {
      // Create support ticket first
      const ticketRequest: CreateTicketRequest = {
        userId: user.id,
        subject: 'WhatsApp Support Request',
        message: t('help.whatsappMessage'),
        priority: 'medium',
        category: 'general'
      };

      const ticketResponse = await supportService.createTicket(ticketRequest);
      
      // Then open WhatsApp
      const phoneNumber = '+994516995513';
      const message = `${t('help.whatsappMessage')}\n\nTicket ID: ${ticketResponse.ticketId}`;
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Support contact error:', error);
      
      // Fallback to direct WhatsApp without ticket
      try {
        const phoneNumber = '+994516995513';
        const message = t('help.whatsappMessage');
        const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        
        const canOpen = await Linking.canOpenURL(whatsappUrl);
        if (canOpen) {
          await Linking.openURL(whatsappUrl);
        } else {
          await Linking.openURL(webUrl);
        }
      } catch (fallbackError) {
        Alert.alert(
          t('common.error'), 
          t('help.whatsappError')
        );
      }
    } finally {
      setLoading(false);
    }
  }, [t, user?.id, supportService]);

  const createSupportTicket = useCallback(async (
    subject: string, 
    message: string, 
    category: 'general' | 'technical' | 'billing' | 'safety' | 'complaint' = 'general'
  ) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    const ticketRequest: CreateTicketRequest = {
      userId: user.id,
      subject,
      message,
      priority: 'medium',
      category
    };

    return await supportService.createTicket(ticketRequest);
  }, [user?.id, supportService]);

  return {
    handleSupportContact,
    createSupportTicket,
    loading
  };
};
