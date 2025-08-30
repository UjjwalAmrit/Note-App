import jwt from "jsonwebtoken"
import passport from "passport"
import User from "../models/User.js"
import { generateOTP, generateOTPExpiry, isValidOTPFormat } from "../utils/otpGenerator.js"
import { isValidEmail, isValidName, isValidDOB, sanitizeInput } from "../utils/validators.js"
import { sendOTPEmail } from "../services/emailService.js"

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-jwt-secret", {
    expiresIn: "7d",
  })
}

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      })
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())

    // Generate OTP
    const otp = generateOTP()
    const otpExpires = generateOTPExpiry()

    // Check if user exists
    let user = await User.findByEmail(sanitizedEmail)

    if (user) {
      // Update existing user's OTP
      user.otp = otp
      user.otpExpires = otpExpires
      await user.save()
    } else {
      // Create temporary user record for OTP
      user = new User({
        email: sanitizedEmail,
        otp,
        otpExpires,
        isVerified: false,
      })
      await user.save()
    }

    // Send OTP via email
    await sendOTPEmail(sanitizedEmail, otp)

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      email: sanitizedEmail,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    })
  }
}

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, firstName, lastName, dob } = req.body

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      })
    }

    // Validate OTP format
    if (!isValidOTPFormat(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      })
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())

    // Find user
    const user = await User.findByEmail(sanitizedEmail)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please request a new OTP.",
      })
    }

    // Verify OTP
    if (!user.isOTPValid(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      })
    }

    // If this is a signup (user details provided)
    if (firstName && lastName && dob) {
      // Validate user details
      if (!isValidName(firstName) || !isValidName(lastName)) {
        return res.status(400).json({
          success: false,
          message: "Please provide valid first name and last name",
        })
      }

      if (!isValidDOB(dob)) {
        return res.status(400).json({
          success: false,
          message: "Please provide a valid date of birth (minimum age: 13)",
        })
      }

      // Update user with signup details
      user.firstName = sanitizeInput(firstName)
      user.lastName = sanitizeInput(lastName)
      user.dob = new Date(dob)
      user.isVerified = true
      await user.clearOTP()

      res.status(200).json({
        success: true,
        message: "Account created successfully! Please login with your email.",
      })
    } else {
      // Just verify OTP without signup
      await user.clearOTP()
      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      })
    }
  } catch (error) {
    console.error("Verify OTP error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    })
  }
}

export const loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    // Validate required fields
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      })
    }

    // Validate OTP format
    if (!isValidOTPFormat(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP format",
      })
    }

    const sanitizedEmail = sanitizeInput(email.toLowerCase())

    // Find user
    const user = await User.findByEmail(sanitizedEmail)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered. Please signup first.",
      })
    }

    // Check if user is verified (has completed signup)
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please complete your signup first",
      })
    }

    // Verify OTP
    if (!user.isOTPValid(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      })
    }

    // Clear OTP and generate JWT token
    await user.clearOTP()
    const token = generateToken(user._id)

    // Return user data and token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        profilePicture: user.profilePicture,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    })
  }
}

export const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next)
}

export const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed` },
    (err, user) => {
      if (err) {
        console.error("Google OAuth callback error:", err)
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_error`)
      }

      if (!user) {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`)
      }

      // Generate JWT token
      const token = generateToken(user._id)

      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
        }),
      )}`

      res.redirect(redirectUrl)
    },
  )(req, res, next)
}

export const logout = (req, res) => {
  try {
    // Since we're using JWT tokens, logout is handled client-side
    // by removing the token from localStorage
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)
    res.status(500).json({
      success: false,
      message: "Logout failed",
    })
  }
}
