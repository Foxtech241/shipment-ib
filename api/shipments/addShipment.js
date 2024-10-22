import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your actual Supabase URL and API key)
const supabase = createClient('https://xmufpczjbjhxfdhnbjyk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZwY3pqYmpoeGZkaG5ianlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjcyMzEsImV4cCI6MjA0NDYwMzIzMX0.Hv1UE_r7LaL4MGgNYQYLEFmAWOSxMHtPc0zpzjpD1BQ');

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
