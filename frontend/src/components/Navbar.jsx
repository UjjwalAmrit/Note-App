"use client"

import { Link, useNavigate } from "react-router-dom"
import {FiSun} from "react-icons/fi"
import { useAuth } from "../context/AuthContext"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">&nbsp;&nbsp;
        <FiSun className="dashboard-icon" />
          Dashboard
        </Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <div className="user-info">
                <span className="user-name">Hello, {user?.firstName || "User"}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/signup" className="nav-link signup-link">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
