const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

console.log("Book ID:", bookId);

async function fetchBook() {
  try {
    const response = await fetch(API_URL + "/books/" + bookId);
    const data = await response.json();

  renderBook(data.book);
  renderReviews(data.reviews);

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

function renderReviews(reviews) {
  const bookContainer = document.getElementById("book-container");

  bookContainer.innerHTML += `
    <h2 class="mt-5">Reviews</h2>

    ${
      reviews.length === 0
        ? "<p>No reviews yet.</p>"
        : reviews
            .map(
              (review) => `
                <div class="border rounded p-3 mb-3">
                  <h4>${review.name}</h4>
                  <p>${review.content}</p>
                  <p><strong>Rating:</strong> ${review.rating}/5</p>
                  <p><small>${new Date(review.created_at).toLocaleDateString()}</small></p>
                </div>
              `,
            )
            .join("")
    }
  `;


bookContainer.innerHTML += `
    <h2 class="mt-5">Write a review</h2>

    <form id="review-form">
      <div class="mb-3">
        <label for="review-name" class="form-label">Name</label>
        <input
          type="text"
          id="review-name"
          class="form-control"
          required
        >
      </div>

      <div class="mb-3">
        <label for="review-content" class="form-label">Review</label>
        <textarea
          id="review-content"
          class="form-control"
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label for="review-rating" class="form-label">Rating (1-5)</label>
        <input
          type="number"
          id="review-rating"
          class="form-control"
          min="1"
          max="5"
          required
        >
      </div>

      <button type="submit" class="btn btn-info">
        Submit review
      </button>
    </form>
  `;
    const reviewForm = document.getElementById("review-form");
    console.log("FORM:", reviewForm);
    reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("review-form submitted");
    });
}




