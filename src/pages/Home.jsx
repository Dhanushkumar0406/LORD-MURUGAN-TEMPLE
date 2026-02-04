import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="page">
      <h1>Free Murugan Temple Tour</h1>
      <p className="lead">
        This mini project helps senior citizens register for a free temple tour
        and lets administrators approve applications and schedule travel.
      </p>
      <div className="button-row">
        <Link className="button" to="/register">Register</Link>
        <Link className="button button-secondary" to="/status">Check Status</Link>
        <Link className="button button-outline" to="/admin">Admin Login</Link>
      </div>
    </section>
  );
}
