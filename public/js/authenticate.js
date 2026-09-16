// Author(s): Alma Isaksson
let usernameDraft = "";
let passwordDraft = "";
let isAdminDraft = false;

async function handleLogin() {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            username: usernameDraft,
            password: passwordDraft
        })
    });
    const data = await response.json();
    if (response.status === 200) { // 200 = authentication ok
        window.location.href = "index.html";
        return;
    } else { // authentication not ok
        const authResponse = document.getElementById("AuthResponse");
        authResponse.textContent = data.message;
        authResponse.classList.add("alert", "alert-warning");
    };
};

async function handleLogout(event) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
    const data = await response.json();
    // console.log(response);
    // console.log(data);
    // console.log(response.status);
    window.location.href = "index.html";
};

async function updateAuthForm() {
    function updateDraft(event) {
        event.preventDefault();
        const target = event.target;
        if (target.dataset.authInputType === "username") {
            usernameDraft = target.value;
        };
        if (target.dataset.authInputType === "password") {
            passwordDraft = target.value;
        };
    };

    function handleSubmit(event) {
        event.preventDefault();
        handleLogin();
    };

    const authForm = document.getElementById("authForm");
    if (!authForm) {
        console.error("HTML is missing the authForm element");
        return;
    };

    const authLegend = authForm.querySelector("#authLegend");
    const authInputFieldsContainer = authForm.querySelector("#authInputFieldsContainer");
    const authSubmitButton = authForm.querySelector("#authSubmitButton");

    if (await checkUserIsAuthenticated()) { // create logout form for authenticated users
        if (authLegend) authLegend.textContent = "Logout";
        if (authSubmitButton) {
            authSubmitButton.value = "Logout";
        };
        authForm.addEventListener("click", handleLogout);
    } else { // create login form for unauthenticated users
        if (authLegend) authLegend.textContent = "Login";
        if (authSubmitButton) {
            authSubmitButton.value = "Login";
        };

        const usernameInputLabel = document.createElement("label");

        const usernameInputLableSpan = document.createElement("span");
        usernameInputLableSpan.textContent = "Username";

        const usernameInputField = document.createElement("input");
        usernameInputField.type = "text";
        usernameInputField.dataset.authInputType = "username";
        usernameInputField.addEventListener("change", updateDraft);

        const passwordInputLabel = document.createElement("label");

        const passwordInputLabelSpan = document.createElement("span");
        passwordInputLabelSpan.textContent = "Password";

        const passwordInputField = document.createElement("input");
        passwordInputField.type = "password";
        passwordInputField.dataset.authInputType = "password";
        passwordInputField.addEventListener("change", updateDraft);

        authForm.addEventListener("submit", handleSubmit);

        usernameInputLabel.append(usernameInputLableSpan, usernameInputField);
        passwordInputLabel.append(passwordInputLabelSpan, passwordInputField);
        authInputFieldsContainer.append(usernameInputLabel, passwordInputLabel);
    };
}

function initializeAuthenticate() {
    updateAuthForm();
};

initializeAuthenticate();