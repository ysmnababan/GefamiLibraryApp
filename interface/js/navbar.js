document.addEventListener('DOMContentLoaded', function() {
    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const logoutNav = document.getElementById('logoutNav');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if the user is logged in by checking the presence of a token in localStorage
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        // User is logged in, hide Login/Register, show Logout
        loginNav.style.display = 'none';
        registerNav.style.display = 'none';
        logoutNav.style.display = 'block';
    } else {
        // No user is logged in, show Login/Register, hide Logout
        loginNav.style.display = 'block';
        registerNav.style.display = 'block';
        logoutNav.style.display = 'none';
    }

    // Logout functionality: clear token and redirect to login page
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        // Clear token from localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('role');

        // Optionally, you can redirect the user to a index page after logout
        window.location.href = 'index.html';
    });
});
