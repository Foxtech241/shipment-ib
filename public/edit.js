document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingnumber = urlParams.get('trackingnumber');
    if (trackingnumber) {
        loadShipmentDetails(trackingnumber);
    }

    const form = document.getElementById('edit-shipment-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateShipment(trackingnumber);
    });
});

// Load shipment details into form
function loadShipmentDetails(trackingnumber) {
    fetch(`/api/shipments/${trackingnumber}`)
        .then(response => response.json())
        .then(shipment => {
            document.getElementById('shipmentOwner').value = shipment.shipmentOwner;
            document.getElementById('senderName').value = shipment.senderName;
            document.getElementById('sendFrom').value = shipment.sendFrom;
            document.getElementById('destination').value = shipment.destination;
            document.getElementById('status').value = shipment.status;
        })
        .catch(error => console.error('Error loading shipment details:', error));
}

// Update shipment data
function updateShipment(trackingnumber) {
    const shipmentOwner = document.getElementById('shipmentOwner').value;
    const senderName = document.getElementById('senderName').value;
    const sendFrom = document.getElementById('sendFrom').value;
    const destination = document.getElementById('destination').value;
    const status = document.getElementById('status').value;

    fetch(`/api/shipments/apiedit?trackingnumber=${trackingnumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shipmentOwner,
            senderName,
            sendFrom,
            destination,
            status,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Shipment updated successfully!');
        window.location.href = '/list.html'; // Redirect back to list page
    })
    .catch(error => console.error('Error updating shipment:', error));
}
