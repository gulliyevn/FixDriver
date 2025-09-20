import { useMemo } from 'react';
import { useI18n } from '../../../../../shared/i18n';
import { OrdersHeaderState, OrdersHeaderActions, UserRole } from '../types/orders-header.types';

export const useOrdersHeader = (role: UserRole): [OrdersHeaderState, OrdersHeaderActions] => {
  const { t } = useI18n();

  const getTitleByRole = (role: UserRole): string => {
    switch (role) {
      case 'client':
        return t('client.orders.title') || 'Заказы';
      case 'driver':
        return t('driver.orders.title') || 'Заказы';
      default:
        return t('common.orders.title') || 'Заказы';
    }
  };

  const getSubtitleByRole = (role: UserRole): string | undefined => {
    switch (role) {
      case 'client':
        return t('client.orders.subtitle') || 'Ваши активные заказы';
      case 'driver':
        return t('driver.orders.subtitle') || 'Доступные заказы';
      default:
        return undefined;
    }
  };

  const state: OrdersHeaderState = useMemo(() => ({
    title: getTitleByRole(role),
    subtitle: getSubtitleByRole(role),
  }), [role, t]);

  const actions: OrdersHeaderActions = useMemo(() => ({
    getTitleByRole,
    getSubtitleByRole,
  }), [t]);

  return [state, actions];
};
