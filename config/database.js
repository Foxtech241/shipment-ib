const { Sequelize } = require('sequelize');

// Create a Sequelize instance with Aiven PostgreSQL connection details
const sequelize = new Sequelize('shipment_dev', 'text_ship', 'ugochukwu', {
    host: 'your-aiven-hostname', // Replace with Aiven's PostgreSQL hostname
    dialect: 'postgres', // Set to 'postgres' for PostgreSQL
    port: 25060, // Aiven's default PostgreSQL port (adjust if different)
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Allows self-signed certificates (necessary for Aiven)
        }
    },
});

// Test the database connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
