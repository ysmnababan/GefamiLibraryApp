document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const username = document.getElementById('inputName').value;
    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;
    const confirmPassword = document.getElementById('inputConfirmPassword').value;

    // Validate that password and confirm password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Create the registration data
    const registrationData = {
        username: username,
        email: email,
        password: password,
        role: 'user'
    };

    // Clear previous error messages
    const errorMessagesDiv = document.getElementById('errorMessages');
    errorMessagesDiv.style.display = 'none'; 
    errorMessagesDiv.innerHTML = ''; 

    // Send the data to the backend
    fetch('http://localhost:8000/api/v1/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
               
                throw err; // Throw the error object to be caught in the catch block
            });
        }
        return response.json(); 
    })
    .then(data => {
        
        alert("Registration successful! Redirecting to login page.");
        window.location.href = 'login.html'; 
    })
    .catch(error => {
        // Handle failure and display error messages
        console.error("Error during registration:", error);
        
        // Show error messages in the error messages div
        for (const [key, messages] of Object.entries(error)) {
            messages.forEach(message => {
                const errorItem = document.createElement('div');
                errorItem.innerText = message; 
                errorMessagesDiv.appendChild(errorItem); 
            });
        }

        // Display the error messages div
        errorMessagesDiv.style.display = 'block';
    });
});
