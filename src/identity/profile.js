// PROFILE.JS
// Loads saved profile data and updates the profile page

document.addEventListener("DOMContentLoaded", () => {
    const savedProfile = JSON.parse(localStorage.getItem("sck_profile")) || {};

    // Update nickname
    if (savedProfile.nickname) {
        document.querySelector(".profile-name").textContent = savedProfile.nickname;
    } else {
        document.querySelector(".profile-name").textContent = "Player Name";
    }

    // Update team
    if (savedProfile.primaryTeam) {
        document.querySelector(".profile-team").textContent = savedProfile.primaryTeam;
    } else {
        document.querySelector(".profile-team").textContent = "Team Name";
    }

    // Update avatar
    if (savedProfile.avatar) {
        document.querySelector(".profile-avatar").src = savedProfile.avatar;
    } else {
        document.querySelector(".profile-avatar").src = "/src/assets/default-avatar.png";
    }
});
