import React, { useState, useEffect } from 'react';
import './About.css';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = [
    { name: "Java", level: 91, color: "#6366f1" },
    { name: "Spring Boot", level: 90, color: "#8b5cf6" },
    { name: "React.js", level: 80, color: "#a855f7" },
    { name: "Node.js", level: 70, color: "#3b82f6" },
    { name: "MongoDB", level: 80, color: "#6366f1" },
    { name: "MySQL", level: 85, color: "#8b5cf6" },
    { name: "Docker", level: 60, color: "#a855f7" },
    { name: "Kafka", level: 40, color: "#3b82f6" }
  ];

  const tools = [
    "Hibernate", "JavaScript", "C++", "Tailwind CSS", "SonarQube", 
    "Git", "Redis", "Postman"
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

      {/* Brief About Application */}
      <div className="about-section mission-section">
        <div className="section-header">
          <h2 className="section-title">About the Application</h2>
          <div className="section-divider"></div>
        </div>
        <div className="mission-content">
          <p>
            CodeComplexity.AI is an intelligent code analysis platform that helps developers 
            understand and optimize their algorithms. Simply paste your code, and get instant 
            Big O notation analysis, performance insights, and optimization suggestions powered by AI.
          </p>
        </div>
      </div>

      {/* How It Works - Simplified */}
      <div className="about-section workflow-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <div className="section-divider"></div>
        </div>
        <div className="workflow-steps">
          <div className="workflow-step">
            <div className="step-number">1</div>
            <h3>Input Code</h3>
            <p>Paste your algorithm or code snippet</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Advanced analysis of complexity and performance</p>
          </div>
          <div className="workflow-arrow">→</div>
          <div className="workflow-step">
            <div className="step-number">3</div>
            <h3>Get Results</h3>
            <p>Receive Big O notation and optimization tips</p>
          </div>
        </div>
      </div>

      {/* Developer Info - Main Focus */}
      <div className="about-section developer-section">
        <div className="section-header">
          <h2 className="section-title">About the Developer</h2>
          <div className="section-divider"></div>
        </div>
        <div className="developer-card">

          <div className="developer-avatar">
  <div className="avatar-glow"></div>
  <img 
    src="/my-img2.jpg" 
    alt="Mahesh Shinde" 
    className="developer-avatar-img"
  />
</div>

          <div className="developer-info">
            <h3>Mahesh Shinde</h3>
            <p className="developer-title">B. Tech Computer Engineering Student</p>
            <p className="developer-college">3rd Year • Sanjivani College of Engineering, Kopargaon</p>
            <p className="developer-description">
              Passionate full-stack developer with expertise in modern web technologies and 
              backend systems. Currently pursuing Computer Engineering with a focus on 
              building scalable applications and exploring AI/ML integration.
            </p>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="about-section tech-section">
        <div className="section-header">
          <h2 className="section-title">Technical Skills</h2>
          <div className="section-divider"></div>
        </div>
        <div className="tech-grid">
          {skills.map((skill, index) => (
            <div key={index} className="tech-item">
              <div className="tech-header">
                <span className="tech-name">{skill.name}</span>
                <span className="tech-percentage">{skill.level}%</span>
              </div>
              <div className="tech-bar">
                <div 
                  className="tech-progress"
                  style={{ 
                    width: `${skill.level}%`,
                    backgroundColor: skill.color
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Tools */}
        <div className="tools-section">
          <h3 className="tools-title">Additional Tools & Technologies</h3>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <div key={index} className="tool-tag">
                {tool}
              </div>
            ))}
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
            Let's connect! Feel free to reach out for collaborations, opportunities, or just to say hello.
          </p>
          <div className="contact-links">
            <a href="mailto:contact.shindemahesh2112@gmail.com" className="contact-link">
              <span className="contact-icon">📧</span>
              <span>Email Me</span>
            </a>
            <a href="https://github.com/coder-mahi" className="contact-link" target="_blank" rel="noopener noreferrer">
              <span className="contact-icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/mahesh-shinde-0a666b23b" className="contact-link" target="_blank" rel="noopener noreferrer">
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