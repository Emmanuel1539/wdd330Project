const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const bookList = document.getElementById('bookList');
const favoritesList = document.getElementById('favoritesList');
const readLaterList = document.getElementById('readLaterList');

// Fetch books from OpenLibrary API with error handling
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const query = searchInput.value;
  try {
    fetch(`https://openlibrary.org/search.json?q=${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch books from API');
        }
        return response.json();
      })
      .then((data) => displayBooks(data.docs))
      .catch((error) => showNotification(`Error: ${error.message}`, 'error'));
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
});

// Display books on the page with error handling
function displayBooks(books) {
  try {
    bookList.innerHTML = '';
    if (!Array.isArray(books)) {
      throw new Error('Books data is not in the expected format');
    }

    // Limit the number of books to 20
    const limitedBooks = books.slice(0, 20);

    limitedBooks.forEach((book) => {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>by ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
        <button class="add-to-favorites">Add to Favorites</button>
        <button class="add-to-read-later">Add to Read Later</button>
      `;
      
      // Add to favorites event
      const addToFavoritesButton = bookCard.querySelector('.add-to-favorites');
      addToFavoritesButton.addEventListener('click', function () {
        try {
          addToFavorites(book);
        } catch (error) {
          showNotification(`Error adding to favorites: ${error.message}`, 'error');
        }
      });

      // Add to Read Later event
      const addToReadLaterButton = bookCard.querySelector('.add-to-read-later');
      addToReadLaterButton.addEventListener('click', function () {
        try {
          addToReadLater(book);
        } catch (error) {
          showNotification(`Error adding to Read Later: ${error.message}`, 'error');
        }
      });

      bookList.appendChild(bookCard);
    });
  } catch (error) {
    showNotification(`Error: ${error.message}`, 'error');
  }
}


// Add book to favorites with error handling
function addToFavorites(book) {
  try {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.some(fav => fav.key === book.key)) {
      favorites.push(book);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      showNotification('Book added to favorites!', 'success');
      updateFavorites();
    }
  } catch (error) {
    showNotification(`Error adding to favorites: ${error.message}`, 'error');
  }
}

// Remove book from favorites with error handling
function removeFromFavorites(bookKey) {
  try {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.key !== bookKey);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavorites();
    showNotification('Book removed from favorites!', 'error');
  } catch (error) {
    showNotification(`Error removing from favorites: ${error.message}`, 'error');
  }
}

// Add book to Read Later with error handling
function addToReadLater(book) {
  try {
    let readLater = JSON.parse(localStorage.getItem('readLater')) || [];
    if (!readLater.some(item => item.key === book.key)) {
      readLater.push(book);
      localStorage.setItem('readLater', JSON.stringify(readLater));
      showNotification('Book added to Read Later!', 'success');
      updateReadLater();
    }
  } catch (error) {
    showNotification(`Error adding to Read Later: ${error.message}`, 'error');
  }
}

// Remove book from Read Later with error handling
function removeFromReadLater(bookKey) {
  try {
    let readLater = JSON.parse(localStorage.getItem('readLater')) || [];
    readLater = readLater.filter(item => item.key !== bookKey);
    localStorage.setItem('readLater', JSON.stringify(readLater));
    updateReadLater();
    showNotification('Book removed from Read Later!', 'error');
  } catch (error) {
    showNotification(`Error removing from Read Later: ${error.message}`, 'error');
  }
}

// Update the UI with favorite books with error handling
function updateFavorites() {
  try {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesList.innerHTML = '';
    favorites.forEach((book) => {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>by ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
        <button class="remove-from-favorites">Remove from Favorites</button>
      `;
      const removeButton = bookCard.querySelector('.remove-from-favorites');
      removeButton.addEventListener('click', () => removeFromFavorites(book.key));
      favoritesList.appendChild(bookCard);
    });
  } catch (error) {
    showNotification(`Error updating favorites: ${error.message}`, 'error');
  }
}

// Update the UI with Read Later books with error handling
function updateReadLater() {
  try {
    const readLater = JSON.parse(localStorage.getItem('readLater')) || [];
    readLaterList.innerHTML = '';
    readLater.forEach((book) => {
      const bookCard = document.createElement('div');
      bookCard.classList.add('book-card');
      bookCard.innerHTML = `
        <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>by ${book.author_name ? book.author_name.join(', ') : 'Unknown'}</p>
        <button class="remove-from-read-later">Remove from Read Later</button>
      `;
      const removeButton = bookCard.querySelector('.remove-from-read-later');
      removeButton.addEventListener('click', () => removeFromReadLater(book.key));
      readLaterList.appendChild(bookCard);
    });
  } catch (error) {
    showNotification(`Error updating Read Later: ${error.message}`, 'error');
  }
}

// Show a notification when a book is added or removed with error handling
function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.classList.add('notification', type);
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize the UI with error handling
function initializeUI() {
  try {
    updateFavorites();
    updateReadLater();
  } catch (error) {
    showNotification(`Error initializing UI: ${error.message}`, 'error');
  }
}

initializeUI();
