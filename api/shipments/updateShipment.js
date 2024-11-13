const { Pool } = require('pg');

// Initialize PostgreSQL client with Aiven connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Aiven PostgreSQL connection URL
  ssl: { rejectUnauthorized: false }
});

async function handler(req, res) {
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

  // Check if tracking number is provided
  if (!trackingnumber) {
    return res.status(400).json({ message: 'Tracking number is required.' });
  }

  try {
    // Check if the shipment already exists
    const existingShipmentResult = await pool.query(
      'SELECT * FROM shipments WHERE trackingnumber = $1',
      [trackingnumber]
    );
    const existingShipment = existingShipmentResult.rows[0];

    if (req.method === 'POST') {
      // Insert new shipment if it does not exist
      if (!existingShipment) {
        const insertResult = await pool.query(
          `INSERT INTO shipments (trackingnumber, shipmentOwner, senderName, sendFrom, destination, status, weight, shippingPrice, receiverName, receiverAddress, methodOfShipping, pickupAirport, timeGoodsLeftCompany)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           RETURNING *`,
          [trackingnumber, shipmentOwner, senderName, sendFrom, destination, status, weight, shippingPrice, receiverName, receiverAddress, methodOfShipping, pickupAirport, timeGoodsLeftCompany]
        );
        res.status(201).json({ success: true, data: insertResult.rows[0] });
      } else {
        res.status(400).json({ message: 'Shipment already exists.' });
      }
    } else if (req.method === 'PUT') {
      // Update existing shipment
      if (existingShipment) {
        const updateResult = await pool.query(
          `UPDATE shipments
           SET shipmentOwner = $1, senderName = $2, sendFrom = $3, destination = $4, status = $5, weight = $6, shippingPrice = $7, receiverName = $8, receiverAddress = $9, methodOfShipping = $10, pickupAirport = $11, timeGoodsLeftCompany = $12
           WHERE trackingnumber = $13
           RETURNING *`,
          [shipmentOwner, senderName, sendFrom, destination, status, weight, shippingPrice, receiverName, receiverAddress, methodOfShipping, pickupAirport, timeGoodsLeftCompany, trackingnumber]
        );
        res.status(200).json({ success: true, data: updateResult.rows[0] });
      } else {
        res.status(404).json({ message: 'Shipment not found.' });
      }
    } else {
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

module.exports = handler;
