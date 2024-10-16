// controllers/shipmentController.js
const express = require('express');
const router = express.Router();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// POST route for creating a shipment
router.post('/', async (req, res) => {
    try {
        // Insert shipment data into the Supabase 'shipments' table
        const { data, error } = await supabase
            .from('shipments') // Replace 'shipments' with your Supabase table name
            .insert([req.body]);

        if (error) throw error;

        res.json({ success: true, shipment: data });
    } catch (error) {
        console.error('Error creating shipment:', error);
        res.status(500).json({ success: false, message: 'Failed to create shipment' });
    }
});

// GET route for fetching all shipments
router.get('/', async (req, res) => {
    try {
        // Fetch shipments from Supabase
        const { data, error } = await supabase
            .from('shipments') // Replace 'shipments' with your Supabase table name
            .select('*');

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch shipments' });
    }
});

// Export the router
module.exports = router;
