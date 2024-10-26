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

            // Add event listeners for delete buttons
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const trackingnumber = button.getAttribute('data-trackingnumber');
                    deleteShipment(trackingnumber); // Call delete function
                });
            });
        })
        .catch(error => console.error('Error fetching shipments:', error));
}

function deleteShipment(trackingnumber) {
    fetch(`/api/shipments/apiedit?trackingnumber=${trackingnumber}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        alert('Shipment deleted successfully!');
        fetchShipments(); // Refresh the list after deletion
    })
    .catch(error => console.error('Error deleting shipment:', error));
}
