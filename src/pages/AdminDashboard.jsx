import { useEffect, useState } from "react";
import { approveRegistration, fetchRegistrations, rejectRegistration } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const navigate = useNavigate();
  const CURRENCY = "\u20B9";
  const formatCurrency = (amount) => `${CURRENCY}${amount}`;

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  async function loadRegistrations() {
    try {
      const data = await fetchRegistrations();
      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadRegistrations();
  }, []);

  async function handleAction(id, action) {
    setMessage("");
    setError("");
    try {
      setActionId(id);
      if (action === "approve") {
        await approveRegistration({ registration_id: id });
        setMessage("Registration approved successfully!");
      } else {
        await rejectRegistration({ registration_id: id });
        setMessage("Registration rejected.");
      }
      await loadRegistrations();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  const pending = registrations.filter((r) => r.status === "PENDING");
  const approved = registrations.filter((r) => r.status === "APPROVED");
  const rejected = registrations.filter((r) => r.status === "REJECTED");

  return (
    <section className="page">
      <h2>Admin Dashboard</h2>
      <p className="hint">Manage temple tour registrations.</p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Pending Registrations ({pending.length})</h3>
        {pending.length === 0 ? (
          <p className="hint">No pending registrations.</p>
        ) : (
          <div className="table pending-table">
            <div className="table-header">
              <span>Citizen ID</span>
              <span>Name</span>
              <span>Age</span>
              <span>Temple</span>
              <span>Cost</span>
              <span>Actions</span>
            </div>
            {pending.map((reg) => (
              <div className="table-row" key={reg.id}>
                <span className="citizen-id-cell">{reg.citizen_id}</span>
                <span>{reg.name}</span>
                <span>{reg.age} yrs</span>
                <span>{reg.temple_name}</span>
                <span>{reg.cost === 0 ? <span className="free-badge">FREE</span> : formatCurrency(reg.cost)}</span>
                <span className="actions">
                  <button
                    className="button small"
                    onClick={() => handleAction(reg.id, "approve")}
                    disabled={actionId === reg.id}
                  >
                    Approve
                  </button>
                  <button
                    className="button button-outline small"
                    onClick={() => handleAction(reg.id, "reject")}
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

      <div className="card" style={{ marginTop: "24px" }}>
        <h3>Approved Registrations ({approved.length})</h3>
        {approved.length === 0 ? (
          <p className="hint">No approved registrations yet.</p>
        ) : (
          <div className="table approved-table">
            <div className="table-header">
              <span>Citizen ID</span>
              <span>Name</span>
              <span>Age</span>
              <span>Temple</span>
              <span>Boarding Point</span>
              <span>Cost</span>
            </div>
            {approved.map((reg) => (
              <div className="table-row approved-row" key={reg.id}>
                <span className="citizen-id-cell">{reg.citizen_id}</span>
                <span>{reg.name}</span>
                <span>{reg.age} yrs</span>
                <span>{reg.temple_name}</span>
                <span>{reg.boarding_point}</span>
                <span>{reg.cost === 0 ? <span className="free-badge">FREE</span> : formatCurrency(reg.cost)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {rejected.length > 0 && (
        <div className="card" style={{ marginTop: "24px" }}>
          <h3>Rejected Registrations ({rejected.length})</h3>
          <div className="table rejected-table">
            <div className="table-header">
              <span>Name</span>
              <span>Age</span>
              <span>Temple</span>
              <span>Status</span>
            </div>
            {rejected.map((reg) => (
              <div className="table-row rejected-row" key={reg.id}>
                <span>{reg.name}</span>
                <span>{reg.age} yrs</span>
                <span>{reg.temple_name}</span>
                <span className="rejected-badge">REJECTED</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
