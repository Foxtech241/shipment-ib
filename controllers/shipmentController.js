// controllers/shipmentController.js
const express = require('express');
const router = express.Router();
const Shipment = require('../models/shipment'); // Ensure the path is correct

// Example route for creating a shipment
router.post('/', async (req, res) => {
    try {
        const shipmentData = req.body;
        const shipment = await Shipment.create(shipmentData);
        res.status(201).json(shipment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create new shipment (POST /api/shipments)
router.post('/', async (req, res) => {
  try {
      const newShipment = await Shipment.create(req.body);
      res.json({ success: true, shipment: newShipment });
  } catch (error) {
      console.error('Error creating shipment:', error);
      res.status(500).json({ success: false, message: 'Failed to create shipment' });
  }
});

// Example route for getting all shipments
router.get('/', async (req, res) => {
    try {
        const shipments = await Shipment.findAll();
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export the router
module.exports = router; // This should be correct
