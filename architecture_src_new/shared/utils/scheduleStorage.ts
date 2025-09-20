import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  FlexibleScheduleData, 
  CustomizedScheduleData, 
  AllScheduleData,
  ScheduleStorageService 
} from '../types/schedule';

/**
 * AsyncStorage implementation of schedule storage service
 * Can be easily replaced with gRPC service implementation
 */
export class AsyncStorageScheduleService implements ScheduleStorageService {
  private readonly FLEXIBLE_SCHEDULE_KEY = 'flexibleSchedule';
  private readonly CUSTOMIZED_SCHEDULE_KEY = 'customizedSchedule';

  async getFlexibleSchedule(): Promise<FlexibleScheduleData | null> {
    try {
      const data = await AsyncStorage.getItem(this.FLEXIBLE_SCHEDULE_KEY);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data) as FlexibleScheduleData;
    } catch (error) {
      console.error('Error getting flexible schedule:', error);
      return null;
    }
  }

  async getCustomizedSchedule(): Promise<CustomizedScheduleData | null> {
    try {
      const data = await AsyncStorage.getItem(this.CUSTOMIZED_SCHEDULE_KEY);
      
      if (!data) {
        return null;
      }
      
      return JSON.parse(data) as CustomizedScheduleData;
    } catch (error) {
      console.error('Error getting customized schedule:', error);
      return null;
    }
  }

  async getAllScheduleData(): Promise<AllScheduleData> {
    const flexibleSchedule = await this.getFlexibleSchedule();
    const customizedSchedule = await this.getCustomizedSchedule();
    
    return {
      flexibleSchedule,
      customizedSchedule,
      timestamp: new Date().toISOString()
    };
  }

  async clearScheduleData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.FLEXIBLE_SCHEDULE_KEY);
      await AsyncStorage.removeItem(this.CUSTOMIZED_SCHEDULE_KEY);
    } catch (error) {
      console.error('Error clearing schedule data:', error);
    }
  }
}

// Default instance for backward compatibility
export const scheduleStorage = new AsyncStorageScheduleService();

// Legacy function exports for smooth migration
export const getFlexibleSchedule = () => scheduleStorage.getFlexibleSchedule();
export const getCustomizedSchedule = () => scheduleStorage.getCustomizedSchedule();
export const getAllScheduleData = () => scheduleStorage.getAllScheduleData();
export const clearScheduleData = () => scheduleStorage.clearScheduleData();

// Export mock service for testing and gRPC preparation
export { MockServices } from '../mocks';
