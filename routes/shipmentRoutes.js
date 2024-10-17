// shipmentRoutes.js
const express = require('express');
const supabase = require('../supabaseClient'); // Adjust path accordingly
const router = express.Router();

// Define the getShipmentByTrackingNumber function
const getShipmentByTrackingNumber = async (req, res) => {
    const trackingNumber = req.params.trackingNumber; // Extract trackingNumber from request parameters

    // Log the tracking number for debugging
    console.log('Tracking number:', trackingNumber);

    // Your logic to get shipment details from Supabase
    const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('trackingNumber', trackingNumber)
        .single();

    if (error) {
        console.log('Error:', error); // Log the error for debugging
        return res.status(400).json({ success: false, message: error.message });
    }

    console.log('Data fetched:', data); // Log the fetched data

    return res.json({ success: true, data });
};

// Add route to get shipment by tracking number
router.get('/:trackingNumber', getShipmentByTrackingNumber);

// Export the router
module.exports = router;
