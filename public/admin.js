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

    // Debugging log
    console.log(shipmentData);

    // Check if we are editing or adding a new shipment
    const isEditing = !!shipmentData.trackingnumber; // Ensure you're editing

    // Send POST or PUT request to the API endpoint
    fetch('/api/shipments/addShipment', {
        method: isEditing ? 'POST' : 'PUT', // Use POST for updates
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
                alert(isEditing ? 'Shipment updated successfully!' : 'Shipment added successfully!');
                document.getElementById('addShipmentForm').reset();
                fetchShipments(); // Refresh the shipment list
            } else {
                alert('Error: ' + (data.message || 'Unknown error occurred'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding/updating the shipment.');
        });
});

document.addEventListener('DOMContentLoaded', function () {
    fetchShipments();
});

// Fetch and display existing shipments
function fetchShipments() {
    fetch('/api/shipments') // Adjust this endpoint to match your API
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('shipments-list').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Clear existing entries

            data.forEach(shipment => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${shipment.trackingnumber}</td>
                    <td>${shipment.shipmentOwner}</td>
                    <td>${shipment.senderName}</td>
                    <td>${shipment.sendFrom}</td>
                    <td>${shipment.destination}</td>
                    <td>${shipment.status}</td>
                    <td>
                        <button class="edit-button" data-trackingnumber="${shipment.trackingnumber}">Edit</button>
                        <button class="delete-button" data-trackingnumber="${shipment.trackingnumber}">Delete</button>
                    </td>
                `;
            });
        })
        .catch(error => console.error('Error fetching shipments:', error));
}

// Edit shipment (you can implement the functionality to redirect to the edit page)
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-button')) {
        const trackingnumber = e.target.getAttribute('data-trackingnumber');
        window.location.href = `/edit.html?trackingnumber=${trackingnumber}`; // Redirect to an edit page
    }

    // Delete shipment
    if (e.target.classList.contains('delete-button')) {
        const trackingnumber = e.target.getAttribute('data-trackingnumber');
        if (confirm(`Are you sure you want to delete the shipment with tracking number ${trackingnumber}?`)) {
            fetch(`/api/shipments/${trackingnumber}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                alert('Shipment deleted successfully!');
                fetchShipments(); // Refresh the list
            })
            .catch(error => console.error('Error deleting shipment:', error));
        }
    }
});
