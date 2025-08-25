export interface FixWaveState {
  // Состояния для страницы FixWave
  isButtonLeft: boolean;
  currentPage: FixWavePage;
  progress: number; // 0-100
}

export interface FixWaveActions {
  // Действия для страницы FixWave
  setIsButtonLeft: (isLeft: boolean) => void;
  toggleButtonPosition: () => void;
  handleButtonPress: () => void;
  handleContainerPress: () => void;
  setCurrentPage: (page: FixWavePage) => void;
  updateProgress: (progress: number) => void;
  nextPage: () => void;
  previousPage: () => void;
}

export interface FixWaveHookReturn {
  state: FixWaveState;
  actions: FixWaveActions;
}

export type FixWavePage = 'addresses' | 'timeSchedule' | 'confirmation';

export interface ProgressStep {
  id: FixWavePage;
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
}

export interface FixWaveOrderData {
  id: string;
  addressData: AddressData;
  timeScheduleData: TimeScheduleData;
  createdAt: number;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
}
