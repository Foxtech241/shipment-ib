export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log('Request body received:', req.body);
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
                pickupAirport,
                timeGoodsLeftCompany
            } = req.body;

            // Check for required fields
            if (!trackingnumber || !shipmentOwner || !senderName || !sendFrom || !destination || !status) {
                console.error('Missing required fields:', req.body);
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            // Try to insert the shipment data into Supabase
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
                    pickupAirport,
                    timeGoodsLeftCompany
                }]);

            if (error) {
                console.error('Supabase insert error:', error);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            // Successfully added the shipment
            res.status(201).json({ success: true, data });
        } catch (err) {
            // Catch any other errors and return a 500 status
            console.error('Server-side error:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    } else {
        // Only allow POST method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
