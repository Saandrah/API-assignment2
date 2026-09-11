// Author(s): Alma Isaksson
async function checkUserIsAdmin2() {
    if (await checkUserIsAdmin()) {
        console.log("access granted");
        return;
    } else {
        window.location.href = "index.html";
        return;
    };
};

checkUserIsAdmin2();