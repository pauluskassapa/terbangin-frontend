const navbarHost = document.querySelector("#site-header");

if (navbarHost) {
  navbarHost.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="site-brand" href="../flight-paul/home.html">
          <img class="brand-symbol" src="../../assets/images/terbangin-symbol.png" alt="">
          <span class="brand-wordmark">TERBANGIN</span>
        </a>

        <nav class="site-nav" aria-label="Navigasi utama">
          <a href="../flight-paul/home.html">Home</a>
          <a href="../flight-paul/search-flight.html">Cari Penerbangan</a>
          <a href="../Page-Daniel/Bali.html">Destinasi</a>
          <a href="../account-joan/login.html">Akun</a>
        </nav>

        <a class="site-login" href="../account-joan/login.html">Masuk</a>
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
}
