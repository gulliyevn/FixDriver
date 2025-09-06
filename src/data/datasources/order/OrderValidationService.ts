import { ORDER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class OrderValidationService {
  // Validate order data
  validateOrderData(data: {
    familyMemberId: string;
    packageType: string;
    addresses: Array<{
      type: string;
      address: string;
      coordinates?: any;
    }>;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check family member
    if (!data.familyMemberId) {
      errors.push('Family member not selected');
    }

    // Check package
    if (!data.packageType) {
      errors.push('Package not selected');
    }

    // Check addresses
    if (!data.addresses || data.addresses.length === 0) {
      errors.push('No addresses specified');
    } else {
      const fromAddress = data.addresses.find(addr => addr.type === 'from');
      const toAddress = data.addresses.find(addr => addr.type === 'to');

      if (!fromAddress || !fromAddress.address) {
        errors.push('Departure address not specified');
      }

      if (!toAddress || !toAddress.address) {
        errors.push('Destination address not specified');
      }

      // Check coordinates for main addresses
      if (fromAddress && !fromAddress.coordinates) {
        errors.push('Could not determine departure address coordinates');
      }

      if (toAddress && !toAddress.coordinates) {
        errors.push('Could not determine destination address coordinates');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
