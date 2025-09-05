import { RoutePoint } from '../../../shared/types/map.types';

export class ShareRouteService {
  static async open(points: RoutePoint[], role: 'driver' | 'client'): Promise<void> {
    try {
      // Mock implementation for now
      console.log('ShareRouteService.open called with:', { points, role });
      
      // TODO: Implement real gRPC call
      // const response = await this.grpcClient.shareRoute({
      //   points: points.map(p => ({
      //     id: p.id,
      //     type: p.type,
      //     coordinate: {
      //       latitude: p.coordinate.latitude,
      //       longitude: p.coordinate.longitude
      //     }
      //   })),
      //   role
      // });
      
      // For now, just log the action
      if (role === 'driver') {
        console.log('Driver sharing route with', points.length, 'points');
      } else {
        console.log('Client sharing trip with', points.length, 'points');
      }
    } catch (error) {
      console.error('ShareRouteService.open error:', error);
      throw error;
    }
  }
}

export default ShareRouteService;
