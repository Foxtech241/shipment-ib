import { supabase } from '@supabase/supabase-js'; // Adjust path as necessary

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { trackingnumber, ...updateData } = req.body;

    // Perform the update operation
    const { data, error } = await supabase
      .from('shipments')
      .update(updateData)
      .match({ trackingnumber });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, data });
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
