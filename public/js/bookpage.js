const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

console.log("Book ID:", bookId);

async function fetchBook() {
  try {
    const response = await fetch(API_URL + "/books/" + bookId);
    const data = await response.json();

  renderBook(data.book);
console.log("Reviews:", data.reviews);

  } catch (error) {
    console.error("Error fetching book:", error);
  }
}

fetchBook();

function renderBook(book) {
  const bookContainer = document.getElementById("book-container");

  bookContainer.innerHTML = `
    <div class="book-details">
      <img src="${book.image}" alt="${book.title}" class="book-image">

      <div>
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published Year:</strong> ${book.published_year}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Genres:</strong> ${book.genres.join(", ")}</p>
      </div>
    </div>

    <a href="index.html" class="btn btn-info mt-3">Back to books</a>
  `;
}

