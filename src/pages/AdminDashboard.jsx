import { useEffect, useState } from "react";
import { fetchRegistrations, approveRegistration, rejectRegistration } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");
    if (role !== "admin" || !token) {
      navigate("/admin-login");
      return;
    }
    loadRegistrations();
  }, [navigate]);

  async function loadRegistrations() {
    setError("");
    try {
      const data = await fetchRegistrations("status=PENDING");
      setRegistrations(data.items || []);
    } catch (err) {
      setError(err.message);
      if (!localStorage.getItem("authToken")) {
        navigate("/admin-login");
      }
    }
  }

  async function handleApprove(regId) {
    setActionId(regId);
    setMessage("");
    setError("");
    try {
      await approveRegistration({ registration_id: regId });
      setMessage("Registration approved!");
      await loadRegistrations();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(regId) {
    setActionId(regId);
    setMessage("");
    setError("");
    try {
      await rejectRegistration({ registration_id: regId });
      setMessage("Registration rejected.");
      await loadRegistrations();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  return (
    <section className="page">
      <h2>Admin Dashboard</h2>
      <p className="hint">Review and approve registrations.</p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Pending Registrations ({registrations.length})</h3>
        {registrations.length === 0 ? (
          <p className="hint">No pending registrations.</p>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Citizen ID</span>
              <span>Name</span>
              <span>Age</span>
              <span>Package</span>
              <span>Cost</span>
              <span>Actions</span>
            </div>
            {registrations.map((reg) => (
              <div className="table-row" key={reg.id}>
                <span className="citizen-id-cell">{reg.citizen_id}</span>
                <span>{reg.name}</span>
                <span>{reg.age}</span>
                <span>{reg.temple_name || "N/A"}</span>
                <span>₹{reg.cost}</span>
                <span className="actions">
                  <button
                    className="button small"
                    onClick={() => handleApprove(reg.id)}
                    disabled={actionId === reg.id}
                  >
                    Approve
                  </button>
                  <button
                    className="button button-outline small"
                    onClick={() => handleReject(reg.id)}
                    disabled={actionId === reg.id}
                  >
                    Reject
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
