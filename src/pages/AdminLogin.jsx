import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

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
      const data = await loginUser(form);
      if (data.role !== "admin") {
        setError("Admin access required.");
        return;
      }
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", String(data.id));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page login">
      <div className="login-card">
        <p className="eyebrow">Admin Portal</p>
        <h1>Admin Login</h1>
        <p className="lead">Sign in with admin credentials to manage registrations.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <button className="button" type="submit">Login as Admin</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="hint">HELLO RANJITH ADMIN</p>
      </div>
    </section>
  );
}
