const express = require('express');
const bodyParser = require('body-parser');
const shipmentController = require('./controllers/shipmentController'); // Ensure this is correct
const router = express.Router();
const sequelize = require('./config/database');
// Import the Supabase client
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with your environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function to fetch shipments
const fetchShipments = async () => {
    const { data, error } = await supabase
        .from('shipments') // Replace with your table name
        .select('*');

    if (error) {
        console.error('Error fetching shipments:', error);
        return [];
    }
    return data;
};


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// This line uses the router from shipmentController
app.use('/api/shipments', shipmentController); 

app.listen(3000, '0.0.0.0', function() {
    console.log("Server is listening on port 3000 and accessible publicly");
  });
// Sync Sequelize models to the database
sequelize.sync().then(() => {
    console.log('Database connected and models synchronized');
}).catch(err => {
    console.error('Error syncing database:', err);
});
