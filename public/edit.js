document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const trackingnumber = params.get('trackingnumber');
    
    if (trackingnumber) {
        fetchShipmentDetails(trackingnumber);
    }

    // Handle form submission
    const form = document.getElementById('edit-shipment-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateShipment(trackingnumber);
    });
});

// Fetch shipment details
function fetchShipmentDetails(trackingnumber) {
    fetch(`/api/shipments/${trackingnumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(shipment => {
            // Fill the form with shipment details
            document.getElementById('trackingnumber').value = shipment.trackingnumber;
            document.getElementById('shipmentOwner').value = shipment.shipmentOwner;
            document.getElementById('senderName').value = shipment.senderName;
            document.getElementById('sendFrom').value = shipment.sendFrom;
            document.getElementById('destination').value = shipment.destination;
            document.getElementById('status').value = shipment.status;
        })
        .catch(error => console.error('Error fetching shipment details:', error));
}

// Update shipment
function updateShipment(trackingnumber) {
    const shipmentData = {
        shipmentOwner: document.getElementById('shipmentOwner').value,
        senderName: document.getElementById('senderName').value,
        sendFrom: document.getElementById('sendFrom').value,
        destination: document.getElementById('destination').value,
        status: document.getElementById('status').value
    };

    fetch(`/api/shipments/${trackingnumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(shipmentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        alert('Shipment updated successfully!');
        window.location.href = 'list.html'; // Redirect back to the list page
    })
    .catch(error => console.error('Error updating shipment:', error));
}
