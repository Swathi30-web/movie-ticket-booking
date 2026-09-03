import { useEffect, useState } from "react";

import {
  deleteBooking,
  getBookings,
  getMovies,
  getTheatres,
  updateBooking,
} from "../services/api";

import type {
  Booking,
  Movie,
  Theatre,
} from "../types";

const Bookings = () => {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [movies, setMovies] =
    useState<Movie[]>([]);

  const [theatres, setTheatres] =
    useState<Theatre[]>([]);

  useEffect(() => {

    const loadData = async () => {

      const [
        bookingResponse,
        movieResponse,
        theatreResponse,
      ] = await Promise.all([
        getBookings(),
        getMovies(),
        getTheatres(),
      ]);

      setBookings(bookingResponse.data);
      setMovies(movieResponse.data);
      setTheatres(theatreResponse.data);
    };

    loadData();

  }, []);

  const getMovieName = (id: string) =>
    movies.find(
      (movie) => movie.id === id
    )?.name || "-";

  const getTheatreName = (id: string) =>
    theatres.find(
      (theatre) => theatre.id === id
    )?.name || "-";

  const cancelBooking = async (
    booking: Booking
  ) => {

    const confirmCancel =
      window.confirm(
        "Cancel this booking?"
      );

    if (!confirmCancel) return;

    await updateBooking(
      booking.id,
      {
        ...booking,
        bookingStatus: "Cancelled",
      }
    );

    setBookings((prev) =>
      prev.map((item) =>
        item.id === booking.id
          ? {
              ...item,
              bookingStatus:
                "Cancelled",
            }
          : item
      )
    );
  };

  const removeBooking = async (
    id: string
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete booking?"
      );

    if (!confirmDelete) return;

    await deleteBooking(id);

    setBookings((prev) =>
      prev.filter(
        (booking) =>
          booking.id !== id
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Booking Management
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full">

          <thead className="bg-slate-900 text-white">

            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Movie</th>
              <th className="p-3">Theatre</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Tickets</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>

          </thead>

          <tbody>
{bookings.map((booking, index) => (
  <tr
    key={booking.id}
    className="border-b"
  >
    <td className="p-3 font-semibold">
      {String(index + 1).padStart(2, "0")}
    </td>

    <td className="p-3">
      {booking.customerName}
    </td>

    <td className="p-3">
      {getMovieName(booking.movieId)}
    </td>

    <td className="p-3">
      {getTheatreName(booking.theatreId)}
    </td>

    <td className="p-3">
      {booking.date}
    </td>

    <td className="p-3">
      {booking.showTime}
    </td>

    <td className="p-3">
      {booking.seats.join(", ")}
    </td>

    <td className="p-3">
      {booking.numberOfTickets}
    </td>

    <td className="p-3">
      ₹{booking.totalAmount}
    </td>

    <td className="p-3">
      <span
        className={
          booking.bookingStatus === "Confirmed"
            ? "text-green-600"
            : "text-red-600"
        }
      >
        {booking.bookingStatus}
      </span>
    </td>

    <td className="p-3">
      {booking.bookingStatus === "Confirmed" && (
        <button
          onClick={() => cancelBooking(booking)}
          className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
        >
          Cancel
        </button>
      )}

      <button
        onClick={() => removeBooking(booking.id)}
        className="bg-red-600 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </td>
  </tr>
))}

          </tbody>

        </table>

        {bookings.length === 0 && (
          <div className="p-10 text-center">
            No bookings yet.
          </div>
        )}

      </div>

    </div>
  );
};

export default Bookings;