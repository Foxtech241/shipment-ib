// controllers/shipmentController.js
const express = require('express');
const router = express.Router();
const { Client } = require('pg'); // PostgreSQL client

// Set up PostgreSQL client
const client = new Client({
    user: process.env.PG_USER,            // e.g., 'postgres'
    host: process.env.PG_HOST,            // e.g., 'localhost'
    database: process.env.PG_DATABASE,    // e.g., 'shipment_db'
    password: process.env.PG_PASSWORD,    // e.g., 'password123'
    port: process.env.PG_PORT || 5432,    // Default PostgreSQL port
});

// Connect to PostgreSQL
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(err => console.error('Error connecting to PostgreSQL:', err));

// POST: Create a new shipment
router.post('/api/shipments', async (req, res) => {
    try {
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

        // Validation
        if (!trackingnumber || !shipmentOwner || !senderName || !sendFrom || !destination || !weight || !shippingPrice || !receiverName || !receiverAddress || !methodOfShipping || !pickupAirport) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        // Insert new shipment into PostgreSQL
        const query = `
            INSERT INTO shipments (
                trackingnumber,
                shipment_owner,
                sender_name,
                send_from,
                destination,
                status,
                weight,
                shipping_price,
                receiver_name,
                receiver_address,
                method_of_shipping,
                pickup_airport,
                time_goods_left_company,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
            ) RETURNING *;
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
            timeGoodsLeftCompany ? new Date(timeGoodsLeftCompany) : null
        ];

        const result = await client.query(query, values);

        // Respond with the inserted shipment
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('Error creating shipment:', error.message);
        res.status(500).json({ success: false, message: 'Server error. ' + error.message });
    }
});

// GET: Fetch all shipments
router.get('/api/shipments', async (req, res) => {
    try {
        const query = 'SELECT * FROM shipments;';
        const result = await client.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch shipments' });
    }
});

// GET: Fetch shipment by tracking number
router.get('/api/shipments/:trackingnumber', async (req, res) => {
    const { trackingnumber } = req.params;
    try {
        const query = 'SELECT * FROM shipments WHERE trackingnumber = $1;';
        const result = await client.query(query, [trackingnumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        res.json({ success: true, shipment: result.rows[0] });
    } catch (error) {
        console.error('Error fetching shipment by tracking number:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
