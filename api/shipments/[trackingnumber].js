import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your actual Supabase URL and API key)
const supabase = createClient('https://your-supabase-url', 'your-supabase-api-key');

export default async function handler(req, res) {
  const { trackingnumber } = req.query;

  try {
    // Query your database for the tracking number
    const { data: shipment, error } = await supabase
      .from('shipments') // Your table name in Supabase
      .select('*')
      .eq('trackingnumber', trackingnumber)
      .single();

    if (error) throw error;

    if (shipment) {
      res.status(200).json(shipment);
    } else {
      res.status(404).json({ message: 'Shipment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shipment', error: error.message });
  }
}
