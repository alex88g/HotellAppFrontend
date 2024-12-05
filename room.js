// Function to fetch and display rooms
function fetchRooms() {
    const apiUrl = 'http://localhost:5037/Room'; // API URL to fetch rooms from

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(rooms => {
        console.log('Rooms:', rooms);
        displayRooms(rooms);
    })
    .catch(error => {
        console.error('Error fetching rooms:', error);
    });
}

// Function to display rooms in the hotel list
function displayRooms(rooms) {
    const roomList = document.getElementById('roomList');
    roomList.innerHTML = ''; // Clear any existing rooms

    // Loop through the rooms and add them to the room list
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('room-item');
        li.dataset.roomId = room.id; // Add the room ID to the list item
        li.textContent = `Room: ${room.name}`;

        // Optionally, add more room details if needed
        if (room.hotel) {
            li.textContent += ` (Hotel: ${room.hotel.name})`;
        }

        // Add a delete button for each room
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteRoom(room.id);  // Call deleteRoom function
        li.appendChild(deleteButton);

        // Add an update button for each room
        const updateButton = document.createElement('button');
        updateButton.className = 'update-btn';
        updateButton.textContent = 'Update';
        updateButton.onclick = () => showEditForm(room);  // Call showEditForm function
        li.appendChild(updateButton);

        // Append the list item to the room list
        roomList.appendChild(li);
    });
}

// Function to show the edit form when the Update button is clicked
function showEditForm(room) {
    // Open a prompt to ask the user for the new room name
    const newRoomName = prompt('Enter the new room name:', room.name);

    // If the user entered a new name (i.e., not canceled), update the room
    if (newRoomName && newRoomName !== room.name) {
        updateRoom(room.id, newRoomName); // Call updateRoom with the new name
    }
}

// Function to update the room with a PUT request
function updateRoom(roomId, newName) {
    const apiUrl = `http://localhost:5037/Room/${roomId}`; // API URL to update the room

    // Create the request body with the updated name
    const updatedRoom = {
        name: newName // The API expects "name" in the request body
    };

    // Send the PUT request to update the room
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedRoom) // Convert the object to a JSON string
    })
    .then(response => response.json())
    .then(data => {
        console.log('Updated Room:', data);
        alert('Room updated successfully');
        
        // Now, update the room list on the page to reflect the new name
        updateRoomInList(roomId, newName);
    })
    .catch(error => {
        console.error('Error updating room:', error);
    });
}

// Function to update the room in the displayed list (after successful update)
function updateRoomInList(roomId, newName) {
    const roomList = document.getElementById('roomList');
    const roomItems = roomList.getElementsByClassName('room-item');

    // Loop through all the room items and find the one that needs to be updated
    for (let li of roomItems) {
        if (li.dataset.roomId == roomId) {
            // Update the room name in the list item, without removing buttons
            li.firstChild.textContent = `Room: ${newName}`;

            break; // Exit the loop once we've updated the right room
        }
    }
}

// Function to delete a room
function deleteRoom(roomId) {
    const apiUrl = `http://localhost:5037/Room/${roomId}`; // API URL to delete the room

    // Send the DELETE request to remove the room
    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Room deleted successfully');
            fetchRooms(); // Refresh the room list after deletion
        } else {
            alert('Error deleting room');
        }
    })
    .catch(error => {
        console.error('Error deleting room:', error);
    });
}

// Function to add a new room using a POST request
function addRoom() {
    const roomName = document.getElementById('roomNameInput').value; // Get the room name from the input field

    // If the room name is empty, show an alert
    if (!roomName) {
        alert('Please enter a room name.');
        return;
    }

    const apiUrl = `http://localhost:5037/Room?name=${encodeURIComponent(roomName)}`; // API URL to add the new room

    // Send the POST request to create the new room
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('New Room:', data);
        alert('Room added successfully');
        fetchRooms(); // Refresh the room list after adding the new room
    })
    .catch(error => {
        console.error('Error adding room:', error);
    });
}

// Call the fetchRooms function when the page loads
document.addEventListener('DOMContentLoaded', fetchRooms);
