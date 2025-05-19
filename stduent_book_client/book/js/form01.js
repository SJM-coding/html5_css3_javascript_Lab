// book.js
const API_BASE_URL = "http://localhost:8080";
let editingBookId = null;

const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");
const cancelButton = document.querySelector(".cancel-btn");
const submitButton = document.querySelector("button[type='submit']");

document.addEventListener("DOMContentLoaded", () => loadBooks());

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(bookForm);

  const bookData = {
    title: formData.get("title").trim(),
    author: formData.get("author").trim(),
    isbn: formData.get("isbn").trim(),
    price: parseFloat(formData.get("price")),
    publishDate: formData.get("publishDate") || null
  };

  if (!validateBook(bookData)) return;

  if (editingBookId) {
    updateBook(editingBookId, bookData);
  } else {
    createBook(bookData);
  }
});

cancelButton.addEventListener("click", resetForm);

function validateBook(book) {
  if (!book.title || !book.author || !book.isbn || isNaN(book.price)) {
    alert("모든 필드를 올바르게 입력해주세요.");
    return false;
  }
  return true;
}

function loadBooks() {
  fetch(`${API_BASE_URL}/api/books`)
    .then((res) => {
      if (!res.ok) throw new Error("도서 목록을 불러올 수 없습니다.");
      return res.json();
    })
    .then((books) => renderBookTable(books))
    .catch((err) => alert(err.message));
}

function renderBookTable(books) {
  bookTableBody.innerHTML = "";
  books.forEach((book) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td>${book.price}</td>
      <td>${book.publishDate ?? '-'}</td>
      <td>
        <button onclick="editBook(${book.id})">수정</button>
        <button onclick="deleteBook(${book.id})">삭제</button>
      </td>
    `;
    bookTableBody.appendChild(row);
  });
}

function createBook(bookData) {
  fetch(`${API_BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData)
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "도서 등록 실패");
      }
      return res.json();
    })
    .then(() => {
      alert("도서가 등록되었습니다.");
      resetForm();
      loadBooks();
    })
    .catch((err) => alert(err.message));
}

function editBook(bookId) {
  fetch(`${API_BASE_URL}/api/books/${bookId}`)
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "도서를 불러오지 못했습니다.");
      }
      return res.json();
    })
    .then((book) => {
      bookForm.title.value = book.title;
      bookForm.author.value = book.author;
      bookForm.isbn.value = book.isbn;
      bookForm.price.value = book.price;
      bookForm.publishDate.value = book.publishDate || "";

      editingBookId = bookId;
      submitButton.textContent = "도서 수정";
      cancelButton.style.display = "inline-block";
    })
    .catch((err) => alert(err.message));
}

function updateBook(bookId, bookData) {
  fetch(`${API_BASE_URL}/api/books/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData)
  })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "도서 수정 실패");
      }
      return res.json();
    })
    .then(() => {
      alert("도서가 수정되었습니다.");
      resetForm();
      loadBooks();
    })
    .catch((err) => alert(err.message));
}

function deleteBook(bookId) {
  if (!confirm(`ID ${bookId} 도서를 삭제하시겠습니까?`)) return;

  fetch(`${API_BASE_URL}/api/books/${bookId}`, { method: "DELETE" })
    .then(async (res) => {
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "도서 삭제 실패");
      }
      alert("도서가 삭제되었습니다.");
      loadBooks();
    })
    .catch((err) => alert(err.message));
}

function resetForm() {
  bookForm.reset();
  editingBookId = null;
  submitButton.textContent = "도서 등록";
  cancelButton.style.display = "none";
}
