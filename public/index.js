document.getElementById('tracking-form').addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent the form from reloading the page

  const trackingNumber = document.getElementById('tracking-number').value;  // Get the input value

  // Send a request to your backend to fetch shipment details based on the tracking number
  fetch(`/api/shipments/${trackingNumber}`)
      .then(response => response.json())
      .then(data => {
          console.log(data); // Log the response data for debugging
          if (data.success) {
              const shipment = data.data; // Change this line
              const shipmentInfo = `
                  <tr>
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
          console.error('Error:', error);
          alert('Error fetching shipment details');
      });
});
