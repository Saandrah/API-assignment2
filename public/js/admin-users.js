// Author(s): Alma Isaksson
// Originally written for admins only, it's been remade to allow non-admins to browse existing accounts, but gatekeeping CRUD from non admins
let userIsAdmin = false; // local boolean so that api request don't happen a million times during loops

const usersData = new Map();
const editUsersData = new Map();
const usersElements = new Map();

async function gatekeepNonAdmin() {
    if (await checkUserIsAdmin()) { // checkUserIsAdmin only checked once then stored locally to save API calls
        userIsAdmin = true;
        return;
    } else {
        // window.location.href = "index.html";
        document.getElementById("linkToAdminPanel").remove();
        document.getElementById("editDeleteTHead").remove();
        return;
    };
};

function enterEditMode(userTargetId) {
    const currentUserData = usersData.get(userTargetId);
    const targetRow = usersElements.get(userTargetId);

    const usernameElement = targetRow.querySelector(`[data-datatype=username]`);
    const usernameInput = document.createElement("input");
    usernameInput.placeholder = currentUserData.username;
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
    editButtonsContainer.classList.add("edit-mode");
    const exitCancelButton = document.createElement("button");
    exitCancelButton.textContent = "Cancel & discard changes";
    exitCancelButton.classList.add("btn", "btn-primary");
    exitCancelButton.addEventListener("click", () => {exitCancelEditMode(userTargetId)});

    const exitSaveButton = document.createElement("button");
    exitSaveButton.textContent = "Save changes";
    exitSaveButton.classList.add("btn", "btn-primary");
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

    const registrationDateData = document.createElement("td");
    const date = new Date(originalUserData.created_at);
    const dateFormated = new Intl.DateTimeFormat("en-CA").format(date);
    registrationDateData.textContent = dateFormated;
    registrationDateData.dataset.datatype = "createdAt";

    const editButtonsContainer = document.createElement("td");
    editButtonsContainer.dataset.datatype = "editButtonsContainer";
    editButtonsContainer.classList.add("edit-delete-wrapper");

    const editButton = document.createElement("button");
    editButton.textContent = `Edit ${originalUserData.username}`;
    editButton.classList.add("btn", "btn-primary");
    editButton.addEventListener("click", () => {enterEditMode(originalUserData._id)});

    const deleteButton = document.createElement("button");
    deleteButton.textContent = `Delete ${originalUserData.username}`;
    deleteButton.classList.add("btn", "btn-danger", "delete-button");
    deleteButton.addEventListener("click", () => {handleDeleteUser(originalUserData._id, targetRow)});

    editButtonsContainer.append(editButton, deleteButton);
    targetRow.replaceChildren(usernameData, passwordData, isAdminData, registrationDateData);
    if (userIsAdmin) targetRow.append(editButtonsContainer);

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
    if (response.status !== 200) { // failed due to error
        handleNotify(data.message);
        return;
    };

    if (newUsername) usersData.set(userTargetId, {...usersData.get(userTargetId), username: newUsername});
    handleNotify(data.message, true);
    exitCancelEditMode(userTargetId);
};

async function handleDeleteUser(userTargetId, elementToDelete) {
    const response = await fetch(`${API_URL}/users/${userTargetId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    const data = await response.json();
    console.log(data);
    console.log(response.status);
    if (response.status !== 200) {
        handleNotify(data.message);
        return;
    };
    handleNotify(data.message);
    elementToDelete.remove();
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
        newUserRow.classList.add("w-100", "border", "rounded");

        const usernameData = document.createElement("td");
        usernameData.textContent = user.username;
        usernameData.className = "username";
        usernameData.dataset.datatype = "username";

        const passwordData = document.createElement("td");
        passwordData.textContent = "******";
        passwordData.className = "password";
        passwordData.dataset.datatype = "password";

        const isAdminData = document.createElement("td");
        if (user.is_admin) {
            isAdminData.textContent = "Admin";
        } else {
            isAdminData.textContent = "User";
        };
        isAdminData.dataset.datatype = "isAdmin";

        const registrationDateData = document.createElement("td");
        const date = new Date(user.created_at);
        const dateFormated = new Intl.DateTimeFormat("en-CA").format(date);
        registrationDateData.textContent = dateFormated;
        registrationDateData.dataset.datatype = "createdAt";

        const editButtonsContainer = document.createElement("td");
        editButtonsContainer.dataset.datatype = "editButtonsContainer";
        editButtonsContainer.classList.add("edit-delete-wrapper");

        const editButton = document.createElement("button");
        editButton.textContent = `Edit ${user.username}`;
        editButton.classList.add("btn", "btn-primary");
        editButton.addEventListener("click", () => {enterEditMode(user._id)});
        editButtonsContainer.append(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = `Delete ${user.username}`;
        deleteButton.classList.add("btn", "btn-danger", "delete-button");
        deleteButton.addEventListener("click", () => {handleDeleteUser(user._id, newUserRow)});
        editButtonsContainer.append(deleteButton);

        newUserRow.append(usernameData, passwordData, isAdminData, registrationDateData);
        if (userIsAdmin) newUserRow.append(editButtonsContainer);
        if (usersListTable) usersListTable.append(newUserRow);
        usersElements.set(user._id, newUserRow);
    };
};

function handleNotify(message, positive = false) {
    const notificationContainer = document.getElementById("notificationContainer");

    const newNotification = document.createElement("p");
    newNotification.textContent = message;
    newNotification.classList.add("alert", "alert-danger");
    if (positive) {
        newNotification.classList.remove("alert-danger");
        newNotification.classList.add("alert-success");
    };
    if (notificationContainer) notificationContainer.append(newNotification);
    setTimeout(() => {
        newNotification.remove();
    }, 3000);
};

gatekeepNonAdmin();
fetchUsers();