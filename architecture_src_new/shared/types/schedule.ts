export interface FlexibleScheduleData {
  selectedDays: string[];
  selectedTime?: string;
  returnTime?: string | null;
  isReturnTrip: boolean;
  customizedDays: {[key: string]: {there: string, back: string}};
  timestamp: string;
}

export interface CustomizedScheduleData {
  [key: string]: {there: string, back: string};
}

export interface AllScheduleData {
  flexibleSchedule: FlexibleScheduleData | null;
  customizedSchedule: CustomizedScheduleData | null;
  timestamp: string;
}

export interface ScheduleStorageService {
  getFlexibleSchedule(): Promise<FlexibleScheduleData | null>;
  getCustomizedSchedule(): Promise<CustomizedScheduleData | null>;
  getAllScheduleData(): Promise<AllScheduleData>;
  clearScheduleData(): Promise<void>;
}
