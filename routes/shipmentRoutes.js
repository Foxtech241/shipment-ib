const express = require('express');
const supabase = require('../supabaseClient');
const router = express.Router();

const createShipment = async (req, res) => {
    const {
        trackingnumber,
        shipmentOwner,
        senderName,
        sendFrom,
        destination,
        status,
        weight,
        shippingPrice,
        receiverName,
        receiverAddress,
        methodOfShipping,
        pickupAirport
    } = req.body;

    try {
        const { data, error } = await supabase
            .from('shipments')
            .insert([{
                trackingnumber,
                shipmentOwner,
                senderName,
                sendFrom,
                destination,
                status,
                weight,
                shippingPrice,
                receiverName,
                receiverAddress,
                methodOfShipping,
                pickupAirport
            }]);

        if (error) {
            return res.status(400).json({ success: false, message: 'Error adding shipment' });
        }

        return res.status(201).json({ success: true, message: 'Shipment added successfully', data });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

router.post('/', createShipment);

module.exports = router;
