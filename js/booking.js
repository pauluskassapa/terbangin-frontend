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

const passengerCount = document.querySelector("#passenger-count");
const passengerList = document.querySelector("#passenger-list");

function createPassengerForms() {
    const count = Number(passengerCount.value);

    passengerList.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const passengerForm = document.createElement("div");
        passengerForm.className = "passenger-form";

        passengerForm.innerHTML = `<h3>Penumpang ${i}</h3>

        <div class="form-group">
        <label for="passenger-name-${i}">Nama lengkap</label>
        <input type="text"id="passenger-name-${i}"name="passenger-name-${i}"placeholder="Masukkan nama lengkap"required>
        </div>

        <div class="form-group">
        <label for="passenger-email-${i}">Email</label>
        <input type="email"id="passenger-email-${i}"name="passenger-email-${i}"placeholder="contoh@email.com"required>
        </div>

        <div class="form-group">
        <label for="passenger-phone-${i}">Nomor telepon</label>
        <input type="tel"id="passenger-phone-${i}"name="passenger-phone-${i}"placeholder="Contoh: 081234567890"pattern="[0-9+() -]{8,20}"required
        >
    </div>`;

    passengerList.appendChild(passengerForm);
    }

    updateTotal();
}