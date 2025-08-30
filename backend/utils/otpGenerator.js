import crypto from "crypto"

// Generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString()
}

// Generate OTP expiry time (5 minutes from now)
export const generateOTPExpiry = () => {
  return new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
}

// Validate OTP format
export const isValidOTPFormat = (otp) => {
  return /^\d{6}$/.test(otp)
}
