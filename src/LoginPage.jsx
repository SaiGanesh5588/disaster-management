import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import myimg from "./assets/hpic.jpg";
import { apiRequest } from "./utils/api";

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
      await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      
      alert("Password reset link has been sent to your email address!");
      setIsForgotPassword(false);
      setEmail("");
    } catch (error) {
      alert(error.message || "Failed to send reset email. Please try again.");
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
        const data = await apiRequest("/api/signup", {
          method: "POST",
          body: JSON.stringify({ name, email, password }),
        });

        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Signup Successful!");
          navigate("/home");
        } else {
          throw new Error("No token received");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert(error.message || "Signup failed. Please try again.");
      }
    } else {
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      try {
        const data = await apiRequest("/api/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login Successful!");
          navigate("/home");
        } else {
          throw new Error("No token received");
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert(error.message || "Login failed. Please check your credentials and try again.");
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
