// Author(s): Alma Isaksson
async function gatekeepNonAdmin() {
    if (await checkUserIsAdmin()) {
        // console.log("access granted");
        return;
    } else {
        // window.location.href = "index.html";
        const alertContainer = document.getElementById("alertContainer");
        if (alertContainer) alertContainer.append(showAdminWarning());
        return;
    };
};

gatekeepNonAdmin();