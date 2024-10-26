import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmufpczjbjhxfdhnbjyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZwY3pqYmpoeGZkaG5ianlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjcyMzEsImV4cCI6MjA0NDYwMzIzMX0.Hv1UE_r7LaL4MGgNYQYLEFmAWOSxMHtPc0zpzjpD1BQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, trackingnumber, deliverytime, deliverystatus, ...otherFields } = req.body;

    try {
      console.log("PUT request body:", req.body);
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
  } 
  else if (req.method === 'DELETE') {
    const trackingnumber = req.query.trackingnumber || req.body.trackingnumber; // Check both query and body

    try {
      console.log("DELETE request tracking number:", trackingnumber);
      const { data, error } = await supabase
        .from('shipments')
        .delete()
        .eq('trackingnumber', trackingnumber);

      if (error) throw error;

      res.status(200).json({ message: 'Shipment deleted successfully', data });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting shipment', details: error.message });
    }
  } 
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
