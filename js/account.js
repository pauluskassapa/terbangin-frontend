const PROFILE_STORAGE_KEY = "terbangin.accountProfile";

function readAccountProfile() {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "null");

    if (
      !savedProfile ||
      typeof savedProfile.fullName !== "string" ||
      typeof savedProfile.email !== "string" ||
      typeof savedProfile.phone !== "string"
    ) {
      return null;
    }

    return savedProfile;
  } catch {
    return null;
  }
}

function writeAccountProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function normalizeAndValidateAccountForm(form) {
  const fullName = form.elements.fullName;
  const email = form.elements.email;
  const phone = form.elements.phone;

  if (fullName) {
    fullName.value = fullName.value.trim();
    fullName.setCustomValidity(fullName.value.length >= 2 ? "" : "Masukkan nama lengkap minimal 2 karakter.");
  }

  if (email) email.value = email.value.trim();

  if (phone) {
    phone.value = phone.value.trim();
    const digitCount = phone.value.replace(/\D/g, "").length;
    phone.setCustomValidity(digitCount >= 8 ? "" : "Masukkan nomor telepon dengan minimal 8 angka.");
  }

  return form.reportValidity();
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  const status = loginForm.querySelector("#login-status");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!loginForm.reportValidity()) return;

    status.textContent = "Formulir valid. Verifikasi login memerlukan layanan autentikasi backend.";
  });
}

const registerForm = document.querySelector("#register-form");

if (registerForm) {
  const passwordInput = registerForm.querySelector("#register-password");
  const confirmInput = registerForm.querySelector("#confirm-password");
  const status = registerForm.querySelector("#register-status");

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    confirmInput.setCustomValidity("");

    if (!normalizeAndValidateAccountForm(registerForm)) return;

    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Konfirmasi kata sandi belum sama.");
      confirmInput.reportValidity();
      confirmInput.focus();
      return;
    }

    const formData = new FormData(registerForm);
    const profile = {
      fullName: String(formData.get("fullName")).trim(),
      email: String(formData.get("email")).trim(),
      phone: String(formData.get("phone")).trim(),
    };

    try {
      writeAccountProfile(profile);
    } catch {
      status.textContent = "Browser tidak mengizinkan penyimpanan profil. Periksa pengaturan penyimpanan browser.";
      return;
    }

    window.location.href = "profile.html";
  });

  confirmInput.addEventListener("input", () => {
    confirmInput.setCustomValidity("");
    status.textContent = "";
  });
}

const resetForm = document.querySelector("#reset-form");

if (resetForm) {
  const status = resetForm.querySelector("#reset-status");

  resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!resetForm.reportValidity()) return;

    status.textContent = "Email valid. Pengiriman instruksi pemulihan memerlukan layanan backend.";
  });
}

const profileForm = document.querySelector("#profile-form");

if (profileForm) {
  const emptyState = document.querySelector("#profile-empty");
  const profileInputs = [...profileForm.querySelectorAll("input")];
  const editButton = document.querySelector("#edit-profile-button");
  const saveButton = document.querySelector("#save-profile-button");
  const cancelButton = document.querySelector("#cancel-profile-button");
  const status = document.querySelector("#profile-status");
  let originalValues = null;

  function setEditing(isEditing) {
    profileInputs.forEach((input) => {
      input.readOnly = !isEditing;
    });
    editButton.hidden = isEditing;
    saveButton.hidden = !isEditing;
    cancelButton.hidden = !isEditing;
  }

  function showProfile(profile) {
    profileForm.elements.fullName.value = profile.fullName;
    profileForm.elements.email.value = profile.email;
    profileForm.elements.phone.value = profile.phone;
  }

  const profile = readAccountProfile();

  if (profile) {
    showProfile(profile);
    profileForm.hidden = false;
    emptyState.hidden = true;
  } else {
    profileForm.hidden = true;
    emptyState.hidden = false;
  }

  editButton.addEventListener("click", () => {
    originalValues = Object.fromEntries(profileInputs.map((input) => [input.name, input.value]));
    status.textContent = "";
    setEditing(true);
    profileForm.elements.fullName.focus();
  });

  cancelButton.addEventListener("click", () => {
    if (originalValues) showProfile(originalValues);
    profileForm.reset();
    if (originalValues) showProfile(originalValues);
    status.textContent = "Perubahan dibatalkan.";
    setEditing(false);
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!normalizeAndValidateAccountForm(profileForm)) return;

    const updatedProfile = {
      fullName: profileForm.elements.fullName.value.trim(),
      email: profileForm.elements.email.value.trim(),
      phone: profileForm.elements.phone.value.trim(),
    };

    try {
      writeAccountProfile(updatedProfile);
    } catch {
      status.textContent = "Perubahan belum tersimpan. Browser menolak akses penyimpanan lokal.";
      return;
    }

    showProfile(updatedProfile);
    originalValues = updatedProfile;
    status.textContent = "Profil berhasil diperbarui di browser ini.";
    setEditing(false);
  });
}

const passwordForm = document.querySelector("#password-form");

if (passwordForm) {
  const newPassword = passwordForm.querySelector("#new-password");
  const confirmPassword = passwordForm.querySelector("#confirm-new-password");
  const status = passwordForm.querySelector("#password-status");

  passwordForm.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    confirmPassword.setCustomValidity("");

    if (!passwordForm.reportValidity()) return;

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Konfirmasi kata sandi baru belum sama.");
      confirmPassword.reportValidity();
      confirmPassword.focus();
      return;
    }

    status.textContent = "Isian valid. Kata sandi belum diubah karena verifikasi dan penyimpanan memerlukan backend.";
    passwordForm.reset();
  });

  confirmPassword.addEventListener("input", () => {
    confirmPassword.setCustomValidity("");
    status.textContent = "";
  });
}

const logoutLink = document.querySelector("#logout-link");

if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    try {
      sessionStorage.removeItem("terbangin.accountSession");
    } catch {
      // Navigasi ke halaman masuk tetap berjalan jika penyimpanan sesi diblokir.
    }
  });
}
