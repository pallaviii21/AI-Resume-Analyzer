import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="/" className="navbar-logo">
            <span>AI Resume Analyzer</span>
          </a>          
        </div>
      </nav>

      {/* Page content */}
      <Dashboard />

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Built with React · Node.js · Supabase · Groq</p>
        </div>
      </footer>
    </div>
  );
}
