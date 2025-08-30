"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { authAPI } from "../services/api"
import OTPInput from "../components/OTPInput"
import GoogleAuthButton from "../components/GoogleAuthButton"

const Signup = () => {
  const [step, setStep] = useState("form") // 'form' or 'otp'
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
  })
  const [otp, setOTP] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const navigate = useNavigate()

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateAge = (dob) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age >= 13 && age <= 120
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    // Validate form data
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      setError("First name must be at least 2 characters long")
      return
    }

    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      setError("Last name must be at least 2 characters long")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!formData.dob) {
      setError("Please enter your date of birth")
      return
    }

    if (!validateAge(formData.dob)) {
      setError("You must be at least 13 years old to create an account")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.sendOTP(formData.email.trim().toLowerCase())
      setMessage("OTP sent successfully! Check your email.")
      setStep("otp")
      startResendCooldown()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.verifyOTP(
        formData.email,
        otp,
        formData.firstName.trim(),
        formData.lastName.trim(),
        formData.dob,
      )

      setMessage("Account created successfully! Redirecting to login...")

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Signup failed. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const startResendCooldown = () => {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return

    setError("")
    setMessage("")
    setLoading(true)

    try {
      await authAPI.sendOTP(formData.email)
      setMessage("New OTP sent successfully!")
      startResendCooldown()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToForm = () => {
    setStep("form")
    setOTP("")
    setError("")
    setMessage("")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up for a new account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {step === "form" ? (
          <>
            <GoogleAuthButton loading={loading} />

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={loading}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="otp-section">
              <div className="otp-header">
                <h3>Verify Your Email</h3>
                <p>We sent a 6-digit code to {formData.email}</p>
                <button type="button" className="change-email-btn" onClick={handleBackToForm}>
                  Change Details
                </button>
              </div>

              <OTPInput value={otp} onChange={setOTP} disabled={loading} />

              <div className="resend-section">
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button" disabled={loading || otp.length !== 6}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
