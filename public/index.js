document.getElementById('tracking-form').addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent the form from reloading the page

  const trackingNumber = document.getElementById('tracking-number').value.trim();  // Get and trim input

  // Check if tracking number is valid
  if (!trackingNumber || trackingNumber.length === 0) {
      alert('Please enter a valid tracking number');
      return;
  }

  // Send a request to your backend to fetch shipment details based on the tracking number
  fetch(`/api/shipments/${trackingNumber}`)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              const shipment = data.data;
              const shipmentInfo = `
                  <tr>
                      <td>${shipment.trackingNumber}</td>
                      <td>${shipment.shipmentOwner}</td>
                      <td>${shipment.senderName}</td>
                      <td>${shipment.sendFrom}</td>
                      <td>${shipment.destination}</td>
                      <td>${shipment.status}</td>
                      <td>${shipment.weight}</td>
                      <td>${shipment.shippingPrice}</td>
                      <td>${shipment.receiverName}</td>
                      <td>${shipment.receiverAddress}</td>
                      <td>${shipment.methodOfShipping}</td>
                      <td>${shipment.pickupAirport}</td>
                  </tr>
              `;
              document.getElementById('shipment-info').innerHTML = shipmentInfo;
              document.getElementById('shipment-details').classList.remove('hidden');  // Show the shipment details section
          } else {
              alert('Shipment not found');
          }
      })
      .catch(error => {
          console.error('Error fetching shipment details:', error);
          alert(`Error fetching shipment details: ${error.message}`);
      });
});
