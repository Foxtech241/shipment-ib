import { Pool } from 'pg';

// Initialize PostgreSQL client with Aiven connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Aiven PostgreSQL URL
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  const { trackingnumber } = req.query;

  try {
    // Query the database for the tracking number
    const query = `SELECT * FROM shipments WHERE trackingnumber = $1`;
    const values = [trackingnumber];
    
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return the shipment data
    } else {
      res.status(404).json({ message: 'Shipment not found' });
    }
  } catch (error) {
    console.error('Error retrieving shipment:', error);
    res.status(500).json({ message: 'Error retrieving shipment', error: error.message });
  }
}
