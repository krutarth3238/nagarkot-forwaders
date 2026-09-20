import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nagarkot',
  max: 10
});

let firebaseApp: App | null = null;
try {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();

  if (projectId && clientEmail && privateKey) {
    firebaseApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey
      })
    });
  }
} catch (e) {
  console.error("Firebase init error", e);
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      userId?: string;
    }
  }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = (authHeader as string).split('Bearer ')[1] as string;
  if (!firebaseApp) {
    return res.status(503).json({ error: 'Firebase authentication is not configured' });
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    req.userId = decoded.uid;
    next();
  } catch (err: any) {
    console.error("Firebase token verification error:", err);
    return res.status(401).json({ error: err.message || 'Invalid Firebase ID token' });
  }
};

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/session', async (req, res): Promise<any> => {
  const { idToken, fullName } = req.body;
  if (!idToken) return res.status(400).json({ error: 'idToken is required' });
  if (!firebaseApp) return res.status(503).json({ error: 'Firebase authentication is not configured' });

  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    const firebase_uid = decoded.uid;
    const email = decoded.email || '';
    const request_full_name = (fullName || '').trim();
    
    if (!firebase_uid || !email) {
      return res.status(400).json({ error: 'Firebase token is missing required user information' });
    }

    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE firebase_uid = $1', [firebase_uid]);
      let user = result.rows[0];

      if (!user) {
        const final_name = request_full_name || decoded.name || email.split('@')[0] || 'User';
        const insertRes = await client.query(
          `INSERT INTO users (firebase_uid, email, full_name, role) VALUES ($1, $2, $3, $4) RETURNING *`,
          [firebase_uid, email, final_name, 'Operations Officer']
        );
        user = insertRes.rows[0];
      }

      res.json({
        token: idToken,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          avatar_url: user.avatar_url || decoded.picture || null
        }
      });
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error("Firebase token verification error:", err);
    return res.status(401).json({ error: err.message || 'Invalid Firebase ID token' });
  }
});

app.get('/api/shipments', requireAuth, async (req, res) => {
  try {
    const { rows: shipments } = await pool.query(
      `SELECT * FROM shipments WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.userId]
    );
    
    const { rows: histories } = await pool.query(
      `SELECT * FROM shipment_history WHERE shipment_id IN (SELECT id FROM shipments WHERE user_id = $1) ORDER BY created_at ASC`,
      [req.userId]
    );

    const historyByShipmentId = histories.reduce((acc: any, h: any) => {
      if (!acc[h.shipment_id]) acc[h.shipment_id] = [];
      acc[h.shipment_id].push(h);
      return acc;
    }, {});

    const mappedShipments = shipments.map(s => ({
      ...s,
      milestones: historyByShipmentId[s.id] || []
    }));

    res.json({ shipments: mappedShipments });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.get('/api/shipments/:id', requireAuth, async (req, res): Promise<any> => {
  try {
    const { rows: shipments } = await pool.query(
      `SELECT * FROM shipments WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.userId]
    );
    if (shipments.length === 0) return res.status(404).json({ error: 'Shipment not found' });
    
    const shipment = shipments[0];
    const { rows: history } = await pool.query(
      `SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY created_at ASC`,
      [shipment.id]
    );
    shipment.milestones = history;
    
    res.json({ shipment });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.post('/api/shipments', requireAuth, async (req, res): Promise<any> => {
  const s = req.body;
  if (!s.referenceNumber || !s.title || !s.origin || !s.destination) {
    return res.status(400).json({ error: 'Missing required fields: referenceNumber, title, origin, destination' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const s_id = `NF-${Math.floor(Math.random() * 90000) + 10000}-${s.destination.substring(s.destination.length - 3)}`;
    const status = s.status || 'Booked';
    
    const { rows: created } = await client.query(
      `INSERT INTO shipments (
        id, user_id, reference_number, title, mode, status, badge_type, origin, origin_name, 
        destination, destination_name, corridor_subtext, carrier, vessel_or_flight, 
        expected_delivery_date, time_remaining, operational_status_text, co2_footprint, 
        is_priority, is_reefer, temperature, weight, pieces, consignee, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, NOW()
      ) RETURNING *`,
      [
        s_id, req.userId, s.referenceNumber, s.title, s.mode || 'Air', status, s.badgeType || 'default',
        s.origin, s.originName || '', s.destination, s.destinationName || '', s.corridorSubtext || '',
        s.carrier, s.vesselOrFlight || '', s.expectedDeliveryDate || '', s.timeRemaining || '',
        s.operationalStatusText || '', s.co2Footprint || '', s.isPriority || false, s.isReefer || false,
        s.temperature || null, s.weight || null, s.pieces || null, s.consignee || null
      ]
    );
    
    const shipment = created[0];
    
    await client.query(
      `INSERT INTO shipment_history (
        shipment_id, update_type, update_description, location, performed_by
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        s_id,
        'Booking Confirmed',
        'Initial consignment booking registered under reference ' + shipment.reference_number,
        (shipment.origin_name || shipment.origin) + ' Terminal',
        'Peter Parker'
      ]
    );
    
    const { rows: history } = await client.query(`SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY created_at ASC`, [s_id]);
    shipment.milestones = history;
    
    await client.query('COMMIT');
    res.status(201).json({ shipment });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

app.patch('/api/shipments/:id/status', requireAuth, async (req, res): Promise<any> => {
  const { id } = req.params;
  const { status, operationalStatusText, location, milestoneTitle, description } = req.body;
  if (!status && !operationalStatusText) {
    return res.status(400).json({ error: 'status or operationalStatusText is required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { rows: updated } = await client.query(
      `UPDATE shipments 
       SET status = COALESCE($1, status), 
           operational_status_text = COALESCE($2, operational_status_text)
       WHERE id = $3 AND user_id = $4 
       RETURNING *`,
      [status || null, operationalStatusText || null, id, req.userId]
    );
    
    if (updated.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Shipment not found' });
    }
    const shipment = updated[0];

    const h_location = location || (shipment.destination_name ? shipment.destination_name + ' Facility' : 'Unknown');
    const h_title = milestoneTitle || `Status Updated to ${shipment.status}`;
    const h_desc = description || `Operational status transitioned to: ${shipment.operational_status_text || shipment.status}`;
    
    await client.query(
      `INSERT INTO shipment_history (
        shipment_id, update_type, update_description, location, performed_by
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        id, h_title, h_desc, h_location, 'Peter Parker'
      ]
    );
    
    const { rows: history } = await client.query(`SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY created_at ASC`, [id]);
    shipment.milestones = history;

    await client.query('COMMIT');
    res.json({ shipment });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
