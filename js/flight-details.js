const params = new URLSearchParams(window.location.search);

const airportNames = {
  CGK: "Jakarta (CGK)",
  BDO: "Bandung (BDO)",
  SUB: "Surabaya (SUB)",
  DPS: "Bali (DPS)",
  YIA: "Yogyakarta (YIA)",
  KNO: "Medan (KNO)"
};

const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const airline = params.get("airline");
const flightNumber = params.get("flight");
const price = Number(params.get("price"));
const travelDate = params.get("date");

const formatRupiah = amount =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(amount);

const route = `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`;

document.querySelector("#flight-route").textContent = route;

if (airline && flightNumber) {
  document.querySelector("#flight-name").textContent =
    `${airline} · ${flightNumber}`;
}

if (Number.isFinite(price) && price > 0) {
  const formattedPrice = formatRupiah(price);
  document.querySelector("#flight-price").textContent = formattedPrice;
  document.querySelector("#flight-total").textContent = formattedPrice;
}

if (travelDate) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${travelDate}T00:00:00`));

  document.querySelector("#flight-date").textContent = formattedDate;
}