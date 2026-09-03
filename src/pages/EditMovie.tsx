import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMovie,
  updateMovie,
} from "../services/api";

import type { Movie } from "../types";

interface MovieForm {
  name: string;
  poster: string;
  genre: string;
  language: string;
  duration: string;
  releaseDate: string;
  rating: string;
  status: "Now Showing" | "Upcoming";
  description: string;
}

const EditMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<MovieForm>({
    name: "",
    poster: "",
    genre: "",
    language: "",
    duration: "",
    releaseDate: "",
    rating: "",
    status: "Now Showing",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const response = await getMovie(id);

        const movie: Movie = response.data;

        setForm({
          name: movie.name,
          poster: movie.poster,
          genre: movie.genre,
          language: movie.language,
          duration: movie.duration,
          releaseDate: movie.releaseDate,
          rating: String(movie.rating),
          status: movie.status,
          description: movie.description,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Movie name is required";
    }

    if (!form.poster.trim()) {
      newErrors.poster = "Poster URL is required";
    }

    if (!form.genre) {
      newErrors.genre = "Genre is required";
    }

    if (!form.language) {
      newErrors.language = "Language is required";
    }

    if (!form.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    if (!form.releaseDate) {
      newErrors.releaseDate =
        "Release date is required";
    }

    if (!form.rating) {
      newErrors.rating = "Rating is required";
    } else if (
      Number(form.rating) < 0 ||
      Number(form.rating) > 10
    ) {
      newErrors.rating =
        "Rating must be between 0 and 10";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    if (!id) {
      alert("Movie ID is missing");
      return;
    }

    try {
      setSubmitting(true);

      await updateMovie(id, {
        name: form.name,
        poster: form.poster,
        genre: form.genre,
        language: form.language,
        duration: form.duration,
        releaseDate: form.releaseDate,
        rating: Number(form.rating),
        status: form.status,
        description: form.description,
      });

      alert("Movie updated successfully");

      navigate(`/movies/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update movie");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-lg font-semibold">
          Loading movie...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Edit Movie
        </h1>
        <p className="text-gray-500 mt-1">
          Update movie information
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow p-6 space-y-6"
      >

        {/* Movie Name */}
        <div>
          <label
            htmlFor="name"
            className="block font-medium mb-2"
          >
            Movie Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter movie name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* Poster URL */}
        <div>
          <label
            htmlFor="poster"
            className="block font-medium mb-2"
          >
            Poster URL
          </label>

          <input
            id="poster"
            name="poster"
            type="url"
            value={form.poster}
            onChange={handleChange}
            placeholder="https://example.com/poster.jpg"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />

          {errors.poster && (
            <p className="text-red-500 text-sm mt-1">
              {errors.poster}
            </p>
          )}
        </div>

        {/* Poster Preview */}
        {form.poster && (
          <div>
            <p className="font-medium mb-2">
              Poster Preview
            </p>

            <img
              src={form.poster}
              alt="Poster Preview"
              className="w-40 h-56 object-cover rounded-lg shadow"
              onError={(e) => {
                e.currentTarget.style.display =
                  "none";
              }}
            />
          </div>
        )}

        {/* Genre + Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label
              htmlFor="genre"
              className="block font-medium mb-2"
            >
              Genre
            </label>

            <select
              id="genre"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">
                Select Genre
              </option>
              <option value="Action">
                Action
              </option>
              <option value="Comedy">
                Comedy
              </option>
              <option value="Drama">
                Drama
              </option>
              <option value="Romance">
                Romance
              </option>
              <option value="Thriller">
                Thriller
              </option>
              <option value="Horror">
                Horror
              </option>
              <option value="Sci-Fi">
                Sci-Fi
              </option>
            </select>

            {errors.genre && (
              <p className="text-red-500 text-sm mt-1">
                {errors.genre}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="language"
              className="block font-medium mb-2"
            >
              Language
            </label>

            <select
              id="language"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            >
              <option value="">
                Select Language
              </option>
              <option value="Tamil">
                Tamil
              </option>
              <option value="English">
                English
              </option>
              <option value="Hindi">
                Hindi
              </option>
              <option value="Telugu">
                Telugu
              </option>
              <option value="Malayalam">
                Malayalam
              </option>
            </select>

            {errors.language && (
              <p className="text-red-500 text-sm mt-1">
                {errors.language}
              </p>
            )}
          </div>

        </div>

        {/* Duration + Date + Rating */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div>
            <label
              htmlFor="duration"
              className="block font-medium mb-2"
            >
              Duration
            </label>

            <input
              id="duration"
              name="duration"
              type="text"
              value={form.duration}
              onChange={handleChange}
              placeholder="2h 30m"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="releaseDate"
              className="block font-medium mb-2"
            >
              Release Date
            </label>

            <input
              id="releaseDate"
              name="releaseDate"
              type="date"
              value={form.releaseDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            {errors.releaseDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.releaseDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="rating"
              className="block font-medium mb-2"
            >
              Rating
            </label>

            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              placeholder="8.5"
              className="w-full border border-gray-300 rounded-lg p-3"
            />

            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rating}
              </p>
            )}
          </div>

        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block font-medium mb-2"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3"
          >
            <option value="Now Showing">
              Now Showing
            </option>

            <option value="Upcoming">
              Upcoming
            </option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-2"
          >
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            placeholder="Enter movie description"
            className="w-full border border-gray-300 rounded-lg p-3 resize-none"
          />

          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-3">

          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting
              ? "Updating..."
              : "Update Movie"}
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/movies/${id}`)
            }
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditMovie;