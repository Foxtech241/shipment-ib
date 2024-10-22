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

// Edit shipment
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-button')) {
        const trackingnumber = e.target.getAttribute('data-trackingnumber');
        window.location.href = `/edit.html?trackingnumber=${trackingnumber}`; // Redirect to edit page
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
