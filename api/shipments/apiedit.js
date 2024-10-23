const { supabase } = require('../../utils/supabaseClient');

// API endpoint to update shipment details
export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { trackingnumber } = req.query; // Retrieve tracking number from query params
        const {
            shipmentOwner,
            senderName,
            sendFrom,
            destination,
            status,
            ...otherFields
        } = req.body;

        try {
            // Update shipment in Supabase using tracking number
            const { data, error } = await supabase
                .from('shipments')
                .update({
                    shipmentOwner,
                    senderName,
                    sendFrom,
                    destination,
                    status,
                    ...otherFields,
                })
                .eq('trackingnumber', trackingnumber); // Update where trackingnumber matches

            if (error) {
                throw error;
            }

            // Return success response
            res.status(200).json(data);
        } catch (error) {
            console.error('Error updating shipment:', error.message);
            res.status(500).json({ message: 'Error updating shipment', error: error.message });
        }
    } else {
        // Handle non-PUT requests
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
