// js/destination.js

document.addEventListener('DOMContentLoaded', function () {
  const flightForm = document.getElementById('flightForm');

  if (flightForm) {
    flightForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Ambil nilai dari input form
      const origin = document.getElementById('origin').value;
      const date = document.getElementById('departureDate').value;
      const passengers = parseInt(document.getElementById('passengers').value);

      // Cek halaman aktif berdasarkan judul (Bali atau Labuan Bajo)
      const pageTitle = document.title.toLowerCase();
      let destinationName = 'Bali (DPS)';
      let basePrice = 800000;

      // Logika harga otomatis menyesuaikan halaman
      if (pageTitle.includes('labuan bajo')) {
        destinationName = 'Labuan Bajo (LBJ)';
        basePrice = 1200000;
        if (origin.includes('Jakarta')) basePrice = 1750000;
        else if (origin.includes('Surabaya')) basePrice = 1400000;
        else if (origin.includes('Bali')) basePrice = 850000;
      } else {
        // Default untuk halaman Bali
        if (origin.includes('Jakarta')) basePrice = 950000;
        else if (origin.includes('Surabaya')) basePrice = 650000;
        else if (origin.includes('Medan')) basePrice = 1600000;
      }

      // Hitung total harga
      const totalPrice = basePrice * passengers;

      // Tampilkan hasil ke elemen HTML
      const resultBox = document.getElementById('flightResult');
      const resultText = document.getElementById('resultText');

      if (resultBox && resultText) {
        resultText.innerHTML = `
          <strong>Rute:</strong> ${origin} ➔ ${destinationName}<br>
          <strong>Tanggal:</strong> ${date}<br>
          <strong>Jumlah Penumpang:</strong> ${passengers} Orang<br>
          <strong>Estimasi Total Harga:</strong> <span style="font-size: 1.2rem; color: #e74c3c; font-weight: bold;">Rp ${totalPrice.toLocaleString('id-ID')}</span>
        `;

        resultBox.style.display = 'block';
      }
    });
  }
});

// Fungsi untuk berpindah ke halaman pencarian tiket Paul
function goToSearchFlight() {
  window.location.href = '../flight-paul/search-flight.html';
}