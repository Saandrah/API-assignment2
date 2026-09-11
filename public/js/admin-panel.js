// Author(s): Alma Isaksson
async function checkUserIsAdmin() {
    const response = await fetch(`${API_URL}/auth/checkadmin`, {
        method: "GET",
        credentials: "include"
    });
    console.log(response.status);
    if (response.status === 200) {
        console.log("User is admin");
        return;
    };
    // else redirect to landing page
    window.location.href = "index.html";
};

checkUserIsAdmin();