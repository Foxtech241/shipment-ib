module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('Shipments');
    
    if (!tableInfo.trackingnumber) {
      await queryInterface.addColumn('Shipments', 'trackingnumber', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });
    }
    if (!tableInfo.shipmentOwner) {
      await queryInterface.addColumn('Shipments', 'shipmentOwner', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    if (!tableInfo.senderName) {
      await queryInterface.addColumn('Shipments', 'senderName', {
        type: Sequelize.STRING,
        allowNull: false,
      });
    }
    // Repeat for the rest of the columns
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shipments', 'trackingnumber');
    await queryInterface.removeColumn('Shipments', 'shipmentOwner');
    await queryInterface.removeColumn('Shipments', 'senderName');
    // Repeat for the rest of the columns
  },
};
