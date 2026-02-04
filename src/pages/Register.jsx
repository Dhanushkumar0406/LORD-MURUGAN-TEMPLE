import { useState } from "react";
import { signupUser } from "../api/api";

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    citizen_id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      await signupUser(formData);
      setMessage("Registration submitted. Please wait for admin approval before logging in.");
      setFormData({
        full_name: "",
        email: "",
        citizen_id: "",
        password: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <h2>Citizen Registration</h2>
      <p className="hint">Submit your details to request access. Admin approval is required before login.</p>

      <form className="form card" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </label>

        <label>
          Citizen ID
          <input
            type="text"
            name="citizen_id"
            value={formData.citizen_id}
            onChange={handleChange}
            placeholder="Enter your citizen ID"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </label>

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
    </section>
  );
}
