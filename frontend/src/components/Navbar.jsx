import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { logout(); navigate("/"); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 shadow-lg"
      style={{ background: "linear-gradient(135deg, #FF6B35, #EC4899)" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <span className="text-2xl">🔍</span>
          <span className="text-xl font-black text-white tracking-tight">
            Lost & Found
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex gap-2 items-center">
          <Link to="/home"
            className="px-4 py-2 rounded-xl font-bold text-sm transition"
            style={isActive("/home")
              ? { background: "white", color: "#FF6B35" }
              : { color: "white" }}>
            Home
          </Link>

          <Link to="/dashboard"
            className="px-4 py-2 rounded-xl font-bold text-sm transition"
            style={isActive("/dashboard")
              ? { background: "white", color: "#FF6B35" }
              : { color: "white" }}>
            Dashboard
          </Link>

          <Link to="/post"
            className="px-4 py-2 rounded-xl font-black text-sm transition shadow-md"
            style={{ background: "white", color: "#FF6B35" }}>
            + Post Item
          </Link>

          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-2 pl-2"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.3)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shadow-md"
              style={{ background: "rgba(255,255,255,0.25)", color: "white", border: "2px solid rgba(255,255,255,0.5)" }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-bold text-sm hidden md:block">
              {user?.name?.split(" ")[0]}
            </span>
            <button onClick={handleLogout}
              className="px-3 py-2 rounded-xl font-bold text-sm transition ml-1"
              style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.35)"}
              onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}