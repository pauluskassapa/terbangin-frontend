const params = new URLSearchParams(window.location.search);

const airline = params.get("airline") || "Garuda Indonesia";
const flightNumber = params.get("flight") || "GA 402";
const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const travelDate = params.get("date") || "2026-10-12";

const price = Number(params.get("price")) || 1250000;
const count = Math.max(1, Number(params.get("count")) || 1);
const baggageKgFromUrl = Number(params.get("baggageKg")) || 0;

const ticketTotal = price * count;

let baggageKg = Math.max(0, baggageKgFromUrl);
let baggageTotal = baggageKg * 200000;
let paymentTotal = ticketTotal + baggageTotal;

const airportNames = {
    CGK: "Jakarta",
    BDO: "Bandung",
    SUB: "Surabaya",
    DPS: "Bali",
    YIA: "Yogyakarta",
    KNO: "Medan",
    LBJ: "Labuan Bajo",
    LOP: "Lombok",
    SOQ: "Sorong / Raja Ampat",
    BPN: "Balikpapan"
};

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(date) {
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
}

// Informasi penerbangan
const paymentAirline = document.getElementById("payment-airline");
const paymentFlight = document.getElementById("payment-flight");
const paymentFrom = document.getElementById("payment-from");
const paymentTo = document.getElementById("payment-to");
const paymentFromName = document.getElementById("payment-from-name");
const paymentToName = document.getElementById("payment-to-name");
const paymentDate = document.getElementById("payment-date");

if (paymentAirline) {
    paymentAirline.textContent = airline;
}

if (paymentFlight) {
    paymentFlight.textContent = flightNumber + " · Ekonomi";
}

if (paymentFrom) {
    paymentFrom.textContent = fromCode;
}

if (paymentTo) {
    paymentTo.textContent = toCode;
}

if (paymentFromName) {
    paymentFromName.textContent = airportNames[fromCode] || fromCode;
}

if (paymentToName) {
    paymentToName.textContent = airportNames[toCode] || toCode;
}

if (paymentDate) {
    paymentDate.textContent = formatDate(travelDate);
}

const paymentPassengers = document.getElementById("payment-passengers");
const paymentTicketPrice = document.getElementById("payment-ticket-price");
const paymentPricePassengers = document.getElementById(
    "payment-price-passengers"
);
const paymentTicketTotal = document.getElementById("payment-ticket-total");

if (paymentPassengers) {
    paymentPassengers.textContent = count + " orang";
}

if (paymentTicketPrice) {
    paymentTicketPrice.textContent = formatRupiah(price);
}

if (paymentPricePassengers) {
    paymentPricePassengers.textContent = count + " orang";
}

if (paymentTicketTotal) {
    paymentTicketTotal.textContent = formatRupiah(ticketTotal);
}

const baggageInput = document.getElementById("payment-baggage-kg");
const baggageTotalText = document.getElementById("payment-baggage-total");
const baggagePriceText = document.getElementById("payment-baggage-price");
const baggagePrice = 200000;


const paymentForm = document.getElementById("payment-form");
const paymentDetails = document.getElementById("payment-details");
const transferDetails = document.getElementById("transfer-details");
const ewalletDetails = document.getElementById("ewallet-details");
const qrisDetails = document.getElementById("qris-details");

const bankSelect = document.getElementById("bank-select");
const ewalletSelect = document.getElementById("ewallet-select");

const virtualAccount = document.getElementById("virtual-account");
const ewalletCode = document.getElementById("ewallet-code");

const transferAmount = document.getElementById("transfer-amount");
const ewalletAmount = document.getElementById("ewallet-amount");
const qrisAmount = document.getElementById("qris-amount");

const dummyVirtualAccounts = {
    BCA: "8808123456789012",
    BRI: "8808123456789013",
    BNI: "8808123456789014",
    Mandiri: "8808123456789015"
};

const dummyEwalletCodes = {
    GoPay: "GP-DFR-812345",
    OVO: "OV-DFR-812346",
    DANA: "DN-DFR-812347",
    ShopeePay: "SP-DFR-812348"
};

function hidePaymentDetails() {
    if (paymentDetails) paymentDetails.hidden = true;
    if (transferDetails) transferDetails.hidden = true;
    if (ewalletDetails) ewalletDetails.hidden = true;
    if (qrisDetails) qrisDetails.hidden = true;
}

function updatePaymentDetails() {
    const selectedMethod = document.querySelector(
        'input[name="payment-method"]:checked'
    );

    if (!selectedMethod) {
        hidePaymentDetails();
        return;
    }

    if (paymentDetails) paymentDetails.hidden = false;
    if (transferDetails) transferDetails.hidden = true;
    if (ewalletDetails) ewalletDetails.hidden = true;
    if (qrisDetails) qrisDetails.hidden = true;

    if (selectedMethod.value === "Transfer Bank") {
        if (transferDetails) transferDetails.hidden = false;

        if (transferAmount) {
            transferAmount.textContent = formatRupiah(paymentTotal);
        }

        if (virtualAccount) {
            virtualAccount.textContent = bankSelect && bankSelect.value
                ? dummyVirtualAccounts[bankSelect.value] || "-"
                : "-";
        }
    }

    if (selectedMethod.value === "E-Wallet") {
        if (ewalletDetails) ewalletDetails.hidden = false;

        if (ewalletAmount) {
            ewalletAmount.textContent = formatRupiah(paymentTotal);
        }

        if (ewalletCode) {
            ewalletCode.textContent = ewalletSelect && ewalletSelect.value
                ? dummyEwalletCodes[ewalletSelect.value] || "-"
                : "-";
        }
    }

    if (selectedMethod.value === "QRIS") {
        if (qrisDetails) qrisDetails.hidden = false;

        if (qrisAmount) {
            qrisAmount.textContent = formatRupiah(paymentTotal);
        }
    }
}

function updatePaymentTotal() {
    baggageTotal = baggageKg * baggagePrice;
    paymentTotal = ticketTotal + baggageTotal;

    if (baggageTotalText) {
        baggageTotalText.textContent = formatRupiah(baggageTotal);
    }

    if (baggagePriceText) {
        baggagePriceText.textContent = formatRupiah(baggageTotal);
    }

    const paymentTotalElement = document.getElementById("payment-total");

    if (paymentTotalElement) {
        paymentTotalElement.textContent = formatRupiah(paymentTotal);
    }

    updatePaymentDetails();
}

if (baggageInput) {
    baggageInput.value = baggageKg;

    baggageInput.addEventListener("input", function () {
        baggageKg = Math.max(0, Math.min(20, Number(this.value) || 0));
        this.value = baggageKg;
        updatePaymentTotal();
    });
}

document
    .querySelectorAll('input[name="payment-method"]')
    .forEach(function (radio) {
        radio.addEventListener("change", updatePaymentDetails);
    });

if (bankSelect) {
    bankSelect.addEventListener("change", updatePaymentDetails);
}

if (ewalletSelect) {
    ewalletSelect.addEventListener("change", updatePaymentDetails);
}

updatePaymentTotal();

if (paymentForm) {
    paymentForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedMethod = document.querySelector(
            'input[name="payment-method"]:checked'
        );

        if (!selectedMethod) {
            alert("Silakan pilih metode pembayaran terlebih dahulu.");
            return;
        }

        if (
            selectedMethod.value === "Transfer Bank" &&
            (!bankSelect || !bankSelect.value)
        ) {
            alert("Silakan pilih bank terlebih dahulu.");
            return;
        }

        if (
            selectedMethod.value === "E-Wallet" &&
            (!ewalletSelect || !ewalletSelect.value)
        ) {
            alert("Silakan pilih E-Wallet terlebih dahulu.");
            return;
        }

        let bookingDraft;

        try {
            bookingDraft = JSON.parse(
                localStorage.getItem("terbanginBookingDraft") || "null"
            );
        } catch (error) {
            bookingDraft = null;
        }

        if (
            !bookingDraft ||
            !Array.isArray(bookingDraft.passengers) ||
            bookingDraft.passengers.length === 0
        ) {
            alert("Data penumpang tidak ditemukan. Silakan ulangi pemesanan.");
            return;
        }

        const bookingCode =
            "TRB" + Math.random().toString(36).slice(2, 8).toUpperCase();

        const booking = {
            ...bookingDraft,
            airline,
            flight: flightNumber,
            from: fromCode,
            to: toCode,
            date: travelDate,
            price,
            count,
            code: bookingCode,
            email: bookingDraft.passengers[0].email,
            baggageKg,
            baggageTotal,
            method: selectedMethod.value,
            total: paymentTotal,
            status: "Pembayaran Berhasil",
            checkedIn: false,
            paidAt: new Date().toISOString()
        };

        let bookings = [];

        try {
            bookings = JSON.parse(
                localStorage.getItem("terbanginBookings") || "[]"
            );

            if (!Array.isArray(bookings)) {
                bookings = [];
            }
        } catch (error) {
            bookings = [];
        }

        bookings.push(booking);

        localStorage.setItem(
            "terbanginBookings",
            JSON.stringify(bookings)
        );

        localStorage.removeItem("terbanginBookingDraft");

        const paymentParams = new URLSearchParams({
            airline,
            flight: flightNumber,
            from: fromCode,
            to: toCode,
            date: travelDate,
            price: String(price),
            count: String(count),
            baggageKg: String(baggageKg),
            baggageTotal: String(baggageTotal),
            method: selectedMethod.value,
            total: String(paymentTotal),
            bookingCode
        });

        window.location.href =
            `payment-success.html?${paymentParams.toString()}`;
    });
}