// Author(s): Alma Isaksson
async function gatekeepNonAdmin() {
    if (await checkUserIsAdmin()) {
        // console.log("access granted");
        return;
    } else {
        window.location.href = "index.html";
        return;
    };
};

async function fetchUsers() {
    const usersListTable = document.getElementById("usersListTable");

    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    for (i in data.result) {
        const user = data.result[i]
        // console.log(user);
        const newUserRow = document.createElement("tr");
        newUserRow.dataset.user_id = user._id;

        const usernameData = document.createElement("td");
        usernameData.textContent = user.username

        const isAdminData = document.createElement("td");
        if (user.is_admin) {
            isAdminData.textContent = "Admin";
        } else {
            isAdminData.textContent = "User";
        };

        newUserRow.append(usernameData, isAdminData);
        if (usersListTable) usersListTable.append(newUserRow);
    };
};

gatekeepNonAdmin();
fetchUsers();