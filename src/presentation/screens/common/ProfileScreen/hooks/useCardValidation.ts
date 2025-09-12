/**
 * useCardValidation hook
 * Handles card form validation logic
 */

import { useLanguage } from '../../../../context/LanguageContext';

interface CardData {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
}

interface ValidationErrors {
  holderName: string;
  number: string;
  expiry: string;
  cvv: string;
}

export const useCardValidation = () => {
  const { t } = useLanguage();

  const validateCard = (cardData: CardData): ValidationErrors => {
    const errors: ValidationErrors = {
      holderName: '',
      number: '',
      expiry: '',
      cvv: ''
    };

    // Validate holder name
    if (!cardData.holderName || cardData.holderName.trim().length < 2) {
      errors.holderName = t('cards.validation.holderNameRequired');
    } else if (!/^[a-zA-Z\s]+$/.test(cardData.holderName.trim())) {
      errors.holderName = t('cards.validation.holderNameInvalid');
    }

    // Validate card number
    if (!cardData.number) {
      errors.number = t('cards.validation.numberRequired');
    } else if (!/^([0-9]{4} ){3}[0-9]{4}$/.test(cardData.number)) {
      errors.number = t('cards.validation.numberInvalid');
    } else if (!isValidLuhn(cardData.number.replace(/\s/g, ''))) {
      errors.number = t('cards.validation.numberInvalid');
    }

    // Validate expiry
    if (!cardData.expiry) {
      errors.expiry = t('cards.validation.expiryRequired');
    } else if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      errors.expiry = t('cards.validation.expiryInvalid');
    } else {
      const [mm, yy] = cardData.expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      
      if (mm < 1 || mm > 12) {
        errors.expiry = t('cards.validation.expiryMonthInvalid');
      } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errors.expiry = t('cards.validation.expiryPast');
      }
    }

    // Validate CVV
    if (!cardData.cvv) {
      errors.cvv = t('cards.validation.cvvRequired');
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = t('cards.validation.cvvInvalid');
    }

    return errors;
  };

  const isValidLuhn = (number: string): boolean => {
    let sum = 0;
    let isEven = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  };

  return {
    validateCard,
    isValidLuhn
  };
};
