import { 
  IFixDriveOrderService, 
  OrderData, 
  SessionData, 
  ContainerData, 
  ValidationResult 
} from './FixDriveOrderTypes';
import { FixDriveOrderStorageService } from './FixDriveOrderStorageService';
import { FixDriveOrderValidationService } from './FixDriveOrderValidationService';
import { FixDriveOrderGrpcService } from './FixDriveOrderGrpcService';

export class FixDriveOrderService implements IFixDriveOrderService {
  private storageService: FixDriveOrderStorageService;
  private validationService: FixDriveOrderValidationService;
  private grpcService: FixDriveOrderGrpcService;

  constructor() {
    this.storageService = new FixDriveOrderStorageService();
    this.validationService = new FixDriveOrderValidationService();
    this.grpcService = new FixDriveOrderGrpcService();
  }

  // Save order data
  async saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt' | 'status'>): Promise<OrderData> {
    return this.storageService.saveOrderData(orderData);
  }

  // Load order data
  async loadOrderData(): Promise<OrderData | null> {
    return this.storageService.loadOrderData();
  }

  // Update order data
  async updateOrderData(updates: Partial<OrderData>): Promise<OrderData | null> {
    return this.storageService.updateOrderData(updates);
  }

  // Save session data
  async saveSessionData(sessionData: SessionData): Promise<void> {
    return this.storageService.saveSessionData(sessionData);
  }

  // Save container times
  async saveContainerTimes(containerData: ContainerData[]): Promise<void> {
    return this.storageService.saveContainerTimes(containerData);
  }

  // Load session data
  async loadSessionData(): Promise<SessionData | null> {
    return this.storageService.loadSessionData();
  }

  // Clear order data
  async clearOrderData(): Promise<void> {
    return this.storageService.clearOrderData();
  }

  // Clear session data
  async clearSessionData(): Promise<void> {
    return this.storageService.clearSessionData();
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    return this.storageService.clearAllData();
  }

  // Get session last update
  async getSessionLastUpdate(): Promise<number | null> {
    return this.storageService.getSessionLastUpdate();
  }

  // Check and clear expired session
  async checkAndClearExpiredSession(): Promise<void> {
    return this.storageService.checkAndClearExpiredSession();
  }

  // Validate order data
  validateOrderData(data: any): ValidationResult {
    return this.validationService.validateOrderData(data);
  }

  // Sync with backend
  async syncWithBackend(): Promise<boolean> {
    return this.grpcService.syncWithBackend();
  }
}

export const fixdriveOrderService = new FixDriveOrderService();
export default fixdriveOrderService;
