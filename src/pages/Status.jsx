import { useState } from "react";
import { fetchStatus, fetchTours } from "../api/api";

export default function Status() {
  const [citizenId, setCitizenId] = useState("");
  const [status, setStatus] = useState(null);
  const [tours, setTours] = useState([]);
  const [error, setError] = useState("");

  async function handleCheck(event) {
    event.preventDefault();
    setError("");
    setStatus(null);
    setTours([]);

    try {
      const data = await fetchStatus(citizenId);
      setStatus(data);
      if (data.status === "Approved") {
        const tourData = await fetchTours(citizenId);
        setTours(tourData);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <h2>Application Status</h2>
      <form className="form" onSubmit={handleCheck}>
        <label>
          Citizen ID
          <input value={citizenId} onChange={(e) => setCitizenId(e.target.value)} required />
        </label>
        <button className="button" type="submit">Check Status</button>
      </form>

      {error && <p className="error">{error}</p>}

      {status && (
        <div className="card">
          <p><strong>Name:</strong> {status.name}</p>
          <p><strong>Status:</strong> {status.status}</p>
        </div>
      )}

      {tours.length > 0 && (
        <div className="card">
          <h3>Tour Details</h3>
          <ul className="list">
            {tours.map((tour) => (
              <li key={tour.id}>
                {tour.temple_name} on {tour.tour_date} — {tour.travel_details}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
