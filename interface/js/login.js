document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error('Login form not found');
        return;
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Get email and password values
        const email = document.getElementById('inputEmail').value;
        const password = document.getElementById('inputPassword').value;

        // Send the login request to your backend API
        fetch('http://localhost:8000/api/v1/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login
            console.log('Login successful:', data);

            // Optionally, save the authentication token (if received) to localStorage
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            // Redirect to another page, e.g., a dashboard
            window.location.href = 'index.html';
        })
        .catch(error => {
            // Handle errors (e.g., invalid credentials)
            console.error('Error:', error);
            alert('Login failed. Please check your credentials and try again.');
        });
    });
});