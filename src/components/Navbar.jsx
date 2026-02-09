import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const role = localStorage.getItem("userRole");

  async function handleLogout() {
    try {
      await logoutUser();
    } catch {
      // Ignore logout errors and clear local state.
    }
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="nav-brand">Murugan Temple Tour</div>
      <nav className="nav-links">
        {isLoggedIn && (
          <NavLink to="/home" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>
        )}
        {isLoggedIn && (
          <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Register
          </NavLink>
        )}
        {isLoggedIn && role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Admin Approval Dashboard
          </NavLink>
        )}
        {isLoggedIn && role === "admin" && (
          <NavLink to="/temple-tickets" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Tickets
          </NavLink>
        )}
        {!isLoggedIn && (
          <NavLink to="/admin-login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Admin Login
          </NavLink>
        )}
        {isLoggedIn && (
          <button className="button button-outline small" type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
