document.addEventListener('DOMContentLoaded', () => {
    const bookListElement = document.getElementById('book-list');

    // Fetch the book list from the API
    fetch('http://localhost:8000/api/v1/books?available=true') // Adjust the endpoint as necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear the existing book list
            bookListElement.innerHTML = '';

            // Loop through the fetched data and create table rows
            data.forEach((book, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.quantity}</td>
                    <td>${book.publisher}</td>
                    <td>
                        <button class="btn btn-primary rent-button" ${!isUserLoggedIn() || isAdminUser() ? 'disabled' : ''}>
                            Rent
                        </button>
                    </td>
                `;

                // Attach event listener for the rent button
                const rentButton = row.querySelector('.rent-button');
                rentButton.addEventListener('click', () => {
                    rentBook(book);
                });

                bookListElement.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });
});

// Function to determine if a user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('authToken') !== null; // Check if the token exists
}

// Function to check if the logged-in user is an admin
function isAdminUser() {
    return localStorage.getItem('role') === 'admin'; // Check user role
}

function rentBook(book) {
    const bookId = book.id; 
    const today = new Date();
    const returnTime = new Date(today);
    returnTime.setDate(today.getDate() + 3); // Set return time to 3 days from today

    const requestBody = {
        return_time: returnTime.toISOString() // Format to ISO string
    };

    // API URL for borrowing the book
    const apiUrl = `http://localhost:8000/api/v1/borrow/${bookId}/`;

    // Fetch call to borrow the book
    fetch(apiUrl, {
        method: 'POST', // Assuming the method is POST to borrow
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}` // Include the token
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Error borrowing book');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Book borrowed successfully:', data);
        alert(`Successfully borrowed "${book.name}"! Return by ${returnTime.toLocaleString()}`);
        // Optionally, refresh the book list or update the UI
    })
    .catch(error => {
        console.error('Error borrowing book:', error);
        alert(error.message); // Show error message to the user
    });
}


////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the user's role and token from local storage
    const userRole = localStorage.getItem('role'); // Example: 'user' or 'admin'
    const token = localStorage.getItem('authToken'); // Make sure the token is stored in local storage

    let apiUrl = '';
    if (userRole === 'user') {
        apiUrl = 'http://localhost:8000/api/v1/books?user_borrowed=true';
    } else if (userRole === 'admin') {
        apiUrl = 'http://localhost:8000/api/v1/books?borrowed=true';
    } else {
        //document.getElementById('rentedBooks').innerText = 'No role found. Please log in.';
        return;
    }
    // Fetch data with the token in the Authorization header
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}` // Include the token in the headers
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        return response.json();
    })
    .then(data => {
        const rentedBooksTableBody = document.getElementById('rentedBooks');
        const returnButton = document.getElementById('returnButton');

        rentedBooksTableBody.innerHTML = ''; // Clear previous content

        // Since the response is an array, iterate over it
        data.forEach((book, index) => {
            const bookRow = createBookRow(book, index);
            rentedBooksTableBody.appendChild(bookRow);
        });
        if (data.length>0 && (userRole === 'user')) {
            returnButton.style.display = 'block'; // Show the return button
        console.log("Return button is visible"); // Debug log
        } else {
            returnButton.style.display = 'none'; // Hide the return button
            console.log("Return button is hidden"); // Debug log
        }
        
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        document.getElementById('rentedBooks').innerText = 'Error loading rented books. Please try again later.';
    });

});


// Function to create book element
// Function to create a table row for the book
function createBookRow(book, index) {
    const bookRow = document.createElement('tr');

    // Structure for displaying book details in table format
    bookRow.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${book.book}</td>
        <td>${new Date(book.borrowed_time).toLocaleString()}</td>
        <td>${new Date(book.return_time).toLocaleString()}</td>
        <td>${book.actual_return_time ? new Date(book.actual_return_time).toLocaleString() : 'Not returned yet'}</td>
        <td>${book.deadline_status}</td>
    `;

    
    return bookRow;
}

////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
    const userRole = localStorage.getItem('role');
    const token = localStorage.getItem('authToken');
    // const rentedBooksTableBody = document.getElementById('rentedBooks');
    const returnButton = document.getElementById('returnButton');

    // Check if user is logged in as 'user'
    if (userRole === 'user') {
        checkReturnButtonVisibility(); // Check visibility initially
    } else {
        returnButton.style.display = 'none'; // Hide the return button for non-users
    }
});

// Function to check the visibility of the return button
function checkReturnButtonVisibility() {
    const rentedBooksTableBody = document.getElementById('rentedBooks');
    const returnButton = document.getElementById('returnButton');

    // Check if there are any rows in the rentedBooks table
    if (rentedBooksTableBody.rows.length > 0) {
        returnButton.style.display = 'block'; // Show the return button
        console.log("Return button is visible"); // Debug log
    } else {
        returnButton.style.display = 'none'; // Hide the return button
        console.log("Return button is hidden"); // Debug log
    }
}

// Function to handle returning a book
function returnBook() {
    const apiUrl = 'http://localhost:8000/api/v1/return/';

    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({}) // No body required
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to return book');
        }
        return response.json();
    })
    .then(data => {
        alert('Book returned successfully!');
        checkReturnButtonVisibility(); // Check button visibility after clearing
    })
    .catch(error => {
        console.error('Error returning book:', error);
        alert(error.message);
    });
};