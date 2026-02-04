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
        {isLoggedIn && role === "user" && (
          <NavLink to="/my-ticket" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            My Ticket
          </NavLink>
        )}
        <NavLink to="/register" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Register
        </NavLink>
        {isLoggedIn && role === "admin" && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Admin
          </NavLink>
        )}
        {!isLoggedIn && (
          <NavLink to="/admin-login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Admin Login
          </NavLink>
        )}
        {!isLoggedIn && (
          <NavLink to="/signup" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Sign Up
          </NavLink>
        )}
        {isLoggedIn ? (
          <button className="button button-outline small" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
