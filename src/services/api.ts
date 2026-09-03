import axios from "axios";

const api = axios.create({
  baseURL: " https://movie-ticket-booking-4-e0wg.onrender.com",
});

// =========================
// MOVIES
// =========================

export const getMovies = () =>
  api.get("/movies");

export const getMovie = (id: string) =>
  api.get(`/movies/${id}`);

export const addMovie = (movie: unknown) =>
  api.post("/movies", movie);

export const updateMovie = (
  id: string,
  movie: unknown
) =>
  api.put(`/movies/${id}`, movie);

export const deleteMovie = (id: string) =>
  api.delete(`/movies/${id}`);

// =========================
// THEATRES
// =========================

export const getTheatres = () =>
  api.get("/theatres");

// =========================
// SHOWS
// =========================

export const getShows = () =>
  api.get("/shows");

export const getShow = (id: string) =>
  api.get(`/shows/${id}`);

export const addShow = (show: unknown) =>
  api.post("/shows", show);

export const updateShow = (
  id: string,
  show: unknown
) =>
  api.put(`/shows/${id}`, show);

export const deleteShow = (id: string) =>
  api.delete(`/shows/${id}`);

// =========================
// BOOKINGS
// =========================

export const getBookings = () =>
  api.get("/bookings");

export const getBooking = (id: string) =>
  api.get(`/bookings/${id}`);

export const addBooking = (
  booking: unknown
) =>
  api.post("/bookings", booking);

export const updateBooking = (
  id: string,
  booking: unknown
) =>
  api.put(`/bookings/${id}`, booking);

export const deleteBooking = (
  id: string
) =>
  api.delete(`/bookings/${id}`);