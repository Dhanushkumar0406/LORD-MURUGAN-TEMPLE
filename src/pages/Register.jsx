import { useState } from "react";
import { createRegistration } from "../api/api";

const temples = [
  { name: "Palani", price: 200 },
  { name: "Thiruchendur", price: 250 },
  { name: "Swamimalai", price: 350 },
  { name: "Thirupparamkunram", price: 350 },
  { name: "Pazhamudircholai", price: 350 },
  { name: "Tiruttani", price: 300 },
  { name: "Marudhamalai", price: 150 }
];

const CURRENCY = "\u20B9";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    district: "",
    age: "",
    temple_name: temples[0].name
  });
  const [registrationResult, setRegistrationResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function calculateCost() {
    const age = parseInt(formData.age, 10);
    if (isNaN(age)) return null;

    if (age > 60) {
      return { amount: 0, isFree: true };
    }

    const temple = temples.find((t) => t.name === formData.temple_name);
    return { amount: temple?.price || 0, isFree: false };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setRegistrationResult(null);
    setError("");
    setSubmitting(true);

    try {
      const data = await createRegistration({
        name: formData.name,
        city: formData.city,
        district: formData.district,
        age: parseInt(formData.age, 10),
        temple_name: formData.temple_name
      });

      setRegistrationResult({
        citizen_id: data.citizen_id,
        name: formData.name,
        temple: formData.temple_name,
        boarding_point: formData.city,
        cost: data.cost,
        is_free: data.is_free,
        status: data.status
      });
      setFormData({
        name: "",
        city: "",
        district: "",
        age: "",
        temple_name: temples[0].name
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const costInfo = calculateCost();

  return (
    <section className="page">
      <h2>Temple Tour Registration</h2>
      <p className="hint">Fill in your details to register for the Murugan Temple Tour.</p>

      <form className="form card" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
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
            min="1"
            max="120"
            required
          />
        </label>

        <label>
          Select Temple
          <select name="temple_name" value={formData.temple_name} onChange={handleChange}>
            {temples.map((temple) => (
              <option key={temple.name} value={temple.name}>
                {temple.name} - {CURRENCY}{temple.price}
              </option>
            ))}
          </select>
        </label>

        {costInfo && (
          <div className="cost-display">
            <strong>Registration Cost: </strong>
            {costInfo.isFree ? (
              <span className="free-badge">FREE (Age above 60)</span>
            ) : (
              <span className="price">{CURRENCY}{costInfo.amount}</span>
            )}
          </div>
        )}

        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {registrationResult && (
        <div className="card success-card">
          <h3>Registration Successful!</h3>
          <div className="citizen-id-display">
            <span className="label">Your Citizen ID:</span>
            <span className="citizen-id">{registrationResult.citizen_id}</span>
          </div>
          <div className="registration-details">
            <p><strong>Name:</strong> {registrationResult.name}</p>
            <p><strong>Temple:</strong> {registrationResult.temple}</p>
            <p><strong>Boarding Point:</strong> {registrationResult.boarding_point}</p>
            <p><strong>Cost:</strong> {registrationResult.is_free ? <span className="free-badge">FREE (Senior Citizen)</span> : `${CURRENCY}${registrationResult.cost}`}</p>
            <p><strong>Status:</strong> {registrationResult.status}</p>
          </div>
          <p className="hint">Please save your Citizen ID for future reference.</p>
        </div>
      )}
    </section>
  );
}
