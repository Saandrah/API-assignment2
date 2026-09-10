// Variables and functions that will be used across all pages

const API_URL = "/api";

async function getAuthStatus() {
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "GET",
        credentials: "include"
    });
    if (response.status === 403) return false;
    if (response.status === 200) return true;
};

function initialize() {
    const linkToAuth = document.getElementById("linkToAuth");
    if (getAuthStatus()) {
        if (linkToAuth) linkToAuth.textContent = "Logout";
    };
};

initialize();