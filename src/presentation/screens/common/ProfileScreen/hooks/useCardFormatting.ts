/**
 * useCardFormatting hook
 * Handles card number and expiry formatting
 */

export const useCardFormatting = () => {
  const formatCardNumber = (text: string): string => {
    // Remove all non-digit characters
    const digits = text.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limited = digits.slice(0, 16);
    
    // Format in groups of 4 digits
    let formatted = '';
    for (let i = 0; i < limited.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += limited[i];
    }
    
    return formatted;
  };

  const formatExpiry = (text: string): string => {
    // Remove all non-digit characters
    let digits = text.replace(/\D/g, '');
    
    // Limit to 4 digits
    digits = digits.slice(0, 4);
    
    let formatted = '';
    if (digits.length > 0) {
      let mm = digits.slice(0, 2);
      
      // Auto-correct month
      if (mm.length === 1 && parseInt(mm) > 1) {
        mm = '0' + mm;
      }
      if (mm.length === 2) {
        const month = parseInt(mm, 10);
        if (month < 1) mm = '01';
        if (month > 12) mm = '12';
      }
      
      formatted = mm;
      
      if (digits.length > 2) {
        formatted += '/';
        let yy = digits.slice(2, 4);
        
        // Auto-correct year
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const year = parseInt(yy, 10);
        if (yy.length === 2 && year < currentYear) {
          yy = currentYear.toString();
        }
        
        formatted += yy;
      }
    }
    
    return formatted;
  };

  const formatCvv = (text: string): string => {
    // Remove all non-digit characters and limit to 4 digits
    return text.replace(/\D/g, '').slice(0, 4);
  };

  const getCardType = (number: string): 'visa' | 'mastercard' => {
    const digits = number.replace(/\D/g, '');
    
    if (digits.startsWith('4')) return 'visa';
    if (digits.startsWith('5')) return 'mastercard';
    if (digits.startsWith('34') || digits.startsWith('37')) return 'visa'; // American Express
    if (digits.startsWith('6')) return 'mastercard'; // Discover
    
    return 'visa'; // Default
  };

  const maskCardNumber = (number: string): string => {
    const digits = number.replace(/\D/g, '');
    if (digits.length < 4) return number;
    
    const lastFour = digits.slice(-4);
    const masked = '•••• '.repeat(Math.ceil(digits.length / 4) - 1);
    return masked + lastFour;
  };

  return {
    formatCardNumber,
    formatExpiry,
    formatCvv,
    getCardType,
    maskCardNumber
  };
};
