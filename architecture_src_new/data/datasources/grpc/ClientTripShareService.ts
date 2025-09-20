import { RoutePoint } from '../../../shared/types/map.types';

export class ClientTripShareService {
  static async share(points: RoutePoint[]): Promise<void> {
    try {
      // Mock implementation for now
      console.log('ClientTripShareService.share called with:', { points });
      
      // TODO: Implement real gRPC call
      // const response = await this.grpcClient.shareClientTrip({
      //   points: points.map(p => ({
      //     id: p.id,
      //     type: p.type,
      //     coordinate: {
      //       latitude: p.coordinate.latitude,
      //       longitude: p.coordinate.longitude
      //     }
      //   }))
      // });
      
      // For now, just log the action
      console.log('Client sharing trip with', points.length, 'points');
    } catch (error) {
      console.error('ClientTripShareService.share error:', error);
      throw error;
    }
  }
}

export default ClientTripShareService;
