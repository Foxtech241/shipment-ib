document.getElementById('tracking-form').addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent the form from reloading the page

  const trackingnumber = document.getElementById('trackingnumber').value;
  console.log('Tracking number sent to backend:', trackingnumber);  // Debug log

  if (!trackingnumber) {
      alert('Please enter a valid tracking number');
      return;
  }

  fetch(`/api/shipments/${trackingnumber}`)
  .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log(data);  // Log the response data for debugging
          if (data) {  // Check if the data exists
              const shipment = data;
              const shipmentInfo = `
                  <tr>
                      <td>${shipment.trackingnumber}</td>
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
          alert('Error fetching shipment details');
      });
});
