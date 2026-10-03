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

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {style: "currency",currency: "IDR",maximumFractionDigits: 0}).format(amount);
}

function formatDate(date) {
    const dateObject = new Date(`${date}T00:00:00`);
    if (Number.isNaN(dateObject.getTime())) {return date;}
    return new Intl.DateTimeFormat("id-ID", {weekday: "long",day: "numeric",month: "long",year: "numeric"}).format(dateObject);
}

document.getElementById("payment-airline").textContent = airline;
document.getElementById("payment-flight").textContent = flightNumber + " · Ekonomi";
document.getElementById("payment-from").textContent = fromCode;
document.getElementById("payment-to").textContent = toCode;
document.getElementById("payment-date").textContent = formatDate(travelDate);
document.getElementById("payment-passengers").textContent = count + " orang";
document.getElementById("payment-ticket-price").textContent = formatRupiah(price);
document.getElementById("payment-price-passengers").textContent = count + " orang";
document.getElementById("payment-ticket-total").textContent = formatRupiah(ticketTotal);

const baggageInput = document.getElementById("payment-baggage-kg");
const baggageTotalText = document.getElementById("payment-baggage-total");
const baggagePriceText = document.getElementById("payment-baggage-price");

function updateBaggage() {
    baggageKg = Number(baggageInput.value);
    if (isNaN(baggageKg) || baggageKg < 0) {baggageKg = 0;}

    if (baggageKg > 20) {baggageKg = 20;}
    baggageInput.value = baggageKg;
    baggageTotal = baggageKg * 200000;
    paymentTotal = ticketTotal + baggageTotal;

    baggageTotalText.textContent = formatRupiah(baggageTotal);
    baggagePriceText.textContent = formatRupiah(baggageTotal);
    document.getElementById("payment-total").textContent = formatRupiah(paymentTotal);
}

baggageInput.addEventListener("input", updateBaggage);
updateBaggage();

const paymentForm = document.getElementById("payment-form");

const confirmation = document.getElementById("payment-confirmation");

const baggagePrice = 200000;

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

function updatePaymentTotal() {
    baggageTotal = baggageKg * baggagePrice;
    paymentTotal = ticketTotal + baggageTotal;
    const baggageTotalElement = document.getElementById("payment-baggage-total");

    if (baggageTotalElement) {
        baggageTotalElement.textContent = formatRupiah(baggageTotal);
    }

    document.getElementById("payment-total").textContent = formatRupiah(paymentTotal);

    updatePaymentDetails();
}

function hidePaymentDetails() {
    paymentDetails.hidden = true;
    transferDetails.hidden = true;
    ewalletDetails.hidden = true;
    qrisDetails.hidden = true;
}

function updatePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

    if (!selectedMethod) {
        hidePaymentDetails();
        return;
    }

    paymentDetails.hidden = false;
    transferDetails.hidden = true;
    ewalletDetails.hidden = true;
    qrisDetails.hidden = true;

    if (selectedMethod.value === "Transfer Bank") {
        transferDetails.hidden = false;

        transferAmount.textContent = formatRupiah(paymentTotal);

        if (bankSelect.value) {
            virtualAccount.textContent = dummyVirtualAccounts[bankSelect.value];
        } 
        else {
            virtualAccount.textContent = "-";
        }
    }

    if (selectedMethod.value === "E-Wallet") {
        ewalletDetails.hidden = false;

        ewalletAmount.textContent = formatRupiah(paymentTotal);

        if (ewalletSelect.value) {
            ewalletCode.textContent = dummyEwalletCodes[ewalletSelect.value];
        } 
        else {
            ewalletCode.textContent = "-";
        }
    }

    if (selectedMethod.value === "QRIS") {
        qrisDetails.hidden = false;
        qrisAmount.textContent = formatRupiah(paymentTotal);
    }
}

if (baggageInput) {
    baggageInput.value = baggageKg;

    baggageInput.addEventListener("input", function () {
        baggageKg = Math.max(0,Math.min(20, Number(this.value) || 0));
        this.value = baggageKg;
        updatePaymentTotal();
    });
}

document
    .querySelectorAll('input[name="payment-method"]')
    .forEach(function (radio) {
        radio.addEventListener("change",updatePaymentDetails);
    });

if (bankSelect) {
    bankSelect.addEventListener("change",updatePaymentDetails);
}

if (ewalletSelect) {
    ewalletSelect.addEventListener("change",updatePaymentDetails);
}

updatePaymentTotal();

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

    if (!selectedMethod) {
        alert("Silakan pilih metode pembayaran terlebih dahulu.");
        return;
    }


    const paymentParams = new URLSearchParams({airline: airline,flight: flightNumber,from: fromCode,to: toCode,date: travelDate,price: String(price),count: String(count),baggageKg: String(baggageKg),baggageTotal: String(baggageTotal),method: selectedMethod.value,total: String(paymentTotal)});
    window.location.href = `payment-success.html?${paymentParams.toString()}`;
});