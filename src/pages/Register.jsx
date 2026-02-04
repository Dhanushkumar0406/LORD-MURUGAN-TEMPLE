import { useState } from "react";
import { registerCitizen } from "../api/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", age: "", address: "", phone: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await registerCitizen({
        name: form.name,
        age: Number(form.age),
        address: form.address,
        phone: form.phone
      });
      setMessage(`Registration successful. Your ID is ${data.citizen_id}.`);
      setForm({ name: "", age: "", address: "", phone: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page">
      <h2>Senior Citizen Registration</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Age
          <input name="age" type="number" value={form.age} onChange={handleChange} required />
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handleChange} required />
        </label>
        <label>
          Phone
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <button className="button" type="submit">Submit</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  );
}
