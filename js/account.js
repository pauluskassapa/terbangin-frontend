const ACCOUNTS_STORAGE_KEY = "terbangin.accounts.v1";
const SESSION_STORAGE_KEY = "terbangin.accountSession";
const REMEMBERED_SESSION_KEY = "terbangin.rememberedAccountSession";
const PASSWORD_HASH_ITERATIONS = 120000;

function loadAccounts() {
  const serializedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!serializedAccounts) return [];

  const accounts = JSON.parse(serializedAccounts);
  if (!Array.isArray(accounts)) throw new Error("Data akun lokal tidak valid.");
  return accounts;
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  if (typeof hex !== "string" || !/^(?:[0-9a-f]{2})+$/i.test(hex)) {
    throw new Error("Hash kata sandi lokal tidak valid.");
  }

  return new Uint8Array(hex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)));
}

async function derivePasswordHash(password, salt = null) {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error("Fitur keamanan browser tidak tersedia. Buka proyek melalui localhost atau HTTPS.");
  }

  const passwordSalt = salt || crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: passwordSalt, iterations: PASSWORD_HASH_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );

  return { salt: bytesToHex(passwordSalt), passwordHash: bytesToHex(new Uint8Array(derivedBits)) };
}

async function passwordMatches(password, account) {
  const salt = hexToBytes(account.passwordSalt);
  const result = await derivePasswordHash(password, salt);
  return result.passwordHash === account.passwordHash;
}

function usernameIsValid(username) {
  return /^[A-Za-z0-9._-]{3,20}$/.test(username);
}

function normalizeAndValidateAccountForm(form) {
  const username = form.elements.username;
  const fullName = form.elements.fullName;
  const email = form.elements.email;
  const phone = form.elements.phone;

  if (username) {
    username.value = username.value.trim();
    username.setCustomValidity(
      usernameIsValid(username.value)
        ? ""
        : "Username wajib diisi dengan 3–20 huruf, angka, titik, garis bawah, atau tanda hubung."
    );
  }

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

function getCurrentUsername() {
  try {
    const activeSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
      || localStorage.getItem(REMEMBERED_SESSION_KEY);
    if (!activeSession) return null;

    const session = JSON.parse(activeSession);
    return typeof session.username === "string" ? session.username : null;
  } catch {
    return null;
  }
}

function setAccountSession(username, rememberMe) {
  const session = JSON.stringify({ username });
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(REMEMBERED_SESSION_KEY);

  if (rememberMe) {
    localStorage.setItem(REMEMBERED_SESSION_KEY, session);
  } else {
    sessionStorage.setItem(SESSION_STORAGE_KEY, session);
  }
}

function getCurrentAccount() {
  const username = getCurrentUsername();
  if (!username) return null;

  try {
    return loadAccounts().find((account) => account.username.toLowerCase() === username.toLowerCase()) || null;
  } catch {
    return null;
  }
}

function setStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("account-status-error", isError);
}

function accountStorageErrorMessage(error) {
  if (error instanceof Error && error.message.includes("localhost atau HTTPS")) return error.message;
  return "Penyimpanan lokal browser tidak tersedia atau datanya bermasalah. Coba buka melalui localhost dan periksa pengaturan browser.";
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
  const status = loginForm.querySelector("#login-status");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "");

    if (!loginForm.reportValidity()) return;

    const identifier = loginForm.elements.identifier.value.trim().toLowerCase();
    const password = loginForm.elements.password.value;
    let accounts;

    try {
      accounts = loadAccounts();
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
      return;
    }

    const account = accounts.find((item) =>
      item.username.toLowerCase() === identifier || item.email.toLowerCase() === identifier
    );

    try {
      if (!account || !(await passwordMatches(password, account))) {
        setStatus(status, "Username/email atau kata sandi tidak cocok.", true);
        return;
      }

      setAccountSession(account.username, loginForm.elements.rememberMe.checked);
      window.location.href = "profile.html";
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
    }
  });
}

const registerForm = document.querySelector("#register-form");

if (registerForm) {
  const passwordInput = registerForm.querySelector("#register-password");
  const confirmInput = registerForm.querySelector("#confirm-password");
  const status = registerForm.querySelector("#register-status");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "");
    confirmInput.setCustomValidity("");

    if (!normalizeAndValidateAccountForm(registerForm)) return;

    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Konfirmasi kata sandi belum sama.");
      confirmInput.reportValidity();
      confirmInput.focus();
      return;
    }

    const formData = new FormData(registerForm);
    const username = String(formData.get("username")).trim();
    const email = String(formData.get("email")).trim();
    let accounts;

    try {
      accounts = loadAccounts();
      const duplicate = accounts.some((account) =>
        account.username.toLowerCase() === username.toLowerCase()
        || account.email.toLowerCase() === email.toLowerCase()
      );

      if (duplicate) {
        setStatus(status, "Username atau email sudah terdaftar di browser ini.", true);
        return;
      }

      const credentials = await derivePasswordHash(passwordInput.value);
      const account = {
        username,
        fullName: String(formData.get("fullName")).trim(),
        email,
        phone: String(formData.get("phone")).trim(),
        passwordSalt: credentials.salt,
        passwordHash: credentials.passwordHash,
      };

      saveAccounts([...accounts, account]);
      setAccountSession(username, false);
      window.location.href = "profile.html";
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
    }
  });

  confirmInput.addEventListener("input", () => {
    confirmInput.setCustomValidity("");
    setStatus(status, "");
  });
}

const resetForm = document.querySelector("#reset-form");

if (resetForm) {
  const passwordInput = resetForm.querySelector("#reset-password");
  const confirmInput = resetForm.querySelector("#reset-confirm-password");
  const status = resetForm.querySelector("#reset-status");

  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "");
    confirmInput.setCustomValidity("");

    if (!resetForm.reportValidity()) return;

    if (passwordInput.value !== confirmInput.value) {
      confirmInput.setCustomValidity("Konfirmasi kata sandi baru belum sama.");
      confirmInput.reportValidity();
      confirmInput.focus();
      return;
    }

    const username = resetForm.elements.username.value.trim();
    const email = resetForm.elements.email.value.trim();

    try {
      const accounts = loadAccounts();
      const index = accounts.findIndex((account) =>
        account.username.toLowerCase() === username.toLowerCase()
        && account.email.toLowerCase() === email.toLowerCase()
      );

      if (index < 0) {
        setStatus(status, "Email dan username tidak cocok dengan akun di browser ini.", true);
        return;
      }

      const credentials = await derivePasswordHash(passwordInput.value);
      accounts[index] = { ...accounts[index], passwordSalt: credentials.salt, passwordHash: credentials.passwordHash };
      saveAccounts(accounts);
      resetForm.reset();
      setStatus(status, "Kata sandi demo berhasil direset di browser ini. Tidak ada email yang dikirim.");
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
    }
  });

  confirmInput.addEventListener("input", () => {
    confirmInput.setCustomValidity("");
    setStatus(status, "");
  });
}

const profileForm = document.querySelector("#profile-form");

if (profileForm) {
  const emptyState = document.querySelector("#profile-empty");
  const securityPanel = document.querySelector("#security-panel");
  const profileInputs = [...profileForm.querySelectorAll("input")];
  const editButton = document.querySelector("#edit-profile-button");
  const saveButton = document.querySelector("#save-profile-button");
  const cancelButton = document.querySelector("#cancel-profile-button");
  const status = document.querySelector("#profile-status");
  let originalValues = null;
  let currentAccount = getCurrentAccount();

  function setEditing(isEditing) {
    profileInputs.forEach((input) => {
      input.readOnly = !isEditing;
    });
    editButton.hidden = isEditing;
    saveButton.hidden = !isEditing;
    cancelButton.hidden = !isEditing;
  }

  function showProfile(account) {
    profileForm.elements.username.value = account.username;
    profileForm.elements.fullName.value = account.fullName;
    profileForm.elements.email.value = account.email;
    profileForm.elements.phone.value = account.phone;
  }

  if (currentAccount) {
    showProfile(currentAccount);
    profileForm.hidden = false;
    emptyState.hidden = true;
    securityPanel.hidden = false;
  } else {
    profileForm.hidden = true;
    emptyState.hidden = false;
    securityPanel.hidden = true;
  }

  editButton.addEventListener("click", () => {
    originalValues = Object.fromEntries(profileInputs.map((input) => [input.name, input.value]));
    setStatus(status, "");
    setEditing(true);
    profileForm.elements.username.focus();
  });

  cancelButton.addEventListener("click", () => {
    if (originalValues) showProfile(originalValues);
    setStatus(status, "Perubahan dibatalkan.");
    setEditing(false);
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStatus(status, "");

    if (!normalizeAndValidateAccountForm(profileForm)) return;

    const updatedProfile = {
      username: profileForm.elements.username.value.trim(),
      fullName: profileForm.elements.fullName.value.trim(),
      email: profileForm.elements.email.value.trim(),
      phone: profileForm.elements.phone.value.trim(),
    };

    try {
      const accounts = loadAccounts();
      const duplicate = accounts.some((account) =>
        account.username.toLowerCase() !== currentAccount.username.toLowerCase()
        && (account.username.toLowerCase() === updatedProfile.username.toLowerCase()
          || account.email.toLowerCase() === updatedProfile.email.toLowerCase())
      );

      if (duplicate) {
        setStatus(status, "Username atau email sudah dipakai akun lain di browser ini.", true);
        return;
      }

      const accountIndex = accounts.findIndex((account) =>
        account.username.toLowerCase() === currentAccount.username.toLowerCase()
      );
      if (accountIndex < 0) throw new Error("Akun demo tidak ditemukan.");

      accounts[accountIndex] = { ...accounts[accountIndex], ...updatedProfile };
      saveAccounts(accounts);
      const rememberMe = Boolean(localStorage.getItem(REMEMBERED_SESSION_KEY));
      setAccountSession(updatedProfile.username, rememberMe);
      currentAccount = accounts[accountIndex];
      originalValues = updatedProfile;
      showProfile(currentAccount);
      setStatus(status, "Profil berhasil diperbarui di browser ini.");
      setEditing(false);
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
    }
  });
}

const passwordForm = document.querySelector("#password-form");

if (passwordForm) {
  const currentPassword = passwordForm.querySelector("#current-password");
  const newPassword = passwordForm.querySelector("#new-password");
  const confirmPassword = passwordForm.querySelector("#confirm-new-password");
  const status = passwordForm.querySelector("#password-status");

  passwordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(status, "");
    confirmPassword.setCustomValidity("");

    if (!passwordForm.reportValidity()) return;

    if (newPassword.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Konfirmasi kata sandi baru belum sama.");
      confirmPassword.reportValidity();
      confirmPassword.focus();
      return;
    }

    const account = getCurrentAccount();
    if (!account) {
      setStatus(status, "Sesi akun berakhir. Silakan masuk lagi.", true);
      return;
    }

    try {
      if (!(await passwordMatches(currentPassword.value, account))) {
        setStatus(status, "Kata sandi saat ini tidak cocok.", true);
        return;
      }

      const credentials = await derivePasswordHash(newPassword.value);
      const accounts = loadAccounts();
      const index = accounts.findIndex((item) => item.username.toLowerCase() === account.username.toLowerCase());
      if (index < 0) throw new Error("Akun demo tidak ditemukan.");

      accounts[index] = { ...accounts[index], passwordSalt: credentials.salt, passwordHash: credentials.passwordHash };
      saveAccounts(accounts);
      passwordForm.reset();
      setStatus(status, "Kata sandi demo berhasil diubah di browser ini.");
    } catch (error) {
      setStatus(status, accountStorageErrorMessage(error), true);
    }
  });

  confirmPassword.addEventListener("input", () => {
    confirmPassword.setCustomValidity("");
    setStatus(status, "");
  });
}

const logoutLink = document.querySelector("#logout-link");

if (logoutLink) {
  logoutLink.addEventListener("click", () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      localStorage.removeItem(REMEMBERED_SESSION_KEY);
    } catch {
      // Link tetap kembali ke halaman masuk meski penyimpanan sesi diblokir.
    }
  });
}
