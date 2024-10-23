import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmufpczjbjhxfdhnbjyk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZwY3pqYmpoeGZkaG5ianlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjcyMzEsImV4cCI6MjA0NDYwMzIzMX0.Hv1UE_r7LaL4MGgNYQYLEFmAWOSxMHtPc0zpzjpD1BQ';
const supabase = createClient(supabaseUrl, supabaseKey);
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase.from('shipments').select('*');
      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching shipments' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
