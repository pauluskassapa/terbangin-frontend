const airportNames = {
  CGK: "Jakarta (CGK)",
  BDO: "Bandung (BDO)",
  SUB: "Surabaya (SUB)",
  DPS: "Bali (DPS)",
  YIA: "Yogyakarta (YIA)",
  KNO: "Medan (KNO)"
};

const searchParams = new URLSearchParams(window.location.search);
const fromCode = searchParams.get("from") || "CGK";
const toCode = searchParams.get("to") || "DPS";
const travelDate = searchParams.get("date");

const fromSelect = document.querySelector("#from");
const toSelect = document.querySelector("#to");
const summary = document.querySelector("#search-summary");

if (fromSelect && [...fromSelect.options].some(option => option.value === fromCode)) {
  fromSelect.value = fromCode;
}

if (toSelect && [...toSelect.options].some(option => option.value === toCode)) {
  toSelect.value = toCode;
}

if (travelDate && summary) {
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(`${travelDate}T00:00:00`));

  summary.textContent =
    `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode} · ${formattedDate}`;

  document.querySelectorAll("main > section:last-child article > p:first-of-type")
    .forEach(route => {
      route.textContent =
        `${airportNames[fromCode] || fromCode} → ${airportNames[toCode] || toCode}`;
    });

    document.querySelectorAll('main > section:last-child article a').forEach(link => {
  const params = new URLSearchParams({
    from: fromCode,
    to: toCode
  });

  if (travelDate) {
    params.set("date", travelDate);
  }

  const linkUrl = new URL(link.href);
  const flightParams = new URLSearchParams(linkUrl.search);

  flightParams.forEach((value, key) => {
    params.set(key, value);
  });

  link.href = `flight-details.html?${params.toString()}`;
});
}