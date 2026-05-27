// GLOBAL-IDENTITY.JS
// Provides a unified identity system across the entire website

// Returns the logged-in user or null
export function getUser() {
    const user = localStorage.getItem("sck_user");
    return user ? JSON.parse(user) : null;
}

// Logs the user out everywhere
export function logout() {
    localStorage.removeItem("sck_user");
    window.location.href = "/src/identity/login.html";
}

// Injects user identity into global UI elements
export function applyIdentityToUI() {
    const user = getUser();

    // Username in nav
    const nameEl = document.querySelector(".nav-username");
    if (nameEl) {
        nameEl.textContent = user ? (user.Nickname || user.Email) : "Guest";
    }

    // Avatar in nav
    const avatarEl = document.querySelector(".nav-avatar");
    if (avatarEl) {
        avatarEl.src = user && user.avatar
            ? user.avatar
            : "/src/assets/default-avatar.png";
    }

    // Logout button
    const logoutBtn = document.querySelector(".nav-logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
}

// Auto-run on every page
document.addEventListener("DOMContentLoaded", applyIdentityToUI);
