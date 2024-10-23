document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const trackingnumber = urlParams.get('trackingnumber');

    if (trackingnumber) {
        loadShipmentDetails(trackingnumber);
    }

    const form = document.getElementById('edit-shipment-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        updateShipment(trackingnumber); // Pass trackingnumber
    });
});

// Load shipment details into the form
function loadShipmentDetails(trackingnumber) {
    fetch(`/api/shipments/${trackingnumber}`)
        .then(response => response.json())
        .then(shipment => {
            // Store the shipment ID from the fetched shipment
            shipmentId = shipment.id; // Ensure this line is correct

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

    // Log the details before sending the request
    console.log({
        id: shipmentId, // Use the correct shipment ID here
        trackingnumber,
        shipmentOwner,
        senderName,
        sendFrom,
        destination,
        status,
    });

    fetch(`/api/shipments/apiedit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: shipmentId, // Include the shipment ID
            trackingnumber,
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
        window.location.href = '/list.html'; // Redirect back to the list page
    })
    .catch(error => console.error('Error updating shipment:', error));
}
