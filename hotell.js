// Define the API endpoint for PUT request
const apiUrl = "http://localhost:5037/Hotel";

// Fetch data from the API
fetch(apiUrl, {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);
        displayHotels(data);  // Call displayHotels to display fetched hotels
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to display hotels in the list
function displayHotels(hotels) {
    const hotelList = document.getElementById('hotelList');
    hotelList.innerHTML = '';  // Clear current list before displaying new data
    hotels.forEach(hotel => {
        const listItem = document.createElement('li');
        listItem.className = 'hotel-item';
        listItem.textContent = `Hotel: ${hotel.name} (ID: ${hotel.id})`;

        // Add a delete button for each hotel
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteHotel(hotel.id);  // Call deleteHotel function
        listItem.appendChild(deleteButton);

        // Add an update button for each hotel
        const updateButton = document.createElement('button');
        updateButton.className = 'update-btn';
        updateButton.textContent = 'Update';
        updateButton.onclick = () => updateHotel(hotel.id);  // Call updateHotel function
        listItem.appendChild(updateButton);

        hotelList.appendChild(listItem);
    });
}

// Function to add a new hotel
function addHotel() {
    const hotelName = document.getElementById('hotelName').value;
    if (!hotelName) {
        alert("Please enter a hotel name.");
        return;
    }

    const postApiUrl = `http://localhost:5037/Hotel?name=${hotelName}`;

    // Send POST request to add new hotel
    fetch(postApiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: Date.now(),
            name: hotelName,
            rooms: []
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Created hotel:', data);
        // Optionally, refresh the hotel list after creating a new one
        fetch(apiUrl)
            .then(response => response.json())
            .then(updatedData => displayHotels(updatedData));
    })
    .catch(error => {
        console.error('Error posting data:', error);
    });
}

// Function to delete a hotel
function deleteHotel(hotelId) {
    const deleteApiUrl = `http://localhost:5037/Hotel/${hotelId}`;

    // Send DELETE request to remove hotel
    fetch(deleteApiUrl, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Deleted hotel with ID: ${hotelId}`);
        // Optionally, refresh the hotel list after deleting the hotel
        fetch(apiUrl)
            .then(response => response.json())
            .then(updatedData => displayHotels(updatedData));
    })
    .catch(error => {
        console.error('Error deleting hotel:', error);
    });
}

// Function to update a hotel
function updateHotel(hotelId) {
    const newHotelName = prompt("Enter the new hotel name:");

    if (!newHotelName) {
        alert("Please enter a valid hotel name.");
        return;
    }

    const updateApiUrl = `http://localhost:5037/Hotel/${hotelId}`;

    // Send PUT request to update hotel
    fetch(updateApiUrl, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: newHotelName
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(`Updated hotel with ID: ${hotelId}`);
        // Optionally, refresh the hotel list after updating the hotel
        fetch(apiUrl)
            .then(response => response.json())
            .then(updatedData => displayHotels(updatedData));
    })
    .catch(error => {
        console.error('Error updating hotel:', error);
    });
}
