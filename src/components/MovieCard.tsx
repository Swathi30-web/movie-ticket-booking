import { Link } from "react-router-dom";
import type { Movie } from "../types";

interface Props {
  movie: Movie;
  onDelete: (id: string) => void;
}

const MovieCard = ({ movie, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <img
        src={movie.poster}
        alt={movie.name}
        className="w-full h-72 object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-bold">
          {movie.name}
        </h2>

        <p className="text-gray-600">
          {movie.genre} • {movie.language}
        </p>

        <p className="mt-2">
          ⭐ {movie.rating}
        
        </p>

        <p className="text-sm">
          {movie.duration}
        </p>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
            movie.status === "Now Showing"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {movie.status}
        </span>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/movies/${movie.id}`}
            className="bg-slate-800 text-white px-3 py-2 rounded"
          >
            View
          </Link>

          <Link
            to={`/movies/edit/${movie.id}`}
            className="bg-yellow-500 text-white px-3 py-2 rounded"
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete(movie.id)}
            className="bg-red-600 text-white px-3 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;