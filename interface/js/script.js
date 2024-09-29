document.addEventListener('DOMContentLoaded', () => {
    const bookListElement = document.getElementById('book-list');

    // Fetch the book list from the API
    fetch('http://localhost:8000/api/v1/books?available=true') // Adjust the endpoint as necessary
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // console.log(response.json());
            
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
                `;
                bookListElement.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
        });
});

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
        rentedBooksTableBody.innerHTML = ''; // Clear previous content

        // Since the response is an array, iterate over it
        data.forEach((book, index) => {
            const bookRow = createBookRow(book, index);
            rentedBooksTableBody.appendChild(bookRow);
        });
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

