import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        <Link to="/" className="text-2xl font-bold">
          🎬 MovieBook
        </Link>

        <div className="flex flex-wrap gap-5">
          <Link to="/">Dashboard</Link>
          <Link to="/movies/add">Add Movie</Link>
          <Link to="/shows">Shows</Link>
          <Link to="/bookings">Bookings</Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;