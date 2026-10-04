document.addEventListener("DOMContentLoaded", function () {
  const STORAGE_KEY = "terbanginBookings";

  function getBookings() {
    try {
      const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      return [];
    }
  }

  function saveBookings(bookings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getCity(code) {
    const cities = {
      CGK: "Jakarta",
      DPS: "Bali",
      SUB: "Surabaya",
      YIA: "Yogyakarta",
      BDO: "Bandung",
      KNO: "Medan",
      BPN: "Balikpapan",
      LOP: "Lombok",
      LBJ: "Labuan Bajo",
      SOQ: "Sorong"
    };

    return cities[code] || code || "-";
  }

  function formatDate(date) {
    if (!date) return "-";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) return date;

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(parsed);
  }

  function formatRupiah(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(Number(amount) || 0);
  }

  function getPassengers(booking) {
    return Array.isArray(booking.passengers) ? booking.passengers : [];
  }

  function getLastName(passenger) {
    const explicitLastName =
      passenger.lastName ||
      passenger.lastname ||
      passenger.last_name ||
      passenger.namaBelakang ||
      passenger.nama_belakang;

    if (explicitLastName) {
      return normalize(explicitLastName);
    }

    const fullName =
      passenger.name ||
      passenger.fullName ||
      passenger.fullname ||
      passenger.nama ||
      passenger.passengerName ||
      "";

    const parts = String(fullName).trim().split(/\s+/).filter(Boolean);

    return normalize(parts.length > 1 ? parts[parts.length - 1] : parts[0]);
  }

  function findBooking(code) {
    return getBookings().find(function (booking) {
      return normalize(booking.code) === normalize(code);
    });
  }

  const bookingForm = document.getElementById("bookingForm");

  if (bookingForm) {
    const bookingCode = document.getElementById("bookingCode");
    const bookingEmail = document.getElementById("bookingEmail");
    const bookingMessage = document.getElementById("bookingMessage");
    const bookingResult = document.getElementById("bookingResult");

    bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const code = bookingCode.value.trim();
      const email = normalize(bookingEmail.value);

      const booking = findBooking(code);

      if (!booking) {
        bookingResult.classList.add("hidden");
        bookingMessage.textContent =
          "Booking tidak ditemukan. Periksa kembali kode booking.";
        return;
      }

      const passengers = getPassengers(booking);

      const emailMatches = passengers.some(function (passenger) {
        return normalize(passenger.email) === email;
      }) || normalize(booking.email) === email;

      if (!emailMatches) {
        bookingResult.classList.add("hidden");
        bookingMessage.textContent =
          "Email tidak sesuai dengan data pemesanan.";
        return;
      }

      bookingMessage.textContent = "";
      bookingResult.classList.remove("hidden");

      document.getElementById("resultCode").textContent =
        booking.code || "-";

      document.getElementById("resultFrom").textContent =
        `${getCity(booking.from)} (${booking.from || "-"})`;

      document.getElementById("resultTo").textContent =
        `${getCity(booking.to)} (${booking.to || "-"})`;

      document.getElementById("resultDate").textContent =
        formatDate(booking.date);

      document.getElementById("resultAirline").textContent =
        booking.airline || "-";

      const passengerCount = passengers.length;
      const infoValues = bookingResult.querySelectorAll(".booking-info > div");

      if (infoValues[2]) {
        infoValues[2].querySelector("strong").textContent =
          `${passengerCount} Penumpang`;
      }

      if (infoValues[3]) {
        infoValues[3].querySelector("strong").textContent =
          booking.checkedIn ? "Sudah Check-in" : "Siap Berangkat";
      }

      const statusBadge = bookingResult.querySelector(".status-badge");

      if (statusBadge) {
        statusBadge.textContent = booking.status || "Dikonfirmasi";
      }

      const checkinLink = bookingResult.querySelector(
        'a[href="online-checkin.html"]'
      );

      if (checkinLink) {
        checkinLink.href =
          `online-checkin.html?code=${encodeURIComponent(booking.code)}`;
      }
    });
  }

  //chekin online

  const checkinForm = document.getElementById("checkinForm");

  if (checkinForm) {
    const codeInput = document.getElementById("checkinCode");
    const lastNameInput = document.getElementById("lastName");
    const checkinMessage = document.getElementById("checkinMessage");
    const seatSection = document.getElementById("seatSection");
    const seatMap = document.getElementById("seatMap");
    const selectedSeatLabel = document.getElementById("selectedSeatLabel");
    const confirmSeat = document.getElementById("confirmSeat");
    const seatMessage = document.getElementById("seatMessage");
    const checkinResult = document.getElementById("checkinResult");

    let activeCode = "";
    let activePassengerIndex = -1;
    let selectedSeat = "";
    let activeBooking = null;

    const params = new URLSearchParams(window.location.search);

    if (params.get("code")) {
      codeInput.value = params.get("code");
    }

    checkinForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const code = codeInput.value.trim();
      const lastName = normalize(lastNameInput.value);
      const booking = findBooking(code);

      seatSection.classList.add("hidden");
      checkinResult.classList.add("hidden");
      checkinMessage.textContent = "";
      seatMessage.textContent = "";
      selectedSeat = "";
      activePassengerIndex = -1;
      activeBooking = null;
      confirmSeat.disabled = true;

      if (!booking) {
        checkinMessage.textContent =
          "Booking tidak ditemukan. Periksa kembali kode booking.";
        return;
      }

      if (booking.status !== "Pembayaran Berhasil") {
        checkinMessage.textContent =
          "Pemesanan belum berstatus pembayaran berhasil.";
        return;
      }

      const passengers = getPassengers(booking);

      const passengerIndex = passengers.findIndex(function (passenger) {
        return getLastName(passenger) === lastName;
      });

      if (passengerIndex === -1) {
        checkinMessage.textContent =
          "Nama belakang tidak cocok dengan data penumpang.";
        return;
      }

      const passenger = passengers[passengerIndex];

      if (passenger.checkedIn || passenger.seat) {
        checkinMessage.textContent =
          `Penumpang sudah memiliki kursi ${passenger.seat || ""}.`;
        return;
      }

      activeCode = booking.code;
      activePassengerIndex = passengerIndex;
      activeBooking = booking;

      checkinMessage.textContent =
        `Booking ditemukan. Silakan pilih kursi untuk ${passenger.name || passenger.fullName || passenger.nama || "penumpang"}.`;

      renderSeats();
      seatSection.classList.remove("hidden");
    });

    function renderSeats() {
      seatMap.innerHTML = "";
      selectedSeat = "";
      selectedSeatLabel.textContent = "Belum dipilih";
      confirmSeat.disabled = true;

      const bookings = getBookings();
      const occupiedSeats = [];

      bookings.forEach(function (booking) {
        getPassengers(booking).forEach(function (passenger) {
          if (
            passenger.seat &&
            passenger.checkedIn &&
            booking.code !== activeCode
          ) {
            occupiedSeats.push(passenger.seat);
          }
        });
      });

      getPassengers(activeBooking).forEach(function (passenger, index) {
        if (
          index !== activePassengerIndex &&
          passenger.seat
        ) {
          occupiedSeats.push(passenger.seat);
        }
      });

      const letters = ["A", "B", "C", "D", "E", "F"];

      for (let row = 1; row <= 15; row++) {
        letters.forEach(function (letter, column) {
          if (column === 3) {
            const aisle = document.createElement("span");
            aisle.className = "seat-aisle";
            seatMap.appendChild(aisle);
          }

          const seatCode = `${row}${letter}`;
          const seat = document.createElement("button");

          seat.type = "button";
          seat.className = "seat";
          seat.textContent = seatCode;
          seat.setAttribute("aria-label", `Kursi ${seatCode}`);

          if (occupiedSeats.includes(seatCode)) {
            seat.classList.add("occupied");
            seat.disabled = true;
            seat.setAttribute("aria-label", `Kursi ${seatCode} terisi`);
          } else {
            seat.classList.add("available");

            seat.addEventListener("click", function () {
              selectedSeat = seatCode;

              seatMap.querySelectorAll(".seat.selected").forEach(
                function (item) {
                  item.classList.remove("selected");
                  item.classList.add("available");
                }
              );

              seat.classList.remove("available");
              seat.classList.add("selected");

              selectedSeatLabel.textContent = seatCode;
              confirmSeat.disabled = false;
              seatMessage.textContent = "";
            });
          }

          seatMap.appendChild(seat);
        });
      }
    }

    confirmSeat.addEventListener("click", function () {
      if (!activeCode || activePassengerIndex < 0 || !selectedSeat) {
        seatMessage.textContent = "Silakan pilih kursi terlebih dahulu.";
        return;
      }

      const bookings = getBookings();
      const bookingIndex = bookings.findIndex(function (booking) {
        return normalize(booking.code) === normalize(activeCode);
      });

      if (bookingIndex === -1) {
        seatMessage.textContent = "Data booking tidak ditemukan lagi.";
        return;
      }

      const booking = bookings[bookingIndex];
      const passenger = getPassengers(booking)[activePassengerIndex];

      if (!passenger) {
        seatMessage.textContent = "Data penumpang tidak ditemukan.";
        return;
      }

      const seatAlreadyTaken = bookings.some(function (item) {
        return getPassengers(item).some(function (person) {
          return (
            person.seat === selectedSeat &&
            person.checkedIn &&
            !(normalize(item.code) === normalize(activeCode) &&
              person === passenger)
          );
        });
      });

      if (seatAlreadyTaken) {
        seatMessage.textContent =
          "Kursi baru saja digunakan. Silakan pilih kursi lain.";
        renderSeats();
        return;
      }

      passenger.seat = selectedSeat;
      passenger.checkedIn = true;
      booking.checkedIn = getPassengers(booking).every(function (person) {
        return Boolean(person.checkedIn);
      });

      saveBookings(bookings);

      document.getElementById("checkinResultCode").textContent =
        booking.code || "-";

      document.getElementById("checkinResultName").textContent =
        passenger.name ||
        passenger.fullName ||
        passenger.nama ||
        `${passenger.firstName || ""} ${passenger.lastName || ""}`.trim() ||
        "-";

      document.getElementById("checkinResultRoute").textContent =
        `${getCity(booking.from)} (${booking.from || "-"}) → ${getCity(booking.to)} (${booking.to || "-"})`;

      document.getElementById("checkinResultSeat").textContent = selectedSeat;

      seatSection.classList.add("hidden");
      checkinResult.classList.remove("hidden");
      checkinMessage.textContent = "";
    });
  }


  //booking history

  const statusFilter = document.getElementById("statusFilter");
  const bookingList = document.getElementById("bookingList");
  const emptyHistory = document.getElementById("emptyHistory");

  if (statusFilter && bookingList && emptyHistory) {
    function getStatus(booking) {
      if (booking.status === "Pembayaran Berhasil") return "selesai";
      if (booking.status === "Dibatalkan") return "dibatalkan";
      return "menunggu";
    }

    function renderHistory() {
      const selectedStatus = statusFilter.value;

      const bookings = getBookings()
        .filter(function (booking) {
          return selectedStatus === "semua" ||
            getStatus(booking) === selectedStatus;
        })
        .sort(function (a, b) {
          return new Date(b.paidAt || b.createdAt || 0) -
            new Date(a.paidAt || a.createdAt || 0);
        });

      bookingList.innerHTML = "";

      if (bookings.length === 0) {
        emptyHistory.hidden = false;
        return;
      }

      emptyHistory.hidden = true;

      bookings.forEach(function (booking) {
        const passengers = getPassengers(booking);
        const card = document.createElement("article");
        card.className = "history-card";

        const top = document.createElement("div");
        top.className = "history-card-top";

        const codeBlock = document.createElement("div");
        const label = document.createElement("span");
        label.className = "history-label";
        label.textContent = "Kode Booking";

        const code = document.createElement("h3");
        code.textContent = booking.code || "-";

        codeBlock.append(label, code);

        const badge = document.createElement("span");
        badge.className = `history-status status-${getStatus(booking)}`;
        badge.textContent =
          getStatus(booking) === "selesai" ? "Pembayaran Berhasil" :
          getStatus(booking) === "dibatalkan" ? "Dibatalkan" :
          "Menunggu Pembayaran";

        top.append(codeBlock, badge);

        const route = document.createElement("div");
        route.className = "history-route";

        const from = document.createElement("div");
        from.className = "history-city";

        const fromName = document.createElement("strong");
        fromName.textContent =
          `${getCity(booking.from)} (${booking.from || "-"})`;

        const fromText = document.createElement("span");
        fromText.textContent = "Kota keberangkatan";
        from.append(fromName, fromText);

        const arrow = document.createElement("span");
        arrow.className = "history-arrow";
        arrow.textContent = "→";

        const to = document.createElement("div");
        to.className = "history-city";

        const toName = document.createElement("strong");
        toName.textContent =
          `${getCity(booking.to)} (${booking.to || "-"})`;

        const toText = document.createElement("span");
        toText.textContent = "Kota tujuan";
        to.append(toName, toText);

        route.append(from, arrow, to);

        const info = document.createElement("div");
        info.className = "history-info";

        function addInfo(title, value) {
          const item = document.createElement("div");
          const itemLabel = document.createElement("span");
          const itemValue = document.createElement("strong");

          itemLabel.textContent = title;
          itemValue.textContent = value;
          item.append(itemLabel, itemValue);
          info.appendChild(item);
        }

        addInfo("Tanggal Penerbangan", formatDate(booking.date));
        addInfo("Maskapai", booking.airline || "-");
        addInfo("Jumlah Penumpang", `${passengers.length} orang`);
        addInfo("Total Harga", formatRupiah(booking.total));

        const seats = passengers
          .map(function (passenger) {
            return passenger.seat;
          })
          .filter(Boolean);

        if (seats.length) {
          addInfo("Kursi", seats.join(", "));
        }

        card.append(top, route, info);
        bookingList.appendChild(card);
      });
    }

    statusFilter.addEventListener("change", renderHistory);
    renderHistory();
  }
});