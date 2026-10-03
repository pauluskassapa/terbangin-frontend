
const navbarHost = document.querySelector("#site-header");

if (navbarHost) {
  navbarHost.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="site-brand" href="../flight-paul/home.html">
          <img
            class="brand-symbol"
            src="../../assets/brand/terbangin-symbol.png"
            alt=""
          >
          <span class="brand-wordmark">TERBANGIN</span>
        </a>

        <nav class="site-nav" aria-label="Navigasi utama">
          <a href="../flight-paul/home.html">Home</a>
          <a href="../flight-paul/search-flight.html">Cari Penerbangan</a>
          <a href="../Page-Daniel/Bali.html">Destinasi</a>
          <a href="../Page-Daniel/FAQ.html">Bantuan</a>
          <a href="../perjalanan-alex/my-booking.html">My Booking</a>
          <a href="../perjalanan-alex/booking-history.html">Booking History</a>
          <a href="../account-joan/login.html">Akun</a>
        </nav>

        <div class="site-actions">
          <button class="theme-toggle" id="theme-toggle" type="button" aria-pressed="false">
            <svg class="theme-toggle-icon theme-toggle-moon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z" />
            </svg>
            <svg class="theme-toggle-icon theme-toggle-sun" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
            </svg>
            <span class="theme-toggle-label">Mode gelap</span>
          </button>
          <a class="site-login" href="../account-joan/login.html">Masuk</a>
        </div>
      </div>
    </header>
  `;

  const currentPath = window.location.pathname;

  navbarHost.querySelectorAll(".site-nav a").forEach(link => {
    const linkPath = new URL(link.href).pathname;

    if (currentPath === linkPath) {
      link.setAttribute("aria-current", "page");
    }
  });

  const themeToggle = navbarHost.querySelector("#theme-toggle");
  const themeLabel = themeToggle.querySelector(".theme-toggle-label");
  const storageKey = "terbangin-theme";

  const syncThemeToggle = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap");
    themeToggle.title = isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap";
    themeLabel.textContent = isDark ? "Mode terang" : "Mode gelap";
  };

  syncThemeToggle();
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Tema tetap bisa diganti untuk halaman ini jika penyimpanan browser dibatasi.
    }
    syncThemeToggle();
  });
}
