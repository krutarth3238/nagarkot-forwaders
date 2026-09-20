"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const pg_1 = require("pg");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nagarkot',
    max: 10
});
let firebaseApp = null;
try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (projectId && clientEmail && privateKey) {
        firebaseApp = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId,
                clientEmail,
                privateKey
            })
        });
    }
}
catch (e) {
    console.error("Firebase init error", e);
}
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split('Bearer ')[1];
    if (!firebaseApp) {
        return res.status(503).json({ error: 'Firebase authentication is not configured' });
    }
    try {
        const decoded = await (0, auth_1.getAuth)().verifyIdToken(token);
        req.user = decoded;
        req.userId = decoded.uid;
        next();
    }
    catch (err) {
        console.error("Firebase token verification error:", err);
        return res.status(401).json({ error: 'Invalid Firebase ID token' });
    }
};
app.get('/health', (req, res) => {
    res.json({ ok: true });
});
app.post('/api/auth/session', async (req, res) => {
    const { idToken, fullName } = req.body;
    if (!idToken)
        return res.status(400).json({ error: 'idToken is required' });
    if (!firebaseApp)
        return res.status(503).json({ error: 'Firebase authentication is not configured' });
    try {
        const decoded = await (0, auth_1.getAuth)().verifyIdToken(idToken);
        const firebase_uid = decoded.uid;
        const email = decoded.email || '';
        const request_full_name = (fullName || '').trim();
        const final_name = request_full_name || decoded.name || email || 'Nagarkot User';
        if (!firebase_uid || !email) {
            return res.status(400).json({ error: 'Firebase token is missing required user information' });
        }
        res.json({
            user: {
                uid: firebase_uid,
                email: email,
                name: final_name,
                picture: decoded.picture
            }
        });
    }
    catch (err) {
        console.error("Firebase token verification error:", err);
        return res.status(401).json({ error: 'Invalid Firebase ID token' });
    }
});
app.get('/api/shipments', requireAuth, async (req, res) => {
    try {
        const { rows: shipments } = await pool.query(`SELECT * FROM shipments WHERE user_id = $1 ORDER BY created_at DESC`, [req.userId]);
        const { rows: histories } = await pool.query(`SELECT * FROM shipment_history WHERE shipment_id IN (SELECT id FROM shipments WHERE user_id = $1) ORDER BY timestamp ASC`, [req.userId]);
        const historyByShipmentId = histories.reduce((acc, h) => {
            if (!acc[h.shipment_id])
                acc[h.shipment_id] = [];
            acc[h.shipment_id].push(h);
            return acc;
        }, {});
        const mappedShipments = shipments.map(s => ({
            ...s,
            milestones: historyByShipmentId[s.id] || []
        }));
        res.json({ shipments: mappedShipments });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/shipments/:id', requireAuth, async (req, res) => {
    try {
        const { rows: shipments } = await pool.query(`SELECT * FROM shipments WHERE id = $1 AND user_id = $2`, [req.params.id, req.userId]);
        if (shipments.length === 0)
            return res.status(404).json({ error: 'Shipment not found' });
        const shipment = shipments[0];
        const { rows: history } = await pool.query(`SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY timestamp ASC`, [shipment.id]);
        shipment.milestones = history;
        res.json({ shipment });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/shipments', requireAuth, async (req, res) => {
    const s = req.body;
    if (!s.referenceNumber || !s.title || !s.origin || !s.destination || !s.carrier) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const s_id = `NF-${Math.floor(Math.random() * 90000) + 10000}-${s.destination.substring(s.destination.length - 3)}`;
        const status = s.status || 'Booked';
        const { rows: created } = await client.query(`INSERT INTO shipments (
        id, user_id, reference_number, title, mode, status, badge_type, origin, origin_name, 
        destination, destination_name, corridor_subtext, carrier, vessel_or_flight, 
        expected_delivery_date, time_remaining, operational_status_text, co2_footprint, 
        is_priority, is_reefer, temperature, weight, pieces, consignee, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 
        $19, $20, $21, $22, $23, $24, NOW()
      ) RETURNING *`, [
            s_id, req.userId, s.referenceNumber, s.title, s.mode || 'Air', status, s.badgeType || 'default',
            s.origin, s.originName || '', s.destination, s.destinationName || '', s.corridorSubtext || '',
            s.carrier, s.vesselOrFlight || '', s.expectedDeliveryDate || '', s.timeRemaining || '',
            s.operationalStatusText || '', s.co2Footprint || '', s.isPriority || false, s.isReefer || false,
            s.temperature || null, s.weight || null, s.pieces || null, s.consignee || null
        ]);
        const shipment = created[0];
        const historyId = (0, uuid_1.v4)();
        await client.query(`INSERT INTO shipment_history (
        id, shipment_id, status, operational_status_text, location, milestone_title, description, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
            historyId, s_id, status, shipment.operational_status_text,
            (shipment.origin_name || shipment.origin) + ' Terminal',
            'Booking Confirmed & Cargo Staged',
            'Initial consignment booking registered under reference ' + shipment.reference_number,
            true
        ]);
        const { rows: history } = await client.query(`SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY timestamp ASC`, [s_id]);
        shipment.milestones = history;
        await client.query('COMMIT');
        res.status(201).json({ shipment });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
app.patch('/api/shipments/:id/status', requireAuth, async (req, res) => {
    const { id } = req.params;
    const { status, operationalStatusText, location, milestoneTitle, description } = req.body;
    if (!status && !operationalStatusText) {
        return res.status(400).json({ error: 'status or operationalStatusText is required' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: updated } = await client.query(`UPDATE shipments 
       SET status = COALESCE($1, status), 
           operational_status_text = COALESCE($2, operational_status_text)
       WHERE id = $3 AND user_id = $4 
       RETURNING *`, [status || null, operationalStatusText || null, id, req.userId]);
        if (updated.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Shipment not found' });
        }
        const shipment = updated[0];
        const h_location = location || (shipment.destination_name ? shipment.destination_name + ' Facility' : 'Unknown');
        const h_title = milestoneTitle || `Status Updated to ${shipment.status}`;
        const h_desc = description || `Operational status transitioned to: ${shipment.operational_status_text || shipment.status}`;
        await client.query(`UPDATE shipment_history SET is_active = false WHERE shipment_id = $1`, [id]);
        const historyId = (0, uuid_1.v4)();
        await client.query(`INSERT INTO shipment_history (
        id, shipment_id, status, operational_status_text, location, milestone_title, description, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
            historyId, id, shipment.status, shipment.operational_status_text,
            h_location, h_title, h_desc, true
        ]);
        const { rows: history } = await client.query(`SELECT * FROM shipment_history WHERE shipment_id = $1 ORDER BY timestamp ASC`, [id]);
        shipment.milestones = history;
        await client.query('COMMIT');
        res.json({ shipment });
    }
    catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
    finally {
        client.release();
    }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map