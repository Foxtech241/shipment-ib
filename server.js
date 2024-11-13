require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL client

const app = express();
const PORT = process.env.PORT || 3000;

// Set up PostgreSQL connection using environment variables for Aiven
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Aiven PostgreSQL connection string
    ssl: { rejectUnauthorized: false } // SSL setting for Aiven PostgreSQL
});

// Verify database connection
pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to Aiven PostgreSQL database');
    }
});

// Import shipment routes (ensure the path matches your project structure)
const shipmentRoutes = require('./routes/shipmentRoutes'); 

// Use CORS and restrict to specific domain (your frontend domain on Vercel)
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

// Define shipment-related routes
app.use('/api/shipments', shipmentRoutes);

// Example route for handling tracking
app.get('/track/:trackingnumber', (req, res) => {
    const trackingnumber = req.params.trackingnumber; 
    res.send(`Tracking Number: ${trackingnumber}`); 
});

// Implement GET route for fetching shipment details by tracking number
app.get('/api/shipments/:trackingnumber', async (req, res) => {
    const { trackingnumber } = req.params;

    try {
        // Query the PostgreSQL database for shipment details
        const result = await pool.query('SELECT * FROM Shipments WHERE trackingnumber = $1', [trackingnumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Shipment not found' });
        }

        res.status(200).json({ success: true, shipment: result.rows[0] });
    } catch (err) {
        console.error('Error fetching shipment details:', err);
        res.status(500).json({ success: false, message: 'Error fetching shipment details' });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', function() {
    console.log(`Server is running on port ${PORT}`);
});
