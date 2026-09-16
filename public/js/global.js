// Author(s): Alma, Helena
// Variables and functions that will be used across all pages

const API_URL = "/api";

async function checkUserIsAuthenticated() {
  // Any getters need to use await within an async function
  const response = await fetch(`${API_URL}/auth/check`, {
    method: "GET",
    credentials: "include",
  });
  if (response.status === 401 || response.status === 403) return false;
  if (response.status === 200) return true;
  console.log(response.status);
  console.log(isAuthenticated);
}

async function checkUserIsAdmin() {
  const response = await fetch(`${API_URL}/auth/checkadmin`, {
    method: "GET",
    credentials: "include",
  });
  // console.log(response.status);
  if (response.status === 200) {
    return true;
  } else {
    return false;
  }
}

async function updateNavbar() {
  if (await checkUserIsAuthenticated()) {
    document.getElementById("linkToAuth").textContent = "Logout";
    document.getElementById("linkToRegister").remove();
  } else {
    document.getElementById("linkToAuth").textContent = "Login";
  }
}

function initializeApp() {
  updateNavbar();
}

initializeApp();

async function fetchBooks() {
  try {
    const response = await fetch(API_URL + "/books");
    return await response.json();
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

function showAdminWarning() {
  let timer = 3;

  const container = document.createElement("div");
  container.classList.add("alert", "alert-danger", "text-center", "p-4");

  const adminWarningText = document.createElement("p");
  adminWarningText.classList.add("fs-4");
  adminWarningText.textContent = "You must be logged in as an admin to access this page.";

  const redirectText = document.createElement("p");
  redirectText.textContent = "Redirecting to the homepage in ";

  const timerSpan = document.createElement("span");
  timerSpan.textContent = timer;

  redirectText.append(timerSpan);
  container.append(adminWarningText, redirectText);

  setTimeout(() => {
    window.location.href = "index.html";
  }, timer * 1000);

  setInterval(() => {
    timer -= 1;
    timerSpan.textContent = timer;
    if (timer < 0) window.location.reload(); // Preventing a bug when navigating back through history
  }, 1000);

  return container;
};
