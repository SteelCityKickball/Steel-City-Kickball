// -------------------------------
// CONFIG
// -------------------------------
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlQaQ9lUR2doOFO1CE5m0UGI49T569YYKWrSyuoSoMBlqRwhg-Rdk13IQFptMS_krfJzXqC8zKxYPl/pub?output=csv";

const GOTW_FOLDER = "/Steel-City-Kickball/images/gotw/";
const MVP_FOLDER = "/Steel-City-Kickball/images/mvp/";
const PHOTO_FOLDER = "/Steel-City-Kickball/images/photos/";


// -------------------------------
// LOAD TEXT FROM GOOGLE SHEET
// -------------------------------
async function loadHomepageText() {
  try {
    const res = await fetch(SHEET_CSV_URL);
    const csv = await res.text();

    const rows = csv.trim().split("\n").map(r => r.split(","));
    const data = {};

    rows.forEach(([key, value]) => {
      data[key] = value;
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
// AUTO‑LOAD NEWEST IMAGE FROM FOLDER
// -------------------------------
async function loadNewestImage(folder, imgElementId) {
  try {
    const res = await fetch(folder);
    const text = await res.text();

    const matches = [...text.matchAll(/href="([^"]+)"/g)]
      .map(m => m[1])
      .filter(name => /\.(jpg|jpeg|png|gif)$/i.test(name));

    if (matches.length === 0) return;

    const newest = matches.sort().reverse()[0];
    document.getElementById(imgElementId).src = folder + newest;

  } catch (err) {
    console.error("Error loading images:", err);
  }
}


// -------------------------------
// LOAD PHOTO STRIP
// -------------------------------
async function loadPhotoStrip() {
  try {
    const res = await fetch(PHOTO_FOLDER);
    const text = await res.text();

    const matches = [...text.matchAll(/href="([^"]+)"/g)]
      .map(m => m[1])
      .filter(name => /\.(jpg|jpeg|png|gif)$/i.test(name));

    const strip = document.getElementById("photo-strip");
    strip.innerHTML = "";

    matches.forEach(file => {
      const img = document.createElement("img");
      img.src = PHOTO_FOLDER + file;
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
  loadNewestImage(GOTW_FOLDER, "gotw-img");
  loadNewestImage(MVP_FOLDER, "mvp-img");
  loadPhotoStrip();
});
