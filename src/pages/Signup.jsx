import { useState } from "react";
import { signupUser } from "../api/api";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    citizen_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await signupUser(form);
      setMessage("Registration submitted. Please wait for admin approval before logging in.");
      setForm({
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
    <section className="page login">
      <div className="login-card">
        <p className="eyebrow">New User</p>
        <h1>Create Account</h1>
        <p className="lead">Register your account. Admin approval is required before login.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Citizen ID
            <input name="citizen_id" value={form.citizen_id} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <button className="button" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Create Account"}
          </button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
