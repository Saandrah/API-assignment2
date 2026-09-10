// Variables and functions that will be used across all pages

const API_URL = "/api";

async function getAuthStatus() {
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "GET",
        credentials: "include"
    });
    if (response.status === 401 || response.status === 403) return false;
    if (response.status === 200) return true;
    console.log(response.status);
    console.log(isAuthenticated);
};

async function updateHeader() {
    if (await getAuthStatus()) {
        document.getElementById("linkToAuth").textContent = "Logout";
    } else {
        document.getElementById("linkToAuth").textContent = "Login";
    };
};

function initializeApp() {
    updateHeader();
};

initializeApp();