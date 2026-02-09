import { useEffect, useState } from "react";
import { fetchRegistrations } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TempleTickets() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("APPROVED");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");
    if (role !== "admin" || !token) {
      navigate("/admin-login");
      return;
    }
    loadTickets();
  }, [navigate, filter]);

  async function loadTickets() {
    setError("");
    try {
      const query = `status=${filter}${search ? `&q=${search}` : ""}`;
      const data = await fetchRegistrations(query);
      setTickets(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    loadTickets();
  }

  function handleDownloadPDF(ticket) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Temple Tour Ticket - ${ticket.citizen_id}</title>
          <style>
            body { font-family: Arial; padding: 40px; }
            .ticket { border: 2px solid #333; padding: 30px; max-width: 600px; margin: auto; }
            h1 { text-align: center; color: #d32f2f; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; }
            .label { font-weight: bold; }
            .green { color: #2e7d32; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <h1>Temple Tour Ticket</h1>
            <div class="row"><span class="label">Citizen ID:</span> ${ticket.citizen_id}</div>
            <div class="row"><span class="label">Name:</span> ${ticket.name}</div>
            <div class="row"><span class="label">Age:</span> <span ${ticket.age >= 60 ? 'class="green"' : ""}>${ticket.age}</span></div>
            <div class="row"><span class="label">City:</span> ${ticket.city}</div>
            <div class="row"><span class="label">District:</span> ${ticket.district}</div>
            <div class="row"><span class="label">Aadhar:</span> ${ticket.aadhar_number}</div>
            <div class="row"><span class="label">Package:</span> ${ticket.temple_name || "N/A"}</div>
            <div class="row"><span class="label">Cost:</span> ${ticket.cost === 0 ? "FREE" : "₹" + ticket.cost}</div>
            <div class="row"><span class="label">Status:</span> ${ticket.status}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  return (
    <section className="page">
      <h2>Temple Tour Tickets</h2>
      <p className="hint">View all temple tour tickets.</p>

      {error && <p className="error">{error}</p>}

      <div className="card">
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", flex: 1 }}>
            <input
              type="text"
              placeholder="Search by name or citizen ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="button">Search</button>
          </form>
        </div>

        <h3>{filter} Tickets ({tickets.length})</h3>
        {tickets.length === 0 ? (
          <p className="hint">No tickets found.</p>
        ) : (
          <div className="table">
            <div className="table-header">
              <span>Citizen ID</span>
              <span>Name</span>
              <span>Age</span>
              <span>Package</span>
              <span>PDF</span>
              <span>Cost</span>
              <span>Status</span>
            </div>
            {tickets.map((ticket) => (
              <div className="table-row" key={ticket.id}>
                <span className="citizen-id-cell">{ticket.citizen_id}</span>
                <span>{ticket.name}</span>
                <span style={ticket.age >= 60 ? { color: "#2e7d32", fontWeight: "bold" } : {}}>
                  {ticket.age}
                </span>
                <span>{ticket.temple_name || "N/A"}</span>
                <span>
                  <button
                    className="button small"
                    onClick={() => handleDownloadPDF(ticket)}
                  >
                    PDF
                  </button>
                </span>
                <span>{ticket.cost === 0 ? "FREE" : `₹${ticket.cost}`}</span>
                <span>{ticket.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
