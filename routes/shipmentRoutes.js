const express = require('express');
const supabase = require('../supabaseClient'); // Adjust path accordingly
const router = express.Router();

// Define the getShipmentByTrackingNumber function
const getShipmentByTrackingNumber = async (req, res) => {
    const trackingNumber = req.params.trackingNumber;

    // Log the tracking number for debugging
    console.log('Tracking number received from frontend:', trackingNumber);

    try {
        // Query Supabase for shipment details
        const { data, error, count } = await supabase
            .from('shipments')
            .select('*')
            .eq('trackingNumber', trackingNumber)
            .limit(1)  // Ensure that only one row is fetched
            .single();

        if (error) {
            console.log('Database error:', error);
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        if (!data) {
            console.log('No shipment data found for tracking number:', trackingNumber);
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        console.log('Shipment data fetched:', data); // Log the fetched data
        return res.json({ success: true, data });
    } catch (err) {
        console.error('Unexpected error occurred:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Add route to get shipment by tracking number
router.get('/:trackingNumber', getShipmentByTrackingNumber);

// Export the router
module.exports = router;
