const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); // PostgreSQL client

// Initialize the PostgreSQL client
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Define the createShipment function
const createShipment = async (req, res) => {
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
        pickupAirport
    } = req.body;

    try {
        // Insert shipment data into PostgreSQL database
        const query = `
            INSERT INTO shipments 
            (trackingnumber, shipmentOwner, senderName, sendFrom, destination, status, weight, shippingPrice, receiverName, receiverAddress, methodOfShipping, pickupAirport) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
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
            pickupAirport
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Error adding shipment' });
        }

        return res.status(201).json({ success: true, message: 'Shipment added successfully', data: result.rows[0] });
    } catch (err) {
        console.error('Error adding shipment:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Define the route to create a shipment
router.post('/', createShipment);

module.exports = router;
