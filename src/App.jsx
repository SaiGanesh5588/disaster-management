import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Alerts from "./Alerts";
import Volunteers from "./Volunteers";
import Donation from "./Donation";
import Stats from "./Stats";
import Us from "./Us";
import Page2 from "./Page2";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Main Application Routes */}
        <Route path="/home/*" element={<Home />} />
        
        {/* Direct Component Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/about" element={<Us />} />
        <Route path="/page2" element={<Page2 />} />
        
        {/* Fallback Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 