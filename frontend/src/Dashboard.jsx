import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    
    const dashboardData = {
        activeAlerts: { value: 8, change: '+12%', trend: 'up' },
        totalVolunteers: { value: 342, change: '+8%', trend: 'up' },
        donationsToday: { value: 156, change: '+15%', trend: 'up' },
        responseRate: { value: 94, change: '+3%', trend: 'up' },
        affectedAreas: { value: 12, change: '-2%', trend: 'down' },
        resourcesDeployed: { value: 87, change: '+12%', trend: 'up' }
    };

    const recentActivity = [
        { id: 1, message: 'Flood warning issued for Central District', time: '2 min ago', type: 'warning' },
        { id: 2, message: 'Emergency response team deployed to North Zone', time: '15 min ago', type: 'info' },
        { id: 3, message: 'Volunteer registration completed - 25 new volunteers', time: '1 hour ago', type: 'success' },
        { id: 4, message: 'Resource allocation updated for Coastal Area', time: '2 hours ago', type: 'info' },
        { id: 5, message: 'Critical alert resolved in Forest Region', time: '3 hours ago', type: 'success' }
    ];

    const chartData = [
        { label: 'Flood', value: 35, color: '#3182CE' },
        { label: 'Fire', value: 28, color: '#D69E2E' },
        { label: 'Earthquake', value: 20, color: '#E53E3E' },
        { label: 'Storm', value: 17, color: '#3182CE' }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
    };


    return (
        <div className="dashboard-container">
            {/* Dashboard Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <h1 className="dashboard-title">Emergency Command Center</h1>
                        <p className="dashboard-subtitle">Real-time disaster management overview</p>
                    </div>
                    <div className="header-right">
                        <div className="time-display">
                            <div className="current-time">{formatTime(currentTime)}</div>
                            <div className="current-date">{formatDate(currentTime)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="stats-grid">
                <div className="stat-card alert-card">
                    <div className="card-icon">
                        <span>🚨</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">{dashboardData.activeAlerts.value}</div>
                        <div className="card-label">ACTIVE ALERTS</div>
                        <div className="card-change positive">{dashboardData.activeAlerts.change}</div>
                    </div>
                </div>

                <div className="stat-card volunteer-card">
                    <div className="card-icon">
                        <span>👥</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">{dashboardData.totalVolunteers.value}</div>
                        <div className="card-label">TOTAL VOLUNTEERS</div>
                        <div className="card-change positive">{dashboardData.totalVolunteers.change}</div>
                    </div>
                </div>

                <div className="stat-card donation-card">
                    <div className="card-icon">
                        <span>💝</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">${dashboardData.donationsToday.value}K</div>
                        <div className="card-label">DONATIONS TODAY</div>
                        <div className="card-change positive">{dashboardData.donationsToday.change}</div>
                    </div>
                </div>

                <div className="stat-card response-card">
                    <div className="card-icon">
                        <span>⚡</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">{dashboardData.responseRate.value}%</div>
                        <div className="card-label">RESPONSE RATE</div>
                        <div className="card-change positive">{dashboardData.responseRate.change}</div>
                    </div>
                </div>

                <div className="stat-card affected-card">
                    <div className="card-icon">
                        <span>📍</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">{dashboardData.affectedAreas.value}</div>
                        <div className="card-label">AFFECTED AREAS</div>
                        <div className="card-change negative">{dashboardData.affectedAreas.change}</div>
                    </div>
                </div>

                <div className="stat-card resource-card">
                    <div className="card-icon">
                        <span>📦</span>
                    </div>
                    <div className="card-content">
                        <div className="card-value">{dashboardData.resourcesDeployed.value}</div>
                        <div className="card-label">RESOURCES DEPLOYED</div>
                        <div className="card-change positive">{dashboardData.resourcesDeployed.change}</div>
                    </div>
                </div>
            </div>

            {/* View All Section */}
            <div className="view-all-section">
                <Link to="/home/stats" className="view-all-btn">
                    View All →
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;