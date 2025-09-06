import { ORDER_CONSTANTS } from '../../../shared/constants/adaptiveConstants';

export class OrderTrackingService {
  private trackingInterval: ReturnType<typeof setInterval> | null = null;

  // Start driver tracking simulation
  startDriverTracking(driverId: string, destination: { latitude: number; longitude: number }): void {
    console.log('Starting driver tracking');
    
    const startPosition = ORDER_CONSTANTS.TRACKING.START_POSITION;
    
    console.log('Driver starts from position:', startPosition);
    console.log('Driver started moving to client');

    let step = 0;
    const totalSteps = ORDER_CONSTANTS.TRACKING.TOTAL_STEPS;
    
    this.trackingInterval = setInterval(() => {
      step++;
      if (step <= totalSteps) {
        const progress = step / totalSteps;
        const currentLat = startPosition.latitude - (startPosition.latitude - destination.latitude) * progress;
        const currentLng = startPosition.longitude + (destination.longitude - startPosition.longitude) * progress;
        
        console.log(`Step ${step}/${totalSteps}, position: ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)}`);
        
        if (step === totalSteps) {
          console.log('Driver arrived to client, trip started');
          this.stopDriverTracking();
        }
      }
    }, ORDER_CONSTANTS.TRACKING.INTERVAL);
  }

  // Stop tracking
  stopDriverTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }
}
