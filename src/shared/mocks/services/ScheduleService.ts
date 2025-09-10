/**
 * 📅 SCHEDULE SERVICE
 * 
 * Mock schedule service for development and testing.
 * Easy to replace with gRPC implementation.
 */

// Types for ScheduleService
interface FlexibleScheduleData {
  id: string;
  name: string;
}

interface CustomizedScheduleData {
  id: string;
  name: string;
}

interface AllScheduleData {
  flexibleSchedule: FlexibleScheduleData | null;
  customizedSchedule: CustomizedScheduleData | null;
  timestamp: string;
}

export default class ScheduleService {
  /**
   * Get flexible schedule
   */
  async getFlexible(): Promise<FlexibleScheduleData | null> {
    return {
      id: 'flexible_1',
      name: 'Flexible Schedule',
    };
  }

  /**
   * Get customized schedule
   */
  async getCustomized(): Promise<CustomizedScheduleData | null> {
    return {
      id: 'customized_1',
      name: 'Customized Schedule',
    };
  }

  /**
   * Get all schedule data
   */
  async getAll(): Promise<AllScheduleData> {
    const flexibleSchedule = await this.getFlexible();
    const customizedSchedule = await this.getCustomized();

    return {
      flexibleSchedule,
      customizedSchedule,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Save flexible schedule
   */
  async saveFlexible(scheduleData: FlexibleScheduleData): Promise<void> {
    console.log('📅 Mock flexible schedule saved:', scheduleData);
  }

  /**
   * Save customized schedule
   */
  async saveCustomized(scheduleData: CustomizedScheduleData): Promise<void> {
    console.log('📅 Mock customized schedule saved:', scheduleData);
  }
}