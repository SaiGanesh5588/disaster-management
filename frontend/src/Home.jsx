import React from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";
import hurtsLogo from './assets/hurts-logo.png';
import Dashboard from "./Dashboard";
import Alerts from "./Alerts";
import Volunteers from "./Volunteers";
import Donation from "./Donation";
import Stats from "./Stats";
import Mainp from "./Mainp";
import Us from "./Us";
import Page2 from "./Page2";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  // Helper function to check if route is active
  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-text-container">
            <span className="logo-wings left-wing">❮❮❮</span>
            <span className="logo-text">HURTS</span>
            <span className="logo-wings right-wing">❯❯❯</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-button ${isActiveRoute('/home') && location.pathname === '/home/' ? 'active' : ''}`}
            onClick={() => navigate("/home/")}
          >
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-button ${isActiveRoute('/home/dashboard') ? 'active' : ''}`}
            onClick={() => navigate("/home/dashboard")}
          >
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-button ${isActiveRoute('/home/alerts') ? 'active' : ''}`}
            onClick={() => navigate("/home/alerts")}
          >
            <span>Alerts</span>
          </button>
          
          <button 
            className={`nav-button ${isActiveRoute('/home/volunteers') ? 'active' : ''}`}
            onClick={() => navigate("/home/volunteers")}
          >
            <span>Volunteers</span>
          </button>
          
          <button 
            className={`nav-button ${isActiveRoute('/home/donation') ? 'active' : ''}`}
            onClick={() => navigate("/home/donation")}
          >
            <span>Donation</span>
          </button>
          
          <button 
            className={`nav-button ${isActiveRoute('/home/stats') ? 'active' : ''}`}
            onClick={() => navigate("/home/stats")}
          >
            <span>Stats</span>
          </button>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button className="nav-button logout-button" onClick={handleLogout}>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="page-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="page-title">
                {location.pathname === '/home/' && 'Welcome Dashboard'}
                {location.pathname === '/home/dashboard' && 'Emergency Command Center'}
                {location.pathname === '/home/alerts' && 'Alert Management System'}
                {location.pathname === '/home/volunteers' && 'Volunteer Coordination Hub'}
                {location.pathname === '/home/donation' && 'Donation Management Portal'}
                {location.pathname === '/home/stats' && 'Analytics & Reports'}
              </h1>
              <p className="page-subtitle">Disaster Management</p>
            </div>
            <div className="header-right">
              <div className="header-actions">
                <button className="header-btn notification-btn">
                  <i className="bi bi-bell"></i>
                  <span className="notification-count">3</span>
                </button>
                <button className="header-btn profile-btn">
                  <i className="bi bi-person-circle"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="content-body">
          <Routes>
            <Route path="/" element={<Mainp />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="volunteers" element={<Volunteers />} />
            <Route path="donation" element={<Donation />} />
            <Route path="stats" element={<Stats />} />
            <Route path="about" element={<Us />} />
            <Route path="page2" element={<Page2 />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Home;