import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './APIClient';
import { HelpContent, HelpContentDto, HelpSection } from '../shared/types/help';
import { DEFAULT_HELP_CONTENT } from '../shared/constants/help';
import { STORAGE_KEYS } from '../utils/storageKeys';

const HELP_CACHE_KEY = STORAGE_KEYS.HELP_CONTENT_CACHE;

class HelpService {
  static async fetchHelpContent(): Promise<HelpContent> {
    if (__DEV__) {
      const cached = await this.getCachedContent();
      if (cached) {
        return cached;
      }
    }

    const response = await apiClient.get<HelpContentDto>('/help/content');
    if (response.success && response.data) {
      const mapped = this.mapDto(response.data);
      if (__DEV__) {
        await AsyncStorage.setItem(HELP_CACHE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    }

    if (__DEV__) {
      return DEFAULT_HELP_CONTENT;
    }

    throw new Error(response.error || 'Failed to load help content');
  }

  static async refreshHelpContent(): Promise<HelpContent> {
    try {
      const response = await apiClient.get<HelpContentDto>('/help/content');
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to load help content');
      }
      const mapped = this.mapDto(response.data);
      if (__DEV__) {
        await AsyncStorage.setItem(HELP_CACHE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    } catch (error) {
      if (__DEV__) {
        const cached = await this.getCachedContent();
        if (cached) {
          return cached;
        }
        return DEFAULT_HELP_CONTENT;
      }
      throw error;
    }
  }

  private static async getCachedContent(): Promise<HelpContent | null> {
    try {
      const raw = await AsyncStorage.getItem(HELP_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as HelpContent;
    } catch (error) {
      console.warn('Failed to parse cached help content', error);
      return null;
    }
  }

  private static mapDto(dto: HelpContentDto): HelpContent {
    const sections: HelpSection[] = dto.sections.map((item) => ({
      id: item.id,
      titleKey: item.title_key,
      descriptionKey: item.description_key,
      icon: item.icon,
      modalType: item.modal_type,
      action: item.action,
    }));

    return {
      sections,
      contact: {
        whatsappNumber: dto.contact?.whatsapp_number || DEFAULT_HELP_CONTENT.contact.whatsappNumber,
        phoneNumber: dto.contact?.phone_number,
        messageKey: dto.contact?.message_key || DEFAULT_HELP_CONTENT.contact.messageKey,
        fallbackUrl: dto.contact?.fallback_url || DEFAULT_HELP_CONTENT.contact.fallbackUrl,
      },
    };
  }
}

export default HelpService;

