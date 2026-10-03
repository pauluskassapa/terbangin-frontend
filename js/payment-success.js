const params = new URLSearchParams(window.location.search);

const airline = params.get("airline") || "Garuda Indonesia";
const flightNumber = params.get("flight") || "GA 402";
const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const travelDate = params.get("date") || "2026-10-12";
const count = Math.max(1, Number(params.get("count")) || 1);
const baggageKg = Math.max(0, Number(params.get("baggageKg")) || 0);
const baggageTotal = Math.max(0, Number(params.get("baggageTotal")) || 0);
const method = params.get("method") || "-";
const total = Math.max(0, Number(params.get("total")) || 0);

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {style: "currency",currency: "IDR",maximumFractionDigits: 0}).format(amount);
}

function formatDate(date) {
    const dateObject = new Date(`${date}T00:00:00`);

    if (Number.isNaN(dateObject.getTime())) {return date;}
    return new Intl.DateTimeFormat("id-ID", {weekday: "long",day: "numeric",month: "long",year: "numeric"}).format(dateObject);
}

const airportNames = {
    CGK: "Jakarta",
    BDO: "Bandung",
    SUB: "Surabaya",
    DPS: "Bali",
    YIA: "Yogyakarta",
    LBJ: "Labuan Bajo",
    LOP: "Lombok",
    SOQ: "Sorong / Raja Ampat",
    KNO: "Medan",
    BPN: "Balikpapan"
};

document.getElementById("success-airline").textContent = airline;
document.getElementById("success-flight").textContent = flightNumber + " · Ekonomi";
document.getElementById("success-route").textContent = `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`;
document.getElementById("success-date").textContent = formatDate(travelDate);
document.getElementById("success-passengers").textContent = count + " orang";
document.getElementById("success-baggage").textContent = baggageKg + " kg · " + formatRupiah(baggageTotal);
document.getElementById("success-method").textContent = method;
document.getElementById("success-total").textContent = formatRupiah(total);