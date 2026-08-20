import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="/" className="navbar-logo">
            <span className="logo-dot"></span>
            <span>AI Resume Analyzer</span>
          </a>
          <div className="navbar-right">
            <a href="#workspace" className="nav-link-btn">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <Dashboard />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} AI Resume Analyzer · ATS Optimization & PDF Generator</p>
        </div>
      </footer>
    </div>
  );
}
