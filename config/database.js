const { Sequelize } = require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('shipment_dev', 'text_ship', 'ugochukwu', {
    host: 'localhost',
    dialect: 'mysql', // or 'sqlite', 'postgres', 'mssql'
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
