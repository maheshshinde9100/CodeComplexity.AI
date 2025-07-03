import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import About from './components/About';
import ComplexityCalculator from './components/ComplexityCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <nav className="mb-8">
          <Link to="/" className="mr-4 text-blue-600 hover:text-blue-800">
            Home
          </Link>
          <Link to="/about" className="text-blue-600 hover:text-blue-800">
            About
          </Link>
        </nav>
        
        <Routes>
          <Route path="/" element={<ComplexityCalculator />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;