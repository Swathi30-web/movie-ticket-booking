import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMovie,
  getShow,
  getTheatres,
  getBookings,
} from "../services/api";

import type {
  Booking,
  Movie,
  Show,
  Theatre,
} from "../types";

const SeatSelection = () => {
  const { showId } = useParams<{ showId: string }>();
  const navigate = useNavigate();

  // Show details
  const [show, setShow] = useState<Show | null>(null);

  // Movie details
  const [movie, setMovie] = useState<Movie | null>(null);

  // Theatre details
  const [theatre, setTheatre] =
    useState<Theatre | null>(null);

  // Selected seats
  const [selectedSeats, setSelectedSeats] =
    useState<string[]>([]);

  // Already booked seats
  const [bookedSeats, setBookedSeats] =
    useState<string[]>([]);

  // Loading state
  const [loading, setLoading] =
    useState(true);

  // Error state
  const [error, setError] =
    useState("");

  // Seat rows
  const rows = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
  ];

  // Number of seats in each row
  const seatsPerRow = 6;

  // ==============================
  // LOAD SHOW DETAILS
  // ==============================

  useEffect(() => {
    const loadData = async () => {
      if (!showId) {
        setError("Show ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // --------------------------
        // Get Show
        // --------------------------

        const showResponse =
          await getShow(showId);

        const showData: Show =
          showResponse.data;

        setShow(showData);

        // --------------------------
        // Get Movie
        // --------------------------

        const movieResponse =
          await getMovie(showData.movieId);

        const movieData: Movie =
          movieResponse.data;

        setMovie(movieData);

        // --------------------------
        // Get Theatre
        // --------------------------

        const theatreResponse =
          await getTheatres();

        const theatreList: Theatre[] =
          theatreResponse.data;

        const foundTheatre =
          theatreList.find(
            (item) =>
              item.id === showData.theatreId
          );

        if (!foundTheatre) {
          setError("Theatre not found");
          return;
        }

        setTheatre(foundTheatre);

        // --------------------------
        // Get Bookings
        // --------------------------

        const bookingResponse =
          await getBookings();

        const bookings: Booking[] =
          bookingResponse.data;

        // Find seats booked for
        // this exact show
        const alreadyBookedSeats =
          bookings
            .filter(
              (booking) =>
                booking.movieId ===
                  showData.movieId &&
                booking.theatreId ===
                  showData.theatreId &&
                booking.date ===
                  showData.date &&
                booking.showTime ===
                  showData.showTime &&
                booking.bookingStatus ===
                  "Confirmed"
            )
            .flatMap(
              (booking) =>
                booking.seats
            );

        setBookedSeats(
          alreadyBookedSeats
        );
      } catch (err) {
        console.error(err);

        setError(
          "Failed to load seat details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showId]);

  // ==============================
  // SEAT SELECTION
  // ==============================

  const toggleSeat = (
    seatNumber: string
  ) => {
    // Do nothing if seat already booked
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    // Remove selected seat
    if (
      selectedSeats.includes(seatNumber)
    ) {
      setSelectedSeats((prev) =>
        prev.filter(
          (seat) =>
            seat !== seatNumber
        )
      );

      return;
    }

    // Add selected seat
    setSelectedSeats((prev) => [
      ...prev,
      seatNumber,
    ]);
  };

  // ==============================
  // TOTAL AMOUNT
  // ==============================

  const totalAmount =
    selectedSeats.length *
    (show?.ticketPrice ?? 0);

  // ==============================
  // CONTINUE TO BOOKING
  // ==============================

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert(
        "Please select at least one seat"
      );

      return;
    }

    navigate(`/booking/${showId}`, {
      state: {
        selectedSeats,
      },
    });
  };

  // ==============================
  // LOADING UI
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-lg font-semibold text-slate-700">
            Loading seats...
          </p>

        </div>
      </div>
    );
  }

  // ==============================
  // ERROR UI
  // ==============================

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex flex-col items-center justify-center p-6">

        <p className="text-red-600 text-xl font-semibold mb-5">
          {error}
        </p>

        <button
          onClick={() =>
            navigate("/shows")
          }
          className="bg-slate-900 text-white px-6 py-3 rounded-xl"
        >
          Back to Shows
        </button>

      </div>
    );
  }

  // ==============================
  // SAFETY CHECK
  // ==============================

  if (!show || !movie || !theatre) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <p className="text-gray-600">
          Show information not found.
        </p>
      </div>
    );
  }

  // ==============================
  // MAIN UI
  // ==============================

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-32">

      {/* ==================================
          HEADER
          ================================== */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-5">

        <button
          onClick={() =>
            navigate("/shows")
          }
          className="text-gray-600 hover:text-slate-900 text-lg transition"
        >
          ← Back to Shows
        </button>

        <div className="mt-10 mb-8">

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            Select Your Seats
          </h1>

          <p className="text-gray-500 text-xl mt-2">
            Choose your preferred seats
          </p>

        </div>

      </div>

      {/* ==================================
          SHOW INFORMATION
          ================================== */}

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">

        <div className="bg-white rounded-2xl shadow-sm p-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {/* Screen */}

            <div>
              <p className="text-gray-500 mb-2">
                Screen
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {show.screen}
              </p>
            </div>

            {/* Date */}

            <div>
              <p className="text-gray-500 mb-2">
                Date
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {show.date}
              </p>
            </div>

            {/* Show Time */}

            <div>
              <p className="text-gray-500 mb-2">
                Show Time
              </p>

              <p className="text-xl font-semibold text-slate-900">
                {show.showTime}
              </p>
            </div>

            {/* Ticket Price */}

            <div>
              <p className="text-gray-500 mb-2">
                Ticket Price
              </p>

              <p className="text-xl font-semibold text-slate-900">
                ₹{show.ticketPrice}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ==================================
          SCREEN
          ================================== */}

      <div className="max-w-[1000px] mx-auto mt-10 px-6">

        <div className="relative h-24">

          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-16 border-t-4 border-gray-400"
            style={{
              borderRadius: "50% 50% 0 0",
            }}
          />

          <span className="absolute top-12 left-1/2 -translate-x-1/2 text-gray-500 text-lg font-medium tracking-wide">
            SCREEN
          </span>

        </div>

      </div>

      {/* ==================================
          SEATS
          ================================== */}

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-10">

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mt-5">

          <div className="flex flex-col items-center gap-5">

            {rows.map((row) => (
              <div
                key={row}
                className="grid grid-cols-6 gap-2 sm:gap-4 md:gap-6"
              >

                {Array.from(
                  {
                    length:
                      seatsPerRow,
                  },
                  (_, index) => {

                    const seat =
                      `${row}${index + 1}`;

                    const isBooked =
                      bookedSeats.includes(
                        seat
                      );

                    const isSelected =
                      selectedSeats.includes(
                        seat
                      );

                    return (
                      <button
                        key={seat}
                        type="button"
                        disabled={isBooked}
                        onClick={() =>
                          toggleSeat(
                            seat
                          )
                        }
                        aria-label={`Seat ${seat}`}
                        className={`
                          w-12 h-12
                          sm:w-16 sm:h-14
                          md:w-20 md:h-16
                          rounded-xl
                          border
                          flex
                          items-center
                          justify-center
                          gap-1
                          md:gap-2
                          text-sm
                          md:text-base
                          font-medium
                          transition-all
                          duration-200

                          ${
                            isBooked
                              ? `
                                bg-red-500
                                text-white
                                border-red-500
                                cursor-not-allowed
                              `
                              : isSelected
                              ? `
                                bg-green-500
                                text-white
                                border-green-500
                                scale-105
                              `
                              : `
                                bg-white
                                text-slate-700
                                border-gray-300
                                hover:border-slate-900
                                hover:bg-gray-50
                                hover:scale-105
                              `
                          }
                        `}
                      >

                        <span className="text-sm md:text-lg">
                          🪑
                        </span>

                        <span>
                          {seat}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>
            ))}

          </div>

          {/* ==================================
              LEGEND
              ================================== */}

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10 pt-8 border-t">

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white border border-gray-300 rounded" />

              <span className="text-gray-600">
                Available
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-500 rounded" />

              <span className="text-gray-600">
                Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded" />

              <span className="text-gray-600">
                Booked
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* ==================================
          BOTTOM SUMMARY
          ================================== */}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">

        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-4">

          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

            {/* Selected seats */}

            <div className="flex-1">

              <p className="text-gray-500 text-sm">
                Selected Seats
              </p>

              <p className="font-semibold text-base md:text-lg mt-1">

                {selectedSeats.length > 0
                  ? selectedSeats.join(", ")
                  : "No seats selected"}

              </p>

            </div>

            {/* Ticket count */}

            <div>

              <p className="text-gray-500 text-sm">
                Tickets
              </p>

              <p className="font-semibold text-lg">
                {selectedSeats.length}
              </p>

            </div>

            {/* Total */}

            <div>

              <p className="text-gray-500 text-sm">
                Total Amount
              </p>

              <p className="text-xl md:text-2xl font-bold text-slate-900">
                ₹{totalAmount}
              </p>

            </div>

            {/* Continue */}

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                selectedSeats.length === 0
              }
              className="
                bg-slate-900
                text-white
                px-6
                py-4
                rounded-xl
                font-semibold
                disabled:bg-gray-300
                disabled:cursor-not-allowed
                hover:bg-slate-800
                transition
              "
            >
              Continue to Booking →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SeatSelection;