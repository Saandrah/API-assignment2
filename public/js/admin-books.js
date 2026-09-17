//-------------------------------------------
//CREATE ELEMENTS & BOOK CONTAINER FOR ADMIN
//-------------------------------------------

const booksContainer = document.getElementById("admin-book-container");
const alertContainer = document.getElementById("alert-container");

// ------------------------------------
// CHECK IF USER IS LOGGED IN AS ADMIN
// ------------------------------------

checkAdminAccess();

async function checkAdminAccess() {
  const isAuthenticated = await checkUserIsAuthenticated();
  if (!isAuthenticated) {
    renderAdminWarning();
    return;
  }

  const isAdmin = await checkUserIsAdmin();
  if (!isAdmin) {
    renderAdminWarning();
    return;
  }

  loadBooks();
}

// -------------------------------------------
// SHOW ADMIN WARNING MESSAGE FROM GLOBALS.JS
// -------------------------------------------

function renderAdminWarning() {
  alertContainer.innerHTML = "";
  booksContainer.innerHTML = "";

  const warning = showAdminWarning();
  alertContainer.appendChild(warning);
}

// -------------------------------------------------------------------------------
// FETCH BOOKS FROM API TO HANDLE ADMIN BOOKS USING GLOBAL FUNCTION FROM global.js
// -------------------------------------------------------------------------------

async function loadBooks() {
  document.getElementById("back-to-admin-panel").style.display = "block";
  const books = await fetchBooks();

  if (books.length === 0) {
    booksContainer.innerHTML = "Something went wrong. Please try again later!";
    return;
  }

  renderBooks(books);
}

function renderBooks(books) {
  booksContainer.innerHTML = `
    <button
      id="create-book-btn"
      class="btn btn-success mb-4 book-btn-shadow"
    >
      Create New Book
    </button>
  `;

  booksContainer.innerHTML += books
    .map(
      (book) => `
      <div class="d-flex gap-4 mb-4 p-3 align-items-start admin-book-card">

        <div class="d-flex gap-4 admin-book-content">
          <!-- Book Thumbnail -->
          <div class="d-flex flex-column">
            <img 
              src="${book.image}" 
              alt="${book.title}" 
              class="book-thumb book-btn-shadow mb-2"
              style="max-width: 120px;"
            />
          </div>

          <!-- Text -->
          <div style="max-width: 900px;">
            <h3 class="mb-2"><strong>${book.title}</strong></h3>
            <p class="mb-1"><strong>Author:</strong> ${book.author}</p>
            <p class="mb-1"><strong>Description:</strong> ${book.description}</p>
            <p class="mb-1"><strong>Genres:</strong> ${Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}</p>
            <p class="mb-1"><strong>Published Year:</strong> ${book.published_year}</p>
          </div>
        </div>

        <!-- Admin buttons -->

        <div class=" admin-buttons">

          <button class="btn btn-info w-100 mb-2 book-btn-shadow" onclick="startEditBook('${book._id}')">Edit book</button>

          <button 
            type="button" 
            class="btn btn-danger w-100 book-btn-shadow"
            onclick="showConfirmDeleteMsg('${book._id}')">
            Delete book
          </button>

          <div class="alert alert-danger mt-2 d-none text-center" id="confirm-${book._id}">
            <p class="mb-3">Do you want to delete the book?</p>
            <button class="btn btn-danger btn-sm me-2" onclick="confirmDelete('${book._id}')">Yes</button>
            <button class="btn btn-secondary btn-sm" onclick="cancelDelete('${book._id}')">Cancel</button>
          </div>
        </div>

      </div>
    `,
    )
    .join("");
}

//---------------------------
//BACK BUTTONS
//---------------------------

function backToAdmin() {
  loadBooks();
}

document.getElementById("back-to-admin-panel").addEventListener("click", () => {
  window.location.href = "admin-panel.html"; // eller index.html beroende på din struktur
});

//---------------------------
// CREATE BOOK FUNCTION - BUTTON CLICK EVENT LISTENER
//---------------------------

document.addEventListener("click", (event) => {
  if (event.target.id === "create-book-btn") {
    renderCreateForm();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.id === "create-book-save-btn") {
    createBook();
  }
});

//---------------------------
// SHOW THE CREATE FORM
//---------------------------

function renderCreateForm() {
  document.getElementById("back-to-admin-panel").style.display = "none";
  booksContainer.innerHTML = `
    <div id="create-book-container" class="p-4 border rounded">
      <h3 class="mt-4">Create New Book</h3>

      <form id="create-book-form" class="mt-3">

        <div class="mb-3">
          <label class="form-label">Title</label>
          <input id="create-title" class="form-control" required placeholder="Insert Book Title">
        </div>

        <div class="mb-3">
          <label class="form-label">Author</label>
          <input id="create-author" class="form-control" required placeholder="Insert Author">
        </div>

        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea id="create-description" class="form-control" required placeholder="Insert Description for this book"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Genres</label>
          <input id="create-genres" class="form-control" placeholder="Insert Genres, e.g. fantasy, drama" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Published Year</label>
          <input id="create-year" class="form-control" required placeholder="Insert Published Year, e.g. 2026">
        </div>

        <div class="mb-3">
          <label class="form-label">Image URL</label>
          <input id="create-image" class="form-control" required placeholder="Insert Image URL for this book">
        </div>

      </form>

      <div class="d-flex gap-3 mt-3 justify-content-between align-items-center">
        <button class="btn btn-outline-dark rounded-3 px-3 book-btn-shadow" onclick="backToAdmin()">← Back</button>
        <button id="create-book-save-btn" class="btn btn-primary book-btn-shadow">Save Book</button>
      </div>

      <div id="create-message" class="mt-3"></div>
    </div>
  `;
}

//------------------------------------------------------
// CREATE - VALIDATION OF INPUT FIELDS & ERROR MESSAGE
//------------------------------------------------------
// This validation ensures:
// 1. All fields are filled out.
// 2. Input is trimmed to remove leading/trailing whitespace.
// 3. Title and Description start with a capitalized first word.
// 4. Author and Genres capitalize every word.
// 5. Genres are converted into a clean array.
// 6. Published year is converted into a number.
// 7. Clean, normalized data is returned for API submission.

function capitalizeFirstWord(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function capitalizeWords(text) {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function validateCreateForm() {
  // INPUT VALUES (trimmed)
  const inputTitle = document.getElementById("create-title").value.trim();
  const inputAuthor = document.getElementById("create-author").value.trim();
  const inputDescription = document
    .getElementById("create-description")
    .value.trim();
  const inputGenres = document.getElementById("create-genres").value.trim();
  const inputYear = document.getElementById("create-year").value.trim();
  const inputImage = document.getElementById("create-image").value.trim();

  // REQUIRED FIELDS CHECK
  if (
    !inputTitle ||
    !inputAuthor ||
    !inputDescription ||
    !inputGenres ||
    !inputYear ||
    !inputImage
  ) {
    showCreateMessage("All fields must be filled out.", "danger");
    return null;
  }

  // CAPITALIZATION RULES
  const title = capitalizeFirstWord(inputTitle);
  const description = capitalizeFirstWord(inputDescription);
  const author = capitalizeWords(inputAuthor);

  const genres = inputGenres
    .split(",")
    .map((g) => capitalizeWords(g.trim()))
    .filter(Boolean);

  // YEAR VALIDATION
  const published_year = Number(inputYear);
  if (isNaN(published_year)) {
    showCreateMessage("Published year must be a valid number.", "danger");
    return null;
  }

  // FINAL CLEAN OBJECT
  return {
    title,
    author,
    description,
    genres,
    published_year,
    image: inputImage,
  };
}

//---------------------------
// CREATE BOOK FUNCTION - API CALL
//---------------------------

async function createBook() {
  const newBook = validateCreateForm();
  if (!newBook) return; // validation already showed error message

  try {
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      showCreateMessage("Failed to create book.", "danger");
      return;
    }

    showCreateMessage("Book created successfully!", "success");

    // Redirect after 2 seconds
    setTimeout(() => {
      loadBooks();
    }, 2000);
  } catch (error) {
    console.error("Error creating book:", error);
    showCreateMessage("Unexpected error while creating book.", "danger");
  }
}

//----------------------------------------------------------------
// CREATE BOOK MESSAGE FUNCTION - SHOW SUCCESS OR ERROR MESSAGE
//----------------------------------------------------------------

function showCreateMessage(message, type = "success") {
  const messageBox = document.getElementById("create-message");
  if (!messageBox) return;

  messageBox.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
}

//---------------------------
// EDIT BOOK FUNCTIONS
//---------------------------
//Clear book container
//Fetch book by ID from backend without reviews
//Render edit table with book data
//Create a table with values from the book object

function startEditBook(bookId) {
  booksContainer.innerHTML = "";
  fetchOneBook(bookId);
}

async function fetchOneBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`);
    const data = await response.json();
    const oneBook = data.book;
    renderEditTable(oneBook);
  } catch (error) {
    console.log("Error fetching book:", error);
  }
}

//---------------------------
// RENDER EDIT TABLE FUNCTION
//---------------------------

function renderEditTable(oneBook) {
  document.getElementById("back-to-admin-panel").style.display = "none";
  booksContainer.innerHTML = `

  <div id="edit-book-container" class="p-4 border rounded">

  <h3 class="mt-4">Edit Book</h3>
  
    <table class="table table-bordered">
      <tr>
        <th>Title</th>
        <td><input id="edit-title" class="form-control" value="${oneBook.title}"></td>
      </tr>

      <tr>
        <th>Author</th>
        <td><input id="edit-author" class="form-control" value="${oneBook.author}"></td>
      </tr>

      <tr>
        <th>Description</th>
        <td><textarea id="edit-description" class="form-control">${oneBook.description}</textarea></td>
      </tr>

      <tr>
        <th>Genres</th>
        <td><input id="edit-genres" class="form-control" value="${Array.isArray(oneBook.genres) ? oneBook.genres.join(", ") : oneBook.genres}"></td>
      </tr>

      <tr>
        <th>Published Year</th>
        <td><input id="edit-year" class="form-control" value="${oneBook.published_year}"></td>
      </tr>

      <tr>
        <th>Image URL</th>
        <td><input id="edit-image" class="form-control" value="${oneBook.image}"></td>
      </tr>
    </table>

     <div class="d-flex gap-3 mt-3 justify-content-between align-items-center">
        <button class="btn btn-outline-dark rounded-3 px-3 book-btn-shadow" onclick="backToAdmin()">← Back</button>
        <button class="btn btn-primary book-btn-shadow" onclick="updateBook('${oneBook._id}')">Save changes</button>
    </div>

    <div id="update-${oneBook._id}" class="mt-3"></div>

  </div>
  `;
}

//-----------------------------------
// SAVE CHANGES- UPDATE BOOK FUNCTION
//-----------------------------------
//On correct update show a success message and redirect back to admin page after 3 seconds
// TO-DO: If not all fields the updateMessageBox will show an err message: !All fields must be filled out"
//TO-DO: If no fields have been changed the updateMessageBox will show an err message: "No changes have been made to the book."

async function updateBook(bookId) {
  const updatedBook = {
    title: document.getElementById("edit-title").value.trim(),
    author: document.getElementById("edit-author").value.trim(),
    description: document.getElementById("edit-description").value.trim(),
    genres: document
      .getElementById("edit-genres")
      .value.split(",")
      .map((genre) => genre.trim()),
    published_year: Number(document.getElementById("edit-year").value),
    image: document.getElementById("edit-image").value.trim(),
  };

  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBook),
      credentials: "include",
    });

    if (!response.ok) {
      alert("Failed to update book.");
      return;
    }

    const updateMessageBox = document.getElementById(`update-${bookId}`);
    updateMessageBox.innerHTML = `
      <div class="alert alert-success mt-2">
        <strong>Book updated successfully!</strong>
      </div>
    `;

    setTimeout(() => {
      updateMessageBox.classList.add("d-none");
      backToAdmin();
    }, 2000);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

// ---------------------------
// DELETE BOOK FUNCTIONS
// ---------------------------

async function deleteBook(bookId) {
  try {
    const response = await fetch(`${API_URL}/books/${bookId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.status === 401 || response.status === 403) {
      alert("You must be logged in as admin to delete a book.");
      return;
    }

    if (!response.ok) {
      alert("Failed to delete book.");
      return;
    }

    const deleteMessageBox = document.getElementById(`confirm-${bookId}`);
    deleteMessageBox.innerHTML = `
      <div class="alert alert-success mt-2">
        <strong>The book has been deleted.</strong>
      </div>
    `;

    setTimeout(() => {
      deleteMessageBox.classList.add("d-none");
      loadBooks();
    }, 2000);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

//Add scroll for msgbox when delete button is clicked
function showConfirmDeleteMsg(bookId) {
  const deleteBox = document.getElementById(`confirm-${bookId}`);
  deleteBox.classList.remove("d-none");

  deleteBox.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}

function cancelDelete(bookId) {
  document.getElementById(`confirm-${bookId}`).classList.add("d-none");
}

function confirmDelete(bookId) {
  deleteBook(bookId);
}
