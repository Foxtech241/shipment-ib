const express = require('express');
const supabase = require('../supabaseClient'); // Adjust path accordingly
const router = express.Router();

// Define the getShipmentBytrackingnumber function
const getShipmentBytrackingnumber = async (req, res) => {
    const trackingnumber = req.params.trackingnumber;

    // Log the tracking number for debugging
    console.log('Tracking number received from frontend:', trackingnumber);

    try {
        // Query Supabase for shipment details
        const { data, error, count } = await supabase
            .from('shipments')
            .select('*')
            .eq('trackingnumber', trackingnumber)
            .limit(1)  // Ensure that only one row is fetched
            .single();

        if (error) {
            console.log('Database error:', error);
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        if (!data) {
            console.log('No shipment data found for tracking number:', trackingnumber);
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
router.get('/:trackingnumber', getShipmentBytrackingnumber);



// Export the router
module.exports = router;
