import { Pool } from 'pg';

// Initialize PostgreSQL client with Aiven connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Aiven PostgreSQL connection URL
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, trackingnumber, deliverytime, deliverystatus, ...otherFields } = req.body;

    try {
      console.log("PUT request body:", req.body);

      // Build the update query dynamically to include only the provided fields
      const fieldsToUpdate = { trackingnumber, deliverytime, deliverystatus, ...otherFields };
      const setClauses = [];
      const values = [id];
      let i = 2;

      for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (value !== undefined) {
          setClauses.push(`${key} = $${i}`);
          values.push(value);
          i++;
        }
      }

      const updateQuery = `
        UPDATE shipments 
        SET ${setClauses.join(', ')} 
        WHERE id = $1 
        RETURNING *;
      `;

      const result = await pool.query(updateQuery, values);

      res.status(200).json({ message: 'Shipment updated successfully', data: result.rows[0] });
    } catch (error) {
      console.error("Error updating shipment:", error);
      res.status(500).json({ error: 'Error updating shipment', details: error.message });
    }
  } 
  else if (req.method === 'DELETE') {
    const trackingnumber = req.query.trackingnumber || req.body.trackingnumber;

    try {
      console.log("DELETE request tracking number:", trackingnumber);

      const deleteQuery = `
        DELETE FROM shipments 
        WHERE trackingnumber = $1 
        RETURNING *;
      `;

      const result = await pool.query(deleteQuery, [trackingnumber]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Shipment not found' });
      }

      res.status(200).json({ message: 'Shipment deleted successfully', data: result.rows[0] });
    } catch (error) {
      console.error("Error deleting shipment:", error);
      res.status(500).json({ error: 'Error deleting shipment', details: error.message });
    }
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
