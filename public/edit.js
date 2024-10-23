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

function loadShipmentDetails(trackingnumber) {
    fetch(`/api/shipments/${trackingnumber}`)
        .then(response => response.json())
        .then(shipment => {
            if (shipment) {
                document.getElementById('shipmentOwner').value = shipment.shipmentOwner;
                document.getElementById('senderName').value = shipment.senderName;
                document.getElementById('sendFrom').value = shipment.sendFrom;
                document.getElementById('destination').value = shipment.destination;
                document.getElementById('status').value = shipment.status;
            } else {
                alert('Shipment not found');
            }
        })
        .catch(error => console.error('Error loading shipment details:', error));
}

function updateShipment(trackingnumber) {
    const shipmentOwner = document.getElementById('shipmentOwner').value;
    const senderName = document.getElementById('senderName').value;
    const sendFrom = document.getElementById('sendFrom').value;
    const destination = document.getElementById('destination').value;
    const status = document.getElementById('status').value;

    fetch(`/api/shipments/apiedit`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
