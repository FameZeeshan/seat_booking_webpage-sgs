document.addEventListener("DOMContentLoaded", () => {
  const seatMap = document.getElementById("seat-map");
  const bookSeatButton = document.getElementById("book-seat");
  const addSeatButton = document.getElementById("add-seat");
  const editSeatButton = document.getElementById("edit-seat"); // New edit seat button
  const deleteSeatsButton = document.getElementById("delete-seats");
  const jobCodeInput = document.getElementById("job-code");
  const timeSlotSelect = document.getElementById("time-slot");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const filterDateInput = document.getElementById("filter-date");
  const todayButton = document.getElementById("today-button");
  const summaryTableBody = document.querySelector("#summary-table tbody");

  let seatNumbers = Array.from({ length: 20 }, (_, i) => 4001 + i); // Example initial seat numbers

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
    seatNumberDiv.contentEditable = false; // Ensure seat number is not editable by default
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

  // Edit Seat button click handler
  editSeatButton.addEventListener("click", () => {
    const selectedSeat = seatMap.querySelector(".seat.selected");
    if (selectedSeat) {
      // Get current seat number
      const seatNumber = selectedSeat.getAttribute("data-seat-number");
      // Perform edit action (e.g., open modal for editing)
      alert(`Editing seat ${seatNumber}`);
    } else {
      alert("Please select a seat to edit.");
    }
  });

  // Other event listeners and functions (e.g., booking functionality, seat availability check, etc.)

  // Example function for booking a seat
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

  // Example function to check seat availability
  function isSeatAvailable(seatNumber, startDate, endDate, timeSlot) {
    const bookings = seatBookings[seatNumber];
    return !bookings.some((booking) => {
      if (booking.timeSlot !== timeSlot) return false;
      return !(endDate < booking.startDate || startDate > booking.endDate);
    });
  }

  // Example function to update seat status based on view date
  function updateSeatStatus(seatNumber, viewDate) {
    const seat = document.querySelector(
      `.seat[data-seat-number="${seatNumber}"]`
    );
    // Update seat status based on bookings for viewDate
    // Example: Update seat class based on bookings
  }

  // Example function to update summary table based on view date
  function updateSummaryTable(viewDate) {
    // Update summary table based on bookings for viewDate
    // Example: Update summary table with seat bookings
  }

  // Example function to update job code list filter
  function updateJobCodeList() {
    const jobCodeList = document.getElementById("job-code-list");
    // Update job code list filter
    // Example: Update job code list options
  }

  // Initialize view with default settings
  // Example: Initialize with current date and default settings
});
