export const CardScanner = {
  scanCard: jest.fn(() => 
    Promise.resolve({
      cardNumber: '4111111111111111',
      expiryMonth: '12',
      expiryYear: '25',
      cardType: 'visa',
    })
  ),
}; 