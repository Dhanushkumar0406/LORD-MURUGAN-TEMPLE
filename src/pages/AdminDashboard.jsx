import { useEffect, useState } from "react";
import { approveUser, createTicket, fetchPendingUsers, rejectUser } from "../api/api";
import { useNavigate } from "react-router-dom";

const temples = [
  { name: "Palani", price: 200 },
  { name: "Thiruchendur", price: 250 },
  { name: "Swamimalai", price: 350 },
  { name: "Thirupparamkunram", price: 350 },
  { name: "Pazhamudircholai", price: 350 },
  { name: "Tiruttani", price: 300 },
  { name: "Marudhamalai", price: 150 }
];

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);
  const [ticketUser, setTicketUser] = useState(null);
  const [ticketForm, setTicketForm] = useState({
    age: "",
    boarding_point: "",
    temple_name: temples[0].name
  });
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketError, setTicketError] = useState("");
  const [savingTicket, setSavingTicket] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  async function loadPendingUsers() {
    setError("");
    try {
      const data = await fetchPendingUsers();
      setPendingUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadPendingUsers();
  }, []);

  async function handleAction(userId, action) {
    setMessage("");
    setError("");
    setTicketMessage("");
    setTicketError("");
    setActionId(userId);
    try {
      if (action === "approve") {
        const approvedUser = pendingUsers.find((user) => user.id === userId) || null;
        await approveUser(userId);
        setMessage("User approved successfully!");
        setTicketUser(approvedUser);
        setTicketForm({
          age: "",
          boarding_point: "",
          temple_name: temples[0].name
        });
      } else {
        await rejectUser(userId);
        setMessage("User rejected.");
      }
      await loadPendingUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  }

  async function handleTicketSubmit(event) {
    event.preventDefault();
    if (!ticketUser) {
      setTicketError("Select an approved user to issue a ticket.");
      return;
    }
    setTicketError("");
    setTicketMessage("");
    setSavingTicket(true);
    try {
      await createTicket(ticketUser.id, {
        age: ticketForm.age,
        boarding_point: ticketForm.boarding_point,
        temple_name: ticketForm.temple_name
      });
      setTicketMessage("Ticket booked successfully!");
    } catch (err) {
      setTicketError(err.message);
    } finally {
      setSavingTicket(false);
    }
  }

  function handleTicketChange(event) {
    const { name, value } = event.target;
    setTicketForm((prev) => ({ ...prev, [name]: value }));
  }

  function calculateCost() {
    const ageValue = parseInt(ticketForm.age, 10);
    if (Number.isNaN(ageValue)) return null;
    if (ageValue > 60) {
      return { isFree: true, amount: 0 };
    }
    const temple = temples.find((item) => item.name === ticketForm.temple_name);
    return { isFree: false, amount: temple?.price ?? 0 };
  }

  const costInfo = calculateCost();

  return (
    <section className="page">
      <h2>Admin Dashboard</h2>
      <p className="hint">Review and approve new registrations before users can log in.</p>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      {ticketUser && (
        <div className="card ticket-card">
          <div className="ticket-header">
            <div>
              <p className="eyebrow">Approved Ticket</p>
              <h3>Temple Tour Booking</h3>
              <p className="hint">Details unlocked after approval.</p>
            </div>
            <span className="ticket-badge">APPROVED</span>
          </div>
          <div className="ticket-grid">
            <div className="ticket-details">
              <div>
                <span className="label">Name</span>
                <strong>{ticketUser.full_name}</strong>
              </div>
              <div>
                <span className="label">Email</span>
                <strong>{ticketUser.email}</strong>
              </div>
              <div>
                <span className="label">Citizen ID</span>
                <strong>{ticketUser.citizen_id}</strong>
              </div>
            </div>

            <form className="form ticket-form" onSubmit={handleTicketSubmit}>
              <label>
                Boarding Point
                <input
                  name="boarding_point"
                  value={ticketForm.boarding_point}
                  onChange={handleTicketChange}
                  placeholder="Enter boarding point"
                  required
                />
              </label>
              <label>
                Age
                <input
                  name="age"
                  type="number"
                  min="1"
                  max="120"
                  value={ticketForm.age}
                  onChange={handleTicketChange}
                  placeholder="Enter age"
                  required
                />
              </label>
              <label>
                Select Temple
                <select name="temple_name" value={ticketForm.temple_name} onChange={handleTicketChange}>
                  {temples.map((temple) => (
                    <option key={temple.name} value={temple.name}>
                      {temple.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="ticket-actions">
                <button className="button" type="submit" disabled={savingTicket}>
                  {savingTicket ? "Booking..." : "Book Ticket"}
                </button>
              </div>
            </form>
          </div>

          {costInfo && (
            <div className="ticket-cost">
              <strong>Ticket Cost:</strong>{" "}
              {costInfo.isFree ? (
                <span className="free-badge">FREE (Age above 60)</span>
              ) : (
                <span className="price">₹{costInfo.amount}</span>
              )}
            </div>
          )}

          {ticketMessage && <p className="success">{ticketMessage}</p>}
          {ticketError && <p className="error">{ticketError}</p>}

          <div className="ticket-places">
            <span className="label">Temples to Visit</span>
            <div className="ticket-list">
              {temples.map((temple) => (
                <span key={temple.name} className="ticket-chip">
                  {temple.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Pending Users ({pendingUsers.length})</h3>
        {pendingUsers.length === 0 ? (
          <p className="hint">No pending users.</p>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Full Name</span>
              <span>Email</span>
              <span>Citizen ID</span>
              <span>Actions</span>
            </div>
            {pendingUsers.map((user) => (
              <div className="table-row" key={user.id}>
                <span>{user.full_name}</span>
                <span>{user.email}</span>
                <span className="citizen-id-cell">{user.citizen_id}</span>
                <span className="actions">
                  <button
                    className="button small"
                    onClick={() => handleAction(user.id, "approve")}
                    disabled={actionId === user.id}
                  >
                    Approve
                  </button>
                  <button
                    className="button button-outline small"
                    onClick={() => handleAction(user.id, "reject")}
                    disabled={actionId === user.id}
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
