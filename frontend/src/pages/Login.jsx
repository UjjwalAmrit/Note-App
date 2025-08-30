"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authAPI } from "../services/api"
import OTPInput from "../components/OTPInput"
import GoogleAuthButton from "../components/GoogleAuthButton"

const Login = () => {
  const [step, setStep] = useState("email") // 'email' or 'otp'
  const [email, setEmail] = useState("")
  const [otp, setOTP] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [resendCooldown, setResendCooldown] = useState(0)

  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Check for error from Google OAuth
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.sendOTP(email.trim().toLowerCase())
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

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)

    try {
      const response = await authAPI.login(email, otp)
      const { token, user } = response.data

      login(user, token)
      setMessage("Login successful! Redirecting...")

      setTimeout(() => {
        navigate("/dashboard")
      }, 1000)
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again."
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
      await authAPI.sendOTP(email)
      setMessage("New OTP sent successfully!")
      startResendCooldown()
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend OTP. Please try again."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOTP("")
    setError("")
    setMessage("")
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {step === "email" ? (
          <>
            <GoogleAuthButton loading={loading} />

            <div className="auth-divider">
              <span>or</span>
            </div>

            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
          <form onSubmit={handleLogin} className="auth-form">
            <div className="otp-section">
              <div className="otp-header">
                <h3>Enter OTP</h3>
                <p>We sent a 6-digit code to {email}</p>
                <button type="button" className="change-email-btn" onClick={handleBackToEmail}>
                  Change Email
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
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
