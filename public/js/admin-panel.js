// Author(s): Alma Isaksson
async function gatekeepNonAdmin() {
    if (await checkUserIsAdmin()) {
        // console.log("access granted");
        return;
    } else {
        // window.location.href = "index.html";
        const alertNoAdminContainer = document.getElementById("alertNoAdminContainer");
        if (alertNoAdminContainer) alertNoAdminContainer.append(showAdminWarning());

        const panelView = document.getElementById("panelView");
        if (panelView) panelView.remove();
        return;
    };
};

gatekeepNonAdmin();