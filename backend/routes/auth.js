import express from "express"
import { sendOTP, verifyOTP, loginWithOTP, googleAuth, googleCallback, logout } from "../controllers/authController.js"
import  authenticate  from "../middleware/authenticate.js"
import { rateLimiter } from "../middleware/rateLimiter.js"
import { testEmailConnection } from "../services/emailService.js"

const router = express.Router()

// Email OTP routes
router.post("/send-otp", rateLimiter, sendOTP)
router.post("/verify-otp", rateLimiter, verifyOTP)
router.post("/login", rateLimiter, loginWithOTP)

// Google OAuth routes
router.get("/google", googleAuth)
router.get("/google/callback", googleCallback)

// Logout route
router.post("/logout", logout)

router.get("/test-email", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      message: "Email testing is only available in development mode",
    })
  }

  try {
    const result = await testEmailConnection()
    res.status(result.success ? 200 : 500).json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email test failed",
      error: error.message,
    })
  }
})

// Protected route example
router.get("/profile", authenticate, (req, res) => {
  res.json({ user: req.user })
})

export default router
