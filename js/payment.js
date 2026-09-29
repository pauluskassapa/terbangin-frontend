const params = new URLSearchParams(window.location.search);

const airline = params.get("airline") || "Garuda Indonesia";
const flightNumber = params.get("flight") || "GA 402";
const fromCode = params.get("from") || "CGK";
const toCode = params.get("to") || "DPS";
const travelDate = params.get("date") || "12 Oktober 2026";

const price = Number(params.get("price")) || 1250000;
const count = Math.max(1, Number(params.get("count")) || 1);

const total = price * count;

function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(amount);
}

document.getElementById("payment-airline").textContent = airline;
document.getElementById("payment-flight").textContent = flightNumber + " · Ekonomi";
document.getElementById("payment-from").textContent = fromCode;
document.getElementById("payment-to").textContent = toCode;
document.getElementById("payment-date").textContent = travelDate;
document.getElementById("payment-passengers").textContent = count + " orang";
document.getElementById("payment-ticket-price").textContent = formatRupiah(price);
document.getElementById("payment-price-passengers").textContent = count + " orang";
document.getElementById("payment-ticket-total").textContent = formatRupiah(total);
document.getElementById("payment-total").textContent = formatRupiah(total);

const paymentForm = document.getElementById("payment-form");
const confirmation = document.getElementById("payment-confirmation");

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');

    if (!selectedMethod) {
        alert("Silakan pilih metode pembayaran terlebih dahulu.");
        return;
    }

    document.getElementById("confirmed-method").textContent = selectedMethod.value;
    document.getElementById("confirmed-total").textContent = formatRupiah(total);
    
    confirmation.hidden = false;

    paymentForm.closest(".payment-card").hidden = true;

    confirmation.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});