const API_BASE_URL = "http://localhost:8080";

const bookForm = document.getElementById("bookForm");
const bookTableBody = document.getElementById("bookTableBody");

document.addEventListener("DOMContentLoaded", function () {
  loadBooks();
});

bookForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("도서 등록 폼 제출됨");

  const bookFormData = new FormData(bookForm);
  bookFormData.forEach((value, key) => {
    console.log(key + " = " + value);
  });

  const bookData = {
    title: bookFormData.get("title").trim(),
    author: bookFormData.get("author").trim(),
    isbn: bookFormData.get("isbn").trim(),
    price: parseFloat(bookFormData.get("price")),
    publishDate: bookFormData.get("publishDate"),
  };

  console.log("bookData 객체:", bookData);
});

function loadBooks() {
  console.log("도서 목록 로드 중...");
}
