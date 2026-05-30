// -------------------------------
// CONFIG — HOMEPAGE CONTENT CSV
// -------------------------------
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQr-ZqGFpZS9KtIZhXq0elsRssVso4HrH6fDx6ingBMo2PljxD0CeIdfPjmx4KT7zh-Rh0sildBK35V/pub?output=csv";


// -------------------------------
// GITHUB API FILE LOADER
// -------------------------------
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


// -------------------------------
// LOAD TEXT FROM GOOGLE SHEET
// -------------------------------
async function loadHomepageText() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    const csv = await res.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));

    const data = {};
    rows.forEach(r => {
      const key = r[0]?.trim();
      const value = r[1]?.trim() || "";
      if (key) data[key] = value;
    });

    document.getElementById("gotw-text").textContent =
      data.gotw_text || "No update available.";

    document.getElementById("mvp-text").textContent =
      data.mvp_text || "No MVP update available.";

    document.getElementById("league-updates").textContent =
      data.league_updates || "No league updates at this time.";

    document.getElementById("commissioner-message").textContent =
      data.commissioner_message || "No message from the commissioner.";

  } catch (err) {
    console.error("Error loading sheet:", err);
  }
}


// -------------------------------
// LOAD NEWEST GOTW + MVP IMAGES
// -------------------------------
async function loadHomepageImages() {
  try {
    const gotw = await getLatestFromGitHub("images/gotw");
    if (gotw.length > 0) {
      document.getElementById("gotw-img").src = gotw[0].download_url;
    }

    const mvp = await getLatestFromGitHub("images/mvp");
    if (mvp.length > 0) {
      document.getElementById("mvp-img").src = mvp[0].download_url;
    }

  } catch (err) {
    console.error("Error loading homepage images:", err);
  }
}


// -------------------------------
// LOAD PHOTO STRIP
// -------------------------------
async function loadPhotoStrip() {
  try {
    const photos = await getLatestFromGitHub("images/photos");
    const strip = document.getElementById("photo-strip");

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


// -------------------------------
// INIT HOMEPAGE
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadHomepageText();
  loadHomepageImages();
  loadPhotoStrip();
});
