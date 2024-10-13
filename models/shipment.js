const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Shipment extends Model {
    constructor(id, owner, senderName, sendFrom, destination, status, weight, shippingPrice, receiverName, receiverAddress, shippingMethod, pickupAirport) {
        super(); // Call the parent constructor
        this.id = id;
        this.owner = owner;
        this.senderName = senderName;
        this.sendFrom = sendFrom;
        this.destination = destination;
        this.status = status;
        this.weight = weight;
        this.shippingPrice = shippingPrice;
        this.receiverName = receiverName;
        this.receiverAddress = receiverAddress;
        this.shippingMethod = shippingMethod;
        this.pickupAirport = pickupAirport;
    }

    // Static method to generate tracking number
    static generateTrackingNumber() {
        const timestamp = Date.now().toString();
        const randomNum = Math.floor(Math.random() * 100000);
        return `TRK${timestamp}${randomNum}`;
    }
}

// Initialize Sequelize model
Shipment.init({
    shipmentOwner: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure tracking number is unique
    },
    senderName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sendFrom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('On route', 'Delivered', 'On hold', 'Seized'),
        allowNull: false,
        defaultValue: 'On route',
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    shippingPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    receiverName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receiverAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    methodOfShipping: {
        type: DataTypes.ENUM('Air', 'Sea', 'Train'),
        allowNull: false,
    },
    pickupAirport: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Shipment',
    hooks: {
        beforeCreate: (shipment) => {
            shipment.trackingNumber = Shipment.generateTrackingNumber();
        }
    }
});

module.exports = Shipment;
