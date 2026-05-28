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
    window.location.href = "/Steel-City-Kickball/index.html";
}

// Injects user identity into global UI elements
export function applyIdentityToUI() {
    const user = getUser();

    // ============================
    // DESKTOP ELEMENTS
    // ============================
    const navLogin = document.getElementById("nav-login");
    const navProfile = document.getElementById("nav-profile");
    const navLogout = document.getElementById("nav-logout");
    const navAvatar = document.getElementById("nav-avatar");

    // ============================
    // MOBILE ELEMENTS
    // ============================
    const mobileLogin = document.getElementById("mobile-login");
    const mobileProfile = document.getElementById("mobile-profile");
    const mobileLogout = document.getElementById("mobile-logout");
    const mobileAvatar = document.getElementById("mobile-avatar");

    // ============================
    // APPLY USER STATE
    // ============================
    if (user) {
        // Desktop
        if (navLogin) navLogin.classList.add("hidden");
        if (navProfile) navProfile.classList.remove("hidden");
        if (navLogout) navLogout.classList.remove("hidden");
        if (navAvatar) navAvatar.src = user.avatar || "/Steel-City-Kickball/src/assets/default-avatar.png";

        // Mobile
        if (mobileLogin) mobileLogin.classList.add("hidden");
        if (mobileProfile) mobileProfile.classList.remove("hidden");
        if (mobileLogout) mobileLogout.classList.remove("hidden");
        if (mobileAvatar) mobileAvatar.src = user.avatar || "/Steel-City-Kickball/src/assets/default-avatar.png";

    } else {
        // Desktop
        if (navLogin) navLogin.classList.remove("hidden");
        if (navProfile) navProfile.classList.add("hidden");
        if (navLogout) navLogout.classList.add("hidden");
        if (navAvatar) navAvatar.src = "/Steel-City-Kickball/src/assets/default-avatar.png";

        // Mobile
        if (mobileLogin) mobileLogin.classList.remove("hidden");
        if (mobileProfile) mobileProfile.classList.add("hidden");
        if (mobileLogout) mobileLogout.classList.add("hidden");
        if (mobileAvatar) mobileAvatar.src = "/Steel-City-Kickball/src/assets/default-avatar.png";
    }

    // ============================
    // LOGOUT HANDLERS
    // ============================
    if (navLogout) navLogout.addEventListener("click", logout);
    if (mobileLogout) mobileLogout.addEventListener("click", logout);
}

// Auto-run on every page
document.addEventListener("DOMContentLoaded", applyIdentityToUI);
