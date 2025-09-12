/**
 * useHelpSections hook
 * Manages help sections data and configuration with gRPC integration
 */

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../../../context/LanguageContext';
import { useAuth } from '../../../../../context/AuthContext';
import { HelpService } from '../../../../../../data/datasources/help/HelpService';
import { HelpSection, HelpRequest } from '../../../../../../shared/types/help/HelpTypes';

export const useHelpSections = (isDriver: boolean) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [helpSections, setHelpSections] = useState<HelpSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize HelpService (currently using mock)
  const helpService = useMemo(() => {
    return new HelpService(undefined, true); // Use mock for now
  }, []);

  useEffect(() => {
    const fetchHelpSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const request: HelpRequest = {
          role: isDriver ? 'driver' : 'client',
          language: language
        };

        const response = await helpService.getHelpSections(request);
        setHelpSections(response.sections);

        // Track usage
        if (user?.id) {
          response.sections.forEach(section => {
            helpService.trackHelpUsage(section.id, user.id);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load help sections');
        
        // Fallback to static sections if API fails
        const fallbackSections: HelpSection[] = [
          {
            id: '1',
            title: t('help.howToOrder'),
            icon: 'car',
            description: t('help.howToOrderDesc'),
            content: t('help.modals.booking.content'),
            category: 'booking',
            language: language
          },
          {
            id: '2',
            title: t('help.paymentAndRates'),
            icon: 'card',
            description: t('help.paymentAndRatesDesc'),
            content: t('help.modals.payment.content'),
            category: 'payment',
            language: language
          },
          {
            id: '3',
            title: t('help.safetyTitle'),
            icon: 'shield-checkmark',
            description: t('help.safetyDesc'),
            content: t('help.modals.safety.content'),
            category: 'safety',
            language: language
          },
          {
            id: '4',
            title: t('help.rulesTitle'),
            icon: 'document-text',
            description: t('help.rulesDesc'),
            content: t('help.modals.rules.content'),
            category: 'rules',
            language: language
          },
          {
            id: '5',
            title: t('help.support'),
            icon: 'chatbubbles',
            description: t('help.supportDesc'),
            content: 'Get in touch with our support team via WhatsApp or in-app chat.',
            category: 'support',
            language: language
          }
        ];
        setHelpSections(fallbackSections);
      } finally {
        setLoading(false);
      }
    };

    fetchHelpSections();
  }, [isDriver, language, t, helpService, user?.id]);

  const refreshHelpSections = async () => {
    // Re-fetch help sections
    const request: HelpRequest = {
      role: isDriver ? 'driver' : 'client',
      language: language
    };

    try {
      const response = await helpService.getHelpSections(request);
      setHelpSections(response.sections);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh help sections');
    }
  };

  return {
    helpSections,
    loading,
    error,
    refreshHelpSections
  };
};
