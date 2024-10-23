const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xmufpczjbjhxfdhnbjyk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdWZwY3pqYmpoeGZkaG5ianlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMjcyMzEsImV4cCI6MjA0NDYwMzIzMX0.Hv1UE_r7LaL4MGgNYQYLEFmAWOSxMHtPc0zpzjpD1BQ');

// API endpoint to fetch all shipments
export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch all shipments from Supabase
            const { data, error } = await supabase
                .from('shipments')
                .select('*'); // Select all columns or specify specific columns you need

            if (error) {
                throw error;
            }

            // Return the fetched data
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching shipments:', error.message);
            res.status(500).json({ message: 'Error fetching shipments', error: error.message });
        }
    } else {
        // Handle non-GET requests
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
