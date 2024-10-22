const express = require('express');
const supabase = require('../supabaseClient'); // Adjust path accordingly
const router = express.Router();

// Step 1: Remove any misplaced code outside functions
// Removed: const shipment = await findShipmentByTrackingNumber(trackingnumber);

// Define the getShipmentBytrackingnumber function
const getShipmentBytrackingnumber = async (req, res) => {
    const trackingnumber = req.params.trackingnumber;

    // Log the tracking number for debugging
    console.log('Tracking number received from frontend:', trackingnumber);

    try {
        // Query Supabase for shipment details
        const { data, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('trackingnumber', trackingnumber)
            .limit(1)  // Ensure that only one row is fetched
            .single();

        if (error || !data) {
            console.log('Database error or no shipment data found:', error);
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        console.log('Shipment data fetched:', data); // Log the fetched data
        return res.json({ success: true, data });
    } catch (err) {
        console.error('Unexpected error occurred:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Step 2: Add the createShipment function for handling POST requests
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

    // Log the shipment data for debugging
    console.log('Shipment data received from frontend:', req.body);

    try {
        const { data, error } = await supabase
            .from('shipments')
            .insert([{
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
            }]);

        if (error) {
            console.error('Error adding shipment:', error);
            return res.status(400).json({ success: false, message: 'Error adding shipment' });
        }

        return res.status(201).json({ success: true, message: 'Shipment added successfully', data });
    } catch (err) {
        console.error('Unexpected error occurred:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Step 1: The GET route for fetching shipment by tracking number
router.get('/:trackingnumber', getShipmentBytrackingnumber);

// Step 2: The POST route for adding a new shipment
router.post('/', createShipment);

// Export the router
module.exports = router;
