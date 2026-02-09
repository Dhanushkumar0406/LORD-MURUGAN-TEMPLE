import { useEffect, useState } from "react";
import { createRegistration, fetchMyRegistrations, updateRegistration, cancelRegistration } from "../api/api";

const emptyForm = {
  name: "",
  city: "",
  district: "",
  age: "",
  aadhar_number: "",
  package_language: "",
};

export default function Register() {
  const [formData, setFormData] = useState({ ...emptyForm });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));

  useEffect(() => {
    if (isLoggedIn) {
      loadRegistrations();
    }
  }, [isLoggedIn]);

  async function loadRegistrations() {
    try {
      const data = await fetchMyRegistrations();
      setRegistrations(data.items || []);
    } catch {
      // Not logged in or error — silently skip
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const payload = { ...formData, age: parseInt(formData.age) };
      if (parseInt(formData.age) >= 60) {
        delete payload.package_language;
      }

      if (editingId) {
        await updateRegistration(editingId, payload);
        setMessage("Registration updated successfully!");
        setEditingId(null);
      } else {
        const result = await createRegistration(payload);
        setMessage(`Registration submitted! Citizen ID: ${result.citizen_id}. Package: ${result.package}. Cost: ₹${result.cost}. Status: ${result.status}. Wait for admin approval.`);
      }

      setFormData({ ...emptyForm });
      if (isLoggedIn) await loadRegistrations();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(reg) {
    setEditingId(reg.id);
    setFormData({
      name: reg.name || "",
      city: reg.city || "",
      district: reg.district || "",
      age: String(reg.age || ""),
      aadhar_number: reg.aadhar_number || "",
      package_language: reg.package_language || "",
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
    setMessage("");
  }

  async function handleDelete(regId) {
    if (!window.confirm("Are you sure you want to cancel this registration?")) return;
    setError("");
    setMessage("");
    try {
      await cancelRegistration(regId);
      setMessage("Registration cancelled successfully!");
      await loadRegistrations();
    } catch (err) {
      setError(err.message);
    }
  }

  const age = parseInt(formData.age);
  const showPackageSelection = age > 0 && age < 60;
  const isFreePackage = age >= 60;

  return (
    <section className="page">
      <h2>{editingId ? "Edit Registration" : "Temple Tour Registration"}</h2>
      <p className="hint">
        {editingId ? "Update your registration details below." : "Register for Aarupadai Murugan temple tour."}
      </p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form className="form card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </label>

        <label>
          City
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter your city"
            required
          />
        </label>

        <label>
          District
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter your district"
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            required
          />
        </label>

        <label>
          Aadhar Number
          <input
            type="text"
            name="aadhar_number"
            value={formData.aadhar_number}
            onChange={handleChange}
            placeholder="Enter your Aadhar number"
            maxLength="12"
            required
          />
        </label>

        {isFreePackage && (
          <div className="card" style={{ background: "#e8f5e9", padding: "15px", marginBottom: "15px" }}>
            <strong style={{ color: "#2e7d32" }}>Free Package (Age 60+)</strong>
            <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Aarupadai Murugan Temples - Free Tour</p>
          </div>
        )}

        {showPackageSelection && (
          <>
            <label>
              Package Plan
              <select
                name="package_language"
                value={formData.package_language}
                onChange={handleChange}
                required
              >
                <option value="">Select Package</option>
                <option value="English">Aarupadai Murugan Temples Package - ₹2500</option>
                <option value="Tamil">ஆறுபடை முருகன் கோவில் பேக்கேஜ் - ₹2500</option>
              </select>
            </label>
            <div className="card" style={{ background: "#fff3e0", padding: "15px", marginBottom: "15px" }}>
              <strong style={{ color: "#e65100" }}>Package Cost: ₹2500</strong>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : editingId ? "Update Registration" : "Submit Registration"}
          </button>
          {editingId && (
            <button type="button" className="button button-outline" onClick={handleCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {isLoggedIn && registrations.length > 0 && (
        <div className="card" style={{ marginTop: "30px" }}>
          <h3>My Registrations ({registrations.length})</h3>
          <div className="table">
            <div className="table-header">
              <span>Citizen ID</span>
              <span>Name</span>
              <span>Age</span>
              <span>Package</span>
              <span>Cost</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            {registrations.map((reg) => (
              <div className="table-row" key={reg.id}>
                <span className="citizen-id-cell">{reg.citizen_id}</span>
                <span>{reg.name}</span>
                <span style={reg.age >= 60 ? { color: "#2e7d32", fontWeight: "bold" } : {}}>
                  {reg.age}
                </span>
                <span>{reg.temple_name || "N/A"}</span>
                <span>{reg.cost === 0 ? "FREE" : `₹${reg.cost}`}</span>
                <span>{reg.status}</span>
                <span className="actions">
                  <button
                    className="button small"
                    onClick={() => handleEdit(reg)}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-outline small"
                    onClick={() => handleDelete(reg.id)}
                  >
                    Delete
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
