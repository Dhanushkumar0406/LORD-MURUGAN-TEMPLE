import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import MyTicket from "./pages/MyTicket.jsx";
import TempleTickets from "./pages/TempleTickets.jsx";
import "./App.css";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const role = localStorage.getItem("userRole");
  if (!isLoggedIn || role !== "admin") {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-ticket"
            element={
              <ProtectedRoute>
                <MyTicket />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/temple-tickets"
            element={
              <AdminRoute>
                <TempleTickets />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin-login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
