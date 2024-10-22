const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_KEY');

async function handler(req, res) {
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
      .single();
  
    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ message: 'Error fetching existing shipment.' });
    }
  
    if (req.method === 'POST') {
      // Insert new shipment
      if (!existingShipment) {
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
      } else {
        return res.status(400).json({ message: 'Shipment already exists.' });
      }
    } else if (req.method === 'PUT') {
      // Update existing shipment
      if (existingShipment) {
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
        return res.status(404).json({ message: 'Shipment not found.' });
      }
    } else {
      res.setHeader('Allow', ['POST', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  