const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const pool = new Pool({ connectionString: 'postgres://postgres:postgres@localhost:5432/nagarkot' });

async function addDummyHistory() {
  const client = await pool.connect();
  try {
    const { rows: shipments } = await client.query('SELECT * FROM shipments WHERE user_id = $1 ORDER BY created_at DESC', ['rKHgVCVgnHNic03mYCoMmZQ3cIr1']);
    
    // Sort by id to be deterministic, or just use the first 12
    for (let i = 0; i < shipments.length; i++) {
      const s = shipments[i];
      // Check how many history items it already has
      const { rows: history } = await client.query('SELECT id FROM shipment_history WHERE shipment_id = $1', [s.id]);
      const currentCount = history.length;
      
      let targetCount = (i < 8) ? Math.floor(Math.random() * 3) + 4 : 1; // 4 to 6 for first 8, 1 for rest
      
      let eventsToAdd = targetCount - currentCount;
      if (eventsToAdd <= 0) continue;
      
      console.log(`Adding ${eventsToAdd} events to ${s.id}`);
      
      // Make older timestamps
      for (let j = 0; j < eventsToAdd; j++) {
        const statuses = ['Booked', 'In Transit', 'Customs Hold', 'Out for Delivery', 'Delivered'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const locations = ['Origin Port', 'Transit Hub', 'Customs Checkpoint', 'Destination Port', 'Warehouse'];
        const location = locations[Math.floor(Math.random() * locations.length)];
        
        await client.query(`
          INSERT INTO shipment_history (
            id, shipment_id, status, operational_status_text, location, milestone_title, description, is_active, timestamp
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - interval '${(eventsToAdd - j) * 2} hours')
        `, [
          uuidv4(), s.id, status, `System update: ${status}`, location, `Historical Milestone`, `Automated log entry for ${location} checkpoint.`, false
        ]);
      }
    }
    console.log('Done adding dummy history!');
  } catch(e) {
    console.error(e);
  } finally {
    client.release();
    pool.end();
  }
}
addDummyHistory();
