export function getUser() {
    const user = localStorage.getItem("sck_user");
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem("sck_user");
    window.location.href = "index.html";
}

export function applyIdentityToUI() {
    const user = getUser();
    const defaultAvatar = "src/assets/default-avatar.png";

    const ids = {
        login: ["nav-login", "mobile-login"],
        profile: ["nav-profile", "mobile-profile"],
        logout: ["nav-logout", "mobile-logout"],
        avatar: ["nav-avatar", "mobile-avatar"]
    };

    if (user) {
        ids.login.forEach(id => document.getElementById(id)?.classList.add("hidden"));
        ids.profile.forEach(id => document.getElementById(id)?.classList.remove("hidden"));
        ids.logout.forEach(id => document.getElementById(id)?.classList.remove("hidden"));
        ids.avatar.forEach(id => document.getElementById(id).src = user.avatar || defaultAvatar);
    } else {
        ids.login.forEach(id => document.getElementById(id)?.classList.remove("hidden"));
        ids.profile.forEach(id => document.getElementById(id)?.classList.add("hidden"));
        ids.logout.forEach(id => document.getElementById(id)?.classList.add("hidden"));
        ids.avatar.forEach(id => document.getElementById(id).src = defaultAvatar);
    }

    document.getElementById("nav-logout")?.addEventListener("click", logout);
    document.getElementById("mobile-logout")?.addEventListener("click", logout);
}
