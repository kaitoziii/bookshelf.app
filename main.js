const books = [];
const RENDER_EVENT = 'render-book';
let isEditing = false;
let editingBookId = null;

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

function renderBooks() {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of books) {
    const bookElement = createBookElement(book);
    if (!book.isComplete) {
      incompleteBookshelfList.appendChild(bookElement);
    } else {
      completeBookshelfList.appendChild(bookElement);
    }
  }
}

function createBookElement(book) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = book.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = `Penulis: ${book.author}`;

  const bookYear = document.createElement('p');
  bookYear.innerText = `Tahun: ${book.year}`;

  const container = document.createElement('div');
  container.classList.add('book-item');
  container.append(bookTitle, bookAuthor, bookYear);

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');

  if (book.isComplete) {
    const undoButton = document.createElement('button');
    undoButton.innerText = 'Belum selesai';
    undoButton.addEventListener('click', () => undoBook(book.id));
    actionContainer.append(undoButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.innerText = 'Selesai';
    completeButton.addEventListener('click', () => completeBook(book.id));
    actionContainer.append(completeButton);
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus';
  deleteButton.addEventListener('click', () => removeBook(book.id));
  actionContainer.append(deleteButton);

  const editButton = document.createElement('button');
  editButton.innerText = 'Edit';
  editButton.addEventListener('click', () => editBook(book));
  actionContainer.append(editButton);

  container.append(actionContainer);
  return container;
}

function addBookToLibrary(book) {
  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));
  alert('Buku berhasil ditambahkan!');
}

function completeBook(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Buku berhasil dipindahkan ke rak selesai dibaca!');
  }
}

function undoBook(id) {
  const book = books.find((b) => b.id === id);
  if (book) {
    book.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Buku berhasil dipindahkan ke rak belum selesai dibaca!');
  }
}

function removeBook(id) {
  const bookIndex = books.findIndex((b) => b.id === id);
  if (bookIndex > -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Buku berhasil dihapus!');
  }
}

function editBook(book) {
  const titleInput = document.getElementById('inputBookTitle');
  const authorInput = document.getElementById('inputBookAuthor');
  const yearInput = document.getElementById('inputBookYear');
  const isCompleteInput = document.getElementById('inputBookIsComplete');
  
  isEditing = true;
  editingBookId = book.id;
  
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  isCompleteInput.checked = book.isComplete;

  const submitButton = document.getElementById('submitButton');
  submitButton.innerText = 'Perbarui Buku';
}

const form = document.getElementById('bookForm');
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('inputBookTitle').value;
  const author = document.getElementById('inputBookAuthor').value;
  const year = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;

  if (!title || !author || !year) {
    alert('Semua kolom harus diisi!');
    return;
  }

  if (isEditing) {
    const book = books.find((b) => b.id === editingBookId);
    if (book) {
      book.title = title;
      book.author = author;
      book.year = year;
      book.isComplete = isComplete;
      alert('Buku berhasil diperbarui!');
    }
    isEditing = false;
    editingBookId = null;
    document.getElementById('submitButton').innerText = 'Masukkan Buku ke rak Belum selesai dibaca';
  } else {
    const book = generateBookObject(generateId(), title, author, year, isComplete);
    addBookToLibrary(book);
  }

  form.reset();
  document.dispatchEvent(new Event(RENDER_EVENT));
});

document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );

  if (filteredBooks.length === 0) {
    alert('Buku tidak ditemukan!');
    return;
  }

  renderBooks(filteredBooks);
});

document.addEventListener(RENDER_EVENT, renderBooks);


function saveData() {
  const parsed = JSON.stringify(books);
  localStorage.setItem('books', parsed);
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem('books');
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  loadDataFromStorage();
});

document.addEventListener(RENDER_EVENT, function () {
  saveData();
});
