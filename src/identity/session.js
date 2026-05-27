// SESSION.JS
// Global session loader for all protected pages

// Returns the logged-in user object or null
function getCurrentUser() {
    const user = localStorage.getItem("sck_user");
    return user ? JSON.parse(user) : null;
}

// Redirect to login if no session exists
function requireLogin() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = "/src/identity/login.html";
    }

    return user;
}

// Load user session on protected pages
document.addEventListener("DOMContentLoaded", () => {
    const user = getCurrentUser();

    // Optional: Display user name in nav/header later
    if (user && document.querySelector(".nav-username")) {
        document.querySelector(".nav-username").textContent = user.Nickname || user.Email;
    }
});
