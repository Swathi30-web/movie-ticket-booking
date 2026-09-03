import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovie } from "../services/api";
import type { Movie } from "../types";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (!id) return;

    getMovie(id)
      .then((response) => {
        setMovie(response.data);
      })
      .catch(() => {
        alert("Failed to load movie");
      });
  }, [id]);

  if (!movie) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow overflow-hidden md:flex">

        <img
          src={movie.poster}
          alt={movie.name}
          className="w-full md:w-80 h-96 object-cover"
        />

        <div className="p-6">

          <h1 className="text-3xl font-bold">
            {movie.name}
          </h1>

          <p className="mt-4">
            Genre: {movie.genre}
          </p>

          <p>
            Language: {movie.language}
          </p>

          <p>
            Duration: {movie.duration}
          </p>

          <p>
            Release Date: {movie.releaseDate}
          </p>

          <p>
            Rating: ⭐ {movie.rating}
          </p>

          <p>
            Status: {movie.status}
          </p>

          <p className="mt-5 text-gray-600">
            {movie.description}
          </p>

          <Link
            to={`/shows?movieId=${movie.id}`}
            className="inline-block mt-6 bg-slate-900 text-white px-5 py-3 rounded"
          >
            Book Tickets
          </Link>

        </div>

      </div>

    </div>
  );
};

export default MovieDetails;