document.addEventListener("DOMContentLoaded", () => {
  const seatMap = document.getElementById("seat-map");
  const bookSeatButton = document.getElementById("book-seat");
  const addSeatButton = document.getElementById("add-seat");
  const deleteSeatsButton = document.getElementById("delete-seats");
  const jobCodeInput = document.getElementById("job-code");
  const timeSlotSelect = document.getElementById("time-slot");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const viewDateInput = document.getElementById("view-date");
  const filterDateInput = document.getElementById("filter-date");
  const todayButton = document.getElementById("today-button");
  const summaryTableBody = document.querySelector("#summary-table tbody");

  let seatNumbers = Array.from({ length: 20 }, (_, i) => 4001 + i); // Generate initial seat numbers

  // Storage for seat bookings
  const seatBookings = {};

  // Storage for job codes
  const jobCodes = new Set();

  // Function to create seat element
  function createSeat(number) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.setAttribute("data-seat-number", number);
    const seatNumberDiv = document.createElement("div");
    seatNumberDiv.classList.add("seat-number");
    seatNumberDiv.contentEditable = true; // Make seat number editable
    seatNumberDiv.innerText = number;
    seat.appendChild(seatNumberDiv);
    seatMap.appendChild(seat);
    seatBookings[number] = []; // Initialize booking storage for each seat

    // Add click event listener to select seats
    seat.addEventListener("click", () => {
      if (
        !seat.classList.contains("booked-morning") &&
        !seat.classList.contains("booked-evening") &&
        !seat.classList.contains("booked-full")
      ) {
        seat.classList.toggle("selected");
      }
    });
  }

  // Create and append initial seats to the seat map
  seatNumbers.forEach(createSeat);

  // Book Seat button click handler
  bookSeatButton.addEventListener("click", () => {
    const jobCode = jobCodeInput.value.trim();
    const timeSlot = timeSlotSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const selectedSeats = Array.from(
      seatMap.querySelectorAll(".seat.selected")
    );

    if (
      jobCode &&
      selectedSeats.length > 0 &&
      startDate &&
      endDate &&
      startDate <= endDate
    ) {
      let validBooking = true;

      selectedSeats.forEach((selectedSeat) => {
        const seatNumber = selectedSeat.getAttribute("data-seat-number");

        if (!isSeatAvailable(seatNumber, startDate, endDate, timeSlot)) {
          validBooking = false;
        }
      });

      if (validBooking) {
        selectedSeats.forEach((selectedSeat) => {
          const seatNumber = selectedSeat.getAttribute("data-seat-number");
          const booking = {
            jobCode,
            timeSlot,
            startDate,
            endDate,
          };
          seatBookings[seatNumber].push(booking);
          jobCodes.add(jobCode);

          const viewDate =
            filterDateInput.value || new Date().toISOString().split("T")[0];
          updateSeatStatus(seatNumber, viewDate);
          updateSummaryTable(viewDate);
          updateJobCodeList();
          selectedSeat.classList.remove("selected");
          alert(
            `Seat ${seatNumber} booked for job code ${jobCode} from ${startDate} to ${endDate} in the ${timeSlot} slot.`
          );
        });
      } else {
        alert(
          "One or more selected seats are already booked for the selected date range and time slot."
        );
      }
    } else {
      alert(
        "Please fill out all fields correctly, select at least one seat, and ensure end date is after or equal to start date."
      );
    }
  });

  // Function to check if a seat is available for booking
  function isSeatAvailable(seatNumber, startDate, endDate, timeSlot) {
    const bookings = seatBookings[seatNumber];
    return !bookings.some((booking) => {
      if (booking.timeSlot !== timeSlot) return false;
      return !(endDate < booking.startDate || startDate > booking.endDate);
    });
  }

  // Function to update seat status based on view date
  function updateSeatStatus(seatNumber, viewDate) {
    const seat = document.querySelector(
      `.seat[data-seat-number="${seatNumber}"]`
    );
    // Clear previous booking classes
    seat.classList.remove(
      "selected",
      "booked-morning",
      "booked-evening",
      "booked-full"
    );

    // Check if seat is booked for the view date
    const bookings = seatBookings[seatNumber];
    if (
      bookings.some((booking) =>
        isDateInRange(viewDate, booking.startDate, booking.endDate)
      )
    ) {
      // Determine booking type for the view date
      const booking = bookings.find((booking) =>
        isDateInRange(viewDate, booking.startDate, booking.endDate)
      );
      if (booking.timeSlot === "morning") {
        seat.classList.add("booked-morning");
      } else if (booking.timeSlot === "evening") {
        seat.classList.add("booked-evening");
      } else if (booking.timeSlot === "full-time") {
        seat.classList.add("booked-full");
      }
    }
  }

  // Function to check if a date is within a range
  function isDateInRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
  }

  // Function to update summary table based on view date
  function updateSummaryTable(viewDate) {
    // Clear existing rows
    summaryTableBody.innerHTML = "";

    // Filter job codes based on current bookings
    const filteredJobCodes = Array.from(jobCodes).filter((jobCode) => {
      return seatNumbers.some((seatNumber) => {
        const bookings = seatBookings[seatNumber];
        return bookings.some((booking) => {
          return (
            booking.jobCode === jobCode &&
            isDateInRange(viewDate, booking.startDate, booking.endDate)
          );
        });
      });
    });

    // Populate summary table with data
    filteredJobCodes.forEach((jobCode) => {
      const morningSeats = seatNumbers.reduce((count, seatNumber) => {
        const bookings = seatBookings[seatNumber];
        if (
          bookings.some(
            (booking) =>
              booking.jobCode === jobCode &&
              booking.timeSlot === "morning" &&
              isDateInRange(viewDate, booking.startDate, booking.endDate)
          )
        ) {
          return count + 1;
        }
        return count;
      }, 0);

      const eveningSeats = seatNumbers.reduce((count, seatNumber) => {
        const bookings = seatBookings[seatNumber];
        if (
          bookings.some(
            (booking) =>
              booking.jobCode === jobCode &&
              booking.timeSlot === "evening" &&
              isDateInRange(viewDate, booking.startDate, booking.endDate)
          )
        ) {
          return count + 1;
        }
        return count;
      }, 0);

      const fullTimeSeats = seatNumbers.reduce((count, seatNumber) => {
        const bookings = seatBookings[seatNumber];
        if (
          bookings.some(
            (booking) =>
              booking.jobCode === jobCode &&
              booking.timeSlot === "full-time" &&
              isDateInRange(viewDate, booking.startDate, booking.endDate)
          )
        ) {
          return count + 1;
        }
        return count;
      }, 0);

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${viewDate}</td>
                <td>${jobCode}</td>
                <td>${morningSeats}</td>
                <td>${eveningSeats}</td>
                <td>${fullTimeSeats}</td>
            `;
      summaryTableBody.appendChild(row);
    });
  }

  // Function to update job code list filter
  function updateJobCodeList() {
    const jobCodeList = document.getElementById("filter-job-code");
    jobCodeList.innerHTML = "";
    const jobCodeOptions = Array.from(jobCodes).map(
      (jobCode) => `<option value="${jobCode}">${jobCode}</option>`
    );
    jobCodeOptions.unshift('<option value="">All</option>');
    jobCodeList.innerHTML = jobCodeOptions.join("");
  }

  // Initial update of summary table and job code list
  const initialViewDate = new Date().toISOString().split("T")[0];
  viewDateInput.value = initialViewDate;
  filterDateInput.value = initialViewDate;
  updateSummaryTable(initialViewDate);
  updateJobCodeList();

  // Filter Date input change event listener
  filterDateInput.addEventListener("change", () => {
    const viewDate = filterDateInput.value;
    updateSummaryTable(viewDate);
  });

  // Today button click event listener
  todayButton.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    viewDateInput.value = today;
    filterDateInput.value = today;
    updateSummaryTable(today);
  });
});
