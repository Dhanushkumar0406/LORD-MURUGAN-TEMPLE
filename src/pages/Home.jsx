import { Link } from "react-router-dom";

const temples = [
  { name: "Palani", image: "/temples/palani-murugan-temple.jpg" },
  { name: "Thiruchendur", image: "/temples/thiruchendur.jpg" },
  { name: "Swamimalai", image: "/temples/swamimalai-murugan-temple.jpg" },
  { name: "Thirupparamkunram", image: "/temples/Thiruparakundram.jpg" },
  { name: "Pazhamudircholai", image: "/temples/pazhamudhir-solai.jpg" },
  { name: "Tiruttani", image: "/temples/Thiruthani.jpg" },
  { name: "Marudhamalai", image: "/temples/marudhamalai.jpg" }
];

export default function Home() {
  const username = localStorage.getItem("username") || "Guest";

  return (
    <section className="page">
      <div className="hero">
        <div className="hero-content">
          <p className="eyebrow">Welcome</p>
          <h1>Welcome to Free Murugan Temple Tour</h1>
          <p className="lead">Hello {username}. Explore the seven sacred Murugan temples and register a citizen for approval.</p>
          <div className="button-row">
            <Link className="button" to="/register">Register</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card__title">Murugan Temples</div>
          <p className="hint">Seven revered shrines across Tamil Nadu.</p>
        </div>
      </div>

      <div className="temple-grid">
        {temples.map((temple) => (
          <div className="temple-card" key={temple.name}>
            <img src={temple.image} alt={temple.name} />
            <h3>{temple.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
