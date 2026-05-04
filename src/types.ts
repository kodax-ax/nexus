export enum ShipmentStatus {
  PICKUP_PENDING = 'PICKUP_PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  EXCEPTION = 'EXCEPTION',
}

export interface LocationHistory {
  timestamp: string;
  location: string;
  status: ShipmentStatus;
  description: string;
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  sender: Address;
  receiver: Address;
  status: ShipmentStatus;
  estimatedDelivery: string;
  locationHistory: LocationHistory[];
  weight: number; // in kg
  dimensions: {
    l: number;
    w: number;
    h: number;
  };
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions: {
    l: number;
    w: number;
    h: number;
  };
  serviceType: 'express' | 'standard' | 'economy';
  status: 'pending' | 'responded' | 'converted';
  createdAt: string;
}
