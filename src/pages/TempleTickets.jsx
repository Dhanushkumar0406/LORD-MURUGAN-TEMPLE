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
    const isFree = ticket.cost === 0 || ticket.age >= 60;
    const costText = isFree ? "FREE" : "\u20B9" + ticket.cost;
    const statusColor = ticket.status === "APPROVED" ? "#2e7d32" : ticket.status === "REJECTED" ? "#c62828" : "#e65100";
    const createdDate = ticket.created_at ? new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${ticket.citizen_id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Poppins', Arial, sans-serif; background: #f5f5f5; padding: 30px; color: #333; }
            .ticket-wrapper { max-width: 700px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); }
            .ticket-header { background: linear-gradient(135deg, #b71c1c 0%, #d32f2f 50%, #e53935 100%); color: #fff; padding: 30px 40px; text-align: center; position: relative; }
            .ticket-header::after { content: ''; position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%); width: 30px; height: 30px; background: #fff; border-radius: 50%; }
            .ticket-header h1 { font-size: 24px; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
            .ticket-header p { font-size: 13px; opacity: 0.9; letter-spacing: 0.5px; }
            .ticket-body { padding: 40px 40px 20px; }
            .citizen-id-box { text-align: center; margin-bottom: 25px; padding: 15px; background: #fafafa; border: 2px dashed #ddd; border-radius: 10px; }
            .citizen-id-box .label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 5px; }
            .citizen-id-box .value { font-size: 28px; font-weight: 700; color: #b71c1c; letter-spacing: 3px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
            .info-item { padding: 14px 0; border-bottom: 1px solid #f0f0f0; }
            .info-item .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 4px; }
            .info-item .value { font-size: 15px; font-weight: 500; color: #333; }
            .info-item.full { grid-column: 1 / -1; }
            .status-badge { display: inline-block; padding: 6px 20px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: #fff; background: ${statusColor}; }
            .free-badge { color: #2e7d32; font-weight: 700; font-size: 18px; }
            .cost-value { font-size: 18px; font-weight: 700; color: #b71c1c; }
            .ticket-footer { padding: 20px 40px 30px; text-align: center; border-top: 2px dashed #eee; margin-top: 10px; }
            .ticket-footer p { font-size: 11px; color: #aaa; letter-spacing: 0.5px; }
            .ticket-footer .org { font-size: 13px; font-weight: 600; color: #b71c1c; margin-bottom: 5px; }
            .temples-list { margin-top: 20px; padding: 15px 20px; background: #fff8e1; border-radius: 10px; border-left: 4px solid #f9a825; }
            .temples-list .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #999; margin-bottom: 8px; }
            .temples-list .names { font-size: 12px; color: #555; line-height: 1.8; }
            .age-green { color: #2e7d32; font-weight: 700; }
            .benefits-section { margin-top: 25px; padding-top: 20px; border-top: 2px dashed #eee; }
            .benefits-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #b71c1c; margin-bottom: 15px; text-align: center; }
            .benefits-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
            .benefit-card { background: #fafafa; border-radius: 10px; padding: 15px; border: 1px solid #f0f0f0; }
            .benefit-card.highlight { background: #fbe9e7; border-color: #ffccbc; }
            .benefit-icon { font-size: 22px; margin-bottom: 6px; }
            .benefit-card h4 { font-size: 11px; font-weight: 600; color: #b71c1c; margin-bottom: 2px; line-height: 1.3; }
            .benefit-card h4 span { display: block; font-size: 10px; color: #c62828; font-weight: 500; }
            .benefit-card p { font-size: 9px; color: #666; line-height: 1.5; margin-top: 5px; }
            .benefit-card p.tamil { font-size: 9px; color: #888; margin-top: 3px; }
            .benefit-card strong { color: #333; }
            .pricing-row { display: flex; gap: 12px; margin-top: 15px; }
            .price-box { flex: 1; padding: 12px; border-radius: 10px; text-align: center; }
            .price-box.free { background: #e8f5e9; border: 2px solid #a5d6a7; }
            .price-box.paid { background: #fff3e0; border: 2px solid #ffcc80; }
            .price-box .price-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 4px; }
            .price-box .price-value { font-size: 20px; font-weight: 700; }
            .price-box.free .price-value { color: #2e7d32; }
            .price-box.paid .price-value { color: #e65100; }
            @media print { body { background: #fff; padding: 0; } .ticket-wrapper { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="ticket-wrapper">
            <div class="ticket-header">
              <h1>AARUPADAI MURUGAN TEMPLE TOUR</h1>
              <p>Official Tour Ticket / அதிகாரப்பூர்வ பயண டிக்கெட்</p>
            </div>
            <div class="ticket-body">
              <div class="citizen-id-box">
                <div class="label">Citizen ID / குடிமக்கள் எண்</div>
                <div class="value">${ticket.citizen_id}</div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="label">Full Name / பெயர்</div>
                  <div class="value">${ticket.name}</div>
                </div>
                <div class="info-item">
                  <div class="label">Age / வயது</div>
                  <div class="value ${ticket.age >= 60 ? "age-green" : ""}">${ticket.age} ${ticket.age >= 60 ? "(Senior Citizen)" : ""}</div>
                </div>
                <div class="info-item">
                  <div class="label">City / நகரம்</div>
                  <div class="value">${ticket.city}</div>
                </div>
                <div class="info-item">
                  <div class="label">District / மாவட்டம்</div>
                  <div class="value">${ticket.district}</div>
                </div>
                <div class="info-item">
                  <div class="label">Aadhar Number / ஆதார் எண்</div>
                  <div class="value">${ticket.aadhar_number}</div>
                </div>
                <div class="info-item">
                  <div class="label">Boarding Point / ஏறும் இடம்</div>
                  <div class="value">${ticket.boarding_point || ticket.city}</div>
                </div>
                <div class="info-item">
                  <div class="label">Package / பேக்கேஜ்</div>
                  <div class="value">${ticket.temple_name || "N/A"}</div>
                </div>
                <div class="info-item">
                  <div class="label">Cost / செலவு</div>
                  <div class="value ${isFree ? "free-badge" : "cost-value"}">${costText}</div>
                </div>
                <div class="info-item">
                  <div class="label">Registered On / பதிவு தேதி</div>
                  <div class="value">${createdDate}</div>
                </div>
                <div class="info-item">
                  <div class="label">Status / நிலை</div>
                  <div class="value"><span class="status-badge">${ticket.status}</span></div>
                </div>
              </div>
              <div class="temples-list">
                <div class="label">Temples Covered / கோவில்கள்</div>
                <div class="names">Palani \u2022 Thiruchendur \u2022 Swamimalai \u2022 Thirupparamkunram \u2022 Pazhamudircholai \u2022 Tiruttani</div>
              </div>
            </div>
            <div class="benefits-section">
              <div class="benefits-title">Trip Info / பயண தகவல்</div>
              <div class="benefits-grid">
                <div class="benefit-card highlight">
                  <div class="benefit-icon">\uD83C\uDF9F\uFE0F</div>
                  <h4>Free for Senior Citizens<span>மூத்த குடிமக்களுக்கு இலவசம்</span></h4>
                  <p>This tour is <strong>completely FREE</strong> for citizens aged <strong>60 to 80</strong>. No hidden charges!</p>
                  <p class="tamil">60 முதல் 80 வயதுக்குட்பட்ட குடிமக்களுக்கு <strong>முற்றிலும் இலவசம்</strong>.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon">\uD83D\uDE8C</div>
                  <h4>Bus Transport<span>பேருந்து போக்குவரத்து</span></h4>
                  <p>Free AC bus service covering <strong>6 sacred Murugan Temples</strong> across Tamil Nadu.</p>
                  <p class="tamil">தமிழ்நாடு முழுவதும் <strong>6 புனித முருகன் கோயில்களுக்கு</strong> இலவச ஏசி பேருந்து சேவை.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon">\uD83C\uDF5B</div>
                  <h4>Free Meals<span>இலவச உணவு</span></h4>
                  <p>All meals \u2014 breakfast, lunch &amp; dinner \u2014 are <strong>provided free</strong> throughout the tour.</p>
                  <p class="tamil">காலை உணவு, மதிய உணவு மற்றும் இரவு உணவு \u2014 பயணம் முழுவதும் <strong>இலவசமாக</strong> வழங்கப்படும்.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon">\uD83C\uDFE8</div>
                  <h4>Free Accommodation<span>இலவச தங்குமிடம்</span></h4>
                  <p>Stay and accommodation at each stop are <strong>fully covered</strong>. No extra cost.</p>
                  <p class="tamil">ஒவ்வொரு நிறுத்தத்திலும் தங்குமிடம் <strong>முழுமையாக</strong> வழங்கப்படும்.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon">\uD83C\uDFE5</div>
                  <h4>Medical Support<span>மருத்துவ உதவி</span></h4>
                  <p>In case of any medical emergency, <strong>medical assistance is free</strong>.</p>
                  <p class="tamil">மருத்துவ அவசரநிலை ஏற்பட்டால், <strong>மருத்துவ உதவி இலவசம்</strong>.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon">\uD83C\uDFDB\uFE0F</div>
                  <h4>Government Organized<span>அரசு ஏற்பாடு</span></h4>
                  <p>This program is <strong>organized by the Government</strong>. Safe, trusted &amp; officially managed.</p>
                  <p class="tamil">இந்தத் திட்டம் <strong>அரசால் ஏற்பாடு</strong> செய்யப்பட்டது.</p>
                </div>
              </div>
              <div class="pricing-row">
                <div class="price-box free">
                  <div class="price-label">Age 60 \u2013 80 / வயது 60 \u2013 80</div>
                  <div class="price-value">FREE / இலவசம்</div>
                </div>
                <div class="price-box paid">
                  <div class="price-label">Below Age 60 / 60 வயதுக்கு கீழ்</div>
                  <div class="price-value">\u20B92,500</div>
                </div>
              </div>
            </div>
            <div class="ticket-footer">
              <p class="org">Government of Tamil Nadu \u2022 தமிழ்நாடு அரசு</p>
              <p>This is a computer-generated ticket. No signature required.</p>
              <p>இது கணினி உருவாக்கிய டிக்கெட். கையெழுத்து தேவையில்லை.</p>
            </div>
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
