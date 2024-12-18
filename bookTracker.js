// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const favoritesList = document.getElementById('favoritesList');

// Local Storage Keys
const FAVORITES_KEY = 'favorites';

// Fetch books from Open Library API
async function fetchBooks(query) {
  const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
  const data = await response.json();
  console.log(data);
  return data.docs.slice(0, 10); // Limit results to 10 books
}

// Render books in the UI
function renderBooks(books) {
  bookList.innerHTML = ''; // Clear previous results
  books.forEach((book) => {
    // Create book card
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    // Populate card with book data
    bookCard.innerHTML = `
      <img src="https://covers.openlibrary.org/b/id/${book.cover_i || 10909258}-M.jpg" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
      <button class="add-to-favorites">Add to Favorites</button>
    `;

    // Add event listener to "Add to Favorites" button
    const addToFavoritesButton = bookCard.querySelector('.add-to-favorites');
    addToFavoritesButton.addEventListener('click', () => addToFavorites(book));

    // Append book card to book list
    bookList.appendChild(bookCard);
  });
}

// Add book to favorites
function addToFavorites(book) {
  const favorites = getFavorites();
  const isAlreadyFavorited = favorites.some((fav) => fav.key === book.key);

  if (isAlreadyFavorited) {
    alert('This book is already in your favorites!');
    return;
  }

  favorites.push(book);
  saveFavorites(favorites);
  renderFavorites();
}

// Get favorites from local storage
function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

// Save favorites to local storage
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Render favorites in the UI
function renderFavorites() {
  const favorites = getFavorites();
  favoritesList.innerHTML = ''; // Clear previous favorites
  favorites.forEach((book) => {
    // Create favorite card
    const bookCard = document.createElement('div');
    bookCard.classList.add('book-card');

    // Populate card with book data
    bookCard.innerHTML = `
      <img src="https://covers.openlibrary.org/b/id/${book.cover_i || 10909258}-M.jpg" alt="${book.title}">
      <h3>${book.title}</h3>
      <p>${book.author_name ? book.author_name.join(', ') : 'Unknown Author'}</p>
      <button class="mark-read">Mark as Read</button>
    `;

    // Add event listener to "Mark as Read" button
    const markReadButton = bookCard.querySelector('.mark-read');
    markReadButton.addEventListener('click', () => markAsRead(bookCard));

    // Append favorite card to favorites list
    favoritesList.appendChild(bookCard);
  });
}

// Mark book as read
function markAsRead(bookCard) {
  bookCard.style.backgroundColor = '#d4edda';
  bookCard.style.borderColor = '#c3e6cb';
}

// Handle search form submission
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  const books = await fetchBooks(query);
  renderBooks(books);
});

// Initialize
renderFavorites();
