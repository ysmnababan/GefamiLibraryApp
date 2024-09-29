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