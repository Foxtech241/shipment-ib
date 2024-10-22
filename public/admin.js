document.getElementById('addShipmentForm').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const shipmentData = {
      trackingnumber: document.getElementById('trackingnumber').value,
      shipmentOwner: document.getElementById('shipmentOwner').value,
      senderName: document.getElementById('senderName').value,
      sendFrom: document.getElementById('sendFrom').value,
      destination: document.getElementById('destination').value,
      status: document.getElementById('status').value,
      weight: parseFloat(document.getElementById('weight').value),
      shippingPrice: parseFloat(document.getElementById('shippingPrice').value),
      receiverName: document.getElementById('receiverName').value,
      receiverAddress: document.getElementById('receiverAddress').value,
      methodOfShipping: document.getElementById('methodOfShipping').value,
      pickupAirport: document.getElementById('pickupAirport').value,
      timeGoodsLeftCompany: document.getElementById('timeGoodsLeftCompany').value || null
    };
  
    console.log(shipmentData); // Debugging log
  
    // Send POST request to the new API endpoint
    fetch('/api/shipments/addShipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shipmentData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert('Shipment added successfully!');
          document.getElementById('addShipmentForm').reset();
        } else {
          alert('Error: ' + (data.message || 'Unknown error occurred'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the shipment.');
      });
  });
  