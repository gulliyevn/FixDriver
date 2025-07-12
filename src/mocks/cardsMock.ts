export interface Card {
  id: string;
  name: string;
  lastFour: string;
  type: 'visa' | 'mastercard' | 'maestro';
  expiry: string;
  isDefault: boolean;
}

export const mockCards: Card[] = [
  {
    id: '1',
    name: 'Visa Classic',
    lastFour: '1234',
    type: 'visa',
    expiry: '12/25',
    isDefault: true
  },
  {
    id: '2',
    name: 'MasterCard Gold',
    lastFour: '5678',
    type: 'mastercard',
    expiry: '08/26',
    isDefault: false
  }
]; 