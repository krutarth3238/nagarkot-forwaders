import { Shipment, ShipmentStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'nagarkot_session_token';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

/** Convert a raw snake_case backend shipment object to the camelCase Shipment type. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapShipment(raw: any): Shipment {
  return {
    id: raw.id,
    referenceNumber: raw.reference_number ?? raw.referenceNumber ?? '',
    title: raw.title ?? '',
    mode: raw.mode ?? '',
    status: raw.status ?? 'Booked',
    badgeType: raw.badge_type ?? raw.badgeType ?? '',
    origin: raw.origin ?? '',
    originName: raw.origin_name ?? raw.originName ?? '',
    transitHub: raw.transit_hub ?? raw.transitHub ?? null,
    transitHubName: raw.transit_hub_name ?? raw.transitHubName ?? null,
    destination: raw.destination ?? '',
    destinationName: raw.destination_name ?? raw.destinationName ?? '',
    corridorSubtext: raw.corridor_subtext ?? raw.corridorSubtext ?? '',
    carrier: raw.carrier ?? '',
    vesselOrFlight: raw.vessel_or_flight ?? raw.vesselOrFlight ?? '',
    expectedDeliveryDate: raw.expected_delivery_date ?? raw.expectedDeliveryDate ?? '',
    timeRemaining: raw.time_remaining ?? raw.timeRemaining ?? '',
    operationalStatusText: raw.operational_status_text ?? raw.operationalStatusText ?? '',
    co2Footprint: raw.co2_footprint ?? raw.co2Footprint ?? '',
    isPriority: raw.is_priority ?? raw.isPriority ?? false,
    isReefer: raw.is_reefer ?? raw.isReefer ?? false,
    temperature: raw.temperature ?? null,
    humidity: raw.humidity ?? null,
    heading: raw.heading ?? null,
    altitudeSpeed: raw.altitude_speed ?? raw.altitudeSpeed ?? null,
    currentAirway: raw.current_airway ?? raw.currentAirway ?? null,
    etaTerminal: raw.eta_terminal ?? raw.etaTerminal ?? null,
    weight: raw.weight ?? null,
    pieces: raw.pieces ?? null,
    consignee: raw.consignee ?? null,
    history: Array.isArray(raw.milestones) ? raw.milestones.map((m: any) => ({
      id: String(m.id),
      status: m.update_type ?? m.status ?? '',
      timestamp: m.created_at ?? m.timestamp ?? '',
      location: m.location ?? '',
      title: m.update_type ?? m.milestone_title ?? '',
      description: m.update_description ?? m.description ?? '',
      isActive: m.is_active ?? false,
      performedBy: m.performed_by ?? null,
    })) : [],
    documents: raw.documents ?? [],
    createdAt: raw.created_at ?? raw.createdAt ?? '',
  };
}

function mapShipmentToSnakeCase(s: Shipment): any {
  return {
    id: s.id,
    reference_number: s.referenceNumber,
    title: s.title,
    mode: s.mode,
    status: s.status,
    badge_type: s.badgeType,
    origin: s.origin,
    origin_name: s.originName,
    transit_hub: s.transitHub ?? null,
    transit_hub_name: s.transitHubName ?? null,
    destination: s.destination,
    destination_name: s.destinationName,
    corridor_subtext: s.corridorSubtext,
    carrier: s.carrier,
    vessel_or_flight: s.vesselOrFlight,
    expected_delivery_date: s.expectedDeliveryDate,
    time_remaining: s.timeRemaining ?? null,
    operational_status_text: s.operationalStatusText,
    co2_footprint: s.co2Footprint ?? null,
    is_priority: s.isPriority ?? false,
    is_reefer: s.isReefer ?? false,
    temperature: s.temperature ?? null,
    humidity: s.humidity ?? null,
    heading: s.heading ?? null,
    altitude_speed: s.altitudeSpeed ?? null,
    current_airway: s.currentAirway ?? null,
    eta_terminal: s.etaTerminal ?? null,
    weight: s.weight ?? null,
    pieces: s.pieces ?? null,
    consignee: s.consignee ?? null,
  };
}

export const api = {
  // Backend returns { shipments: [...] } — unwrap and map to camelCase.
  getShipments: (): Promise<Shipment[]> =>
    fetch(`${API_URL}/shipments`, { headers: authHeaders() }).then((res) =>
      handle<{ shipments: unknown[] } | unknown[]>(res).then((data: any) => {
        const arr = Array.isArray(data) ? data : (data.shipments ?? []);
        return arr.map(mapShipment);
      })
    ),

  // Backend returns { shipment: {...} } — unwrap and map to camelCase.
  createShipment: (shipment: Shipment): Promise<Shipment> =>
    fetch(`${API_URL}/shipments`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(mapShipmentToSnakeCase(shipment)),
    }).then((res) =>
      handle<{ shipment: unknown } | unknown>(res).then((data: any) =>
        mapShipment(data.shipment ?? data)
      )
    ),

  updateStatus: (
    shipmentId: string,
    payload: {
      status?: ShipmentStatus;
      operationalStatusText?: string;
      milestoneTitle?: string;
      location?: string;
      description?: string;
    }
  ): Promise<Shipment> =>
    fetch(`${API_URL}/shipments/${encodeURIComponent(shipmentId)}/status`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then((res) =>
      handle<{ shipment: unknown } | unknown>(res).then((data: any) =>
        mapShipment(data.shipment ?? data)
      )
    ),
};

