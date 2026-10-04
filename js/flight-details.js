
const params = new URLSearchParams(window.location.search);

const airportNames = {
    CGK: "Jakarta (CGK)",
    BDO: "Bandung (BDO)",
    SUB: "Surabaya (SUB)",
    DPS: "Bali (DPS)",
    YIA: "Yogyakarta (YIA)",
    KNO: "Medan (KNO)",
    LBJ: "Labuan Bajo (LBJ)",
    LOP: "Lombok (LOP)",
    SOQ: "Sorong / Raja Ampat (SOQ)",
    BPN: "Balikpapan (BPN)"
};

const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const airline = params.get("airline") || "Garuda Indonesia";
const flightNumber = params.get("flight") || "GA 402";
const price = Number(params.get("price")) || 1250000;
const travelDate = params.get("date") || "2026-10-12";

const formatRupiah = amount =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);

const route =
    `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`;

document.querySelector("#flight-route").textContent = route;

document.querySelector("#flight-departure").textContent =
    `08.00 — Berangkat dari ${airportNames[fromCode] || fromCode}`;

document.querySelector("#flight-arrival").textContent =
    `10.50 — Tiba di ${airportNames[toCode] || toCode}`;

const flightName = document.querySelector("#flight-name");
if (flightName) {
    flightName.textContent = `${airline} · ${flightNumber}`;
}

const flightPrice = document.querySelector("#flight-price");
const flightTotal = document.querySelector("#flight-total");

if (flightPrice) {
    flightPrice.textContent = formatRupiah(price);
}

if (flightTotal) {
    flightTotal.textContent = formatRupiah(price);
}

const flightDate = document.querySelector("#flight-date");
if (flightDate) {
    const dateObject = new Date(`${travelDate}T00:00:00`);

    if (!Number.isNaN(dateObject.getTime())) {
        flightDate.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(dateObject);
    }
}

const bookingParams = new URLSearchParams({
    from: fromCode,
    to: toCode,
    airline,
    flight: flightNumber,
    price: String(price),
    date: travelDate
});

document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    if (href && /booking\.html(?:\?|$)/i.test(href)) {
        link.href =
            `../booking-defrigo/booking.html?${bookingParams.toString()}`;
    }
});
