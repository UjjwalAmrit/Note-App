import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.isVerified && !this.googleId // Required only if not a Google user
      },
      trim: true,
    },
    lastName: {
      type: String,
      required: function () {
        return this.isVerified && !this.googleId // Required only if not a Google user
      },
      trim: true,
    },
    dob: {
      type: Date,
      required: function () {
        return this.isVerified && !this.googleId // Required only if not a Google user
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String, // For Google users
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
)

// Index for faster queries
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })


// Method to clear OTP after verification
userSchema.methods.clearOTP = function () {
  this.otp = undefined
  this.otpExpires = undefined
  return this.save()
}

// Method to check if OTP is valid
userSchema.methods.isOTPValid = function (inputOTP) {
  return this.otp === inputOTP && this.otpExpires > new Date()
}

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

const User = mongoose.model("User", userSchema)

export default User
