import { Pool } from 'pg';

// Initialize PostgreSQL client with Aiven connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Your Aiven PostgreSQL connection URL
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('Request body received:', req.body);
      const {
        trackingnumber,
        shipmentOwner,
        senderName,
        sendFrom,
        destination,
        status,
        weight,
        shippingPrice,
        receiverName,
        receiverAddress,
        methodOfShipping,
        pickupAirport,
        timeGoodsLeftCompany
      } = req.body;

      // Check for required fields
      if (!trackingnumber || !shipmentOwner || !senderName || !sendFrom || !destination || !status) {
        console.error('Missing required fields:', req.body);
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      // Insert the shipment data into PostgreSQL database
      const query = `
        INSERT INTO shipments (
          trackingnumber,
          shipmentOwner,
          senderName,
          sendFrom,
          destination,
          status,
          weight,
          shippingPrice,
          receiverName,
          receiverAddress,
          methodOfShipping,
          pickupAirport,
          timeGoodsLeftCompany
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;
      `;
      const values = [
        trackingnumber,
        shipmentOwner,
        senderName,
        sendFrom,
        destination,
        status,
        weight,
        shippingPrice,
        receiverName,
        receiverAddress,
        methodOfShipping,
        pickupAirport,
        timeGoodsLeftCompany
      ];

      const result = await pool.query(query, values);

      // Successfully added the shipment
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      // Catch any errors and return a 500 status
      console.error('Database insert error:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  } else {
    // Only allow POST method
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
