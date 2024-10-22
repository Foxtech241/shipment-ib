// addShipment.js (or updateShipment.js)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

async function handler(req, res) {
  if (req.method === 'PUT') { // Use PUT for updates
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

    // Check if trackingnumber is provided
    if (!trackingnumber) {
      return res.status(400).json({ message: 'Tracking number is required.' });
    }

    // Update the shipment details
    const { data, error } = await supabase
      .from('shipments')
      .update({
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
      })
      .eq('trackingnumber', trackingnumber); // Match the existing tracking number

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.status(200).json({ success: true, data });
  } else {
    // Handle other methods (GET, POST, etc.)
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
