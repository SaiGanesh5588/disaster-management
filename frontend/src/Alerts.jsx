import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Alerts.css";

const sampleAlerts = [
  { id: 1, type: "Flood", location: "Hyderabad", severity: "High", precautions: "Move to higher ground, avoid flooded areas.", coordinates: { lat: 17.3850, lng: 78.4867 } },
  { id: 2, type: "Flood", location: "Mumbai", severity: "Severe", precautions: "Stay indoors, avoid walking through floodwaters.", coordinates: { lat: 19.0760, lng: 72.8777 } },
  { id: 3, type: "Earthquake", location: "Delhi", severity: "High", precautions: "Drop, cover, and hold on. Stay away from windows.", coordinates: { lat: 28.7041, lng: 77.1025 } },
  { id: 4, type: "Cyclone", location: "Visakhapatnam", severity: "Severe", precautions: "Stay indoors, secure windows and doors.", coordinates: { lat: 17.6868, lng: 83.2185 } },
  { id: 5, type: "Thunderstorm", location: "Nagpur", severity: "High", precautions: "Stay indoors, avoid using electrical appliances.", coordinates: { lat: 21.1458, lng: 79.0882 } },
  { id: 6, type: "Flood", location: "Chennai", severity: "Medium", precautions: "Keep emergency supplies ready, listen to authorities.", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { id: 7, type: "Flood", location: "Kolkata", severity: "Low", precautions: "Be alert for weather updates, avoid unnecessary travel.", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { id: 8, type: "Earthquake", location: "Bangalore", severity: "Severe", precautions: "Evacuate to open spaces if necessary.", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { id: 9, type: "Earthquake", location: "Jaipur", severity: "Medium", precautions: "Check for structural damages before re-entering buildings.", coordinates: { lat: 26.9124, lng: 75.7873 } },
  { id: 10, type: "Earthquake", location: "Pune", severity: "Low", precautions: "Be prepared with emergency kits and communication plans.", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { id: 11, type: "Cyclone", location: "Goa", severity: "High", precautions: "Evacuate low-lying areas, avoid coastal regions.", coordinates: { lat: 15.2993, lng: 74.1240 } },
  { id: 12, type: "Cyclone", location: "Guntur", severity: "Medium", precautions: "Stock up on essentials, keep power backup ready.", coordinates: { lat: 16.3067, lng: 80.4365 } },
  { id: 13, type: "Cyclone", location: "Kanyakumari", severity: "Low", precautions: "Stay updated with news reports, avoid sea travel.", coordinates: { lat: 8.0883, lng: 77.5385 } },
  { id: 14, type: "Thunderstorm", location: "Bhimavaram", severity: "Severe", precautions: "Do not take shelter under trees or open spaces.", coordinates: { lat: 16.5449, lng: 81.5212 } },
  { id: 15, type: "Thunderstorm", location: "Vijayawada", severity: "Medium", precautions: "Unplug electrical devices, stay away from windows.", coordinates: { lat: 16.5062, lng: 80.6480 } },
  { id: 16, type: "Thunderstorm", location: "Bhopal", severity: "Low", precautions: "Secure outdoor items, be cautious while traveling.", coordinates: { lat: 23.2599, lng: 77.4126 } },
  { id: 17, type: "Flood", location: "Kerala", severity: "High", precautions: "Move to higher ground, avoid flooded areas.", coordinates: { lat: 10.8505, lng: 76.2711 } },
  { id: 18, type: "Earthquake", location: "Ahmedabad", severity: "Medium", precautions: "Stay calm, move to open areas if needed.", coordinates: { lat: 23.0225, lng: 72.5714 } }
];

// Function to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

const validCities = sampleAlerts.map(alert => alert.location.toLowerCase());

const Alerts = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [cityEntered, setCityEntered] = useState("");
  const [safeZone, setSafeZone] = useState(false);
  const [error, setError] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [nearbyAlerts, setNearbyAlerts] = useState([]);
  const [detectedCity, setDetectedCity] = useState("");
  const [useLocation, setUseLocation] = useState(false);

  // Get user's current location using geolocation API
  const getCurrentLocation = () => {
    setLocationLoading(true);
    setError("");
    
    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported by this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        findNearbyAlerts(latitude, longitude);
        reverseGeocode(latitude, longitude);
        setUseLocation(true);
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "❌ Unable to retrieve your location. ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access to get real-time alerts.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Find alerts within 100km radius of user's location
  const findNearbyAlerts = (userLat, userLng) => {
    const nearby = sampleAlerts.filter(alert => {
      const distance = calculateDistance(userLat, userLng, alert.coordinates.lat, alert.coordinates.lng);
      return distance <= 100; // Within 100km radius
    }).map(alert => {
      const distance = calculateDistance(userLat, userLng, alert.coordinates.lat, alert.coordinates.lng);
      return { ...alert, distance: Math.round(distance) };
    }).sort((a, b) => a.distance - b.distance); // Sort by distance

    setNearbyAlerts(nearby);
    
    if (nearby.length > 0) {
      setSelectedAlert(nearby[0]); // Show closest alert
      setSafeZone(false);
    } else {
      setSelectedAlert(null);
      setSafeZone(true);
    }
  };

  // Simple reverse geocoding using a free service
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a simple approach to determine city based on closest alert location
      const closest = sampleAlerts.reduce((prev, curr) => {
        const prevDistance = calculateDistance(lat, lng, prev.coordinates.lat, prev.coordinates.lng);
        const currDistance = calculateDistance(lat, lng, curr.coordinates.lat, curr.coordinates.lng);
        return prevDistance < currDistance ? prev : curr;
      });
      
      const distance = calculateDistance(lat, lng, closest.coordinates.lat, closest.coordinates.lng);
      if (distance <= 50) { // Within 50km, consider it the same city
        setDetectedCity(closest.location);
      } else {
        setDetectedCity("Unknown Location");
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      setDetectedCity("Unknown Location");
    }
  };

  const handleCityCheck = () => {
    const trimmedCity = cityEntered.trim().toLowerCase();

    if (!trimmedCity.match(/^[a-zA-Z ]+$/)) {
      setError("❌ Invalid city name. Please enter a valid name.");
      setSelectedAlert(null);
      setSafeZone(false);
      return;
    }

    if (!validCities.includes(trimmedCity)) {
      setError("");
      setSelectedAlert(null);
      setSafeZone(true);
      return;
    }

    setError("");
    const alertsFound = sampleAlerts.filter(alert => alert.location.toLowerCase() === trimmedCity);
    if (alertsFound.length > 0) {
      const randomAlert = alertsFound[Math.floor(Math.random() * alertsFound.length)];
      setSelectedAlert(randomAlert);
      setSafeZone(false);
    }
  };

  const resetToManual = () => {
    setUseLocation(false);
    setCurrentLocation(null);
    setNearbyAlerts([]);
    setDetectedCity("");
    setCityEntered("");
    setSelectedAlert(null);
    setSafeZone(false);
    setError("");
  };

  return (
    <div className="alerts-container">
      {/* Main Content Area */}
      <div className="alerts-content">
        <div className="content-header">
          <div className="header-left">
            <h1 className="page-title">🚨 Disaster Alerts</h1>
            <p className="page-subtitle">Real-time disaster monitoring and alert system</p>
          </div>
        </div>

        <div className="alerts-container">
          <div className="alerts-intro">
            <p className="alerts-subtitle">Choose how to check for alerts:</p>
          </div>
          
          {!useLocation ? (
            // Manual City Input Mode
            <div className="manual-mode">
              <div className="location-options">
                <button 
                  className="location-btn auto" 
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? (
                    <>
                      🔄 <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      📍 <span>Use My Location</span>
                    </>
                  )}
                </button>
                <div className="divider">OR</div>
              </div>
              
              <div className="manual-input">
                <input
                  type="text"
                  placeholder="Enter City Name..."
                  value={cityEntered}
                  onChange={(e) => setCityEntered(e.target.value)}
                />
                <div className="buttons">
                  <button onClick={handleCityCheck}>Check Alerts</button>
                  <button className="clear-btn" onClick={() => { setCityEntered(""); setSelectedAlert(null); setSafeZone(false); setError(""); }}>Clear</button>
                </div>
              </div>
            </div>
          ) : (
            // Location-Based Mode
            <div className="location-mode">
              <div className="location-info">
                <div className="detected-location">
                  <h3>📍 Your Location</h3>
                  <p className="city-name">{detectedCity}</p>
                  <p className="coordinates">Lat: {currentLocation?.lat.toFixed(4)}, Lng: {currentLocation?.lng.toFixed(4)}</p>
                </div>
                
                {nearbyAlerts.length > 0 && (
                  <div className="nearby-alerts-summary">
                    <h4>⚠️ Alerts in Your Area</h4>
                    <p>{nearbyAlerts.length} alert{nearbyAlerts.length > 1 ? 's' : ''} found within 100km</p>
                    <div className="alerts-list">
                      {nearbyAlerts.slice(0, 3).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`alert-item ${alert.severity.toLowerCase()} ${selectedAlert?.id === alert.id ? 'active' : ''}`}
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <span className="alert-type">{alert.type}</span>
                          <span className="alert-location">{alert.location}</span>
                          <span className="alert-distance">{alert.distance}km away</span>
                          <span className={`alert-severity ${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                        </div>
                      ))}
                    </div>
                    {nearbyAlerts.length > 3 && (
                      <p className="more-alerts">+{nearbyAlerts.length - 3} more alerts in the area</p>
                    )}
                  </div>
                )}
                
                <button className="switch-mode-btn" onClick={resetToManual}>
                  🔄 Switch to Manual Input
                </button>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
          {safeZone && (
            <div className="safe-message">
              ✅ <strong>You are in a Safe Zone!</strong>
              <p>No active disaster alerts in your area.</p>
              {useLocation && nearbyAlerts.length === 0 && (
                <p className="safe-details">We checked within 100km of your location and found no active alerts.</p>
              )}
            </div>
          )}

          {selectedAlert && (
            <div className="alert-details">
              <div className="alert-header">
                <h2 className={`alert-title ${selectedAlert.type.toLowerCase()}`}>
                  {selectedAlert.type} Alert 🚨
                </h2>
                {selectedAlert.distance && (
                  <span className="distance-badge">{selectedAlert.distance}km from you</span>
                )}
              </div>
              
              <div className="alert-info">
                <div className="info-item">
                  <strong>📍 Location:</strong> {selectedAlert.location}
                </div>
                <div className="info-item">
                  <strong>⚠️ Severity:</strong> 
                  <span className={`severity-badge ${selectedAlert.severity.toLowerCase()}`}>
                    {selectedAlert.severity}
                  </span>
                </div>
                <div className="info-item">
                  <strong>🛡️ Precautions:</strong> {selectedAlert.precautions}
                </div>
              </div>
              
              <div className="safety-tips">
                <h4>🆘 Emergency Guidelines:</h4>
                <ul>
                  <li>📞 Keep emergency contacts ready</li>
                  <li>🚨 Follow local authority guidelines</li>
                  <li>🛒 Stock up on food, water, and essentials</li>
                  <li>📻 Stay tuned to official news sources</li>
                  <li>🏠 Prepare your emergency kit</li>
                </ul>
              </div>
              
              {useLocation && nearbyAlerts.length > 1 && (
                <div className="other-alerts">
                  <h4>🔍 Other Nearby Alerts:</h4>
                  <div className="nearby-list">
                    {nearbyAlerts.filter(alert => alert.id !== selectedAlert.id).slice(0, 2).map(alert => (
                      <div 
                        key={alert.id} 
                        className="nearby-alert"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <span className="nearby-type">{alert.type}</span>
                        <span className="nearby-location">{alert.location}</span>
                        <span className="nearby-distance">{alert.distance}km</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Alerts;