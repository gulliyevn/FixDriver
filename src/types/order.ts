export interface Order {
  id: string;
  clientId: string;
  driverId?: string;
  status: OrderStatus;
  from: string;
  to: string;
  departureTime: string;
  returnTime?: string;
  passenger: {
    name: string;
    relationship: string;
    phone?: string;
  };
  route: Array<{
    id: string;
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }>;
  distance: number;
  duration: number;
  price: number;
  extraPayment?: {
    amount: number;
    reason: string;
  };
  driverNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';
