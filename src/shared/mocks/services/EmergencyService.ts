/**
 * 🚨 EMERGENCY SERVICE
 * 
 * Mock emergency service for development and testing.
 * Easy to replace with gRPC implementation.
 */

export default class EmergencyService {
  /**
   * Get emergency services
   */
  async getServices(): Promise<any[]> {
    return [
      { id: 'police', name: 'Police', number: '911' },
      { id: 'ambulance', name: 'Ambulance', number: '911' },
      { id: 'fire', name: 'Fire Department', number: '911' },
    ];
  }

  /**
   * Call emergency service
   */
  async callEmergency(serviceId: string): Promise<void> {
    console.log('🚨 Mock emergency call to:', serviceId);
  }
}
