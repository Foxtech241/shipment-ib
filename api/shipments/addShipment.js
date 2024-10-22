import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your actual Supabase URL and API key)
const supabase = createClient('https://xmufpczjbjhxfdhnbjyk.supabase.co', 'your-supabase-api-key');

export default async function handler(req, res) {
  if (req.method === 'POST') {
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
      // Insert the shipment details into the Supabase database
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
        return res.status(400).json({ success: false, message: 'Error adding shipment', error });
      }

      return res.status(201).json({ success: true, message: 'Shipment added successfully', data });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
