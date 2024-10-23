require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const shipmentController = require('./controllers/shipmentController'); 
const shipmentRoutes = require('./routes/shipmentRoutes'); // Adjust to your file structure
const { createClient } = require('@supabase/supabase-js'); // Ensure this is correctly imported

// Initialize Supabase with your environment variables
const supabaseUrl = process.env.SUPABASE_URL || 'https://xmufpczjbjhxfdhnbjyk.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZwY3pqYmpoeGZkaG5ianlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjcyMzEsImV4cCI6MjA0NDYwMzIzMX0.Hv1UE_r7LaL4MGgNYQYLEFmAWOSxMHtPc0zpzjpD1BQ';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Check your environment variables.');
    process.exit(1); // Terminate if missing keys
}

const app = express();
const PORT = process.env.PORT || 3000;
const shipmentRoutes = require('./routes/shipmentRoutes'); // Adjust the path if necessary
app.use('/api/shipments', shipmentRoutes);


// Use CORS and restrict it to specific domain (your frontend domain on Vercel)
app.use(cors({
  origin: 'https://shipment-fedex.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Log all incoming requests
app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url);
    next();
});

// Ignore requests for .map files (optional)
app.get('*.map', (req, res) => {
    res.status(204).send(); // Send "No Content" response for .map files
});

// Define your routes
app.use('/api/shipments', shipmentRoutes); // This handles all your shipment-related routes

// Example route for handling tracking
app.get('/track/:trackingnumber', (req, res) => {
    const trackingnumber = req.params.trackingnumber; 
    res.send(`Tracking Number: ${trackingnumber}`); 
});

// Implement the GET route for fetching shipment details by tracking number
app.get('/api/shipments/:trackingnumber', async (req, res) => {
    const { trackingnumber } = req.params;

    try {
        // Replace with logic to fetch the shipment details from Supabase or your DB
        const { data, error } = await supabase
            .from('Shipments')
            .select('*')
            .eq('trackingnumber', trackingnumber)
            .single();

        if (error) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        res.status(200).json({ success: true, shipment: data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching shipment details' });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', function() {
    console.log(`Server is running on port ${PORT}`);
});
