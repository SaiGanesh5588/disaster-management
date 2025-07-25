import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Volunteers.css";

const Volunteers = () => {
  const [activeTab, setActiveTab] = useState('join');
  const [volunteers, setVolunteers] = useState([]);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    ongoingMissions: 0,
    completedMissions: 0
  });
  
  const [newVolunteer, setNewVolunteer] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    skills: "",
    availability: "",
    experience: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate loading volunteer data
    setTimeout(() => {
      setStats({
        totalVolunteers: 342,
        activeVolunteers: 156,
        ongoingMissions: 8,
        completedMissions: 47
      });
      
      setVolunteers([
        {
          id: 1,
          name: "Hari Priya",
          location: "Central District",
          skills: "Medical Aid, Search & Rescue",
          experience: "3 years",
          status: "active",
          missions: 12,
          rating: 4.9,
          avatar: "👩‍⚕️"
        },
        {
          id: 2,
          name: "Ram Prasad",
          location: "North Zone",
          skills: "Emergency Response, First Aid",
          experience: "5 years",
          status: "active",
          missions: 23,
          rating: 4.8,
          avatar: "👨‍🚒"
        },
        {
          id: 3,
          name: "Usha",
          location: "East Sector",
          skills: "Communication, Logistics",
          experience: "2 years",
          status: "available",
          missions: 8,
          rating: 4.7,
          avatar: "👩‍💼"
        },
        {
          id: 4,
          name: "Tejaswini",
          location: "West Area",
          skills: "Technical Support, Coordination",
          experience: "4 years",
          status: "active",
          missions: 18,
          rating: 4.9,
          avatar: "q👩"
        }
      ]);
    }, 1000);
  }, []);

  const handleJoinVolunteers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/volunteers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVolunteer),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Welcome to our volunteer community! 🎉");
        setNewVolunteer({
          name: "",
          email: "",
          phone: "",
          location: "",
          age: "",
          skills: "",
          availability: "",
          experience: ""
        });
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      alert("Server Error! Please try again.");
    }
    setLoading(false);
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    volunteer.skills.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, value, icon, subtitle }) => (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  );

  const VolunteerCard = ({ volunteer }) => (
    <div className={`volunteer-card ${volunteer.status}`}>
      <div className="volunteer-header">
        <div className="volunteer-avatar">{volunteer.avatar}</div>
        <div className="volunteer-info">
          <h3 className="volunteer-name">{volunteer.name}</h3>
          <p className="volunteer-location">📍 {volunteer.location}</p>
          <div className="volunteer-rating">
            <span className="rating-stars">⭐ {volunteer.rating}</span>
            <span className="mission-count">• {volunteer.missions} missions</span>
          </div>
        </div>
        <div className={`status-indicator ${volunteer.status}`}>
          {volunteer.status === 'active' ? '🟢' : '🟡'}
        </div>
      </div>
      <div className="volunteer-details">
        <div className="detail-item">
          <strong>Skills:</strong> {volunteer.skills}
        </div>
        <div className="detail-item">
          <strong>Experience:</strong> {volunteer.experience}
        </div>
      </div>
      <div className="volunteer-actions">
        <button className="contact-btn">📞 Contact</button>
        <button className="assign-btn">📋 Assign Mission</button>
      </div>
    </div>
  );

  return (
    <div className="volunteers-container">
      {/* Main Content Area */}
      <div className="volunteers-content">
        {/* Header */}
        <div className="volunteers-header">
          <h1 className="page-title">Volunteer Community</h1>
          <p className="page-subtitle">Heroes who make a difference in emergency situations</p>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
        <StatCard 
          title="Total Volunteers" 
          value={stats.totalVolunteers} 
          icon="👥" 
          subtitle="Registered members"
        />
        <StatCard 
          title="Active Now" 
          value={stats.activeVolunteers} 
          icon="🟢" 
          subtitle="Currently available"
        />
        <StatCard 
          title="Ongoing Missions" 
          value={stats.ongoingMissions} 
          icon="🚀" 
          subtitle="In progress"
        />
        <StatCard 
          title="Completed Missions" 
          value={stats.completedMissions} 
          icon="✅" 
          subtitle="This month"
        />
        </div>

        {/* Navigation Tabs */}
        <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          🤝 Join Us
        </button>
        <button 
          className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          📋 Volunteer Directory
        </button>
        <button 
          className={`tab-btn ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          🎯 Active Missions
        </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
        {activeTab === 'join' && (
          <div className="join-section">
            <div className="join-hero">
              <h2>Become a Volunteer Hero</h2>
              <p>Join our community of dedicated volunteers and help save lives during emergencies</p>
            </div>
            
            <div className="join-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name"
                    value={newVolunteer.name}
                    onChange={(e) => setNewVolunteer({...newVolunteer, name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={newVolunteer.email}
                    onChange={(e) => setNewVolunteer({...newVolunteer, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    placeholder="Your contact number"
                    value={newVolunteer.phone}
                    onChange={(e) => setNewVolunteer({...newVolunteer, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input 
                    type="text" 
                    placeholder="Your city/area"
                    value={newVolunteer.location}
                    onChange={(e) => setNewVolunteer({...newVolunteer, location: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input 
                    type="number" 
                    placeholder="Your age"
                    value={newVolunteer.age}
                    onChange={(e) => setNewVolunteer({...newVolunteer, age: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Skills & Expertise</label>
                  <input 
                    type="text" 
                    placeholder="e.g., First Aid, Search & Rescue, Communication"
                    value={newVolunteer.skills}
                    onChange={(e) => setNewVolunteer({...newVolunteer, skills: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Availability</label>
                  <select 
                    value={newVolunteer.availability}
                    onChange={(e) => setNewVolunteer({...newVolunteer, availability: e.target.value})}
                  >
                    <option value="">Select availability</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="24/7">24/7 Emergency Response</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous Experience</label>
                  <textarea 
                    placeholder="Tell us about your volunteer or emergency response experience"
                    value={newVolunteer.experience}
                    onChange={(e) => setNewVolunteer({...newVolunteer, experience: e.target.value})}
                    rows="3"
                  ></textarea>
                </div>
              </div>
              
              <button 
                className="join-btn"
                onClick={handleJoinVolunteers}
                disabled={loading}
              >
                {loading ? '🔄 Registering...' : '🚀 Join Our Team'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="directory-section">
            <div className="directory-header">
              <h2>Volunteer Directory</h2>
              <div className="search-bar">
                <input 
                  type="text"
                  placeholder="🔍 Search volunteers by name, location, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="volunteers-grid">
              {filteredVolunteers.map(volunteer => (
                <VolunteerCard key={volunteer.id} volunteer={volunteer} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="missions-section">
            <div className="missions-header">
              <h2>Active Emergency Missions</h2>
              <p>Current operations requiring volunteer support</p>
            </div>
            
            <div className="missions-grid">
              <div className="mission-card urgent">
                <div className="mission-header">
                  <div className="mission-icon">🚨</div>
                  <div className="mission-info">
                    <h3>Flood Relief - Central District</h3>
                    <p className="mission-location">📍 Downtown Area</p>
                  </div>
                  <div className="urgency-badge urgent">URGENT</div>
                </div>
                <div className="mission-details">
                  <p><strong>Volunteers Needed:</strong> 15</p>
                  <p><strong>Skills Required:</strong> First Aid, Logistics</p>
                  <p><strong>Duration:</strong> 24-48 hours</p>
                </div>
                <button className="volunteer-btn">🙋‍♀️ Volunteer Now</button>
              </div>
              
              <div className="mission-card high">
                <div className="mission-header">
                  <div className="mission-icon">🔥</div>
                  <div className="mission-info">
                    <h3>Wildfire Support - North Zone</h3>
                    <p className="mission-location">📍 Forest Area</p>
                  </div>
                  <div className="urgency-badge high">HIGH</div>
                </div>
                <div className="mission-details">
                  <p><strong>Volunteers Needed:</strong> 8</p>
                  <p><strong>Skills Required:</strong> Evacuation Support</p>
                  <p><strong>Duration:</strong> 12 hours</p>
                </div>
                <button className="volunteer-btn">🙋‍♂️ Volunteer Now</button>
              </div>
              
              <div className="mission-card medium">
                <div className="mission-header">
                  <div className="mission-icon">📦</div>
                  <div className="mission-info">
                    <h3>Supply Distribution</h3>
                    <p className="mission-location">📍 East Sector</p>
                  </div>
                  <div className="urgency-badge medium">MEDIUM</div>
                </div>
                <div className="mission-details">
                  <p><strong>Volunteers Needed:</strong> 12</p>
                  <p><strong>Skills Required:</strong> Organization, Transport</p>
                  <p><strong>Duration:</strong> 6 hours</p>
                </div>
                <button className="volunteer-btn">🙋 Volunteer Now</button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Volunteers;
