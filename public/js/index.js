//-------------------
//CREATE BOOK CONTAINER
//--------------------
//Create container to hold the books from the API in order to display them on the page

const booksContainer = document.getElementById("book-container");

// -------------------------------------------------
// FETCH BOOKS USING GLOBAL FUNCTION FROM global.js
// ---------------------------------------------------

async function loadBooks() {
  const books = await fetchBooks();

  if (books.length === 0) {
    booksContainer.innerHTML = "Something went wrong. Please try again later!";
    return;
  }

  renderBooks(books);
}
loadBooks();

// ---------------------------
// RENDER BOOKS
// ---------------------------

function renderBooks(books) {
  booksContainer.innerHTML = books
    .map(
      (book) => `
      <div class="d-flex gap-3 mb-3 p-3 align-items-start book-card">

      <div class="d-flex flex-column">
        <img 
          src="${book.image}" 
          alt="${book.title}" 
          class="book-thumb book-btn-shadow mb-2"
        />
        <a href="bookpage.html?id=${book._id}" class="btn btn-info mt-2 book-btn-shadow nowrap-text">
            Show Book
          </a>
        </div>

        <div>
          <h3 class="mb-2">
            <strong>${book.title}</strong>
          </h3>

          <p class="mb-1"><strong>Author:</strong> ${book.author}</p>
          <p class="mb-1"><strong>Description:</strong> ${book.description}</p>
          <p class="mb-1"><strong>Genres:</strong> ${Array.isArray(book.genres) ? book.genres.join(", ") : book.genres}</p>
          <p class="mb-1"><strong>Published Year:</strong> ${book.published_year}</p>

        </div>

      </div>
    `,
    )
    .join("");
}
