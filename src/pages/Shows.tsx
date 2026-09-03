import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addShow,
  deleteShow,
  getMovies,
  getShows,
  getTheatres,
  updateShow,
} from "../services/api";

import type {
  Movie,
  Show,
  Theatre,
} from "../types";

interface ShowForm {
  movieId: string;
  theatreId: string;
  screen: string;
  date: string;
  showTime: string;
  ticketPrice: string;
  availableSeats: string;
}

const initialForm: ShowForm = {
  movieId: "",
  theatreId: "",
  screen: "",
  date: "",
  showTime: "",
  ticketPrice: "",
  availableSeats: "",
};

const Shows = () => {
  const navigate = useNavigate();

  // =========================
  // STATES
  // =========================

  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theatres, setTheatres] =
    useState<Theatre[]>([]);

  const [form, setForm] =
    useState<ShowForm>(initialForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // Form hidden initially
  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formErrors, setFormErrors] =
    useState<Record<string, string>>({});

  // Search
  const [search, setSearch] =
    useState("");

  // Filters
  const [theatreFilter, setTheatreFilter] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  const [timeFilter, setTimeFilter] =
    useState("");

  // =========================
  // LOAD DATA
  // =========================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        showsResponse,
        moviesResponse,
        theatresResponse,
      ] = await Promise.all([
        getShows(),
        getMovies(),
        getTheatres(),
      ]);

      setShows(showsResponse.data);
      setMovies(moviesResponse.data);
      setTheatres(theatresResponse.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load shows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =========================
  // MAP MOVIES
  // =========================

  const movieMap = useMemo(() => {
    const map: Record<string, Movie> = {};

    movies.forEach((movie) => {
      map[movie.id] = movie;
    });

    return map;
  }, [movies]);

  // =========================
  // MAP THEATRES
  // =========================

  const theatreMap = useMemo(() => {
    const map: Record<string, Theatre> = {};

    theatres.forEach((theatre) => {
      map[theatre.id] = theatre;
    });

    return map;
  }, [theatres]);

  // =========================
  // GET MOVIE NAME
  // =========================

  const getMovieName = (
    movieId: string
  ) => {
    return (
      movieMap[movieId]?.name ||
      "Unknown Movie"
    );
  };

  // =========================
  // GET THEATRE NAME
  // =========================

  const getTheatreName = (
    theatreId: string
  ) => {
    return (
      theatreMap[theatreId]?.name ||
      "Unknown Theatre"
    );
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    const errors: Record<
      string,
      string
    > = {};

    if (!form.movieId) {
      errors.movieId =
        "Please select a movie";
    }

    if (!form.theatreId) {
      errors.theatreId =
        "Please select a theatre";
    }

    if (!form.screen.trim()) {
      errors.screen =
        "Screen is required";
    }

    if (!form.date) {
      errors.date =
        "Date is required";
    }

    if (!form.showTime) {
      errors.showTime =
        "Show time is required";
    }

    if (!form.ticketPrice) {
      errors.ticketPrice =
        "Ticket price is required";
    } else if (
      Number(form.ticketPrice) <= 0
    ) {
      errors.ticketPrice =
        "Ticket price must be greater than 0";
    }

    if (!form.availableSeats) {
      errors.availableSeats =
        "Available seats is required";
    } else if (
      Number(form.availableSeats) <= 0
    ) {
      errors.availableSeats =
        "Available seats must be greater than 0";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormErrors({});
  };

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAddShow = () => {
    resetForm();
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // CLOSE FORM
  // =========================

  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  };

  // =========================
  // ADD / UPDATE SHOW
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      const showData = {
        movieId: form.movieId,
        theatreId: form.theatreId,
        screen: form.screen.trim(),
        date: form.date,
        showTime: form.showTime,
        ticketPrice: Number(
          form.ticketPrice
        ),
        availableSeats: Number(
          form.availableSeats
        ),
      };

      // UPDATE
      if (editingId) {
        await updateShow(
          editingId,
          showData
        );

        setShows((prev) =>
          prev.map((show) =>
            show.id === editingId
              ? {
                  ...show,
                  ...showData,
                }
              : show
          )
        );

        alert(
          "Show updated successfully"
        );
      }

      // ADD
      else {
        const response =
          await addShow(showData);

        setShows((prev) => [
          ...prev,
          response.data,
        ]);

        alert(
          "Show added successfully"
        );
      }

      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error(err);

      alert(
        editingId
          ? "Failed to update show"
          : "Failed to add show"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // EDIT SHOW
  // =========================

  const handleEdit = (show: Show) => {
    setEditingId(show.id);

    setForm({
      movieId: show.movieId,
      theatreId: show.theatreId,
      screen: show.screen,
      date: show.date,
      showTime: show.showTime,
      ticketPrice: String(
        show.ticketPrice
      ),
      availableSeats: String(
        show.availableSeats
      ),
    });

    setFormErrors({});
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE SHOW
  // =========================

  const handleDelete = async (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this show?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteShow(id);

      setShows((prev) =>
        prev.filter(
          (show) => show.id !== id
        )
      );

      if (editingId === id) {
        resetForm();
        setShowForm(false);
      }

      alert(
        "Show deleted successfully"
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete show");
    }
  };

  // =========================
  // FILTER SHOWS
  // =========================

  const filteredShows = shows.filter(
    (show) => {
      const movieName =
        getMovieName(show.movieId);

      const theatreName =
        getTheatreName(
          show.theatreId
        );

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        movieName
          .toLowerCase()
          .includes(searchText) ||
        theatreName
          .toLowerCase()
          .includes(searchText) ||
        show.screen
          .toLowerCase()
          .includes(searchText) ||
        show.showTime
          .toLowerCase()
          .includes(searchText);

      const matchesTheatre =
        !theatreFilter ||
        show.theatreId ===
          theatreFilter;

      const matchesDate =
        !dateFilter ||
        show.date === dateFilter;

      const matchesTime =
        !timeFilter ||
        show.showTime === timeFilter;

      return (
        matchesSearch &&
        matchesTheatre &&
        matchesDate &&
        matchesTime
      );
    }
  );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-lg font-semibold">
            Loading shows...
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="min-h-screen bg-[#f4f5f7] p-5 md:p-8">

      <div className="max-w-[1400px] mx-auto">

        {/* ========================
            HEADER
            ======================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-900">
              Show Management
            </h1>

            <p className="text-gray-500 mt-2">
              Manage movie shows,
              theatres and timings
            </p>
          </div>

          {/* ADD SHOW BUTTON */}

          <button
            type="button"
            onClick={handleAddShow}
            className="bg-slate-900 text-white px-6 py-4 rounded-xl font-semibold hover:bg-slate-800 transition"
          >
            <span className="text-xl mr-2">
              +
            </span>

            Add Show
          </button>

        </div>

        {/* ========================
            ERROR
            ======================== */}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* ========================
            ADD / EDIT SHOW FORM

            Initially hidden.
            Opens only when Add Show
            or Edit is clicked.
            ======================== */}

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">

            {/* Form header */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingId
                    ? "Edit Show"
                    : "Add New Show"}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  {editingId
                    ? "Update existing show details"
                    : "Create a new movie show"}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                className="border border-gray-300 px-5 py-2 rounded-xl hover:bg-gray-100"
              >
                ✕ Close
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Movie + Theatre */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Movie */}

                <div>
                  <label
                    htmlFor="movieId"
                    className="block font-medium mb-2"
                  >
                    Movie
                  </label>

                  <select
                    id="movieId"
                    name="movieId"
                    value={
                      form.movieId
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">
                      Select Movie
                    </option>

                    {movies.map(
                      (movie) => (
                        <option
                          key={movie.id}
                          value={
                            movie.id
                          }
                        >
                          {movie.name}
                        </option>
                      )
                    )}
                  </select>

                  {formErrors.movieId && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .movieId
                      }
                    </p>
                  )}
                </div>

                {/* Theatre */}

                <div>
                  <label
                    htmlFor="theatreId"
                    className="block font-medium mb-2"
                  >
                    Theatre
                  </label>

                  <select
                    id="theatreId"
                    name="theatreId"
                    value={
                      form.theatreId
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="">
                      Select Theatre
                    </option>

                    {theatres.map(
                      (theatre) => (
                        <option
                          key={theatre.id}
                          value={
                            theatre.id
                          }
                        >
                          {theatre.name} -{" "}
                          {theatre.location}
                        </option>
                      )
                    )}
                  </select>

                  {formErrors.theatreId && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .theatreId
                      }
                    </p>
                  )}
                </div>

              </div>

              {/* Screen + Date + Time */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Screen */}

                <div>
                  <label
                    htmlFor="screen"
                    className="block font-medium mb-2"
                  >
                    Screen
                  </label>

                  <input
                    id="screen"
                    name="screen"
                    type="text"
                    value={
                      form.screen
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Screen 1"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />

                  {formErrors.screen && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .screen
                      }
                    </p>
                  )}
                </div>

                {/* Date */}

                <div>
                  <label
                    htmlFor="date"
                    className="block font-medium mb-2"
                  >
                    Date
                  </label>

                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={
                      form.date
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />

                  {formErrors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .date
                      }
                    </p>
                  )}
                </div>

                {/* Time */}

                <div>
                  <label
                    htmlFor="showTime"
                    className="block font-medium mb-2"
                  >
                    Show Time
                  </label>

                  <input
                    id="showTime"
                    name="showTime"
                    type="time"
                    value={
                      form.showTime
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />

                  {formErrors.showTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .showTime
                      }
                    </p>
                  )}
                </div>

              </div>

              {/* Price + Seats */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Ticket Price */}

                <div>
                  <label
                    htmlFor="ticketPrice"
                    className="block font-medium mb-2"
                  >
                    Ticket Price
                  </label>

                  <input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="number"
                    min="1"
                    value={
                      form.ticketPrice
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="200"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />

                  {formErrors.ticketPrice && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .ticketPrice
                      }
                    </p>
                  )}
                </div>

                {/* Available Seats */}

                <div>
                  <label
                    htmlFor="availableSeats"
                    className="block font-medium mb-2"
                  >
                    Available Seats
                  </label>

                  <input
                    id="availableSeats"
                    name="availableSeats"
                    type="number"
                    min="1"
                    value={
                      form.availableSeats
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="100"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />

                  {formErrors.availableSeats && (
                    <p className="text-red-500 text-sm mt-1">
                      {
                        formErrors
                          .availableSeats
                      }
                    </p>
                  )}
                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50"
                >
                  {submitting
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Show"
                    : "Add Show"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleCloseForm
                  }
                  className="border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-100"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* ========================
            SEARCH & FILTER
            ======================== */}

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="🔍 Search movie, theatre..."
              className="border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />

            {/* Theatre */}

            <select
              value={theatreFilter}
              onChange={(e) =>
                setTheatreFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl p-3"
            >
              <option value="">
                All Theatres
              </option>

              {theatres.map(
                (theatre) => (
                  <option
                    key={theatre.id}
                    value={theatre.id}
                  >
                    {theatre.name}
                  </option>
                )
              )}
            </select>

            {/* Date */}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl p-3"
            />

            {/* Time */}

            <input
              type="time"
              value={timeFilter}
              onChange={(e) =>
                setTimeFilter(
                  e.target.value
                )
              }
              className="border border-gray-300 rounded-xl p-3"
            />

          </div>

        </div>

        {/* ========================
            SHOW TABLE
            ======================== */}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  All Shows
                </h2>

                <p className="text-gray-500 mt-1">
                  {filteredShows.length} show
                  {filteredShows.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

            </div>

          </div>

          {filteredShows.length ===
          0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                🎬
              </div>

              <h3 className="text-xl font-semibold">
                No Shows Found
              </h3>

              <p className="text-gray-500 mt-2">
                Try changing your search
                or add a new show.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1100px]">

                <thead className="bg-slate-900 text-white">

                  <tr>

                    <th className="text-left p-5">
                      Movie
                    </th>

                    <th className="text-left p-5">
                      Theatre
                    </th>

                    <th className="text-left p-5">
                      Screen
                    </th>

                    <th className="text-left p-5">
                      Date
                    </th>

                    <th className="text-left p-5">
                      Show Time
                    </th>

                    <th className="text-left p-5">
                      Ticket Price
                    </th>

                    <th className="text-left p-5">
                      Available Seats
                    </th>

                    <th className="text-left p-5">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredShows.map(
                    (show) => (
                      <tr
                        key={show.id}
                        className="border-b hover:bg-gray-50"
                      >

                        {/* Movie */}

                        <td className="p-5">

                          <div className="font-semibold text-slate-900">
                            {getMovieName(
                              show.movieId
                            )}
                          </div>

                        </td>

                        {/* Theatre */}

                        <td className="p-5">

                          <div className="font-medium">
                            {getTheatreName(
                              show.theatreId
                            )}
                          </div>

                          <div className="text-sm text-gray-500">
                            {
                              theatreMap[
                                show
                                  .theatreId
                              ]
                                ?.location
                            }
                          </div>

                        </td>

                        {/* Screen */}

                        <td className="p-5">
                          {show.screen}
                        </td>

                        {/* Date */}

                        <td className="p-5">
                          {show.date}
                        </td>

                        {/* Time */}

                        <td className="p-5">
                          {show.showTime}
                        </td>

                        {/* Price */}

                        <td className="p-5 font-semibold">
                          ₹
                          {
                            show.ticketPrice
                          }
                        </td>

                        {/* Seats */}

                        <td className="p-5">

                          <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold text-sm">
                            {
                              show.availableSeats
                            }
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="p-5">

                          <div className="flex gap-2 items-center">

                            {/* Select Seats */}

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/shows/${show.id}/seats`
                                )
                              }
                              className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-800 whitespace-nowrap"
                            >
                              Select Seats
                            </button>

                            {/* Edit */}

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  show
                                )
                              }
                              className="bg-yellow-500 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-yellow-600"
                            >
                              Edit
                            </button>

                            {/* Delete */}

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  show.id
                                )
                              }
                              className="bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-red-700"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Shows;