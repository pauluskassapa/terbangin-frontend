const bookingForm = document.querySelector("#bookingForm");
const bookingResult = document.querySelector("#bookingResult");
const bookingMessage = document.querySelector("#bookingMessage");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookingCode = document.querySelector("#bookingCode").value.trim();
    const bookingEmail = document.querySelector("#bookingEmail").value.trim();

    if (
      bookingCode.toUpperCase() === "TRB123" &&
      bookingEmail.toLowerCase() === "alex@example.com"
    ) {
      document.querySelector("#resultCode").textContent = "TRB123";
      document.querySelector("#resultDate").textContent = "28 September 2026";

      bookingResult.classList.remove("hidden");
      bookingMessage.textContent = "";
    } else {
      bookingResult.classList.add("hidden");
      bookingMessage.textContent =
        "Booking tidak ditemukan. Silakan periksa kembali data yang dimasukkan.";
    }
  });
}

const checkinForm = document.querySelector("#checkinForm");
const checkinResult = document.querySelector("#checkinResult");
const checkinMessage = document.querySelector("#checkinMessage");

if (checkinForm) {
  checkinForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookingCode = document.querySelector("#checkinCode").value.trim();
    const lastName = document.querySelector("#lastName").value.trim();

    if (bookingCode.toUpperCase() === "TRB123" && lastName !== "") {
      document.querySelector("#checkinResultCode").textContent =
        bookingCode.toUpperCase();

      document.querySelector("#checkinResultName").textContent =
        lastName;

      checkinResult.classList.remove("hidden");
      checkinMessage.textContent = "";
    } else {
      checkinResult.classList.add("hidden");
      checkinMessage.textContent =
        "Kode booking tidak ditemukan. Silakan periksa kembali data yang dimasukkan.";
    }
  });
}