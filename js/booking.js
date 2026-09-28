const params = new URLSearchParams(window.location.search);

const airportNames = {
    CGK: "Jakarta",
    BDO: "Bandung",
    SUB: "Surabaya",
    DPS: "Bali",
    YIA: "Yogyakarta",
    KNO: "Medan"
};

const airline = params.get("airline") || "Garuda Indonesia";
const flightNumber = params.get("flight") || "GA 402";
const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const travelDate = params.get("date") || "2026-10-12";
const price = Number(params.get("price")) || 1250000;

const formatRupiah = amount =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);

const formatDate = date => {
    const dateObject = new Date(`${date}T00:00:00`);

    if (Number.isNaN(dateObject.getTime())) {
        return date;
    }

    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(dateObject);
};

document.querySelector("#booking-airline").textContent = airline;
document.querySelector("#booking-flight").textContent = `${flightNumber} · Ekonomi`;

document.querySelector("#booking-from").textContent = fromCode;
document.querySelector("#booking-from-name").textContent = airportNames[fromCode] || fromCode;

document.querySelector("#booking-to").textContent = toCode;
document.querySelector("#booking-to-name").textContent = airportNames[toCode] || toCode;

document.querySelector("#booking-date").textContent = formatDate(travelDate);

document.querySelector("#ticket-price").textContent = formatRupiah(price);