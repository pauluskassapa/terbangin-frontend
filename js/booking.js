const params = new URLSearchParams(window.location.search);

const airportNames = {
    CGK: "Jakarta",
    BDO: "Bandung",
    SUB: "Surabaya",
    DPS: "Bali",
    YIA: "Yogyakarta",
    KNO: "Medan",
    BPN: "Balikpapan",
    LOP: "Lombok",
    LBJ: "Labuan Bajo",
    SOQ: "Sorong"
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
document.querySelector("#booking-flight").textContent =
    `${flightNumber} · Ekonomi`;

document.querySelector("#booking-from").textContent = fromCode;
document.querySelector("#booking-from-name").textContent =
    airportNames[fromCode] || fromCode;

document.querySelector("#booking-to").textContent = toCode;
document.querySelector("#booking-to-name").textContent =
    airportNames[toCode] || toCode;

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

        passengerForm.innerHTML = `
            <h3>Penumpang ${i}</h3>

            <div class="form-group">
                <label for="passenger-name-${i}">Nama lengkap</label>
                <input
                    type="text"
                    id="passenger-name-${i}"
                    name="passenger-name-${i}"
                    placeholder="Masukkan nama lengkap"
                    required
                >
            </div>

            <div class="form-group">
                <label for="passenger-email-${i}">Email</label>
                <input
                    type="email"
                    id="passenger-email-${i}"
                    name="passenger-email-${i}"
                    placeholder="contoh@email.com"
                    required
                >
            </div>

            <div class="form-group">
                <label for="passenger-phone-${i}">Nomor telepon</label>
                <input
                    type="tel"
                    id="passenger-phone-${i}"
                    name="passenger-phone-${i}"
                    placeholder="Contoh: 081234567890"
                    pattern="[0-9+() -]{8,20}"
                    required
                >
            </div>
        `;

        passengerList.appendChild(passengerForm);
    }

    updateTotal();
}

function updateTotal() {
    const count = Number(passengerCount.value);
    const total = price * count;

    document.querySelector("#price-passengers").textContent =
        `${count} orang`;

    document.querySelector("#ticket-total").textContent =
        formatRupiah(total);

    document.querySelector("#booking-total").textContent =
        formatRupiah(total);
}

passengerCount.addEventListener("change", createPassengerForms);

const bookingForm = document.querySelector("#booking-form");
const confirmation = document.querySelector("#booking-confirmation");
const confirmationDetails = document.querySelector("#confirmation-details");

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
        return;
    }

    const count = Number(passengerCount.value);
    const total = price * count;
    const passengers = [];

    for (let i = 1; i <= count; i++) {
        passengers.push({
            name: document.querySelector(`#passenger-name-${i}`).value.trim(),
            email: document.querySelector(`#passenger-email-${i}`).value.trim(),
            phone: document.querySelector(`#passenger-phone-${i}`).value.trim()
        });
    }

    confirmationDetails.innerHTML = "";

    function addConfirmationRow(label, value) {
        const row = document.createElement("div");
        row.className = "confirmation-row";

        const labelElement = document.createElement("span");
        labelElement.textContent = label;

        const valueElement = document.createElement("strong");
        valueElement.textContent = value;

        row.appendChild(labelElement);
        row.appendChild(valueElement);

        confirmationDetails.appendChild(row);
    }

    addConfirmationRow("Maskapai", airline);
    addConfirmationRow("Nomor penerbangan", flightNumber);
    addConfirmationRow(
        "Rute",
        `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`
    );
    addConfirmationRow("Tanggal", formatDate(travelDate));
    addConfirmationRow("Jumlah penumpang", `${count} orang`);

    passengers.forEach((passenger, index) => {
        addConfirmationRow(`Nama penumpang ${index + 1}`, passenger.name);
        addConfirmationRow(`Email penumpang ${index + 1}`, passenger.email);
        addConfirmationRow(`Telepon penumpang ${index + 1}`, passenger.phone);
    });

    addConfirmationRow("Total pembayaran", formatRupiah(total));

    const bookingDraft = {
        airline,
        flight: flightNumber,
        from: fromCode,
        to: toCode,
        date: travelDate,
        price,
        count,
        passengers,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem(
        "terbanginBookingDraft",
        JSON.stringify(bookingDraft)
    );

    const paymentParams = new URLSearchParams({
        airline,
        flight: flightNumber,
        from: fromCode,
        to: toCode,
        date: travelDate,
        price: String(price),
        count: String(count)
    });

    document.querySelector("#payment-link").href =
        `../booking-defrigo/payment.html?${paymentParams.toString()}`;

    confirmation.hidden = false;

    confirmation.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

createPassengerForms();