export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>Free Murugan Temple Tour - {year} - Senior Citizen Outreach</p>
    </footer>
  );
}
