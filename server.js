const express = require('express');
const bodyParser = require('body-parser');
const shipmentController = require('./controllers/shipmentController'); // Ensure this is correct
const router = express.Router();
const sequelize = require('./config/database');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// This line uses the router from shipmentController
app.use('/api/shipments', shipmentController); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Sync Sequelize models to the database
sequelize.sync().then(() => {
    console.log('Database connected and models synchronized');
}).catch(err => {
    console.error('Error syncing database:', err);
});