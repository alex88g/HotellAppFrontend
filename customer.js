// Function to fetch and display customers
function fetchCustomers() {
    const apiUrl = 'http://localhost:5037/Customer'; // API URL to fetch customers from

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(customers => {
        console.log('Customers:', customers);
        displayCustomers(customers);
    })
    .catch(error => {
        console.error('Error fetching customers:', error);
    });
}

// Function to display customers in the list
function displayCustomers(customers) {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = ''; // Clear any existing customers

    // Loop through the customers and add them to the customer list
    customers.forEach(customer => {
        const li = document.createElement('li');
        li.classList.add('customer-item');
        li.setAttribute('data-id', customer.id); // Add data-id to each customer item
        li.innerHTML = `Customer: <span class="customer-name">${customer.name}</span>`;

        // Optionally, add more customer details if needed
        if (customer.rooms && customer.rooms.length > 0) {
            li.innerHTML += ` (Rooms: ${customer.rooms.map(room => room.name).join(', ')})`;
        }

        // Create the Delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteCustomer(customer.id);  // Call deleteCustomer function
        li.appendChild(deleteButton);

            // Create the Update button
            const updateButton = document.createElement('button');
            updateButton.classList.add('update-btn');
            updateButton.textContent = 'Update';
            updateButton.onclick = () => {
                const newName = prompt("Enter the new name for the customer:", customer.name);
                if (newName) {
                    updateCustomer(customer.id, newName);  // Call updateCustomer function
                }
            };
            li.appendChild(updateButton);

        // Append the list item to the customer list
        customerList.appendChild(li);
    });
}
// Function to update the customer (sending PUT request)
function updateCustomer(customerId, newName) {
    const apiUrl = `http://localhost:5037/Customer/${customerId}`; // API URL to update the customer

    // Create the request body with the updated name
    const updatedCustomer = {
        name: newName // The API expects "name" in the request body
    };

    // Send the PUT request to update the customer
    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCustomer) // Convert the object to a JSON string
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            console.log('Updated Customer:', data);
            alert('Customer updated successfully');
            
            // Update the customer list on the page to reflect the new name
            updateCustomerInList(customerId, newName);
        } else {
            console.error('Failed to update customer');
            alert('Failed to update customer');
        }
    })
    .catch(error => {
        console.error('Error updating customer:', error);
        alert('Error updating customer');
    });
}

// Optional function to update the customer list displayed on the page
function updateCustomerInList(customerId, newName) {
    const customerList = document.getElementById('customerList');
    const customerItem = customerList.querySelector(`[data-id='${customerId}']`);
    
    if (customerItem) {
        const customerNameSpan = customerItem.querySelector('.customer-name');
        if (customerNameSpan) {
            customerNameSpan.textContent = newName; // Update the displayed name
        }
    }
}

// Function to delete the customer (sending DELETE request)
function deleteCustomer(customerId) {
    const apiUrl = `http://localhost:5037/Customer/${customerId}`; // API URL to delete the customer

    // Send the DELETE request to remove the customer
    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Deleted Customer:', customerId);
            alert('Customer deleted successfully');
            // Optionally, remove the customer from the displayed list after deletion
            removeCustomerFromList(customerId);
        } else {
            console.error('Failed to delete customer');
            alert('Failed to delete customer');
        }
    })
    .catch(error => {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer');
    });
}

// Optional function to remove the customer from the displayed list
function removeCustomerFromList(customerId) {
    const customerList = document.getElementById('customerList');
    const customerItem = customerList.querySelector(`[data-id='${customerId}']`);
    
    if (customerItem) {
        customerItem.remove();
    }
}

function addCustomer() {
    const customerName = document.getElementById('customerNameInput').value.trim();

    // Validate customer name input
    if (!customerName) {
        alert('Please enter a customer name.');
        return;
    }

    // API URL to add a customer
    const apiUrl = `http://localhost:5037/Customer?name=${encodeURIComponent(customerName)}`;

    // Send a POST request to the API
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json', // Expect plain text response
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Parse the plain text response
        })
        .then((data) => {
            console.log('Server Response:', data);
            alert(data); // Display the server's success or error message
            
            // Reload the page to reflect the new customer data
            location.reload(); // This will reload the page after the customer is added
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while adding the customer.'); // Display generic error message
        });
}

// Call the fetchCustomers function when the page loads
document.addEventListener('DOMContentLoaded', fetchCustomers);
