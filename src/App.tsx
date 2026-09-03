import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import AddMovie from "./pages/AddMovie";
import MovieDetails from "./pages/MovieDetails";
import EditMovie from "./pages/EditMovie";
import Shows from "./pages/Shows";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Dashboard */}
        <Route
          path="/"
          element={<Dashboard />}
        />

        {/* Add Movie */}
        <Route
          path="/movies/add"
          element={<AddMovie />}
        />

        {/* Movie Details */}
        <Route
          path="/movies/:id"
          element={<MovieDetails />}
        />

        {/* Edit Movie */}
        <Route
          path="/movies/edit/:id"
          element={<EditMovie />}
        />

        {/* Show Management */}
        <Route
          path="/shows"
          element={<Shows />}
        />

        {/* Seat Selection */}
        <Route
          path="/shows/:showId/seats"
          element={<SeatSelection />}
        />

        {/* Booking */}
        <Route
          path="/booking/:showId"
          element={<Booking />}
        />

        {/* Booking Management */}
        <Route
          path="/bookings"
          element={<Bookings />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;