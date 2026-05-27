// URL of your published Identity sheet (CSV)
const IDENTITY_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7Y1-Mu-ZQpHqfBeKRTW3SES-Wuck7aZF2s5keFvN32Womqqrq16KnuewdbOBfzSE06N9VuG8MaKht/pub?output=csv";

// Convert CSV → Array of objects
async function fetchIdentityData() {
    const response = await fetch(IDENTITY_SHEET_URL);
    const csvText = await response.text();

    const rows = csvText.trim().split("\n").map(r => r.split(","));
    const headers = rows.shift();

    return rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = row[i] ? row[i].trim() : "";
        });
        return obj;
    });
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById("login-email").value.trim().toLowerCase();
    const passwordInput = document.getElementById("login-password").value.trim();

    const users = await fetchIdentityData();

    const match = users.find(u =>
        u.Email.toLowerCase() === emailInput &&
        u.Password === passwordInput
    );

    if (!match) {
        alert("Invalid email or password.");
        return;
    }

    // Save user session
    localStorage.setItem("sck_user", JSON.stringify(match));

    // Redirect to profile
    window.location.href = "/src/identity/profile.html";
}

// Attach to form
document.getElementById("<form id="loginForm">
").addEventListener("submit", handleLogin);
