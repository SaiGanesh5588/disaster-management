import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Stats.css';

const Stats = () => {
    const [stats, setStats] = useState({
        totalAlerts: 0,
        activeAlerts: 0,
        volunteers: 0,
        donations: 0,
        affectedAreas: 0,
        peopleHelped: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setStats({
                totalAlerts: 127,
                activeAlerts: 8,
                volunteers: 342,
                donations: 156,
                affectedAreas: 23,
                peopleHelped: 2847
            });
            setLoading(false);
        }, 1000);
    }, []);

    const disasterTypes = [
        { name: 'Floods', count: 45, percentage: 35, color: '#3b82f6' },
        { name: 'Earthquakes', count: 32, percentage: 25, color: '#ef4444' },
        { name: 'Hurricanes', count: 28, percentage: 22, color: '#f59e0b' },
        { name: 'Wildfires', count: 22, percentage: 18, color: '#10b981' }
    ];

    const recentActivity = [
        { id: 1, type: 'Alert', message: 'Flood warning issued for Central District', time: '2 hours ago', status: 'active' },
        { id: 2, type: 'Volunteer', message: '15 new volunteers registered', time: '4 hours ago', status: 'completed' },
        { id: 3, type: 'Donation', message: 'Emergency supplies donated to East Zone', time: '6 hours ago', status: 'completed' },
        { id: 4, type: 'Response', message: 'Rescue operation completed in Sector 7', time: '8 hours ago', status: 'completed' }
    ];

    const StatCard = ({ title, value, icon, trend, trendValue }) => (
        <div className="stat-card">
            <div className="stat-icon">
                {icon}
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <div className="stat-value">
                    {loading ? (
                        <div className="loading-skeleton"></div>
                    ) : (
                        <span className="stat-number">{value.toLocaleString()}</span>
                    )}
                </div>
                {trend && (
                    <div className={`stat-trend ${trend}`}>
                        <span className="trend-icon">{trend === 'up' ? '↗' : '↘'}</span>
                        <span className="trend-value">{trendValue}%</span>
                    </div>
                )}
            </div>
        </div>
    );

    const ProgressBar = ({ label, percentage, color }) => (
        <div className="progress-item">
            <div className="progress-header">
                <span className="progress-label">{label}</span>
                <span className="progress-percentage">{percentage}%</span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
        </div>
    );

    return (
        <div className="stats-container">
            {/* Main Content Area */}
            <div className="stats-content">
                <div className="stats-header">
                <h1 className="stats-title">Disaster Management Statistics</h1>
                <p className="stats-subtitle">Real-time overview of emergency response activities</p>
            </div>

            {/* Key Metrics */}
            <div className="stats-grid">
                <StatCard 
                    title="Total Alerts" 
                    value={stats.totalAlerts} 
                    icon="🚨" 
                    trend="up" 
                    trendValue={12}
                />
                <StatCard 
                    title="Active Alerts" 
                    value={stats.activeAlerts} 
                    icon="⚠️" 
                    trend="down" 
                    trendValue={8}
                />
                <StatCard 
                    title="Volunteers" 
                    value={stats.volunteers} 
                    icon="👥" 
                    trend="up" 
                    trendValue={23}
                />
                <StatCard 
                    title="Donations" 
                    value={stats.donations} 
                    icon="💝" 
                    trend="up" 
                    trendValue={15}
                />
                <StatCard 
                    title="Affected Areas" 
                    value={stats.affectedAreas} 
                    icon="📍" 
                    trend="down" 
                    trendValue={5}
                />
                <StatCard 
                    title="People Helped" 
                    value={stats.peopleHelped} 
                    icon="🤝" 
                    trend="up" 
                    trendValue={31}
                />
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                <div className="chart-container">
                    <h2 className="chart-title">Disaster Types Distribution</h2>
                    <div className="disaster-chart">
                        {disasterTypes.map((disaster, index) => (
                            <ProgressBar 
                                key={index}
                                label={`${disaster.name} (${disaster.count})`}
                                percentage={disaster.percentage}
                                color={disaster.color}
                            />
                        ))}
                    </div>
                </div>

                <div className="activity-container">
                    <h2 className="chart-title">Recent Activity</h2>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    {activity.type === 'Alert' && '🚨'}
                                    {activity.type === 'Volunteer' && '👥'}
                                    {activity.type === 'Donation' && '💝'}
                                    {activity.type === 'Response' && '🚑'}
                                </div>
                                <div className="activity-content">
                                    <p className="activity-message">{activity.message}</p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                                <div className={`activity-status ${activity.status}`}>
                                    {activity.status === 'active' ? '●' : '✓'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-section">
                <div className="summary-card">
                    <h3>Emergency Response Rate</h3>
                    <div className="summary-metric">
                        <span className="metric-value">94.2%</span>
                        <span className="metric-label">Average response time under 15 minutes</span>
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Resource Availability</h3>
                    <div className="summary-metric">
                        <span className="metric-value">87%</span>
                        <span className="metric-label">Emergency supplies in stock</span>
                    </div>
                </div>
                <div className="summary-card">
                    <h3>Volunteer Engagement</h3>
                    <div className="summary-metric">
                        <span className="metric-value">76%</span>
                        <span className="metric-label">Active volunteers this month</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Stats;