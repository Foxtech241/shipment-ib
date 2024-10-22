const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

async function handler(req, res) {
  if (req.method === 'POST') { // Using POST to check for existing records and add new ones
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

    // Check if the shipment already exists
    const { data: existingShipment, error: fetchError } = await supabase
      .from('shipments')
      .select('*')
      .eq('trackingnumber', trackingnumber)
      .single(); // Fetch only one record

    if (fetchError && fetchError.code !== 'PGRST116') { // Ignore not found errors
      return res.status(500).json({ message: 'Error fetching existing shipment.' });
    }

    if (existingShipment) {
      // If the shipment exists, update it
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
        .eq('trackingnumber', trackingnumber);

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(200).json({ success: true, data });
    } else {
      // If the shipment does not exist, insert a new one
      const { data, error } = await supabase
        .from('shipments')
        .insert({
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
        });

      if (error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(201).json({ success: true, data });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
