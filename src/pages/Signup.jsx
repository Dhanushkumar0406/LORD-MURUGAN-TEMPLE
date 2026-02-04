import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/api";

export default function Signup() {
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
      const data = await signupUser(form);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", String(data.id));
      localStorage.setItem("userLoggedIn", "true");
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page login">
      <div className="login-card">
        <p className="eyebrow">New User</p>
        <h1>Create Account</h1>
        <p className="lead">Sign up to manage temple tour registrations.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>
          <button className="button" type="submit">Create Account</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </section>
  );
}
