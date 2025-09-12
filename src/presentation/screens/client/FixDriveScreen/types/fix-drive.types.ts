export interface FixDriveState {
  // Состояния для страницы FixDrive
  isButtonLeft: boolean;
  currentPage: FixDrivePage;
  progress: number; // 0-100
}

export interface FixDriveActions {
  // Действия для страницы FixDrive
  setIsButtonLeft: (isLeft: boolean) => void;
  toggleButtonPosition: () => void;
  handleButtonPress: () => void;
  handleContainerPress: () => void;
  setCurrentPage: (page: FixDrivePage) => void;
  updateProgress: (progress: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export interface FixDriveHookReturn {
  state: FixDriveState;
  actions: FixDriveActions;
}

export type FixDrivePage = 'addresses' | 'timeSchedule' | 'confirmation';

export interface ProgressStep {
  id: FixDrivePage;
  title: string;
  icon: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface AddressData {
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
}

export interface TimeScheduleData {
  date: Date;
  time: string;
  isRecurring: boolean;
  recurringDays?: string[];
  notes?: string;
  fromAddress?: string;
  toAddress?: string;
  // Новые поля для сохранения состояния
  fixedTimes?: Record<number, string>;
  weekdayTimes?: Record<number, string>;
  weekendTimes?: Record<number, string>;
  selectedDays?: string[];
  switchStates?: {
    switch1: boolean;
    switch2: boolean;
    switch3: boolean;
  };
}

export interface FixDriveOrderData {
  id: string;
  addressData: AddressData;
  timeScheduleData: TimeScheduleData;
  createdAt: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}
