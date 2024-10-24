document.addEventListener('DOMContentLoaded', function () {
    fetchShipments();
});

function fetchShipments() {
    fetch('/api/shipments/apilist')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                console.log('No shipments found.');
                return;
            }
            const tbody = document.getElementById('shipments-list').getElementsByTagName('tbody')[0];
            tbody.innerHTML = ''; // Clear any existing rows

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

            // Add event listeners for the edit buttons
            const editButtons = document.querySelectorAll('.edit-button');
            editButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const trackingnumber = button.getAttribute('data-trackingnumber');
                    window.location.href = `/edit.html?trackingnumber=${trackingnumber}`; // Redirect to edit page
                });
            });

        })
        .catch(error => console.error('Error fetching shipments:', error));
}

// Delete a shipment
function deleteShipment(trackingnumber) {
    if (confirm('Are you sure you want to delete this shipment?')) {
        fetch(`/api/shipments/${trackingnumber}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Shipment deleted successfully');
            // Remove the deleted shipment from the list without refreshing
            fetchShipments();
        })
        .catch(error => console.error('Error deleting shipment:', error));
    }
} 