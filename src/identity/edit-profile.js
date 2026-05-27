// EDIT-PROFILE.JS
// Advanced profile editor with live preview

document.addEventListener("DOMContentLoaded", () => {
    const savedProfile = JSON.parse(localStorage.getItem("sck_profile")) || {};

    const avatarPreview = document.getElementById("avatarPreview");
    const avatarInput = document.getElementById("avatarInput");
    const nicknameInput = document.getElementById("nicknameInput");
    const primaryTeamInput = document.getElementById("primaryTeamInput");
    const secondaryTeamInput = document.getElementById("secondaryTeamInput");
    const saveBtn = document.getElementById("saveProfileBtn");

    // Load existing profile data
    if (savedProfile.avatar) {
        avatarPreview.src = savedProfile.avatar;
        avatarInput.value = savedProfile.avatar;
    }

    if (savedProfile.nickname) {
        nicknameInput.value = savedProfile.nickname;
    }

    if (savedProfile.primaryTeam) {
        primaryTeamInput.value = savedProfile.primaryTeam;
    }

    if (savedProfile.secondaryTeam) {
        secondaryTeamInput.value = savedProfile.secondaryTeam;
    }

    // Live avatar preview
    avatarInput.addEventListener("input", () => {
        avatarPreview.src = avatarInput.value.trim() || "/src/assets/default-avatar.png";
    });

    // Save profile
    saveBtn.addEventListener("click", () => {
        const updatedProfile = {
            nickname: nicknameInput.value.trim(),
            avatar: avatarInput.value.trim(),
            primaryTeam: primaryTeamInput.value,
            secondaryTeam: secondaryTeamInput.value
        };

        localStorage.setItem("sck_profile", JSON.stringify(updatedProfile));

        alert("Profile updated!");

        window.location.href = "/src/identity/profile.html";
    });
});
