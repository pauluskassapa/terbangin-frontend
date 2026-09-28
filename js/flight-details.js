const params = new URLSearchParams(window.location.search);

const airline = params.get("airline");
const flightNumber = params.get("flight");
const price = Number(params.get("price"));

const formatRupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

if (airline && flightNumber) {
  document.querySelector("#flight-name").textContent =
    `${airline} · ${flightNumber}`;
}

if (Number.isFinite(price) && price > 0) {
  const formattedPrice = formatRupiah(price);
  document.querySelector("#flight-price").textContent = formattedPrice;
  document.querySelector("#flight-total").textContent = formattedPrice;
}