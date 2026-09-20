export type ShipmentStatus =
  | 'Booked'
  | 'In Transit'
  | 'Customs Hold'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Exception Alert';

export type ShipmentMode = 'air' | 'sea' | 'rail' | 'road';

export interface StatusHistoryItem {
  id: string;
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  title: string;
  description: string;
  badge?: string;
  isActive?: boolean;
}

export interface AttachedDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
}

export interface Shipment {
  id: string; // e.g. 'NF-98241-AMS'
  referenceNumber: string; // e.g. 'AWB-020-9418294'
  title: string; // e.g. 'Medical Diagnostics Pharma'
  mode: ShipmentMode;
  status: ShipmentStatus;
  badgeType?: string; // 'COLD' | 'FCL' | 'SECURE' | 'ALERT' | 'RAIL' | 'FTL'
  origin: string; // e.g. 'KTM'
  originName: string;
  transitHub?: string; // e.g. 'FRA'
  transitHubName?: string;
  destination: string; // e.g. 'AMS'
  destinationName: string;
  corridorSubtext?: string;
  carrier: string;
  vesselOrFlight: string;
  expectedDeliveryDate: string;
  timeRemaining?: string;
  operationalStatusText: string;
  co2Footprint: string;
  isPriority?: boolean;
  isReefer?: boolean;
  temperature?: string;
  humidity?: string;
  heading?: string;
  altitudeSpeed?: string;
  currentAirway?: string;
  etaTerminal?: string;
  weight?: string;
  pieces?: number;
  consignee?: string;
  documents: AttachedDocument[];
  history: StatusHistoryItem[];
  createdAt: string;
}

export type ActiveScreen = 'landing-and-portal' | 'shipment-tracking' | 'analytics-and-routes';
export type LandingSubView = 'landing' | 'portal-login';
