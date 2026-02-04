import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/api";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await adminLogin(form);
      localStorage.setItem("adminLoggedIn", "true");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <h2>Admin Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Username
          <input name="username" value={form.username} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <button className="button" type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="hint">Default admin: admin / admin123</p>
    </section>
  );
}
