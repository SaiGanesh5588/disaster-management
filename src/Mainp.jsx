import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Mainp.css';
import homepic1 from "./assets/h1pic.jpg";
import homepic2 from "./assets/h2pic.jpg";
import homepic3 from "./assets/h3pic.jpg";
import homepic4 from "./assets/hpic.jpg";

const features = [
  {
    icon: "🚨",
    title: "Real-time Alerts",
    description: "Get instant notifications about emergencies and disasters in your area",
    link: "/home/alerts"
  },
  {
    icon: "👥",
    title: "Volunteer Network",
    description: "Connect with volunteers and coordinate rescue operations effectively",
    link: "/home/volunteers"
  },
  {
    icon: "💝",
    title: "Emergency Donations",
    description: "Facilitate quick donations and resource distribution to affected areas",
    link: "/home/donation"
  },
  {
    icon: "📊",
    title: "Analytics & Reports",
    description: "Monitor disaster response effectiveness with comprehensive statistics",
    link: "/home/stats"
  }
];

const emergencyTips = [
  {
    src: homepic1,
    title: "Earthquakes",
    icon: "🌍",
    tips: ["Drop, Cover, Hold", "Stay away from heavy objects", "Find safe shelter immediately"],
    severity: "high"
  },
  {
    src: homepic2,
    title: "Thunderstorms",
    icon: "🌩️",
    tips: ["Stay indoors", "Avoid open areas", "Follow weather updates"],
    severity: "medium"
  },
  {
    src: homepic3,
    title: "Cyclones",
    icon: "🌪️",
    tips: ["Stay indoors", "Secure loose items", "Prepare emergency kit"],
    severity: "high"
  },
  {
    src: homepic4,
    title: "Floods",
    icon: "🌊",
    tips: ["Avoid flooded areas", "Move to higher ground", "Follow evacuation orders"],
    severity: "medium"
  }
];

const Mainp = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    activeAlerts: 0,
    volunteers: 0,
    donations: 0,
    areasProtected: 0
  });

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate loading stats
    setTimeout(() => {
      setStats({
        activeAlerts: 8,
        volunteers: 342,
        donations: 156,
        areasProtected: 23
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const FeatureCard = ({ feature }) => (
    <Link to={feature.link} className="feature-card">
      <div className="feature-icon">{feature.icon}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-description">{feature.description}</p>
      <div className="feature-arrow">→</div>
    </Link>
  );

  const EmergencyTipCard = ({ tip }) => (
    <div className={`tip-card ${tip.severity}`}>
      <div className="tip-image-container">
        <img src={tip.src} alt={tip.title} className="tip-image" />
        <div className="tip-overlay">
          <div className="tip-icon">{tip.icon}</div>
        </div>
      </div>
      <div className="tip-content">
        <h4 className="tip-title">{tip.title}</h4>
        <ul className="tip-list">
          {tip.tips.map((tipItem, index) => (
            <li key={index}>{tipItem}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-highlight">Emergency</span> Response
              <br />
              <span className="hero-subtitle">When Every Second Counts</span>
            </h1>
            <p className="hero-description">
              Comprehensive disaster management system providing real-time alerts, 
              volunteer coordination, and emergency response capabilities to protect communities.
            </p>
            <div className="hero-actions">
              <Link to="/home/dashboard" className="cta-button primary">
                <span>🚨</span> Emergency Dashboard
              </Link>
              <Link to="/home/alerts" className="cta-button secondary">
                <span>📢</span> View Active Alerts
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-time">
              <div className="current-time">{currentTime.toLocaleTimeString()}</div>
              <div className="current-date">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-number">{stats.activeAlerts}</span>
                <span className="stat-label">Active Alerts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.volunteers}</span>
                <span className="stat-label">Volunteers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Emergency Response Features</h2>
          <p className="section-subtitle">
            Comprehensive tools for effective disaster management and community protection
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </section>

      {/* Emergency Tips Section */}
      <section className="tips-section">
        <div className="section-header">
          <h2 className="section-title">Emergency Preparedness</h2>
          <p className="section-subtitle">
            Essential safety tips for common disaster scenarios
          </p>
        </div>
        <div className="tips-grid">
          {emergencyTips.map((tip, index) => (
            <EmergencyTipCard key={index} tip={tip} />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Make a Difference?</h2>
          <p className="cta-description">
            Join our community of volunteers and help us build a safer, more resilient society.
          </p>
          <div className="cta-buttons">
            <Link to="/home/volunteers" className="cta-button primary">
              <span>👥</span> Become a Volunteer
            </Link>
            <Link to="/home/donation" className="cta-button outline">
              <span>💝</span> Make a Donation
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="emergency-contact">
        <div className="contact-card">
          <div className="contact-icon">🚨</div>
          <div className="contact-info">
            <h3>Emergency Hotline</h3>
            <div className="hotline-number">📞 911-EMERGENCY</div>
            <p>Available 24/7 for immediate assistance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mainp;