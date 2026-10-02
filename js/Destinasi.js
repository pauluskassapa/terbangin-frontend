document.addEventListener('DOMContentLoaded', function () {
  const carouselTracks = document.querySelectorAll('.culinary-track');

  carouselTracks.forEach((track, index) => {
    const carousel = document.createElement('div');
    carousel.className = 'destination-carousel';
    track.classList.add('destination-carousel__track');
    track.id ||= `destination-carousel-track-${index + 1}`;
    track.parentNode.insertBefore(carousel, track);
    carousel.appendChild(track);

    const isCulinary = track.classList.contains('culinary-track');
    const label = isCulinary ? 'kartu kuliner' : 'kartu destinasi';
    const controls = document.createElement('div');
    controls.className = 'destination-carousel__controls';
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', `Navigasi ${label}`);

    const previousButton = document.createElement('button');
    previousButton.className = 'destination-carousel__button';
    previousButton.type = 'button';
    previousButton.textContent = '‹';
    previousButton.setAttribute('aria-label', `Lihat ${label} sebelumnya`);
    previousButton.setAttribute('aria-controls', track.id);

    const nextButton = document.createElement('button');
    nextButton.className = 'destination-carousel__button';
    nextButton.type = 'button';
    nextButton.textContent = '›';
    nextButton.setAttribute('aria-label', `Lihat ${label} berikutnya`);
    nextButton.setAttribute('aria-controls', track.id);

    controls.append(previousButton, nextButton);
    carousel.appendChild(controls);

    const updateButtons = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      previousButton.disabled = track.scrollLeft <= 1;
      nextButton.disabled = track.scrollLeft >= maxScroll - 1;
    };

    const moveTrack = direction => {
      const firstCard = track.querySelector('.destination-card, .culture-card');
      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      track.scrollBy({
        left: direction * (firstCard.getBoundingClientRect().width + gap),
        behavior: 'smooth'
      });
    };

    previousButton.addEventListener('click', () => moveTrack(-1));
    nextButton.addEventListener('click', () => moveTrack(1));
    track.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons, { passive: true });
    updateButtons();
  });

  const flightForm = document.getElementById('flightForm');

  if (flightForm) {
    flightForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const origin = document.getElementById('origin').value;
      const date = document.getElementById('departureDate').value;
      const passengers = Number(document.getElementById('passengers').value);
      const pageTitle = document.title.toLowerCase();
      const destinationName = document.body.dataset.destinationName ||
        (pageTitle.includes('labuan bajo') ? 'Labuan Bajo' : pageTitle.includes('yogyakarta') ? 'Yogyakarta' : 'Bali');
      const airportCode = document.body.dataset.airportCode ||
        (pageTitle.includes('labuan bajo') ? 'LBJ' : pageTitle.includes('yogyakarta') ? 'YIA' : 'DPS');
      let basePrice = Number(document.body.dataset.basePrice) || 950000;

      if (document.body.dataset.basePrice) {
        if (origin.includes('Surabaya')) basePrice *= 0.88;
        else if (origin.includes('Bali')) basePrice *= 0.78;
      } else if (destinationName === 'Labuan Bajo') {
        basePrice = origin.includes('Jakarta') ? 1750000 : origin.includes('Surabaya') ? 1400000 : origin.includes('Bali') ? 850000 : 1200000;
      } else if (destinationName === 'Yogyakarta') {
        basePrice = origin.includes('Jakarta') ? 750000 : origin.includes('Surabaya') ? 600000 : 950000;
      } else {
        basePrice = origin.includes('Jakarta') ? 950000 : origin.includes('Surabaya') ? 650000 : origin.includes('Medan') ? 1600000 : 800000;
      }

      const totalPrice = basePrice * passengers;
      const resultBox = document.getElementById('flightResult');
      const resultText = document.getElementById('resultText');

      if (resultBox && resultText) {
        resultText.innerHTML = `
          <strong>Rute:</strong> ${origin} ➔ ${destinationName} (${airportCode})<br>
          <strong>Tanggal:</strong> ${date}<br>
          <strong>Jumlah Penumpang:</strong> ${passengers} Orang<br>
          <strong>Estimasi Total Harga:</strong> <span style="font-size: 1.2rem; color: #e74c3c; font-weight: bold;">Rp ${(Math.round(totalPrice / 1000) * 1000).toLocaleString('id-ID')}</span>
        `;

        resultBox.style.display = 'block';
      }
    });
  }
});

function goToSearchFlight() {
  const body = document.body;
  const origin = document.getElementById('origin')?.value.match(/\(([A-Z]{3})\)/)?.[1] || 'CGK';
  const date = document.getElementById('departureDate')?.value || '';
  const pageTitle = document.title.toLowerCase();
  const destination = body.dataset.airportCode ||
    (pageTitle.includes('labuan bajo') ? 'LBJ' : pageTitle.includes('yogyakarta') ? 'YIA' : 'DPS');
  const query = new URLSearchParams({ from: origin, to: destination, date });
  window.location.href = `../flight-paul/search-flight.html?${query.toString()}`;
}
