require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const shipmentController = require('./controllers/shipmentController'); 
const shipmentRoutes = require('./routes/shipmentRoutes'); // Adjust to your file structure


// Import the Supabase client
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with your environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
    process.exit(1); // Terminate if missing keys
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// Ignore any requests for .map files
app.get('*.map', (req, res) => {
    res.status(204).send(); // Send "No Content" response for .map files
});


app.use('/api/shipments', shipmentController); 
app.get('/track/:trackingnumber', (req, res) => {
    const trackingnumber = req.params.trackingnumber; // Retrieve trackingnumber from request
    res.send(`Tracking Number: ${trackingnumber}`); // Respond with the tracking number
});
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

// Use the shipment routes
app.use(shipmentRoutes);

app.use('/api/shipments', shipmentRoutes);  


// Start the server
app.listen(PORT, '0.0.0.0', function() {
    console.log(`Server is running on port ${PORT}`);
});
