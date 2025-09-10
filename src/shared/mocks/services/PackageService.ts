/**
 * 📦 PACKAGE SERVICE
 * 
 * Mock package service for development and testing.
 * Easy to replace with gRPC implementation.
 */

// Types for PackageService
interface PackageType {
  type: string;
  name: string;
}

interface PackageVisuals {
  icon: string;
  color: string;
  label: string;
  decoration: string;
  isPremium: boolean;
}

export default class PackageService {
  /**
   * Get package types
   */
  async getTypes(): Promise<PackageType[]> {
    return [
      { type: 'basic', name: 'Basic Package' },
      { type: 'premium', name: 'Premium Package' },
      { type: 'vip', name: 'VIP Package' },
    ];
  }

  /**
   * Get package visuals
   */
  async getVisuals(packageType: string): Promise<PackageVisuals> {
    const visuals: Record<string, PackageVisuals> = {
      basic: {
        icon: '📦',
        color: '#4CAF50',
        label: 'Basic',
        decoration: 'Standard service',
        isPremium: false,
      },
      premium: {
        icon: '⭐',
        color: '#FF9800',
        label: 'Premium',
        decoration: 'Enhanced service',
        isPremium: true,
      },
      vip: {
        icon: '👑',
        color: '#9C27B0',
        label: 'VIP',
        decoration: 'Luxury service',
        isPremium: true,
      },
    };

    return visuals[packageType] || visuals.basic;
  }

  /**
   * Get all package visuals
   */
  async getAllVisuals(): Promise<Record<string, PackageVisuals>> {
    const types = await this.getTypes();
    const visuals: Record<string, PackageVisuals> = {};

    for (const type of types) {
      visuals[type.type] = await this.getVisuals(type.type);
    }

    return visuals;
  }
}