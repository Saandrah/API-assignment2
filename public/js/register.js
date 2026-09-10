let usernameDraft = "";
let passwordDraft = "";
let isAdminDraft = false;

async function handleSubmit(event) {
    event.preventDefault();
    console.log(usernameDraft);
    console.log(passwordDraft);
    console.log(isAdminDraft);
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
            username: usernameDraft,
            password: passwordDraft,
            is_admin: isAdminDraft
        })
    });
    const data = await response.json();
    console.log(response);
    console.log(data);
    console.log(response.status);
    if (response.status === 201) { // login and redirect to ladning if successful
        await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                username: usernameDraft,
                password: passwordDraft
            })
        });
        window.location.href = "index.html";
    } else { // registration failed, notify in response span
        const registerResponse = document.getElementById("registerResponse");
        if (registerResponse) registerResponse.textContent = data.message;
    };
};

function initializeRegister() {
    function handleUpdateDraft(event) {
        event.preventDefault();
        console.log(event.target.id);
        console.log(event.target);
        switch (event.target.id) {
            case "registerUsernameInputField":
                usernameDraft = event.target.value;
                break;
            case "registerPasswordInputField":
                passwordDraft = event.target.value;
                break;
            case "registerIsAdminInputField":
                isAdminDraft = event.target.checked;
                break;
            default:
                break;
        };
    };

    const registerForm = document.getElementById("registerForm");
    if (!registerForm) {
        console.log("HTML is missing the registerForm element");
        return;
    };

    const registerUsernameInputField = registerForm.querySelector("#registerUsernameInputField");
    if (registerUsernameInputField) registerUsernameInputField.addEventListener("change", handleUpdateDraft);

    const registerPasswordInputField = registerForm.querySelector("#registerPasswordInputField");
    if (registerPasswordInputField) registerPasswordInputField.addEventListener("change", handleUpdateDraft);

    const registerIsAdminInputField = registerForm.querySelector("#registerIsAdminInputField");
    if (registerIsAdminInputField) registerIsAdminInputField.addEventListener("change", handleUpdateDraft);
    
    registerForm.addEventListener("submit", handleSubmit);
}

initializeRegister();