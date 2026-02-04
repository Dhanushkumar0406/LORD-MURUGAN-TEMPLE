import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyTicket } from "../api/api";

const temples = [
  { name: "Palani", price: 200 },
  { name: "Thiruchendur", price: 250 },
  { name: "Swamimalai", price: 350 },
  { name: "Thirupparamkunram", price: 350 },
  { name: "Pazhamudircholai", price: 350 },
  { name: "Tiruttani", price: 300 },
  { name: "Marudhamalai", price: 150 }
];

export default function MyTicket() {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "user") {
      navigate("/home");
      return;
    }

    async function loadTicket() {
      setError("");
      setLoading(true);
      try {
        const data = await fetchMyTicket();
        setTicket(data.ticket);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTicket();
  }, [navigate]);

  if (loading) {
    return (
      <section className="page">
        <h2>My Ticket</h2>
        <p className="hint">Loading your ticket details...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h2>My Ticket</h2>
        <p className="error">{error}</p>
      </section>
    );
  }

  if (!ticket) {
    return (
      <section className="page">
        <h2>My Ticket</h2>
        <p className="hint">Your ticket has not been issued yet. Please check back later.</p>
      </section>
    );
  }

  const createdAt = ticket.created_at ? new Date(ticket.created_at) : null;
  const costText = ticket.is_free ? "FREE (Age above 60)" : `₹${ticket.cost}`;

  return (
    <section className="page">
      <div className="card ticket-card">
        <div className="ticket-header">
          <div>
            <p className="eyebrow">My Ticket</p>
            <h2>Temple Tour Booking</h2>
            <p className="hint">Issued after admin approval.</p>
          </div>
          <span className="ticket-badge">CONFIRMED</span>
        </div>

        <div className="ticket-details">
          <div>
            <span className="label">Boarding Point</span>
            <strong>{ticket.boarding_point}</strong>
          </div>
          <div>
            <span className="label">Temple</span>
            <strong>{ticket.temple_name}</strong>
          </div>
          <div>
            <span className="label">Age</span>
            <strong>{ticket.age} yrs</strong>
          </div>
          <div>
            <span className="label">Cost</span>
            <strong>{costText}</strong>
          </div>
          {createdAt && (
            <div>
              <span className="label">Issued On</span>
              <strong>{createdAt.toLocaleString()}</strong>
            </div>
          )}
        </div>

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
    </section>
  );
}
