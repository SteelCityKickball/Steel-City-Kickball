// Your Apps Script Web App URL
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbyTQYyErJ-TfOxdV99vC8w2PqpEEMT5o5ZIZb5CYckheDG_4USllAIM_F8vkuJcXlzG/exec";

const DEFAULT_AVATAR = "src/assets/default-avatar.png";

// -------------------------------
// MAIN UI UPDATE FUNCTION
// -------------------------------
async function applyIdentityToUI() {
  const email = localStorage.getItem("sck_user_email");

  // Desktop elements
  const navGoogleLogin = document.getElementById("nav-google-login");
  const navUser = document.getElementById("nav-user");
  const navName = document.getElementById("nav-name");
  const navAvatar = document.getElementById("nav-avatar");
  const navLogoutBtn = document.getElementById("nav-logout-btn");

  // Mobile elements
  const mobileGoogleLogin = document.getElementById("mobile-google-login");
  const mobileAvatar = document.getElementById("mobile-avatar");
  const mobileName = document.getElementById("mobile-name");
  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  const mobileProfileRow = document.getElementById("mobile-profile-row");

  // -------------------------------
  // NOT LOGGED IN
  // -------------------------------
  if (!email) {
    // Desktop
    if (navGoogleLogin) navGoogleLogin.style.display = "block";
    if (navUser) navUser.style.display = "none";
    if (navLogoutBtn) navLogoutBtn.style.display = "none";

    // Mobile
    if (mobileGoogleLogin) mobileGoogleLogin.style.display = "block";
    if (mobileAvatar) mobileAvatar.style.display = "none";
    if (mobileName) mobileName.style.display = "none";
    if (mobileLogoutBtn) mobileLogoutBtn.style.display = "none";
    if (mobileProfileRow) mobileProfileRow.style.display = "none";

    return;
  }

  // -------------------------------
  // LOGGED IN — FETCH PROFILE
  // -------------------------------
  let profile = null;
  try {
    const res = await fetch(
      `${WEB_APP_URL}?action=getProfile&email=${encodeURIComponent(email)}`
    );
    profile = await res.json();
  } catch (e) {
    console.error("Profile fetch failed:", e);
  }

  const displayName = profile?.name || email;
  const avatarUrl = profile?.avatarUrl || DEFAULT_AVATAR;

  // -------------------------------
  // UPDATE DESKTOP UI
  // -------------------------------
  if (navUser) {
    navUser.style.display = "flex";
    if (navName) navName.textContent = displayName;
    if (navAvatar) navAvatar.src = avatarUrl;
  }
  if (navGoogleLogin) navGoogleLogin.style.display = "none";
  if (navLogoutBtn) navLogoutBtn.style.display = "inline-block";

  // -------------------------------
  // UPDATE MOBILE UI
  // -------------------------------
  if (mobileAvatar) {
    mobileAvatar.style.display = "block";
    mobileAvatar.src = avatarUrl;
  }
  if (mobileName) {
    mobileName.style.display = "inline";
    mobileName.textContent = displayName;
  }
  if (mobileGoogleLogin) mobileGoogleLogin.style.display = "none";
  if (mobileLogoutBtn) mobileLogoutBtn.style.display = "inline-block";
  if (mobileProfileRow) mobileProfileRow.style.display = "list-item";

  // -------------------------------
  // COMMISSIONER REDIRECT
  // -------------------------------
  try {
    const check = await fetch(
      `${WEB_APP_URL}?action=checkRole&email=${encodeURIComponent(email)}`
    ).then(r => r.json());

    if (check.status === "ok" && check.role === "commissioner") {
      if (!window.location.pathname.includes("/commissioner/")) {
        window.location.href =
          "/Steel-City-Kickball/commissioner/commissioner.html";
      }
    }
  } catch (e) {
    console.error("Role check failed:", e);
  }
}

// -------------------------------
// GOOGLE LOGIN CALLBACK
// -------------------------------
function handleCredentialResponse(response) {
  try {
    const payload = JSON.parse(atob(response.credential.split(".")[1]));
    const email = payload.email;

    localStorage.setItem("sck_user_email", email);
    window.location.reload();
  } catch (e) {
    console.error("Failed to parse Google credential:", e);
  }
}

// -------------------------------
// LOGOUT
// -------------------------------
function logout() {
  localStorage.removeItem("sck_user_email");
  window.location.reload();
}

// Expose globally
window.applyIdentityToUI = applyIdentityToUI;
window.handleCredentialResponse = handleCredentialResponse;
window.logout = logout;
