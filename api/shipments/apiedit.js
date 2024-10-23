import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, trackingnumber, deliverytime, deliverystatus, ...otherFields } = req.body;

    try {
      // Update shipment by ID
      const { data, error } = await supabase
        .from('shipments')
        .update({
          trackingnumber,
          deliverytime,
          deliverystatus,
          ...otherFields
        })
        .eq('id', id);

      if (error) throw error;

      res.status(200).json({ message: 'Shipment updated successfully', data });
    } catch (error) {
      res.status(500).json({ error: 'Error updating shipment', details: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
