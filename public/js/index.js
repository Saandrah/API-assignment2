async function getAuthStatus() {
    const response = await fetch(`${API_URL}/auth/check`, {
        method: "GET",
        credentials: "include"
    });
    if (response.status === 403) return false;
    if (response.status === 200) return true;
};

function init() {
    if (getAuthStatus()) {
        document.getElementById("linkToAuth").textContent = "Logout";
    };
};

init();