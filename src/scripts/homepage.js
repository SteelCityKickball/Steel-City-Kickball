// Single source of truth: Apps Script Web App
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTQYyErJ-TfOxdV99vC8w2PqpEEMT5o5ZIZb5CYckheDG_4USllAIM_F8vkuJcXlzG/exec";

// --- GitHub helper for images (you already use this pattern) ---
async function getLatestFromGitHub(path) {
  const apiUrl = `https://api.github.com/repos/SteelCityKickball/Steel-City-Kickball/contents/${path}`;
  const response = await fetch(apiUrl);
  const files = await response.json();

  const images = files.filter(f =>
    f.name.match(/\.(jpg|jpeg|png|gif)$/i)
  );

  images.sort((a, b) => b.name.localeCompare(a.name));
  return images;
}

// --- Load text from Apps Script (Homepage sheet) ---
async function loadHomepageContent() {
  try {
    const res = await fetch(`${WEB_APP_URL}?action=getHomepageContent`);
    const data = await res.json();

    // Commissioner Message
    const commissionerEl = document.getElementById("commissioner-message");
    if (commissionerEl) {
      commissionerEl.textContent =
        data.CommissionerMessage || "No commissioner message available.";
    }

    // League Updates
    const updatesEl = document.getElementById("league-updates");
    if (updatesEl) {
      updatesEl.textContent =
        data.LeagueUpdates || "No league updates at this time.";
    }

    // Game of the Week
    const gotwEl = document.getElementById("gotw-text");
    if (gotwEl) {
      const title = data.GOTWTitle || "";
      const blurb = data.GOTWBlurb || "";
      gotwEl.textContent = title && blurb ? `${title} — ${blurb}` : (title || blurb || "No update available.");
    }

    // MVP
    const mvpEl = document.getElementById("mvp-text");
    if (mvpEl) {
      const name = data.MVPName || "";
      const team = data.MVPTeam || "";
      const blurb = data.MVPBlurb || "";
      let header = "";
      if (name && team) header = `${name} (${team})`;
      else if (name) header = name;
      else if (team) header = team;

      mvpEl.textContent = header && blurb ? `${header} — ${blurb}` : (header || blurb || "No MVP update available.");
    }

  } catch (err) {
    console.error("Error loading homepage content:", err);
  }
}

// --- Load GOTW + MVP images from GitHub ---
async function loadHomepageImages() {
  try {
    const gotw = await getLatestFromGitHub("images/gotw");
    if (gotw.length > 0) {
      const gotwImg = document.getElementById("gotw-img");
      if (gotwImg) gotwImg.src = gotw[0].download_url;
    }

    const mvp = await getLatestFromGitHub("images/mvp");
    if (mvp.length > 0) {
      const mvpImg = document.getElementById("mvp-img");
      if (mvpImg) mvpImg.src = mvp[0].download_url;
    }

  } catch (err) {
    console.error("Error loading homepage images:", err);
  }
}

// --- Load photo strip from GitHub ---
async function loadPhotoStrip() {
  try {
    const photos = await getLatestFromGitHub("images/photos");
    const strip = document.getElementById("photo-strip");
    if (!strip) return;

    strip.innerHTML = "";

    photos.forEach(file => {
      const img = document.createElement("img");
      img.src = file.download_url;
      img.className = "strip-photo";
      strip.appendChild(img);
    });

  } catch (err) {
    console.error("Error loading photo strip:", err);
  }
}

// --- Init homepage ---
document.addEventListener("DOMContentLoaded", () => {
  loadHomepageContent();
  loadHomepageImages();
  loadPhotoStrip();
});
