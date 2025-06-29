import { TravelPackage, ActivePackage, BookingRequest, RoutePoint, Passenger } from '../types/package';

export class PackageService {
  // Получить все доступные пакеты
  static async getAvailablePackages(): Promise<TravelPackage[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'single',
            name: 'Разовая поездка',
            type: 'single',
            price: 25, // AZN
            duration: 0,
            description: 'Оплата за одну поездку',
            isActive: false,
          },
          {
            id: 'weekly',
            name: 'Недельный пакет',
            type: 'weekly',
            price: 150,
            tripsIncluded: 10,
            kmLimit: 200,
            timeLimit: 600, // 10 часов
            duration: 7,
            description: '10 поездок на неделю, до 200 км',
            isActive: false,
          },
          {
            id: 'monthly',
            name: 'Месячный пакет',
            type: 'monthly',
            price: 500,
            tripsIncluded: 40,
            kmLimit: 800,
            timeLimit: 2400, // 40 часов
            duration: 30,
            description: '40 поездок на месяц, до 800 км',
            isActive: false,
          },
          {
            id: 'yearly',
            name: 'Годовой пакет',
            type: 'yearly',
            price: 5000,
            tripsIncluded: 500,
            kmLimit: 10000,
            timeLimit: 30000, // 500 часов
            duration: 365,
            description: '500 поездок на год, до 10000 км',
            isActive: false,
          },
        ]);
      }, 500);
    });
  }

  // Получить активный пакет пользователя
  static async getActivePackage(userId: string): Promise<ActivePackage | null> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock активного пакета
        resolve({
          id: 'monthly',
          name: 'Месячный пакет',
          type: 'monthly',
          price: 500,
          tripsIncluded: 40,
          kmLimit: 800,
          timeLimit: 2400,
          duration: 30,
          description: '40 поездок на месяц, до 800 км',
          isActive: true,
          tripsRemaining: 32,
          expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // через 20 дней
          purchasedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 дней назад
          tripsUsed: 8,
          kmUsed: 150,
          timeUsed: 480, // 8 часов
        });
      }, 500);
    });
  }

  // Купить новый пакет
  static async purchasePackage(packageId: string, userId: string): Promise<ActivePackage> {
    // TODO: интеграция со Stripe
    return new Promise((resolve) => {
      setTimeout(() => {
        const packages = {
          single: {
            id: 'single',
            name: 'Разовая поездка',
            type: 'single' as const,
            price: 25,
            duration: 0,
            description: 'Оплата за одну поездку',
            isActive: true,
            purchasedAt: new Date(),
            tripsUsed: 0,
            kmUsed: 0,
            timeUsed: 0,
          },
          weekly: {
            id: 'weekly',
            name: 'Недельный пакет',
            type: 'weekly' as const,
            price: 150,
            tripsIncluded: 10,
            kmLimit: 200,
            timeLimit: 600,
            duration: 7,
            description: '10 поездок на неделю, до 200 км',
            isActive: true,
            tripsRemaining: 10,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            purchasedAt: new Date(),
            tripsUsed: 0,
            kmUsed: 0,
            timeUsed: 0,
          },
          monthly: {
            id: 'monthly',
            name: 'Месячный пакет',
            type: 'monthly' as const,
            price: 500,
            tripsIncluded: 40,
            kmLimit: 800,
            timeLimit: 2400,
            duration: 30,
            description: '40 поездок на месяц, до 800 км',
            isActive: true,
            tripsRemaining: 40,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            purchasedAt: new Date(),
            tripsUsed: 0,
            kmUsed: 0,
            timeUsed: 0,
          },
          yearly: {
            id: 'yearly',
            name: 'Годовой пакет',
            type: 'yearly' as const,
            price: 5000,
            tripsIncluded: 500,
            kmLimit: 10000,
            timeLimit: 30000,
            duration: 365,
            description: '500 поездок на год, до 10000 км',
            isActive: true,
            tripsRemaining: 500,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            purchasedAt: new Date(),
            tripsUsed: 0,
            kmUsed: 0,
            timeUsed: 0,
          },
        };

        resolve(packages[packageId as keyof typeof packages]);
      }, 1000);
    });
  }

  // Рассчитать цену маршрута
  static async calculateRoutePrice(route: RoutePoint[]): Promise<{
    distance: number;
    duration: number;
    basePrice: number;
  }> {
    // TODO: интеграция с картами для расчета реального расстояния
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock расчет - примерно 2 км на точку и 5 минут
        const distance = route.length * 2; // км
        const duration = route.length * 5; // минуты
        const basePrice = 15 + distance * 1.5; // базовый тариф + за км

        resolve({
          distance,
          duration,
          basePrice: Math.round(basePrice),
        });
      }, 800);
    });
  }

  // Проверить, нужна ли доплата за выход за лимиты пакета
  static checkExtraPayment(
    activePackage: ActivePackage,
    routeDistance: number,
    routeDuration: number
  ): { needsExtra: boolean; extraAmount: number; reason?: string } {
    if (activePackage.type === 'single') {
      return { needsExtra: false, extraAmount: 0 };
    }

    // Проверяем лимиты
    const kmExceeded = activePackage.kmLimit && 
      (activePackage.kmUsed + routeDistance) > activePackage.kmLimit;
    
    const timeExceeded = activePackage.timeLimit && 
      (activePackage.timeUsed + routeDuration) > activePackage.timeLimit;

    if (kmExceeded || timeExceeded) {
      const extraKm = kmExceeded ? 
        (activePackage.kmUsed + routeDistance) - activePackage.kmLimit! : 0;
      const extraTime = timeExceeded ? 
        (activePackage.timeUsed + routeDuration) - activePackage.timeLimit! : 0;

      const extraAmount = extraKm * 1.5 + extraTime * 0.5; // цена за превышение
      
      return {
        needsExtra: true,
        extraAmount: Math.round(extraAmount),
        reason: kmExceeded ? 'Превышен лимит километров' : 'Превышен лимит времени'
      };
    }

    return { needsExtra: false, extraAmount: 0 };
  }

  // Создать бронирование
  static async createBooking(bookingData: Partial<BookingRequest>): Promise<BookingRequest> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          packageId: bookingData.packageId,
          passenger: bookingData.passenger!,
          route: bookingData.route!,
          departureTime: bookingData.departureTime!,
          returnTime: bookingData.returnTime,
          driverNotes: bookingData.driverNotes || '',
          isRoundTrip: bookingData.isRoundTrip || false,
          estimatedDistance: bookingData.estimatedDistance || 0,
          estimatedDuration: bookingData.estimatedDuration || 0,
          estimatedPrice: bookingData.estimatedPrice || 0,
          needsExtraPayment: bookingData.needsExtraPayment || false,
          extraPaymentAmount: bookingData.extraPaymentAmount || 0,
        });
      }, 1000);
    });
  }

  // Получить сохраненные шаблоны пассажиров
  static async getPassengerTemplates(userId: string): Promise<Passenger[]> {
    // TODO: заменить на реальный API запрос
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'Нигяр Гулиева',
            relationship: 'дочь',
            phone: '+994 55 123 45 67',
            notes: 'Нужно детское кресло',
            isTemplate: true,
          },
          {
            id: '2',
            name: 'Айшан Мамедова',
            relationship: 'мама',
            phone: '+994 50 987 65 43',
            notes: 'Помочь с сумками',
            isTemplate: true,
          },
        ]);
      }, 300);
    });
  }
}

export default PackageService; 