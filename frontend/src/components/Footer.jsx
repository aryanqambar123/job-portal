function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} JobPortal. All rights reserved.</p>
        <p className="footer-note">Connecting job seekers with opportunities worldwide.</p>
      </div>
    </footer>
  );
}

export default Footer;