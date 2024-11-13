import { Pool } from 'pg';

// Initialize PostgreSQL client with Aiven connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Aiven PostgreSQL connection URL
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM shipments');
      res.status(200).json(result.rows); // Send the fetched data as JSON response
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ error: 'Error fetching shipments' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
