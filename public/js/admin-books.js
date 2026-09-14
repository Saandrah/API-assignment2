//-------------------
//CREATE BOOK CONTAINER FOR ADMIN
//--------------------

const booksContainer = document.getElementById("admin-book-container");

// ------------------------------------
// CHECK IF USER IS LOGGED IN AS ADMIN
// ------------------------------------
checkAdminAccess();

async function checkAdminAccess() {
  const isAuthenticated = await checkUserIsAuthenticated();
  if (!isAuthenticated) {
    showAdminWarning();
    return;
  }

  const isAdmin = await checkUserIsAdmin();
  if (!isAdmin) {
    showAdminWarning();
    return;
  }
  loadBooks();
}

// ---------------------------
// SHOW ADMIN WARNING
// ---------------------------

function showAdminWarning() {
  booksContainer.innerHTML = `
    <div class="alert alert-danger text-center p-4">
      <h4>You must be logged in as an admin to access this page.</h4>
      <p>You will be redirected to the homepage shortly.</p>
    </div>
  `;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 5000);
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
  booksContainer.innerHTML = books
    .map(
      (book) => `
      <div class="d-flex gap-4 mb-4 p-3 border rounded align-items-start">

        <!-- Book Thumbnail -->
        <div class="d-flex flex-column">
          <img 
            src="${book.image}" 
            alt="${book.title}" 
            class="book-thumb book-shadow mb-2"
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
          <a href="edit-book.html?id=${book._id}" class="btn btn-outline-primary w-100 mb-2">
            Edit book
          </a>

          <button 
            type="button" 
            class="btn btn-outline-danger w-100"
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

// ---------------------------
// DELETE BOOK FUNCTIONS
// ---------------------------
//D-none is Display None in bootstrap

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
