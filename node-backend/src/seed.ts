import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nagarkot',
});

const USER_ID = 'rKHgVCVgnHNic03mYCoMmZQ3cIr1';

const demoShipments = [
  // Indian Domestic
  {
    title: 'Automotive Parts', origin: 'INBOM', origin_name: 'Mumbai, India', destination: 'INDEL', destination_name: 'New Delhi, India',
    corridor_subtext: 'NH48 Expressway', mode: 'Land', status: 'In Transit', badge_type: 'active', carrier: 'VRL Logistics',
    vessel_or_flight: 'Truck MH04-1234', time_remaining: '14h 30m', operational_status_text: 'En route - Approaching Jaipur',
    co2_footprint: '0.15 MT CO2e', is_priority: true, weight: '2500 kg', pieces: 12, consignee: 'Maruti Suzuki Ltd'
  },
  {
    title: 'Electronics Accessories', origin: 'INMAA', origin_name: 'Chennai, India', destination: 'INBLR', destination_name: 'Bangalore, India',
    corridor_subtext: 'NH48 South', mode: 'Land', status: 'Booked', badge_type: 'default', carrier: 'Blue Dart',
    vessel_or_flight: 'Truck TN01-9876', time_remaining: '6h 15m', operational_status_text: 'Awaiting Pickup',
    co2_footprint: '0.08 MT CO2e', is_priority: false, weight: '850 kg', pieces: 45, consignee: 'Flipkart Hub'
  },
  {
    title: 'Pharma Vaccines', origin: 'INCCU', origin_name: 'Kolkata, India', destination: 'INHYD', destination_name: 'Hyderabad, India',
    corridor_subtext: 'Direct Flight', mode: 'Air', status: 'In Transit', badge_type: 'active', carrier: 'IndiGo Cargo',
    vessel_or_flight: '6E-5432', time_remaining: '1h 45m', operational_status_text: 'In Flight',
    co2_footprint: '1.2 MT CO2e', is_priority: true, is_reefer: true, temperature: '2°C', weight: '400 kg', pieces: 8, consignee: "Dr. Reddy's Labs"
  },
  {
    title: 'Textile Garments', origin: 'INPNQ', origin_name: 'Pune, India', destination: 'INAMD', destination_name: 'Ahmedabad, India',
    corridor_subtext: 'Western Corridor', mode: 'Land', status: 'Delivered', badge_type: 'success', carrier: 'Gati KWE',
    vessel_or_flight: 'Truck MH12-5555', time_remaining: 'Delivered', operational_status_text: 'Proof of Delivery Signed',
    co2_footprint: '0.12 MT CO2e', is_priority: false, weight: '1200 kg', pieces: 150, consignee: 'Arvind Mills'
  },
  {
    title: 'IT Equipment', origin: 'INDEL', origin_name: 'New Delhi, India', destination: 'INBOM', destination_name: 'Mumbai, India',
    corridor_subtext: 'Express Cargo', mode: 'Air', status: 'In Transit', badge_type: 'active', carrier: 'Air India Express',
    vessel_or_flight: 'IX-888', time_remaining: '2h 10m', operational_status_text: 'Departed DEL',
    co2_footprint: '2.1 MT CO2e', is_priority: true, weight: '850 kg', pieces: 22, consignee: 'TCS Ltd'
  },
  // International
  {
    title: 'Consumer Electronics', origin: 'CNSHA', origin_name: 'Shanghai, China', destination: 'INBOM', destination_name: 'Mumbai, India',
    corridor_subtext: 'Ocean Freight FCL', mode: 'Ocean', status: 'In Transit', badge_type: 'active', carrier: 'Maersk Line',
    vessel_or_flight: 'MV Mumbai Express', time_remaining: '14 days', operational_status_text: 'Transiting Malacca Strait',
    co2_footprint: '8.5 MT CO2e', is_priority: false, weight: '24000 kg', pieces: 1, consignee: 'Reliance Digital'
  },
  {
    title: 'Medical Devices', origin: 'USJFK', origin_name: 'New York, USA', destination: 'INDEL', destination_name: 'New Delhi, India',
    corridor_subtext: 'Trans-Atlantic Express', mode: 'Air', status: 'Customs Hold', badge_type: 'warning', carrier: 'FedEx',
    vessel_or_flight: 'FX-092', time_remaining: 'Pending Clearance', operational_status_text: 'Held for Inspection',
    co2_footprint: '6.2 MT CO2e', is_priority: true, weight: '150 kg', pieces: 3, consignee: 'Apollo Hospitals'
  },
  {
    title: 'Machinery Spares', origin: 'INMAA', origin_name: 'Chennai, India', destination: 'SGSIN', destination_name: 'Singapore',
    corridor_subtext: 'Bay of Bengal Route', mode: 'Ocean', status: 'Booked', badge_type: 'default', carrier: 'Hapag-Lloyd',
    vessel_or_flight: 'MV Singapore Star', time_remaining: '5 days', operational_status_text: 'Container Gated In',
    co2_footprint: '2.8 MT CO2e', is_priority: false, weight: '12000 kg', pieces: 1, consignee: 'Jurong Shipyard'
  },
  {
    title: 'Software Servers', origin: 'INBLR', origin_name: 'Bangalore, India', destination: 'GBLHR', destination_name: 'London, UK',
    corridor_subtext: 'Direct Flight', mode: 'Air', status: 'Delivered', badge_type: 'success', carrier: 'British Airways Cargo',
    vessel_or_flight: 'BA-118', time_remaining: 'Delivered', operational_status_text: 'Handed over to Consignee',
    co2_footprint: '5.4 MT CO2e', is_priority: true, weight: '600 kg', pieces: 4, consignee: 'Barclays Tech'
  },
  {
    title: 'Luxury Goods', origin: 'AEDXB', origin_name: 'Dubai, UAE', destination: 'INHYD', destination_name: 'Hyderabad, India',
    corridor_subtext: 'Middle East Express', mode: 'Air', status: 'In Transit', badge_type: 'active', carrier: 'Emirates SkyCargo',
    vessel_or_flight: 'EK-528', time_remaining: '3h 40m', operational_status_text: 'Departed DXB',
    co2_footprint: '1.8 MT CO2e', is_priority: true, weight: '250 kg', pieces: 10, consignee: 'Taj Hotels'
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`DELETE FROM shipments WHERE user_id = $1 AND reference_number LIKE 'DEMO-%'`, [USER_ID]);
    
    for (const s of demoShipments) {
      const destCode = s.destination.length >= 3 ? s.destination.substring(s.destination.length - 3) : s.destination;
      const id = `NF-${Math.floor(Math.random() * 90000) + 10000}-${destCode}`;
      const ref = `DEMO-${Math.floor(Math.random() * 90000000) + 10000000}`;
      
      const d = new Date();
      d.setDate(d.getDate() + Math.floor(Math.random() * 14) + 1);
      const edd = d.toISOString().split('T')[0];
      
      await client.query(`
        INSERT INTO shipments (
          id, user_id, reference_number, title, mode, status, badge_type, origin, origin_name,
          destination, destination_name, corridor_subtext, carrier, vessel_or_flight,
          expected_delivery_date, time_remaining, operational_status_text, co2_footprint,
          is_priority, is_reefer, temperature, weight, pieces, consignee, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, NOW()
        )
      `, [
        id, USER_ID, ref, s.title, s.mode, s.status, s.badge_type, s.origin, s.origin_name,
        s.destination, s.destination_name, s.corridor_subtext, s.carrier, s.vessel_or_flight,
        edd, s.time_remaining, s.operational_status_text, s.co2_footprint, s.is_priority,
        s.is_reefer || false, s.temperature || null, s.weight || null, s.pieces || null, s.consignee || null
      ]);
      
      const historyId = uuidv4();
      await client.query(`
        INSERT INTO shipment_history (
          id, shipment_id, status, operational_status_text, location, milestone_title, description, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        historyId, id, s.status, s.operational_status_text, `${s.origin_name} Terminal`,
        'Booking Confirmed & Cargo Staged', `Initial consignment booking registered under reference ${ref}`, true
      ]);
    }
    
    await client.query('COMMIT');
    console.log('Successfully inserted 10 demo shipments via Node.js seed script.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seeding error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();
