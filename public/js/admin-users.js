// Author(s): Alma Isaksson
const usersData = new Map();
const editUsersData = new Map();
const usersElements = new Map();

async function gatekeepNonAdmin() {
    if (await checkUserIsAdmin()) {
        return;
    } else {
        window.location.href = "index.html";
        return;
    };
};

function enterEditMode(userTargetId) {
    const currentUserData = usersData.get(userTargetId);
    const targetRow = usersElements.get(userTargetId);

    const usernameElement = targetRow.querySelector(`[data-datatype=username]`);
    const usernameInput = document.createElement("input");
    usernameInput.placeholder = currentUserData.username
    usernameElement.replaceChildren(usernameInput);
    usernameElement.addEventListener("change", (event) => {
        const currentDraft = editUsersData.get(userTargetId);
        editUsersData.set(userTargetId, {...currentDraft, username: event.target.value});
    });

    const passwordElement = targetRow.querySelector(`[data-datatype=password]`);
    const passwordInput = document.createElement("input");
    passwordInput.placeholder = "******";
    passwordElement.replaceChildren(passwordInput);
    passwordElement.addEventListener("change", (event) => {
        const currentDraft = editUsersData.get(userTargetId);
        editUsersData.set(userTargetId, {...currentDraft, password: event.target.value});
    });

    const isAdminElement = targetRow.querySelector(`[data-datatype=isAdmin]`);
    const isAdminInput = document.createElement("input");
    isAdminInput.type = "checkbox";
    if (currentUserData.is_admin) isAdminInput.checked = true;
    editUsersData.set(userTargetId, {is_admin: currentUserData.is_admin});
    isAdminElement.replaceChildren(isAdminInput);
    isAdminElement.addEventListener("change", (event) => {
        const currentDraft = editUsersData.get(userTargetId);
        editUsersData.set(userTargetId, {...currentDraft, is_admin: event.target.checked});
    });

    const editButtonsContainer = targetRow.querySelector(`[data-datatype=editButtonsContainer]`);
    const exitCancelButton = document.createElement("button");
    exitCancelButton.textContent = "Cancel & discard changes";
    exitCancelButton.addEventListener("click", () => {exitCancelEditMode(userTargetId)});

    const exitSaveButton = document.createElement("button");
    exitSaveButton.textContent = "Save changes";
    exitSaveButton.addEventListener("click", () => {exitSaveEditMode(userTargetId)})

    editButtonsContainer.replaceChildren(exitCancelButton, exitSaveButton);
};

function exitCancelEditMode(userTargetId) {
    const originalUserData = usersData.get(userTargetId);
    const targetRow = usersElements.get(userTargetId);

    const usernameData = document.createElement("td");
    usernameData.textContent = originalUserData.username;
    usernameData.dataset.datatype = "username";

    const passwordData = document.createElement("td");
    passwordData.textContent = "******";
    passwordData.dataset.datatype = "password";

    const isAdminData = document.createElement("td");
    if (originalUserData.is_admin) {
        isAdminData.textContent = "Admin";
    } else {
        isAdminData.textContent = "User";
    };
    isAdminData.dataset.datatype = "isAdmin";

    const editButtonsContainer = document.createElement("td");
    editButtonsContainer.dataset.datatype = "editButtonsContainer";
    const editButton = document.createElement("button");
    editButton.textContent = `Edit ${originalUserData.username}`;
    editButton.addEventListener("click", () => {enterEditMode(originalUserData._id)});
    editButtonsContainer.append(editButton);

    targetRow.replaceChildren(usernameData, passwordData, isAdminData, editButtonsContainer);

    editUsersData.delete(userTargetId);
};

async function exitSaveEditMode(userTargetId) {
    let patchBody = { setIsAdmin: false};
    const newUserData = editUsersData.get(userTargetId);

    const newUsername = newUserData.username;
    if (newUsername) {
        patchBody = {...patchBody, newUsername: newUsername};
    };

    const newPassword = newUserData.password;
    if (newPassword) patchBody = {...patchBody, newPassword: newPassword};

    const setIsAdmin = newUserData.is_admin;
    if (setIsAdmin) patchBody = {...patchBody, setIsAdmin: true};
    usersData.set(userTargetId, {...usersData.get(userTargetId), is_admin: setIsAdmin});

    console.log(patchBody);
    const response = await fetch(`${API_URL}/users/${userTargetId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(patchBody)
    })
    const data = await response.json();
    console.log(response.status);
    console.log(data);
    if (response.status !== 200) return;

    if (newUsername) usersData.set(userTargetId, {...usersData.get(userTargetId), username: newUsername});
    exitCancelEditMode(userTargetId);
};

async function fetchUsers() {
    const usersListTable = document.getElementById("usersListTable");

    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    for (i in data.result) {
        const user = data.result[i];
        usersData.set(user._id, {...user, password: null});

        const newUserRow = document.createElement("tr");
        newUserRow.dataset.userId = user._id;

        const usernameData = document.createElement("td");
        usernameData.textContent = user.username;
        usernameData.dataset.datatype = "username";

        const passwordData = document.createElement("td");
        passwordData.textContent = "******";
        passwordData.dataset.datatype = "password";

        const isAdminData = document.createElement("td");
        if (user.is_admin) {
            isAdminData.textContent = "Admin";
        } else {
            isAdminData.textContent = "User";
        };
        isAdminData.dataset.datatype = "isAdmin";

        const editButtonsContainer = document.createElement("td");
        editButtonsContainer.dataset.datatype = "editButtonsContainer";
        const editButton = document.createElement("button");
        editButton.textContent = `Edit ${user.username}`;
        editButton.addEventListener("click", () => {enterEditMode(user._id)});
        editButtonsContainer.append(editButton);

        newUserRow.append(usernameData, passwordData, isAdminData, editButtonsContainer);
        if (usersListTable) usersListTable.append(newUserRow);
        usersElements.set(user._id, newUserRow);
    };
};

gatekeepNonAdmin();
fetchUsers();