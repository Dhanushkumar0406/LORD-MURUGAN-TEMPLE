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
          <p className="lead">HELLO RANJITH ADMIN. Explore the seven sacred Murugan temples and register a citizen for approval.</p>
          <div className="button-row">
            <Link className="button" to="/register">Register</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card__title">Murugan Temples</div>
          <p className="hint">Seven revered shrines across Tamil Nadu.</p>
        </div>
      </div>

      <div className="infohut">
        <p className="eyebrow">Trip Info / பயண தகவல்</p>
        <h2>About This Tour Package / இந்தப் பயண பேக்கேஜ் பற்றி</h2>

        <div className="infohut-grid">
          <div className="infohut-card infohut-card--highlight">
            <div className="infohut-icon">🎫</div>
            <h3>Free for Senior Citizens<br/>மூத்த குடிமக்களுக்கு இலவசம்</h3>
            <p>
              This tour is <strong>completely FREE</strong> for citizens aged <strong>60 to 80</strong>.
              No hidden charges!
            </p>
            <p className="infohut-tamil">
              60 முதல் 80 வயதுக்குட்பட்ட குடிமக்களுக்கு இந்தப் பயணம் <strong>முற்றிலும் இலவசம்</strong>.
              மறைமுக கட்டணங்கள் இல்லை!
            </p>
          </div>

          <div className="infohut-card">
            <div className="infohut-icon">🚌</div>
            <h3>Bus Transport<br/>பேருந்து போக்குவரத்து</h3>
            <p>
              Free AC bus service covering <strong>6 sacred Murugan Temples</strong> across Tamil Nadu.
            </p>
            <p className="infohut-tamil">
              தமிழ்நாடு முழுவதும் உள்ள <strong>6 புனித முருகன் கோயில்களுக்கு</strong> இலவச ஏசி பேருந்து சேவை.
            </p>
          </div>

          <div className="infohut-card">
            <div className="infohut-icon">🍛</div>
            <h3>Free Meals<br/>இலவச உணவு</h3>
            <p>
              All meals — breakfast, lunch &amp; dinner — are <strong>provided free</strong> throughout the tour.
            </p>
            <p className="infohut-tamil">
              காலை உணவு, மதிய உணவு மற்றும் இரவு உணவு — பயணம் முழுவதும் <strong>இலவசமாக</strong> வழங்கப்படும்.
            </p>
          </div>

          <div className="infohut-card">
            <div className="infohut-icon">🏨</div>
            <h3>Free Accommodation<br/>இலவச தங்குமிடம்</h3>
            <p>
              Stay and accommodation at each stop are <strong>fully covered</strong>. No extra cost.
            </p>
            <p className="infohut-tamil">
              ஒவ்வொரு நிறுத்தத்திலும் தங்குமிடம் <strong>முழுமையாக</strong> வழங்கப்படும். கூடுதல் செலவு இல்லை.
            </p>
          </div>

          <div className="infohut-card">
            <div className="infohut-icon">🏥</div>
            <h3>Medical Support<br/>மருத்துவ உதவி</h3>
            <p>
              In case of any medical emergency during the trip, <strong>medical assistance is free</strong>.
            </p>
            <p className="infohut-tamil">
              பயணத்தின் போது ஏதேனும் மருத்துவ அவசரநிலை ஏற்பட்டால், <strong>மருத்துவ உதவி இலவசம்</strong>.
            </p>
          </div>

          <div className="infohut-card">
            <div className="infohut-icon">🏛️</div>
            <h3>Government Organized<br/>அரசு ஏற்பாடு</h3>
            <p>
              This program is <strong>organized by the Government</strong>. Safe, trusted &amp; officially managed.
            </p>
            <p className="infohut-tamil">
              இந்தத் திட்டம் <strong>அரசால் ஏற்பாடு</strong> செய்யப்பட்டது. பாதுகாப்பான, நம்பகமான &amp; அதிகாரப்பூர்வ மேலாண்மை.
            </p>
          </div>
        </div>

        <div className="infohut-pricing">
          <div className="infohut-price-card infohut-price-card--free">
            <span className="infohut-price-label">Age 60 – 80 / வயது 60 – 80</span>
            <span className="infohut-price-value free-badge">FREE / இலவசம்</span>
          </div>
          <div className="infohut-price-card infohut-price-card--paid">
            <span className="infohut-price-label">Below Age 60 / 60 வயதுக்கு கீழ்</span>
            <span className="infohut-price-value price">₹2,500</span>
          </div>
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
