import { 
  mockUsers, 
  mockDrivers, 
  mockOrders, 
  createMockUser, 
  createMockDriver,
  mockEarningsData,
  mockFilters
} from '../../mocks';
import { UserRole } from '../../types/user';

describe('Mock Data', () => {
  describe('mockUsers', () => {
    it('should have valid user structure', () => {
      expect(mockUsers).toBeInstanceOf(Array);
      expect(mockUsers.length).toBeGreaterThan(0);
      
      mockUsers.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('surname');
        expect(user).toHaveProperty('role');
        expect(user).toHaveProperty('phone');
      });
    });

    it('should have valid email addresses', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      mockUsers.forEach(user => {
        expect(user.email).toMatch(emailRegex);
      });
    });

    it('should have valid phone numbers', () => {
      const phoneRegex = /^\+?994\d{9}$/;
      mockUsers.forEach(user => {
        expect(user.phone).toMatch(phoneRegex);
      });
    });
  });

  describe('mockDrivers', () => {
    it('should have valid driver structure', () => {
      expect(mockDrivers).toBeInstanceOf(Array);
      expect(mockDrivers.length).toBeGreaterThan(0);
      
      mockDrivers.forEach(driver => {
        expect(driver).toHaveProperty('id');
        expect(driver).toHaveProperty('email');
        expect(driver).toHaveProperty('first_name');
        expect(driver).toHaveProperty('last_name');
        expect(driver).toHaveProperty('phone_number');
        expect(driver).toHaveProperty('license_number');
        expect(driver).toHaveProperty('vehicle_brand');
        expect(driver).toHaveProperty('vehicle_model');
        expect(driver).toHaveProperty('vehicle_number');
      });
    });

    it('should have valid license numbers', () => {
      const licenseRegex = /^[A-Z]{2}\d{6}$/;
      mockDrivers.forEach(driver => {
        expect(driver.license_number).toMatch(licenseRegex);
      });
    });

    it('should have valid vehicle numbers', () => {
      const vehicleRegex = /^\d{2}-[A-Z]{2}-\d{3}$/;
      mockDrivers.forEach(driver => {
        expect(driver.vehicle_number).toMatch(vehicleRegex);
      });
    });
  });

  describe('mockOrders', () => {
    it('should have valid order structure', () => {
      expect(mockOrders).toBeInstanceOf(Array);
      expect(mockOrders.length).toBeGreaterThan(0);
      
      mockOrders.forEach(order => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('clientId');
        expect(order).toHaveProperty('driverId');
        expect(order).toHaveProperty('from');
        expect(order).toHaveProperty('to');
        expect(order).toHaveProperty('price');
        expect(order).toHaveProperty('distance');
        expect(order).toHaveProperty('duration');
      });
    });

    it('should have valid prices', () => {
      mockOrders.forEach(order => {
        expect(typeof order.price).toBe('number');
        expect(order.price).toBeGreaterThan(0);
      });
    });

    it('should have valid distances', () => {
      mockOrders.forEach(order => {
        expect(typeof order.distance).toBe('number');
        expect(order.distance).toBeGreaterThan(0);
      });
    });
  });

  describe('mockEarningsData', () => {
    it('should have valid periods', () => {
      expect(mockEarningsData.periods).toBeInstanceOf(Array);
      expect(mockEarningsData.periods.length).toBeGreaterThan(0);
      
      mockEarningsData.periods.forEach(period => {
        expect(period).toHaveProperty('key');
        expect(period).toHaveProperty('label');
        expect(period).toHaveProperty('icon');
      });
    });

    it('should have valid earnings data for each period', () => {
      const periods = ['today', 'week', 'month'];
      periods.forEach(period => {
        const data = mockEarningsData.earningsData[period as keyof typeof mockEarningsData.earningsData];
        expect(data).toHaveProperty('total');
        expect(data).toHaveProperty('rides');
        expect(data).toHaveProperty('hours');
        expect(data).toHaveProperty('average');
        expect(data).toHaveProperty('chart');
      });
    });
  });

  describe('mockFilters', () => {
    it('should have valid status filters', () => {
      expect(mockFilters.status).toBeInstanceOf(Array);
      expect(mockFilters.status.length).toBeGreaterThan(0);
      
      mockFilters.status.forEach(filter => {
        expect(filter).toHaveProperty('id');
        expect(filter).toHaveProperty('label');
      });
    });

    it('should have valid rating filters', () => {
      expect(mockFilters.rating).toBeInstanceOf(Array);
      expect(mockFilters.rating.length).toBeGreaterThan(0);
      
      mockFilters.rating.forEach(filter => {
        expect(filter).toHaveProperty('id');
        expect(filter).toHaveProperty('label');
      });
    });

    it('should have valid vehicle filters', () => {
      expect(mockFilters.vehicle).toBeInstanceOf(Array);
      expect(mockFilters.vehicle.length).toBeGreaterThan(0);
      
      mockFilters.vehicle.forEach(filter => {
        expect(filter).toHaveProperty('id');
        expect(filter).toHaveProperty('label');
      });
    });
  });

  describe('createMockUser', () => {
    it('should create a valid user', () => {
      const user = createMockUser({
        email: 'test@example.com',
        role: UserRole.CLIENT,
        name: 'Test',
        surname: 'User',
        phone: '+994501234567'
      });

      expect(user).toHaveProperty('id');
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test');
      expect(user.surname).toBe('User');
      expect(user.phone).toBe('+994501234567');
    });
  });

  describe('createMockDriver', () => {
    it('should create a valid driver', () => {
      const driver = createMockDriver({
        email: 'driver@example.com',
        first_name: 'John',
        last_name: 'Driver',
        phone_number: '+994501234567'
      });

      expect(driver).toHaveProperty('id');
      expect(driver.email).toBe('driver@example.com');
      expect(driver.first_name).toBe('John');
      expect(driver.last_name).toBe('Driver');
      expect(driver.phone_number).toBe('+994501234567');
    });
  });
}); 