// controllers/shipmentController.js
const express = require('express');
const router = express.Router();

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// POST request to create a new shipment
router.post('/api/shipments', async (req, res) => {
    try {
      // Extract data from request body
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
  
      // Basic validation: ensure required fields are not empty
      if (!trackingnumber || !shipmentOwner || !senderName || !sendFrom || !destination || !weight || !shippingPrice || !receiverName || !receiverAddress || !methodOfShipping || !pickupAirport) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
      }
  
      // Insert the new shipment into the database using Supabase
      const { data, error } = await supabase
        .from('shipments')  // Ensure the table name matches your database
        .insert([{
          trackingnumber: trackingnumber,
          shipment_owner: shipmentOwner,
          sender_name: senderName,
          send_from: sendFrom,
          destination: destination,
          status: status,
          weight: weight,
          shipping_price: shippingPrice,
          receiver_name: receiverName,
          receiver_address: receiverAddress,
          method_of_shipping: methodOfShipping,
          pickup_airport: pickupAirport,
          time_goods_left_company: timeGoodsLeftCompany ? new Date(timeGoodsLeftCompany) : null,
          created_at: new Date(), // Optionally handle the created_at field manually
          updated_at: new Date() // Handle updated_at manually as well
        }]);
  
      if (error) {
        throw error;
      }
  
      // Return success response
      res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
      console.error('Error creating shipment:', error.message);
      res.status(500).json({ success: false, message: 'Server error. ' + error.message });
    }
  });

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

// Route to fetch shipment details by tracking number
router.get('/api/shipments/:trackingnumber', async (req, res) => {
    const trackingnumber = req.params.trackingnumber;

    const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .eq('trackingnumber', trackingnumber);

    if (error || data.length === 0) {
        return res.json({ success: false, message: 'Shipment not found' });
    }

    res.json({ success: true, shipment: data[0] });
});

// Define the function to get shipment details by tracking number
async function getShipmentBytrackingnumber(req, res) {
    const { trackingnumber } = req.params; // Extract tracking number from the URL parameters

    try {
        // Query the Supabase database for the shipment using the tracking number
        const { data: shipment, error } = await supabase
            .from('shipments')
            .select('*')
            .eq('trackingnumber', trackingnumber)
            .single(); // Retrieve a single record

        if (error) {
            return res.status(500).json({ success: false, message: 'Error fetching shipment details', error });
        }

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        res.json({ success: true, shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


// Export the function correctly
module.exports = {
    getShipmentBytrackingnumber,
};

module.exports = router;
