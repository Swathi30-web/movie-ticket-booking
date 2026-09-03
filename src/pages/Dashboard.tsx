import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import Loading from "../components/Loading";
import {
  deleteMovie,
  getBookings,
  getMovies,
} from "../services/api";
import type { Booking, Movie } from "../types";

const Dashboard = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);

      const [movieResponse, bookingResponse] =
        await Promise.all([
          getMovies(),
          getBookings(),
        ]);

      setMovies(movieResponse.data);
      setBookings(bookingResponse.data);

      setError("");
    } catch {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this movie?"
    );

    if (!confirmDelete) return;

    try {
      await deleteMovie(id);
      setMovies((prev) =>
        prev.filter((movie) => movie.id !== id)
      );
    } catch {
      alert("Failed to delete movie");
    }
  };

  let filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenre =
      !genre || movie.genre === genre;

    const matchesLanguage =
      !language || movie.language === language;

    return (
      matchesSearch &&
      matchesGenre &&
      matchesLanguage
    );
  });

  if (sort === "rating") {
    filteredMovies.sort((a, b) => b.rating - a.rating);
  }

  if (sort === "releaseDate") {
    filteredMovies.sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() -
        new Date(a.releaseDate).getTime()
    );
  }

  const nowShowing = movies.filter(
    (movie) => movie.status === "Now Showing"
  ).length;

  const upcoming = movies.filter(
    (movie) => movie.status === "Upcoming"
  ).length;

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="text-center text-red-600 p-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Movie Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Movies</p>
          <h2 className="text-3xl font-bold">
            {movies.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Now Showing</p>
          <h2 className="text-3xl font-bold text-green-600">
            {nowShowing}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Upcoming Movies</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {upcoming}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p>Total Bookings</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {bookings.length}
          </h2>
        </div>

      </div>

      {/* Search */}

      <div className="bg-white p-5 rounded-xl shadow mb-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search movie..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border p-3 rounded"
          />

          <select
            value={genre}
            onChange={(e) =>
              setGenre(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Romance">Romance</option>
          </select>

          <select
            value={language}
            onChange={(e) =>
              setLanguage(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="">All Languages</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
            className="border p-3 rounded"
          >
            <option value="">Sort</option>
            <option value="rating">
              Rating
            </option>
            <option value="releaseDate">
              Release Date
            </option>
          </select>

        </div>
      </div>

      {/* Movies */}

      {filteredMovies.length === 0 ? (
        <div className="text-center py-10">
          No movies found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default Dashboard;