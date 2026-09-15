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
      <div class="d-flex gap-4 mb-4 p-3 border rounded align-items-start">

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
        <div style="max-width: 600px;">
          <h3 class="mb-2"><strong>${book.title}</strong></h3>
          <p class="mb-1"><strong>Author:</strong> ${book.author}</p>
          <p class="mb-1"><strong>Description:</strong> ${book.description}</p>
          <p class="mb-1"><strong>Genres:</strong> ${Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}</p>
          <p class="mb-1"><strong>Published Year:</strong> ${book.published_year}</p>
        </div>

        <!-- Admin buttons -->
        <div class="d-flex flex-column align-items-end" style="width: 180px;">

          <button class="btn btn-info w-100 mb-2 book-btn-shadow" onclick="startEditBook('${book._id}')">Edit book</button>

          <button 
            type="button" 
            class="btn btn-danger w-100 book-btn-shadow"
            onclick="showConfirmDeleteMsg('${book._id}')">
            Delete book
          </button>

          <div class="alert alert-danger mt-2 d-none" id="confirm-${book._id}">
            <p class="mb-2">Are you sure you want to delete this book?</p>
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
//BACK BUTTON FUNCTION
//---------------------------

function backToAdmin() {
  loadBooks();
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
  booksContainer.innerHTML = `

  <div class= "w-50" style="max-width: 600px;" >

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
        <button class="btn btn-outline-dark rounded-3 px-3" onclick="backToAdmin()">← Back</button>
        <button class="btn btn-primary" onclick="updateBook('${oneBook._id}')">Save changes</button>
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
        <strong>The book has been updated successfully.</strong>
      </div>
    `;

    setTimeout(() => {
      updateMessageBox.classList.add("d-none");
      backToAdmin();
    }, 3000);
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
        <strong>The book has been deleted successfully.</strong>
      </div>
    `;

    setTimeout(() => {
      deleteMessageBox.classList.add("d-none");
      loadBooks();
    }, 3000);
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
}

function showConfirmDeleteMsg(bookId) {
  document.getElementById(`confirm-${bookId}`).classList.remove("d-none");
}

function cancelDelete(bookId) {
  document.getElementById(`confirm-${bookId}`).classList.add("d-none");
}

function confirmDelete(bookId) {
  deleteBook(bookId);
}
