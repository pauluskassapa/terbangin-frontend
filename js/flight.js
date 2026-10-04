
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

const searchParams = new URLSearchParams(window.location.search);

const fromCode = searchParams.get("from") || "CGK";
const toCode = searchParams.get("to") || "DPS";
const travelDate = searchParams.get("date");

const cityName = code =>
    (airportNames[code] || code).replace(/\s*\([A-Z]{3}\)$/, "");

const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const summary = document.querySelector("#search-summary");

if (
    fromSelect &&
    [...fromSelect.options].some(option => option.value === fromCode)
) {
    fromSelect.value = fromCode;
}

if (
    toSelect &&
    [...toSelect.options].some(option => option.value === toCode)
) {
    toSelect.value = toCode;
}

if (summary && fromSelect && toSelect) {
    const route =
        `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`;

    if (travelDate) {
        const dateObject = new Date(`${travelDate}T00:00:00`);

        const formattedDate = Number.isNaN(dateObject.getTime())
            ? travelDate
            : new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric"
            }).format(dateObject);

        summary.textContent = `${route} · ${formattedDate}`;
    } else {
        summary.textContent = route;
    }

    document.querySelectorAll(
        ".flight-card .flight-schedule div:first-child span"
    ).forEach(label => {
        label.textContent = `${fromCode} · ${cityName(fromCode)}`;
    });

    document.querySelectorAll(
        ".flight-card .flight-schedule div:last-child span"
    ).forEach(label => {
        label.textContent = `${toCode} · ${cityName(toCode)}`;
    });

    document.querySelectorAll(".flight-results .flight-card a").forEach(link => {
        const params = new URLSearchParams(
            new URL(link.href, window.location.href).search
        );

        // Pilihan kota dari pencarian harus menjadi sumber utama.
        params.set("from", fromCode);
        params.set("to", toCode);

        if (travelDate) {
            params.set("date", travelDate);
        }

        link.href = `flight-details.html?${params.toString()}`;
    });
}
