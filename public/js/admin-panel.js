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

gatekeepNonAdmin();