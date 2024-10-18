export default async function handler(req, res) {
    const { trackingnumber } = req.query;
  
    // Simulate your database lookup here
    const shipment = await findShipmentInDatabase(trackingnumber);
  
    if (shipment) {
      res.status(200).json(shipment);
    } else {
      res.status(404).json({ message: 'Shipment not found' });
    }
  }
  
  // Simulated function to lookup shipment from a database
  async function findShipmentInDatabase(trackingnumber) {
    const shipments = {
      '45567788897655433': { trackingnumber: '45567788897655433', status: 'In transit' }
    };
    return shipments[trackingnumber] || null;
  }
  