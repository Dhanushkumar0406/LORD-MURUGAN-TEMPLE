import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const data = await loginUser(form);
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
        <p className="eyebrow">Entry Point</p>
        <h1>Login</h1>
        <p className="lead">Sign in with your approved account to continue.</p>
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
        <p className="hint">Login is available after admin approval.</p>
      </div>
    </section>
  );
}
