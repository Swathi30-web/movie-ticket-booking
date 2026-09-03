import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMovie } from "../services/api";

const AddMovie = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await addMovie({
        ...form,
        rating: Number(form.rating),
      });

      alert("Movie added successfully");

      navigate("/");
    } catch {
      alert("Failed to add movie");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Add Movie
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5"
      >

        <div>
          <label>Movie Name</label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />

          {errors.name && (
            <p className="text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label>Poster URL</label>

          <input
            value={form.poster}
            onChange={(e) =>
              setForm({
                ...form,
                poster: e.target.value,
              })
            }
            className="w-full border p-3 rounded"
          />

          {errors.poster && (
            <p className="text-red-500">
              {errors.poster}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label>Genre</label>

            <select
              value={form.genre}
              onChange={(e) =>
                setForm({
                  ...form,
                  genre: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            >
              <option value="">Select Genre</option>
              <option>Action</option>
              <option>Comedy</option>
              <option>Drama</option>
              <option>Romance</option>
              <option>Thriller</option>
            </select>
          </div>

          <div>
            <label>Language</label>

            <select
              value={form.language}
              onChange={(e) =>
                setForm({
                  ...form,
                  language: e.target.value,
                })
              }
              className="w-full border p-3 rounded"
            >
              <option value="">Select Language</option>
              <option>Tamil</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
              <option>Malayalam</option>
            </select>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4">

          <input
            placeholder="Duration"
            value={form.duration}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value,
              })
            }
            className="border p-3 rounded"
          />

          <input
            type="date"
            value={form.releaseDate}
            onChange={(e) =>
              setForm({
                ...form,
                releaseDate: e.target.value,
              })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            placeholder="Rating"
            value={form.rating}
            onChange={(e) =>
              setForm({
                ...form,
                rating: e.target.value,
              })
            }
            className="border p-3 rounded"
          />

        </div>

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        >
          <option>Now Showing</option>
          <option>Upcoming</option>
        </select>

        <textarea
          placeholder="Description"
          rows={5}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-slate-900 text-white px-6 py-3 rounded"
        >
          Add Movie
        </button>

      </form>

    </div>
  );
};

export default AddMovie;