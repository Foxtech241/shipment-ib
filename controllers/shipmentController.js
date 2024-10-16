// controllers/shipmentController.js
const express = require('express');
const router = express.Router();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is correctly initialized
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase client not initialized correctly.');
    throw new Error('Supabase client initialization failed.');
}

// POST route for creating a shipment
router.post('/', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the incoming request data
        
        // Insert shipment data into the Supabase 'shipments' table
        const { data, error } = await supabase
            .from('shipments') // Replace 'shipments' with your Supabase table name
            .insert([req.body]);

        if (error) {
            console.error('Supabase insert error:', error); // Log error details
            return res.status(500).json({ success: false, message: error.message });
        }

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

        if (error) {
            console.error('Supabase fetch error:', error); // Log error details
            return res.status(500).json({ success: false, message: error.message });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching shipments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch shipments' });
    }
});

module.exports = router;
