import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  approveCitizen,
  rejectCitizen,
  fetchCitizens,
  scheduleTour
} from "../api/api";

export default function AdminDashboard() {
  const [citizens, setCitizens] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [schedule, setSchedule] = useState({
    citizen_id: "",
    temple_name: "",
    tour_date: "",
    travel_details: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const allowed = localStorage.getItem("adminLoggedIn");
    if (!allowed) {
      navigate("/admin");
    }
  }, [navigate]);

  async function loadCitizens() {
    try {
      const data = await fetchCitizens();
      setCitizens(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadCitizens();
  }, []);

  async function handleApprove(id) {
    setMessage("");
    setError("");
    try {
      setActionId(id);
      await approveCitizen(id);
      setCitizens((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Approved" } : c))
      );
      setMessage("Citizen approved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  async function handleReject(id) {
    setMessage("");
    setError("");
    try {
      setActionId(id);
      await rejectCitizen(id);
      setCitizens((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c))
      );
      setMessage("Citizen rejected.");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  function handleScheduleChange(event) {
    const { name, value } = event.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSchedule(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await scheduleTour({
        citizen_id: Number(schedule.citizen_id),
        temple_name: schedule.temple_name,
        tour_date: schedule.tour_date,
        travel_details: schedule.travel_details
      });
      setMessage("Tour scheduled successfully.");
      setSchedule({ citizen_id: "", temple_name: "", tour_date: "", travel_details: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  const total = citizens.length;
  const approved = citizens.filter((c) => c.status === "Approved").length;
  const pending = citizens.filter((c) => c.status === "Pending").length;
  const rejected = citizens.filter((c) => c.status === "Rejected").length;

  return (
    <section className="page">
      <h2>Admin Dashboard</h2>

      <div className="stats">
        <div>Total: {total}</div>
        <div>Approved: {approved}</div>
        <div>Pending: {pending}</div>
        <div>Rejected: {rejected}</div>
      </div>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Citizen Applications</h3>
        <div className="table">
          <div className="table-header">
            <span>Name</span>
            <span>Age</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {citizens.map((citizen) => (
            <div className="table-row" key={citizen.id}>
              <span>{citizen.name}</span>
              <span>{citizen.age}</span>
              <span>{citizen.status}</span>
              <span className="actions">
                <button
                  className="button small"
                  onClick={() => handleApprove(citizen.id)}
                  disabled={actionId === citizen.id}
                >
                  Approve
                </button>
                <button
                  className="button button-outline small"
                  onClick={() => handleReject(citizen.id)}
                  disabled={actionId === citizen.id}
                >
                  Reject
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Schedule Tour</h3>
        <form className="form" onSubmit={handleSchedule}>
          <label>
            Citizen ID
            <input name="citizen_id" value={schedule.citizen_id} onChange={handleScheduleChange} required />
          </label>
          <label>
            Temple Name
            <input name="temple_name" value={schedule.temple_name} onChange={handleScheduleChange} required />
          </label>
          <label>
            Tour Date
            <input name="tour_date" type="date" value={schedule.tour_date} onChange={handleScheduleChange} required />
          </label>
          <label>
            Travel Details
            <textarea name="travel_details" value={schedule.travel_details} onChange={handleScheduleChange} required />
          </label>
          <button className="button" type="submit">Schedule</button>
        </form>
      </div>
    </section>
  );
}
