export type HelpModalType = 'booking' | 'payment' | 'rules' | 'safety';

export type HelpSectionAction =
  | { type: 'navigation'; value: string }
  | { type: 'link'; value: string };

export interface HelpSection {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  modalType?: HelpModalType;
  action?: HelpSectionAction;
}

export interface HelpContactInfo {
  whatsappNumber: string;
  phoneNumber?: string;
  messageKey: string;
  fallbackUrl?: string;
}

export interface HelpContent {
  sections: HelpSection[];
  contact: HelpContactInfo;
}

export interface HelpSectionDto {
  id: string;
  title_key: string;
  description_key: string;
  icon: string;
  modal_type?: HelpModalType;
  action?: HelpSectionAction;
}

export interface HelpContentDto {
  sections: HelpSectionDto[];
  contact: {
    phone_number?: string;
    whatsapp_number?: string;
    message_key?: string;
    fallback_url?: string;
  };
}

