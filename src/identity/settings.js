// SETTINGS.JS
// Temporary local-only profile system until Google Sheets integration

// Load saved profile data on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedProfile = JSON.parse(localStorage.getItem("sck_profile")) || {};

    if (savedProfile.nickname) {
        document.getElementById("nickname").value = savedProfile.nickname;
    }

    if (savedProfile.avatar) {
        document.getElementById("avatar").value = savedProfile.avatar;
    }

    if (savedProfile.primaryTeam) {
        document.getElementById("primaryTeam").value = savedProfile.primaryTeam;
    }

    if (savedProfile.secondaryTeam) {
        document.getElementById("secondaryTeam").value = savedProfile.secondaryTeam;
    }
});

// Handle form submission
document.getElementById("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedProfile = {
        nickname: document.getElementById("nickname").value.trim(),
        avatar: document.getElementById("avatar").value.trim(),
        primaryTeam: document.getElementById("primaryTeam").value,
        secondaryTeam: document.getElementById("secondaryTeam").value
    };

    // Save locally for now
    localStorage.setItem("sck_profile", JSON.stringify(updatedProfile));

    alert("Profile updated! (Temporary local save)");

    // Redirect back to profile page
    window.location.href = "/src/identity/profile.html";
});
