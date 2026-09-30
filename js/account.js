const registerForm = document.querySelector("#register-form");

if (registerForm) {
  const passwordInput = registerForm.querySelector("#register-password");
  const confirmInput = registerForm.querySelector("#confirm-password");
  const status = registerForm.querySelector("#register-status");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!registerForm.reportValidity()) return;

    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Konfirmasi kata sandi belum sama.");
      confirmInput.reportValidity();
      confirmInput.focus();
      return;
    }

    confirmInput.setCustomValidity("");
    status.textContent = "Formulir valid. Pengiriman dan penyimpanan akun akan disambungkan pada tahap berikutnya.";
  });

  confirmInput.addEventListener("input", () => {
    confirmInput.setCustomValidity("");
    status.textContent = "";
  });
}
