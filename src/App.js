import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import About from './components/About';
import ComplexityCalculator from './components/ComplexityCalculator';
import './App.css';

function NavBar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">CodeComplexity.AI</span>
        </Link>
      </div>
      
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          Home
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
        >
          <span className="nav-icon">👨‍💻</span>
          About
        </Link>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-text">
          <span className="footer-icon">💜</span>
          <span>Built with passion by</span>
          <a 
            href="https://github.com/coder-mahi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            Mahesh Shinde
          </a>
        </div>
        <div className="footer-year">
          © 2024 CodeComplexity.AI
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ComplexityCalculator />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;