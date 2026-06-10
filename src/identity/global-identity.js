// Your Apps Script Web App URL (backend)
const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbzhvyWQ0noFPBWymncwEW1-Qf6r--kbIDfvi_lgFkIBC3hm-RHsbmFxBSCVqZhiVuJm/exec";

// Commissioner dashboard hosted in GitHub Pages
const COMMISSIONER_URL =
  "https://steelcitykickball.github.io/Steel-City-Kickball/commissioner/commissioner.html";

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

  // Helper functions
  const show = el => el && el.classList.remove("hidden");
  const hide = el => el && el.classList.add("hidden");

  // -------------------------------
  // NOT LOGGED IN
  // -------------------------------
  if (!email) {
    // Desktop
    show(navGoogleLogin);
    hide(navUser);
    hide(navLogoutBtn);

    // Mobile
    show(mobileGoogleLogin);
    hide(mobileAvatar);
    hide(mobileName);
    hide(mobileLogoutBtn);
    hide(mobileProfileRow);

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
    show(navUser);
    if (navName) navName.textContent = displayName;
    if (navAvatar) navAvatar.src = avatarUrl;
  }
  hide(navGoogleLogin);
  show(navLogoutBtn);

  // -------------------------------
  // UPDATE MOBILE UI
  // -------------------------------
  if (mobileAvatar) {
    show(mobileAvatar);
    mobileAvatar.src = avatarUrl;
  }
  if (mobileName) {
    show(mobileName);
    mobileName.textContent = displayName;
  }
  hide(mobileGoogleLogin);
  show(mobileLogoutBtn);
  show(mobileProfileRow);

  // -------------------------------
  // COMMISSIONER REDIRECT
  // -------------------------------
  try {
    const check = await fetch(
      `${WEB_APP_URL}?action=checkRole&email=${encodeURIComponent(email)}`
    ).then(r => r.json());

    if (check.status === "ok" && check.role === "commissioner") {
      // Prevent redirect loop if already on commissioner page
      if (!window.location.href.includes("/commissioner/commissioner.html")) {
        window.location.href = COMMISSIONER_URL;
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
