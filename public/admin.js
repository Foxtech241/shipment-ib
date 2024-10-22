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
  
  // Fetch and display existing shipments on page load
function fetchShipments() {
    fetch('/api/shipments') // Adjust this endpoint to match your API
      .then(response => response.json())
      .then(data => {
        const tbody = document.getElementById('shipments-list').getElementsByTagName('tbody')[0];
        tbody.innerHTML = ''; // Clear existing entries
  
        data.forEach(shipment => {
          const row = tbody.insertRow();
          row.innerHTML = `
            <td>${shipment.shipmentOwner}</td>
            <td>${shipment.senderName}</td>
            <td>${shipment.sendFrom}</td>
            <td>${shipment.destination}</td>
            <td>${shipment.status}</td>
            <td>${shipment.trackingnumber}</td>
            <td>
              <button class="edit-button" data-trackingnumber="${shipment.trackingnumber}">Edit</button>
            </td>
          `;
        });
      })
      .catch(error => console.error('Error fetching shipments:', error));
  }
  
  // Call fetchShipments on page load
  fetchShipments();
  
  // Edit shipment
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-button')) {
      const trackingnumber = e.target.getAttribute('data-trackingnumber');
      // Fetch shipment data based on trackingnumber
      fetch(`/api/shipments/${trackingnumber}`)
        .then(response => response.json())
        .then(shipment => {
          // Populate the form with shipment data
          document.getElementById('trackingnumber').value = shipment.trackingnumber;
          document.getElementById('shipmentOwner').value = shipment.shipmentOwner;
          document.getElementById('senderName').value = shipment.senderName;
          document.getElementById('sendFrom').value = shipment.sendFrom;
          document.getElementById('destination').value = shipment.destination;
          document.getElementById('status').value = shipment.status;
          document.getElementById('weight').value = shipment.weight;
          document.getElementById('shippingPrice').value = shipment.shippingPrice;
          document.getElementById('receiverName').value = shipment.receiverName;
          document.getElementById('receiverAddress').value = shipment.receiverAddress;
          document.getElementById('methodOfShipping').value = shipment.methodOfShipping;
          document.getElementById('pickupAirport').value = shipment.pickupAirport;
          document.getElementById('timeGoodsLeftCompany').value = shipment.timeGoodsLeftCompany || '';
  
          // Optionally, change the button text to "Update Shipment"
          document.getElementById('addShipmentForm').querySelector('button[type="submit"]').textContent = 'Update Shipment';
        })
        .catch(error => console.error('Error fetching shipment details:', error));
    }
  });
  
  // Admin.js - Modify the event listener for editing
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
  
    // Check if we are editing or adding a new shipment
    const isEditing = shipmentData.trackingnumber; // Ensure you're editing
  
    // Send PUT request to the API endpoint
    fetch('/api/shipments/addShipment', {
      method: isEditing ? 'PUT' : 'POST', // Use PUT for updates
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
          alert('Shipment updated successfully!');
          document.getElementById('addShipmentForm').reset();
        } else {
          alert('Error: ' + (data.message || 'Unknown error occurred'));
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the shipment.');
      });
  });
  