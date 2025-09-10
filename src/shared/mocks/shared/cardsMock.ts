/**
 * 💳 CARDS MOCK DATA
 * 
 * Mock payment cards data for development and testing.
 * Clean implementation with English comments and data.
 */

export interface Card {
  id: string;
  name: string;
  holderName: string;
  lastFour: string;
  type: 'visa' | 'mastercard' | 'maestro';
  expiry: string;
  isDefault: boolean;
}

export const mockCards: Card[] = [
  {
    id: '1',
    name: 'Visa Classic',
    holderName: 'John Smith',
    lastFour: '1234',
    type: 'visa',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: '2',
    name: 'MasterCard Gold',
    holderName: 'Jane Doe',
    lastFour: '5678',
    type: 'mastercard',
    expiry: '08/26',
    isDefault: false
  },
  {
    id: '3',
    name: 'Maestro Debit',
    holderName: 'Mike Johnson',
    lastFour: '9012',
    type: 'maestro',
    expiry: '06/27',
    isDefault: false
  }
];

// Mock card types
export const mockCardTypes = [
  { type: 'visa', name: 'Visa', icon: '💳' },
  { type: 'mastercard', name: 'MasterCard', icon: '💳' },
  { type: 'maestro', name: 'Maestro', icon: '💳' }
];

// Mock card validation
export const mockCardValidation = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  maestro: /^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$/
};