import { 
  PackageType, 
  PackagePeriod, 
  PackageVisuals, 
  PackageVisualsService 
} from '../types/packages';

/**
 * Package visuals service implementation
 * Provides visual elements for VIP packages
 */
export class PackageVisualsHelper implements PackageVisualsService {
  private readonly PACKAGE_ICONS: Record<string, string> = {
    [PackageType.FREE]: 'leaf',
    [PackageType.PLUS]: 'shield',
    [PackageType.PREMIUM]: 'heart',
    [PackageType.PREMIUM_PLUS]: 'diamond',
    [PackageType.SINGLE]: '🎫',
    [PackageType.WEEKLY]: '📅',
    [PackageType.MONTHLY]: '📆',
    [PackageType.YEARLY]: '📊'
  };

  private readonly PACKAGE_COLORS: Record<string, string> = {
    [PackageType.FREE]: '#10B981',
    [PackageType.PLUS]: '#3B82F6',
    [PackageType.PREMIUM]: '#8B5CF6',
    [PackageType.PREMIUM_PLUS]: '#F59E0B',
    [PackageType.SINGLE]: '#FF6B6B',
    [PackageType.WEEKLY]: '#4ECDC4',
    [PackageType.MONTHLY]: '#45B7D1',
    [PackageType.YEARLY]: '#96CEB4'
  };

  private readonly PACKAGE_LABELS: Record<string, string> = {
    [PackageType.FREE]: 'БЕСПЛАТНО',
    [PackageType.PLUS]: 'ПЛЮС',
    [PackageType.PREMIUM]: 'ПРЕМИУМ',
    [PackageType.PREMIUM_PLUS]: 'ПРЕМИУМ+',
    [PackageType.SINGLE]: 'ОДИН',
    [PackageType.WEEKLY]: 'НЕДЕЛЯ',
    [PackageType.MONTHLY]: 'МЕСЯЦ',
    [PackageType.YEARLY]: 'ГОД'
  };

  private readonly PACKAGE_DECORATIONS: Record<string, string> = {
    [PackageType.FREE]: 'leaf',
    [PackageType.PLUS]: 'lead',
    [PackageType.PREMIUM]: 'platinum',
    [PackageType.PREMIUM_PLUS]: 'gold'
  };

  private readonly PREMIUM_PACKAGES = [
    PackageType.FREE,
    PackageType.PLUS,
    PackageType.PREMIUM,
    PackageType.PREMIUM_PLUS
  ];

  private readonly CURRENCY = 'AFc';

  /**
   * Extract base package type by removing period suffix
   */
  private getBaseType(type: string): string {
    return type.replace(/_month$|_year$/, '');
  }

  /**
   * Get package icon by type
   */
  getPackageIcon(type: string): string {
    const baseType = this.getBaseType(type);
    return this.PACKAGE_ICONS[baseType] || this.PACKAGE_ICONS[PackageType.FREE];
  }

  /**
   * Get package color by type
   */
  getPackageColor(type: string): string {
    const baseType = this.getBaseType(type);
    return this.PACKAGE_COLORS[baseType] || this.PACKAGE_COLORS[PackageType.FREE];
  }

  /**
   * Get package label by type
   */
  getPackageLabel(type: string): string {
    const baseType = this.getBaseType(type);
    return this.PACKAGE_LABELS[baseType] || this.PACKAGE_LABELS[PackageType.FREE];
  }

  /**
   * Get package decoration by type
   */
  getPackageDecoration(type: string): string {
    const baseType = this.getBaseType(type);
    return this.PACKAGE_DECORATIONS[baseType] || this.PACKAGE_DECORATIONS[PackageType.FREE];
  }

  /**
   * Format package price with currency
   */
  formatPackagePrice(price: number): string {
    if (price === 0) return 'Бесплатно';
    return `${Number(price || 0).toFixed(2)} ${this.CURRENCY}`;
  }

  /**
   * Check if package is premium type
   */
  isPremiumPackage(type: string): boolean {
    const baseType = this.getBaseType(type);
    return this.PREMIUM_PACKAGES.includes(baseType as PackageType);
  }

  /**
   * Get complete package visuals object
   */
  getPackageVisuals(type: string): PackageVisuals {
    const baseType = this.getBaseType(type);
    
    return {
      icon: this.getPackageIcon(type),
      color: this.getPackageColor(type),
      label: this.getPackageLabel(type),
      decoration: this.getPackageDecoration(type),
      isPremium: this.isPremiumPackage(type)
    };
  }
}

// Default instance for backward compatibility
export const packageVisuals = new PackageVisualsHelper();

// Legacy function exports for smooth migration
export const getPackageIcon = (type: string) => packageVisuals.getPackageIcon(type);
export const getPackageColor = (type: string) => packageVisuals.getPackageColor(type);
export const getPackageLabel = (type: string) => packageVisuals.getPackageLabel(type);
export const getPackageDecoration = (type: string) => packageVisuals.getPackageDecoration(type);
export const formatPackagePrice = (price: number) => packageVisuals.formatPackagePrice(price);
export const isPremiumPackage = (type: string) => packageVisuals.isPremiumPackage(type);

// Export mock service for testing and gRPC preparation
export { MockServices } from '../mocks';
