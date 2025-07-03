import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 1,
      title: "BigO Analysis",
      description: "Advanced algorithmic complexity analysis with real-time Big O notation calculation",
      icon: "🚀",
      color: "#00f5ff"
    },
    {
      id: 2,
      title: "Code Optimization",
      description: "Intelligent suggestions to improve your code performance and efficiency",
      icon: "⚡",
      color: "#00ff88"
    },
    {
      id: 3,
      title: "Smart Suggestions",
      description: "AI-powered recommendations for better coding practices and patterns",
      icon: "🧠",
      color: "#ff6b6b"
    },
    {
      id: 4,
      title: "Detailed Analysis",
      description: "Comprehensive code breakdown with complexity metrics and insights",
      icon: "📊",
      color: "#ffff00"
    },
    {
      id: 5,
      title: "Performance Metrics",
      description: "Real-time performance tracking and complexity scoring system",
      icon: "📈",
      color: "#ff00ff"
    },
    {
      id: 6,
      title: "History Tracking",
      description: "Complete analysis history with comparison and trend visualization",
      icon: "📝",
      color: "#00ffff"
    }
  ];

  const stats = [
    { label: "Code Analyses", value: "10,000+", color: "#00f5ff" },
    { label: "Algorithms Optimized", value: "5,000+", color: "#00ff88" },
    { label: "Performance Boost", value: "85%", color: "#ff6b6b" },
    { label: "Happy Developers", value: "2,500+", color: "#ffff00" }
  ];

  const techStack = [
    { name: "React", level: 95, color: "#00f5ff" },
    { name: "Node.js", level: 90, color: "#00ff88" },
    { name: "AI/ML", level: 85, color: "#ff6b6b" },
    { name: "Algorithm Analysis", level: 98, color: "#ffff00" }
  ];

  return (
    <div className={`about-container ${isVisible ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <div className="about-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="gradient-text">CodeComplexity.AI</h1>
          <p className="hero-subtitle">
            Advanced Code Analysis Platform for Modern Developers
          </p>
          <div className="pulse-dot"></div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="about-section mission-section">
        <div className="section-header">
          <h2 className="section-title">Our Mission</h2>
          <div className="section-divider"></div>
        </div>
        <div className="mission-content">
          <p>
            CodeComplexity.AI revolutionizes how developers understand and optimize their code. 
            Our cutting-edge platform combines advanced algorithms with artificial intelligence 
            to provide instant, accurate complexity analysis and optimization suggestions.
          </p>
          <p>
            We believe that every developer deserves access to professional-grade code analysis 
            tools that help them write better, faster, and more efficient code.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="about-section features-section">
        <div className="section-header">
          <h2 className="section-title">Key Features</h2>
          <div className="section-divider"></div>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-glow"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-section stats-section">
        <div className="section-header">
          <h2 className="section-title">Platform Statistics</h2>
          <div className="section-divider"></div>
        </div>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-bar">
                <div className="stat-fill"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="about-section tech-section">
        <div className="section-header">
          <h2 className="section-title">Technology Stack</h2>
          <div className="section-divider"></div>
        </div>
        <div className="tech-grid">
          {techStack.map((tech, index) => (
            <div key={index} className="tech-item">
              <div className="tech-header">
                <span className="tech-name">{tech.name}</span>
                <span className="tech-percentage">{tech.level}%</span>
              </div>
              <div className="tech-bar">
                <div 
                  className="tech-progress"
                  style={{ 
                    width: `${tech.level}%`,
                    backgroundColor: tech.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="about-section workflow-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <div className="section-divider"></div>
        </div>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h3>Input Your Code</h3>
            <p>Paste your code into our advanced editor with syntax highlighting</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI engine analyzes complexity, patterns, and performance metrics</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive detailed analysis, optimization suggestions, and BigO notation</p>
          </div>
        </div>
      </div>

      {/* Developer Info */}
      <div className="about-section developer-section">
        <div className="section-header">
          <h2 className="section-title">About the Developer</h2>
          <div className="section-divider"></div>
        </div>
        <div className="developer-card">
          <div className="developer-avatar">
            <div className="avatar-glow"></div>
            <span className="avatar-text">DEV</span>
          </div>
          <div className="developer-info">
            <h3>Built with Passion</h3>
            <p>
              CodeComplexity.AI was created by passionate developers who understand 
              the challenges of writing efficient code. Our goal is to democratize 
              access to advanced code analysis tools and help developers worldwide 
              improve their coding skills.
            </p>
            <div className="developer-stats">
              <div className="dev-stat">
                <span className="dev-stat-value">5+</span>
                <span className="dev-stat-label">Years Experience</span>
              </div>
              <div className="dev-stat">
                <span className="dev-stat-value">100+</span>
                <span className="dev-stat-label">Projects</span>
              </div>
              <div className="dev-stat">
                <span className="dev-stat-value">∞</span>
                <span className="dev-stat-label">Passion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="about-section contact-section">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <div className="section-divider"></div>
        </div>
        <div className="contact-content">
          <p>
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
          <div className="contact-links">
            <a href="#" className="contact-link">
              <span className="contact-icon">📧</span>
              <span>Email Us</span>
            </a>
            <a href="#" className="contact-link">
              <span className="contact-icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="#" className="contact-link">
              <span className="contact-icon">💼</span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;