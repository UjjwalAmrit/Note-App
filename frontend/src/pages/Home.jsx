"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to MERN Auth</h1>
        <p className="hero-subtitle">Secure authentication with Google OAuth and Email OTP verification</p>

        {isAuthenticated ? (
          <div className="welcome-back">
            <h2>Welcome back, {user?.firstName}!</h2>
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/signup" className="cta-button primary">
              Get Started
            </Link>
            <Link to="/login" className="cta-button secondary">
              Sign In
            </Link>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure OTP Authentication</h3>
            <p>Login with email and receive secure OTP codes for verification</p>
          </div>
          <div className="feature-card">
            <h3>🚀 Google OAuth Integration</h3>
            <p>Quick and easy login with your Google account</p>
          </div>
          <div className="feature-card">
            <h3>📱 Mobile Responsive</h3>
            <p>Works perfectly on all devices and screen sizes</p>
          </div>
          <div className="feature-card">
            <h3>🛡️ JWT Token Security</h3>
            <p>Secure session management with JSON Web Tokens</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
