import { Shipment } from '../types';

export const initialShipments: Shipment[] = [
  {
    id: 'NF-98241-AMS',
    referenceNumber: 'AWB-020-9418294',
    title: 'Medical Diagnostics Pharma',
    mode: 'air',
    status: 'In Transit',
    badgeType: 'COLD',
    origin: 'KTM',
    originName: 'Kathmandu, Tribhuvan Int\'l',
    transitHub: 'FRA',
    transitHubName: 'Frankfurt Hub CargoCity',
    destination: 'AMS',
    destinationName: 'Amsterdam Schiphol',
    corridorSubtext: 'Air Express Cold-Chain',
    carrier: 'Lufthansa Cargo',
    vesselOrFlight: 'LH-8421 (MD-11F)',
    expectedDeliveryDate: 'Today, 21:45 CEST',
    timeRemaining: 'In 7h 07m',
    operationalStatusText: 'In Flight (Gulf Airway)',
    co2Footprint: '1.42 t (-14% offset)',
    isPriority: true,
    isReefer: true,
    temperature: '4.1°C',
    humidity: '48% RH',
    heading: 'Heading 310° NW',
    altitudeSpeed: 'FL340 / 480 kts',
    currentAirway: 'Gulf Waypoint UL-421',
    etaTerminal: 'In 3h 40m',
    weight: '640 kg',
    pieces: 14,
    consignee: 'Erasmus MC University Medical Center, Rotterdam/Amsterdam Dock 4',
    createdAt: '2025-09-12T09:30:00Z',
    documents: [
      {
        id: 'doc-1',
        name: 'Air_Waybill_020-9418294.pdf',
        type: 'IATA e-Freight Standard',
        size: '1.2 MB',
        category: 'e-BOL'
      },
      {
        id: 'doc-2',
        name: 'Cryo_Coldchain_Cert_Validation.p7s',
        type: 'Cryptographic Log Hash',
        size: '410 KB',
        category: 'Certificate'
      },
      {
        id: 'doc-3',
        name: 'Consolidated_Commercial_Invoice.pdf',
        type: 'Customs Duty Stamped',
        size: '840 KB',
        category: 'Invoice'
      }
    ],
    history: [
      {
        id: 'h1',
        status: 'Booked',
        timestamp: 'Sep 12, 09:30',
        location: 'Nagarkot Hub, Kathmandu',
        title: 'Booking Confirmed & Cargo Accepted',
        description: 'Received 14 thermally insulated payload skids. Total weight: 640 kg.',
        completed: true
      } as any,
      {
        id: 'h2',
        status: 'In Transit',
        timestamp: 'Sep 12, 14:15',
        location: 'Tribhuvan Int\'l Airport (KTM)',
        title: 'Export Customs Cleared & Airside',
        description: 'Customs Officer #N-881 verified seal integrity. Tamper sensor armed.',
        completed: true
      } as any,
      {
        id: 'h3',
        status: 'In Transit',
        timestamp: 'Sep 12, 16:45',
        location: 'In-Flight • Air Corridor Trans-Eurasia',
        title: 'In-Flight • Air Corridor Trans-Eurasia',
        description: 'En route to Frankfurt Hub (FRA). Altitude: 34,000 ft. Airspeed: 480 kts. Cold-chain continuous log sync nominal.',
        badge: 'ACTIVE',
        isActive: true,
        completed: true
      } as any,
      {
        id: 'h4',
        status: 'In Transit',
        timestamp: 'Sep 12, 19:40',
        location: 'Frankfurt Airport (FRA)',
        title: 'Hub Transshipment to Amsterdam',
        description: 'Direct ramp transfer to feeder flight LH-992 with dedicated reefer van.',
        completed: false
      } as any,
      {
        id: 'h5',
        status: 'Delivered',
        timestamp: 'Sep 13, 08:30',
        location: 'Rotterdam/Amsterdam Consignee Dock 4',
        title: 'Final Mile Cold-Chain Delivery',
        description: 'Erasmus MC University Medical Center dock handover & temperature validation.',
        completed: false
      } as any
    ]
  },
  {
    id: 'NF-44912-SZX',
    referenceNumber: 'BOL-COSU-8921820',
    title: 'Consumer Electronics & ICs',
    mode: 'sea',
    status: 'In Transit',
    badgeType: 'FCL',
    origin: 'SZX',
    originName: 'Shenzhen Yantian Port',
    transitHub: 'CCU',
    transitHubName: 'Kolkata Port Syama Prasad',
    destination: 'BIR',
    destinationName: 'Birgunj Dry Port',
    corridorSubtext: 'Intermodal Sea + Rail',
    carrier: 'Evergreen Marine',
    vesselOrFlight: 'EVER GIVEN (V. 042W)',
    expectedDeliveryDate: 'Sep 18, 08:00 NPT',
    timeRemaining: 'In 5d 17h',
    operationalStatusText: 'Transshipment Kolkata Port',
    co2Footprint: '6.85 t (Standard)',
    isPriority: false,
    isReefer: false,
    heading: 'Heading 265° W',
    altitudeSpeed: '19.4 kts Surface',
    currentAirway: 'Bay of Bengal Sealane 4',
    etaTerminal: 'In 1d 12h',
    weight: '24,200 kg',
    pieces: 40,
    consignee: 'Himalayan Electronics Depot, Kathmandu',
    createdAt: '2025-09-08T11:00:00Z',
    documents: [
      {
        id: 'doc-201',
        name: 'Ocean_Bill_of_Lading_COSU8921820.pdf',
        type: 'FIATA Negotiable Multimodal BOL',
        size: '2.4 MB',
        category: 'e-BOL'
      },
      {
        id: 'doc-202',
        name: 'Lithium_Battery_UN3481_Compliance.pdf',
        type: 'Dangerous Goods Declaration',
        size: '890 KB',
        category: 'Certificate'
      }
    ],
    history: [
      {
        id: 'h201',
        status: 'Booked',
        timestamp: 'Sep 08, 11:00',
        location: 'Shenzhen Yantian Terminal',
        title: 'Container Stuffed & Sealed',
        description: 'Tamper-evident container seal #CN-9912401 verified. 40ft High Cube container ready.',
        completed: true
      } as any,
      {
        id: 'h202',
        status: 'In Transit',
        timestamp: 'Sep 10, 06:15',
        location: 'Strait of Malacca',
        title: 'Maritime Transit Leg Cleared',
        description: 'Vessel EVER GIVEN passed Singapore gateway on schedule.',
        completed: true
      } as any,
      {
        id: 'h203',
        status: 'In Transit',
        timestamp: 'Sep 13, 04:20',
        location: 'Kolkata Port Trust (CCU)',
        title: 'Berth Discharge & Customs Transshipment',
        description: 'Vessel docked at Berth 4. Cargo cleared for bonded CONCOR rail feeder to Birgunj.',
        badge: 'ACTIVE',
        isActive: true,
        completed: true
      } as any,
      {
        id: 'h204',
        status: 'Out for Delivery',
        timestamp: 'Sep 16, 12:00',
        location: 'Birgunj Integrated Check Post',
        title: 'Nepal Inland Customs Inspection',
        description: 'Green channel automated verification per Nepal Revenue Department.',
        completed: false
      } as any
    ]
  },
  {
    id: 'NF-10842-RTM',
    referenceNumber: 'MSK-7881902-EU',
    title: 'Hydraulic Precision Turbines',
    mode: 'sea',
    status: 'In Transit',
    badgeType: 'SECURE',
    origin: 'BOM',
    originName: 'Mumbai JNPT Port',
    transitHub: 'DXB',
    transitHubName: 'Dubai Jebel Ali Gateway',
    destination: 'RTM',
    destinationName: 'Port of Rotterdam',
    corridorSubtext: 'Heavy Machinery Multimodal',
    carrier: 'Maersk Line',
    vesselOrFlight: 'MAERSK MC-KINNEY (V. 22B)',
    expectedDeliveryDate: 'Sep 14, 16:30 CEST',
    timeRemaining: 'In 1d 21h',
    operationalStatusText: 'Port Berth Secured (Maasvlakte)',
    co2Footprint: '12.4 t (Heavy Lift)',
    isPriority: true,
    isReefer: false,
    heading: 'Heading 015° NNE',
    altitudeSpeed: '21.2 kts Surface',
    currentAirway: 'English Channel Approaches',
    etaTerminal: 'In 18h 30m',
    weight: '38,500 kg',
    pieces: 4,
    consignee: 'Siemens Energy Netherlands B.V., Europoort',
    createdAt: '2025-09-02T14:20:00Z',
    documents: [
      {
        id: 'doc-301',
        name: 'Master_BOL_MSK7881902EU.pdf',
        type: 'Maersk Digital BOL',
        size: '1.8 MB',
        category: 'e-BOL'
      },
      {
        id: 'doc-302',
        name: 'Heavy_Lift_Rigging_Safety_Cert.pdf',
        type: 'Lloyd\'s Register Certification',
        size: '3.1 MB',
        category: 'Certificate'
      }
    ],
    history: [
      {
        id: 'h301',
        status: 'Booked',
        timestamp: 'Sep 02, 14:20',
        location: 'JNPT Port Mumbai',
        title: 'Project Cargo Rigging Approved',
        description: 'Heavy machinery turbines mounted on 4 flat-rack platforms.',
        completed: true
      } as any,
      {
        id: 'h302',
        status: 'In Transit',
        timestamp: 'Sep 06, 08:45',
        location: 'Jebel Ali Hub, Dubai',
        title: 'Bunkering & Feeder Sync',
        description: 'Vessel bunkered with low-sulfur marine fuel. Telemetry confirmed zero shift.',
        completed: true
      } as any,
      {
        id: 'h303',
        status: 'In Transit',
        timestamp: 'Sep 12, 18:10',
        location: 'North Sea Coastal Corridor',
        title: 'Pre-Arrival Maasvlakte Quay Slot Confirmed',
        description: 'Automated terminal crane gang scheduled for 17:00 CEST discharge.',
        badge: 'ACTIVE',
        isActive: true,
        completed: true
      } as any
    ]
  },
  {
    id: 'NF-77309-BOS',
    referenceNumber: 'SWISS-91204-FDA',
    title: 'Biologics Cryogenic Flasks',
    mode: 'air',
    status: 'Customs Hold',
    badgeType: 'ALERT',
    origin: 'BSL',
    originName: 'Basel EuroAirport',
    transitHub: 'ZRH',
    transitHubName: 'Zurich Airport Hub',
    destination: 'BOS',
    destinationName: 'Boston Logan Int\'l',
    corridorSubtext: 'Direct Swiss WorldCargo',
    carrier: 'Swiss Int\'l Air Lines',
    vesselOrFlight: 'LX-52 (A330-300)',
    expectedDeliveryDate: 'Delayed (Pending Release)',
    timeRemaining: '+14h Est. Latency',
    operationalStatusText: 'Customs Hold: FDA Seal Review',
    co2Footprint: '0.94 t (Cryo LN₂)',
    isPriority: true,
    isReefer: true,
    temperature: '-196.0°C (LN₂)',
    humidity: '12% RH',
    weight: '320 kg',
    pieces: 2,
    consignee: 'Novartis Biomedical Research Institute, Cambridge MA',
    createdAt: '2025-09-11T16:00:00Z',
    documents: [
      {
        id: 'doc-401',
        name: 'Air_Waybill_SWISS91204FDA.pdf',
        type: 'IATA Life Science e-AWB',
        size: '950 KB',
        category: 'e-BOL'
      },
      {
        id: 'doc-402',
        name: 'FDA_Prior_Notice_PN2025881.pdf',
        type: 'FDA Electronic Filing Receipt',
        size: '1.4 MB',
        category: 'Regulatory'
      }
    ],
    history: [
      {
        id: 'h401',
        status: 'Booked',
        timestamp: 'Sep 11, 16:00',
        location: 'Basel BioPark Depot',
        title: 'Cryogenic Loading & Iridium Telemetry Tagged',
        description: 'Dry vapor shipper charged with liquid nitrogen. Temperature stable at -196°C.',
        completed: true
      } as any,
      {
        id: 'h402',
        status: 'In Transit',
        timestamp: 'Sep 12, 08:30',
        location: 'Zurich Int\'l Airport',
        title: 'Departed Transatlantic Flight LX-52',
        description: 'Landed at Boston Logan Air Cargo terminal Bay 12.',
        completed: true
      } as any,
      {
        id: 'h403',
        status: 'Customs Hold',
        timestamp: 'Sep 12, 13:45',
        location: 'Boston Logan Customs Cargo Facility',
        title: 'Hold Issued: FDA Import Operations Secondary Seal Verification',
        description: 'Regulatory audit flagged seal barcode format. Nagarkot compliance desk submitting revised 21 CFR Form 3542 digital certificate.',
        badge: 'EXCEPTION',
        isActive: true,
        completed: true
      } as any
    ]
  },
  {
    id: 'NF-62109-DEL',
    referenceNumber: 'RR-CONCOR-29182',
    title: 'Handcrafted Textiles & Garments',
    mode: 'rail',
    status: 'In Transit',
    badgeType: 'RAIL',
    origin: 'KTM',
    originName: 'Kathmandu Chobhar Dry Port',
    transitHub: 'BIR',
    transitHubName: 'Birgunj Border Rail Yard',
    destination: 'TKD',
    destinationName: 'Tughlakabad Inland Depot (Delhi)',
    corridorSubtext: 'CONCOR Express Rail',
    carrier: 'Container Corp of India',
    vesselOrFlight: 'CONCOR-882A',
    expectedDeliveryDate: 'Tomorrow, 11:15 IST',
    timeRemaining: 'In 20h 47m',
    operationalStatusText: 'Raxaul Border Terminal Cleared',
    co2Footprint: '0.62 t (-42% eco-rail)',
    isPriority: false,
    isReefer: false,
    weight: '16,800 kg',
    pieces: 840,
    consignee: 'FabIndia Overseas Logistics Centre, Okhla New Delhi',
    createdAt: '2025-09-10T10:15:00Z',
    documents: [
      {
        id: 'doc-501',
        name: 'Railway_Receipt_CONCOR29182.pdf',
        type: 'Indian Railways e-RR Consignment Note',
        size: '720 KB',
        category: 'e-BOL'
      },
      {
        id: 'doc-502',
        name: 'SAFTA_Certificate_of_Origin.pdf',
        type: 'Preferential Tariff SAFTA Form',
        size: '1.1 MB',
        category: 'Certificate'
      }
    ],
    history: [
      {
        id: 'h501',
        status: 'Booked',
        timestamp: 'Sep 10, 10:15',
        location: 'Chobhar Inland Container Depot',
        title: 'Customs Sealing in Nepal',
        description: 'Textile export bales inspected & sealed under SAFTA duty rebate schedule.',
        completed: true
      } as any,
      {
        id: 'h502',
        status: 'In Transit',
        timestamp: 'Sep 11, 22:00',
        location: 'Raxaul-Birgunj Border',
        title: 'Cross-Border Exchange Cleared',
        description: 'Transferred to Indian Railways electrified locomotive #WAG-9.',
        completed: true
      } as any,
      {
        id: 'h503',
        status: 'In Transit',
        timestamp: 'Sep 12, 14:00',
        location: 'East Central Railway Freight Corridor',
        title: 'Express Block Train En Route to Tughlakabad',
        description: 'Passing Gorakhpur junction at 75 km/h. Automated GPS wayside tracking nominal.',
        badge: 'ACTIVE',
        isActive: true,
        completed: true
      } as any
    ]
  },
  {
    id: 'NF-51208-SIN',
    referenceNumber: 'TRK-NEX-441928',
    title: 'Solar Inverters & Micro-Grids',
    mode: 'road',
    status: 'In Transit',
    badgeType: 'FTL',
    origin: 'SIN',
    originName: 'Singapore Jurong Industrial',
    transitHub: 'CCU',
    transitHubName: 'Kolkata Port Overland Hub',
    destination: 'KTM',
    destinationName: 'Kathmandu Power Grid Hub',
    corridorSubtext: 'Overland Convoy Protected',
    carrier: 'Nagarkot Express Fleet',
    vesselOrFlight: 'Convoy TR-09 & TR-12',
    expectedDeliveryDate: 'Sep 16, 14:00 NPT',
    timeRemaining: 'In 3d 23h',
    operationalStatusText: 'Crossing Narayangarh Highway',
    co2Footprint: '3.18 t (Euro 6 Certified)',
    isPriority: false,
    isReefer: false,
    weight: '14,500 kg',
    pieces: 18,
    consignee: 'Nepal Electricity Authority, Ratnapark Kathmandu',
    createdAt: '2025-09-09T08:00:00Z',
    documents: [
      {
        id: 'doc-601',
        name: 'Road_Consignment_Note_CMR.pdf',
        type: 'International Road Transport e-CMR',
        size: '1.3 MB',
        category: 'e-BOL'
      }
    ],
    history: [
      {
        id: 'h601',
        status: 'Booked',
        timestamp: 'Sep 09, 08:00',
        location: 'Jurong Port Logistics, Singapore',
        title: 'Cargo Dispatched via RoRo vessel to Kolkata',
        description: 'Inverters loaded into heavy-duty air-suspension tractor trailers.',
        completed: true
      } as any,
      {
        id: 'h602',
        status: 'In Transit',
        timestamp: 'Sep 11, 16:30',
        location: 'Birgunj Border ICP',
        title: 'Entered Nepal Territory via Customs Fast-Track',
        description: 'Electronic cargo tracking system (ECTS) seals attached.',
        completed: true
      } as any,
      {
        id: 'h603',
        status: 'In Transit',
        timestamp: 'Sep 12, 11:20',
        location: 'Narayangarh-Mugling Highway Corridor',
        title: 'High-Altitude Convoy Escort',
        description: 'Convoy accompanied by technical support escort vehicle. Speed: 42 km/h.',
        badge: 'ACTIVE',
        isActive: true,
        completed: true
      } as any
    ]
  }
];
