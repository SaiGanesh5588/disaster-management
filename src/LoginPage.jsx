import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import myimg from "./assets/hpic.jpg";

const LoginPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    
    try {
      // Simulate API call for password reset
      const response = await fetch("http://127.0.0.1:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        alert("Password reset link has been sent to your email address!");
        setIsForgotPassword(false);
        setEmail("");
      } else {
        alert("Email not found. Please check your email address.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token); // ✅ Store token
          alert("Signup Successful!");
          navigate("/home");
        } else {
          alert(data.error || "Signup failed");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("Something went wrong during signup.");
      }
    } else {
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("token", data.token); // ✅ Store token
          alert("Login Successful!");
          navigate("/home");
        } else {
          alert(data.error || "Login failed");
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("Something went wrong during login.");
      }
    }
  };

  return (
    <div className="page-container">
      <img src={myimg} alt="Background" className="bg-image" />
      <div className="form-container">
        <h1>{isForgotPassword ? "RESET PASSWORD" : "LOGIN"}</h1>
        {!isForgotPassword && (
          <div className="toggle-buttons">
            <button
              type="button"
              className={!isSignup ? "active" : ""}
              onClick={() => setIsSignup(false)}
            >
              Login
            </button>
            <button
              type="button"
              className={isSignup ? "active" : ""}
              onClick={() => setIsSignup(true)}
            >
              Signup
            </button>
          </div>
        )}
        <form onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="email"
              placeholder={isForgotPassword ? "Enter your email address" : "Email Address"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isForgotPassword && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          {isSignup && (
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit">
            {isForgotPassword ? "Send Reset Link" : (isSignup ? "Signup" : "Login")}
          </button>
        </form>
        {!isSignup && !isForgotPassword && (
          <button 
            type="button" 
            className="forgot-password-btn"
            onClick={() => setIsForgotPassword(true)}
          >
            Forgot password?
          </button>
        )}
        {isForgotPassword && (
          <button 
            type="button" 
            className="back-to-login-btn"
            onClick={() => {
              setIsForgotPassword(false);
              setEmail("");
            }}
          >
            ← Back to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
