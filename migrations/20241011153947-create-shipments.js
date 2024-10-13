'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shipments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      shipmentOwner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      senderName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sendFrom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          'On route',
          'Delivered',
          'On hold',
          'Seized'
        ),
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      shippingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      receiverName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiverAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      methodOfShipping: {
        type: Sequelize.ENUM('Air', 'Sea', 'Train'),
        allowNull: false,
      },
      pickupAirport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Shipments');
  }
};
