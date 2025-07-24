import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Donation.css";
import myimg from "./assets/h1pic.jpg";

const Donation = () => {
  const [activeTab, setActiveTab] = useState('donate');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [donationStats, setDonationStats] = useState({
    totalRaised: 0,
    totalDonors: 0,
    activeCampaigns: 0,
    peopleHelped: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    donationType: "",
    amount: "",
    quantity: "",
    description: "",
    location: "",
    contact: "",
  });

  const donationCategories = [
    {
      id: "money",
      name: "Money",
      icon: "💰",
      description: "Direct financial support for emergency relief",
      impact: "₹1000 can provide emergency supplies for 5 families",
      urgency: "high",
      raised: "₹2,45,000",
      goal: "₹5,00,000"
    },
    {
      id: "food",
      name: "Food",
      icon: "🍽️",
      description: "Essential food items and nutrition supplies",
      impact: "10kg rice can feed a family for a week",
      urgency: "urgent",
      raised: "1,200 kg",
      goal: "2,000 kg"
    },
    {
      id: "clothes",
      name: "Clothes",
      icon: "👕",
      description: "Clothing and warm garments for affected people",
      impact: "5 winter clothes can protect a family",
      urgency: "medium",
      raised: "850 items",
      goal: "1,500 items"
    },
    {
      id: "medicines",
      name: "Medicines",
      icon: "💊",
      description: "Medical supplies and first aid essentials",
      impact: "Basic medical kit can treat 20 people",
      urgency: "high",
      raised: "320 kits",
      goal: "500 kits"
    },
    {
      id: "shelter",
      name: "Shelter",
      icon: "🏠",
      description: "Temporary housing and construction materials",
      impact: "₹5000 can provide temporary shelter for a family",
      urgency: "high",
      raised: "45 units",
      goal: "100 units"
    },
    {
      id: "other",
      name: "Other",
      icon: "📦",
      description: "Other essential supplies and equipment",
      impact: "Every contribution makes a difference",
      urgency: "medium",
      raised: "Various",
      goal: "Ongoing"
    }
  ];
  
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  useEffect(() => {
    // Simulate loading donation stats and recent donations
    setTimeout(() => {
      setDonationStats({
        totalRaised: 1250000,
        totalDonors: 3420,
        activeCampaigns: 12,
        peopleHelped: 8750
      });
      
      setRecentDonations([
        {
          id: 1,
          name: "Hari Priya",
          type: "Money",
          amount: "₹5,000",
          location: "Mumbai",
          time: "2 hours ago",
          avatar: "👩"
        },
        {
          id: 2,
          name: "Ram Prasad",
          type: "Food",
          amount: "25kg Rice",
          location: "Delhi",
          time: "4 hours ago",
          avatar: "👨"
        },
        {
          id: 3,
          name: "Usha",
          type: "Clothes",
          amount: "15 Winter Jackets",
          location: "Gujarat",
          time: "6 hours ago",
          avatar: "👩"
        },
        {
          id: 4,
          name: "Tejaswini",
          type: "Money",
          amount: "₹10,000",
          location: "Punjab",
          time: "8 hours ago",
          avatar: "👩"
        }
      ]);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData({ ...formData, donationType: category.name });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      alert("🎉 Thank you for your generous donation! Your contribution will make a real difference in helping those in need.");
      
      // Reset form
      setFormData({
        name: "",
        donationType: "",
        amount: "",
        quantity: "",
        description: "",
        location: "",
        contact: "",
      });
      setSelectedCategory(null);
      
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Failed to submit donation. Please try again.");
    }
    
    setLoading(false);
  };

  const formatNumber = (num) => {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getProgressPercentage = (raised, goal) => {
    if (typeof raised === 'string' && raised.includes('₹')) {
      const raisedNum = parseInt(raised.replace(/[₹,]/g, ''));
      const goalNum = parseInt(goal.replace(/[₹,]/g, ''));
      return Math.min((raisedNum / goalNum) * 100, 100);
    }
    return 65; // Default percentage for non-monetary donations
  };

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

  const CategoryCard = ({ category, isSelected, onClick }) => (
    <div 
      className={`category-card ${category.urgency} ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(category)}
    >
      <div className="category-header">
        <div className="category-icon">{category.icon}</div>
        <div className="category-info">
          <h3 className="category-name">{category.name}</h3>
          <div className={`urgency-badge ${category.urgency}`}>
            {category.urgency.toUpperCase()}
          </div>
        </div>
      </div>
      
      <p className="category-description">{category.description}</p>
      
      <div className="category-progress">
        <div className="progress-info">
          <span className="raised">{category.raised}</span>
          <span className="goal">of {category.goal}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage(category.raised, category.goal)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="category-impact">
        <strong>Impact:</strong> {category.impact}
      </div>
    </div>
  );

  const RecentDonationCard = ({ donation }) => (
    <div className="recent-donation-card">
      <div className="donation-avatar">{donation.avatar}</div>
      <div className="donation-info">
        <div className="donation-header">
          <span className="donor-name">{donation.name}</span>
          <span className="donation-time">{donation.time}</span>
        </div>
        <div className="donation-details">
          <span className="donation-type">{donation.type}</span>
          <span className="donation-amount">{donation.amount}</span>
        </div>
        <div className="donation-location">📍 {donation.location}</div>
      </div>
    </div>
  );

  return (
    <div className="donation-container">
      {/* Main Content Area */}
      <div className="donation-content">
        {/* Header */}
        <div className="donation-header">
        <h1 className="page-title">Make a Difference Today</h1>
        <p className="page-subtitle">Your generosity brings hope and relief to those who need it most</p>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <StatCard 
          title="Total Raised" 
          value={`₹${formatNumber(donationStats.totalRaised)}`} 
          icon="💰" 
          subtitle="Funds collected"
        />
        <StatCard 
          title="Generous Donors" 
          value={formatNumber(donationStats.totalDonors)} 
          icon="❤️" 
          subtitle="People helping"
        />
        <StatCard 
          title="Active Campaigns" 
          value={donationStats.activeCampaigns} 
          icon="🎯" 
          subtitle="Ongoing drives"
        />
        <StatCard 
          title="Lives Impacted" 
          value={formatNumber(donationStats.peopleHelped)} 
          icon="🙏" 
          subtitle="People helped"
        />
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'donate' ? 'active' : ''}`}
          onClick={() => setActiveTab('donate')}
        >
          💝 Donate Now
        </button>
        <button 
          className={`tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          📊 Our Impact
        </button>
        <button 
          className={`tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          🌟 Recent Donations
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'donate' && (
          <div className="donate-section">
            <div className="donate-hero">
              <h2>Choose Your Way to Help</h2>
              <p>Select a donation category that resonates with your heart</p>
            </div>
            
            {/* Donation Categories */}
            <div className="categories-grid">
              {donationCategories.map(category => (
                <CategoryCard 
                  key={category.id}
                  category={category}
                  isSelected={selectedCategory?.id === category.id}
                  onClick={handleCategorySelect}
                />
              ))}
            </div>

            {/* Donation Form */}
            {selectedCategory && (
              <div className="donation-form-container">
                <div className="form-header">
                  <h3>Complete Your {selectedCategory.name} Donation</h3>
                  <p>Fill in the details below to make your contribution</p>
                </div>
                
                <form className="donation-form" onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Your Full Name *</label>
                      <input 
                        type="text" 
                        name="name" 
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    {selectedCategory.name === "Money" && (
                      <div className="form-group">
                        <label>Donation Amount (₹) *</label>
                        <input 
                          type="number" 
                          name="amount" 
                          placeholder="Enter amount in rupees"
                          value={formData.amount}
                          onChange={handleChange} 
                          required 
                          min="1"
                        />
                      </div>
                    )}

                    {selectedCategory.name !== "Money" && (
                      <>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input 
                            type="number" 
                            name="quantity" 
                            placeholder="Enter quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min="1"
                          />
                        </div>
                        <div className="form-group full-width">
                          <label>Description *</label>
                          <textarea 
                            name="description" 
                            placeholder={`Describe your ${selectedCategory.name.toLowerCase()} donation (e.g., 10kg Rice, 5 Blankets, First Aid Kits)`}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                          ></textarea>
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>Your Location *</label>
                      <select 
                        name="location" 
                        value={formData.location}
                        onChange={handleChange} 
                        required
                      >
                        <option value="">Select your state</option>
                        {indianStates.map((state, index) => (
                          <option key={index} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Contact Number *</label>
                      <input 
                        type="tel" 
                        name="contact" 
                        placeholder="Your phone number"
                        value={formData.contact}
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-footer">
                    <div className="donation-summary">
                      <h4>Donation Summary</h4>
                      <div className="summary-item">
                        <span>Category:</span>
                        <span>{selectedCategory.icon} {selectedCategory.name}</span>
                      </div>
                      {formData.amount && (
                        <div className="summary-item">
                          <span>Amount:</span>
                          <span>₹{formData.amount}</span>
                        </div>
                      )}
                      {formData.description && (
                        <div className="summary-item">
                          <span>Items:</span>
                          <span>{formData.description}</span>
                        </div>
                      )}
                      <div className="summary-impact">
                        <strong>Your Impact:</strong> {selectedCategory.impact}
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="donate-btn"
                      disabled={loading}
                    >
                      {loading ? '🔄 Processing...' : `💖 Donate ${selectedCategory.name}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="impact-section">
            <div className="impact-header">
              <h2>Our Collective Impact</h2>
              <p>See how your donations are making a real difference</p>
            </div>
            
            <div className="impact-grid">
              {donationCategories.map(category => (
                <div key={category.id} className="impact-card">
                  <div className="impact-icon">{category.icon}</div>
                  <h3>{category.name} Drive</h3>
                  <div className="impact-progress">
                    <div className="progress-info">
                      <span className="raised">{category.raised}</span>
                      <span className="goal">of {category.goal}</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage(category.raised, category.goal)}%` }}
                      ></div>
                    </div>
                    <div className="progress-percentage">
                      {Math.round(getProgressPercentage(category.raised, category.goal))}% Complete
                    </div>
                  </div>
                  <p className="impact-description">{category.impact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="recent-section">
            <div className="recent-header">
              <h2>Recent Generous Donations</h2>
              <p>Join these amazing people in making a difference</p>
            </div>
            
            <div className="recent-donations-list">
              {recentDonations.map(donation => (
                <RecentDonationCard key={donation.id} donation={donation} />
              ))}
            </div>
            
            <div className="recent-footer">
              <p>Be the next hero in our story of hope and compassion!</p>
              <button 
                className="switch-tab-btn"
                onClick={() => setActiveTab('donate')}
              >
                🚀 Start Donating
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Donation;
