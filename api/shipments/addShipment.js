export default async function handler(req, res) {
    if (req.method === 'POST') {
        // Log the incoming request data to check if it's coming through correctly
        console.log('Request body:', req.body);

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

        // Check if all required fields are present
        if (!trackingnumber || !shipmentOwner || !senderName || !sendFrom || !destination || !status) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Continue with inserting the data into your database (Supabase in this case)
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
                    pickupAirport,
                    timeGoodsLeftCompany
                }]);

            if (error) {
                console.error('Supabase error:', error);
                return res.status(400).json({ success: false, message: 'Error adding shipment' });
            }

            return res.status(201).json({ success: true, message: 'Shipment added successfully', data });
        } catch (err) {
            console.error('Server error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
