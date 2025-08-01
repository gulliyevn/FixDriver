export const getPackageIcon = (type: string): string => {
  switch (type) {
    case 'free': return 'leaf';
    case 'plus': return 'shield';
    case 'premium': return 'heart';
    case 'premiumPlus': return 'diamond';
    case 'single': return '🎫';
    case 'weekly': return '📅';
    case 'monthly': return '📆';
    case 'yearly': return '📊';
    default: return 'leaf';
  }
};

export const getPackageColor = (type: string): string => {
  switch (type) {
    case 'free': return '#10B981';
    case 'plus': return '#3B82F6';
    case 'premium': return '#8B5CF6';
    case 'premiumPlus': return '#F59E0B';
    case 'single': return '#FF6B6B';
    case 'weekly': return '#4ECDC4';
    case 'monthly': return '#45B7D1';
    case 'yearly': return '#96CEB4';
    default: return '#10B981';
  }
};

export const getPackageLabel = (type: string): string => {
  switch (type) {
    case 'free': return 'БЕСПЛАТНО';
    case 'plus': return 'ПЛЮС';
    case 'premium': return 'ПРЕМИУМ';
    case 'premiumPlus': return 'ПРЕМИУМ+';
    case 'single': return 'ОДИН';
    case 'weekly': return 'НЕДЕЛЯ';
    case 'monthly': return 'МЕСЯЦ';
    case 'yearly': return 'ГОД';
    default: return 'БЕСПЛАТНО';
  }
};

export const getPackageDecoration = (type: string): string => {
  switch (type) {
    case 'free': return 'leaf';
    case 'plus': return 'lead';
    case 'premium': return 'platinum';
    case 'premiumPlus': return 'gold';
    default: return 'leaf';
  }
};

export const formatPackagePrice = (price: number): string => {
  if (price === 0) return 'Бесплатно';
  return `${Number(price || 0).toFixed(2)} AFc`;
};

export const isPremiumPackage = (type: string): boolean => {
  return ['free', 'plus', 'premium', 'premiumPlus'].includes(type);
}; 