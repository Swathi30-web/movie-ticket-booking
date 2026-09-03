import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  addBooking,
  getBookings,
  getMovie,
  getShow,
  getTheatres,
} from "../services/api";

import type {
  Booking,
  Movie,
  Show,
  Theatre,
} from "../types";

interface LocationState {
  selectedSeats?: string[];
}

interface BookingForm {
  customerName: string;
  email: string;
  phone: string;
}

const BookingPage = () => {
  const { showId } = useParams<{
    showId: string;
  }>();

  const navigate = useNavigate();

  const location = useLocation();

  // Seats received from Seat Selection page
  const locationState =
    location.state as LocationState | null;

  const [show, setShow] =
    useState<Show | null>(null);

  const [movie, setMovie] =
    useState<Movie | null>(null);

  const [theatre, setTheatre] =
    useState<Theatre | null>(null);

  const [selectedSeats, setSelectedSeats] =
    useState<string[]>(
      locationState?.selectedSeats || []
    );

  const [form, setForm] =
    useState<BookingForm>({
      customerName: "",
      email: "",
      phone: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ============================
  // LOAD BOOKING DATA
  // ============================

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

        // Get show
        const showResponse =
          await getShow(showId);

        const showData: Show =
          showResponse.data;

        setShow(showData);

        // Get movie
        const movieResponse =
          await getMovie(showData.movieId);

        const movieData: Movie =
          movieResponse.data;

        setMovie(movieData);

        // Get theatres
        const theatreResponse =
          await getTheatres();

        const theatreList: Theatre[] =
          theatreResponse.data;

        const foundTheatre =
          theatreList.find(
            (item) =>
              item.id ===
              showData.theatreId
          );

        if (!foundTheatre) {
          setError("Theatre not found");
          return;
        }

        setTheatre(foundTheatre);

      } catch (error) {
        console.error(error);

        setError(
          "Failed to load booking details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showId]);

  // ============================
  // FORM CHANGE
  // ============================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // FORM VALIDATION
  // ============================

  const validateForm = () => {
    const name =
      form.customerName.trim();

    const email =
      form.email.trim();

    const phone =
      form.phone.trim();

    if (!name) {
      alert(
        "Please enter customer name"
      );
      return false;
    }

    if (!email) {
      alert("Please enter email");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert(
        "Please enter a valid email"
      );
      return false;
    }

    if (!phone) {
      alert(
        "Please enter phone number"
      );
      return false;
    }

    const phoneRegex =
      /^[0-9]{10}$/;

    if (!phoneRegex.test(phone)) {
      alert(
        "Phone number must contain 10 digits"
      );
      return false;
    }

    if (selectedSeats.length === 0) {
      alert(
        "Please select at least one seat"
      );
      return false;
    }

    return true;
  };

  // ============================
  // TOTAL AMOUNT
  // ============================

  const totalAmount =
    selectedSeats.length *
    (show?.ticketPrice ?? 0);

  // ============================
  // CONFIRM BOOKING
  // ============================

  const handleBooking = async () => {
    if (!show || !movie || !theatre) {
      alert(
        "Booking information is not available"
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setBookingLoading(true);

      /*
        Check latest bookings before
        confirming the booking.
      */

      const bookingsResponse =
        await getBookings();

      const latestBookings: Booking[] =
        bookingsResponse.data;

      const latestBookedSeats =
        latestBookings
          .filter(
            (booking) =>
              booking.movieId ===
                movie.id &&
              booking.theatreId ===
                theatre.id &&
              booking.date ===
                show.date &&
              booking.showTime ===
                show.showTime &&
              booking.bookingStatus ===
                "Confirmed"
          )
          .flatMap(
            (booking) =>
              booking.seats
          );

      // Check if selected seats
      // are already booked

      const seatAlreadyBooked =
        selectedSeats.some((seat) =>
          latestBookedSeats.includes(seat)
        );

      if (seatAlreadyBooked) {
        alert(
          "One or more selected seats are already booked. Please choose different seats."
        );

        /*
          Remove seats that are already
          booked from current selection.
        */

        setSelectedSeats((prev) =>
          prev.filter(
            (seat) =>
              !latestBookedSeats.includes(
                seat
              )
          )
        );

        return;
      }

      // ============================
      // BOOKING OBJECT
      // ============================

      const bookingData = {
        customerName:
          form.customerName.trim(),

        email:
          form.email.trim(),

        phone:
          form.phone.trim(),

        movieId: movie.id,

        theatreId: theatre.id,

        date: show.date,

        showTime: show.showTime,

        seats: selectedSeats,

        numberOfTickets:
          selectedSeats.length,

        totalAmount,

        bookingStatus:
          "Confirmed" as const,
      };

      // POST booking

      await addBooking(bookingData);

      alert(
        "🎉 Ticket booked successfully!"
      );

      // Go to booking history

      navigate("/bookings", {
        replace: true,
      });

    } catch (error) {
      console.error(error);

      alert(
        "Failed to book ticket. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">

          <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-slate-900 rounded-full mx-auto mb-4" />

          <p className="text-lg font-semibold">
            Loading booking details...
          </p>

        </div>
      </div>
    );
  }

  // ============================
  // ERROR
  // ============================

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">

        <p className="text-red-600 text-xl mb-5">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            navigate("/shows")
          }
          className="bg-slate-900 text-white px-6 py-3 rounded-lg"
        >
          Back to Shows
        </button>

      </div>
    );
  }

  // ============================
  // SAFETY CHECK
  // ============================

  if (!show || !movie || !theatre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Booking details not available
        </p>
      </div>
    );
  }

  // ============================
  // UI
  // ============================

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">

        {/* Back button */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/shows/${show.id}/seats`
            )
          }
          className="text-gray-600 hover:text-slate-900 mb-6"
        >
          ← Back to Seat Selection
        </button>

        {/* Heading */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Book Movie Tickets
          </h1>

          <p className="text-gray-500 mt-2">
            Complete your booking details
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ============================
              LEFT SIDE
              ============================ */}

          <div className="space-y-6">

            {/* Movie Details */}

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-5">
                Movie Details
              </h2>

              <div className="flex gap-5">

                <img
                  src={movie.poster}
                  alt={movie.name}
                  className="w-28 h-40 object-cover rounded-xl"
                />

                <div className="space-y-2">

                  <h3 className="text-xl font-bold">
                    {movie.name}
                  </h3>

                  <p className="text-gray-600">
                    🎬 {movie.genre}
                  </p>

                  <p className="text-gray-600">
                    🌐 {movie.language}
                  </p>

                  <p className="text-gray-600">
                    🏢 {theatre.name}
                  </p>

                  <p className="text-gray-600">
                    🖥️ {show.screen}
                  </p>

                  <p className="text-gray-600">
                    📅 {show.date}
                  </p>

                  <p className="text-gray-600">
                    🕐 {show.showTime}
                  </p>

                </div>

              </div>

            </div>

            {/* Selected Seats */}

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-5">
                Selected Seats
              </h2>

              {selectedSeats.length >
              0 ? (
                <div className="flex flex-wrap gap-3">

                  {selectedSeats.map(
                    (seat) => (
                      <span
                        key={seat}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        {seat}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="text-gray-500">
                  No seats selected
                </p>
              )}

            </div>

          </div>

          {/* ============================
              RIGHT SIDE
              ============================ */}

          <div className="bg-white rounded-2xl shadow p-6 h-fit">

            <h2 className="text-2xl font-bold mb-6">
              Customer Details
            </h2>

            {/* Customer Name */}

            <div className="mb-5">

              <label
                htmlFor="customerName"
                className="block font-medium mb-2"
              >
                Customer Name
              </label>

              <input
                id="customerName"
                name="customerName"
                type="text"
                value={
                  form.customerName
                }
                onChange={
                  handleChange
                }
                placeholder="Enter customer name"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

            </div>

            {/* Email */}

            <div className="mb-5">

              <label
                htmlFor="email"
                className="block font-medium mb-2"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={
                  handleChange
                }
                placeholder="Enter email"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

            </div>

            {/* Phone */}

            <div className="mb-6">

              <label
                htmlFor="phone"
                className="block font-medium mb-2"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  if (
                    value.length <= 10
                  ) {
                    setForm((prev) => ({
                      ...prev,
                      phone: value,
                    }));
                  }
                }}
                maxLength={10}
                placeholder="10 digit phone number"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
              />

            </div>

            {/* ============================
                BOOKING SUMMARY
                ============================ */}

            <div className="border-t pt-6">

              <h3 className="text-xl font-bold mb-5">
                Booking Summary
              </h3>

              <div className="space-y-3">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Movie
                  </span>

                  <span className="font-medium text-right">
                    {movie.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Theatre
                  </span>

                  <span className="font-medium text-right">
                    {theatre.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Date
                  </span>

                  <span className="font-medium">
                    {show.date}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Show Time
                  </span>

                  <span className="font-medium">
                    {show.showTime}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Seats
                  </span>

                  <span className="font-medium">
                    {selectedSeats.length}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Ticket Price
                  </span>

                  <span className="font-medium">
                    ₹{show.ticketPrice}
                  </span>
                </div>

              </div>

              {/* Total */}

              <div className="border-t mt-5 pt-5 flex justify-between items-center">

                <span className="text-xl font-bold">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-green-600">
                  ₹{totalAmount}
                </span>

              </div>

            </div>

            {/* Confirm Booking */}

            <button
              type="button"
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full bg-slate-900 text-white py-4 rounded-xl mt-6 font-semibold text-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bookingLoading
                ? "Booking..."
                : "Confirm Booking"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BookingPage;