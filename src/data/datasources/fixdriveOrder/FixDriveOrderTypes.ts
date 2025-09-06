export interface OrderData {
  id: string;
  familyMemberId: string;
  familyMemberName: string;
  packageType: string;
  addresses: Array<{
    id: string;
    type: 'from' | 'to' | 'stop';
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  createdAt: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}

export interface SessionData {
  currentPage: string;
  addressData?: any;
  timeScheduleData?: any;
  lastUpdate?: number;
}

export interface ContainerData {
  containerId: string;
  containerType: string;
  containerIndex: number;
  address: string;
  fromCoordinate?: { latitude: number; longitude: number };
  toCoordinate?: { latitude: number; longitude: number };
  time: string;
  isActive: boolean;
  isCalculated: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface IFixDriveOrderService {
  saveOrderData(orderData: Omit<OrderData, 'id' | 'createdAt' | 'status'>): Promise<OrderData>;
  loadOrderData(): Promise<OrderData | null>;
  updateOrderData(updates: Partial<OrderData>): Promise<OrderData | null>;
  saveSessionData(sessionData: SessionData): Promise<void>;
  saveContainerTimes(containerData: ContainerData[]): Promise<void>;
  loadSessionData(): Promise<SessionData | null>;
  clearOrderData(): Promise<void>;
  clearSessionData(): Promise<void>;
  clearAllData(): Promise<void>;
  getSessionLastUpdate(): Promise<number | null>;
  checkAndClearExpiredSession(): Promise<void>;
  validateOrderData(data: any): ValidationResult;
  syncWithBackend(): Promise<boolean>;
}
