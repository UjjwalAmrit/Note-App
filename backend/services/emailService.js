import nodemailer from "nodemailer"

const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || "gmail"

  let config = {}

  switch (emailProvider.toLowerCase()) {
    case "gmail":
      config = {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
      break
    case "outlook":
      config = {
        service: "hotmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
      break
    case "smtp":
      config = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      }
      break
    default:
      throw new Error(`Unsupported email provider: ${emailProvider}`)
  }

  return nodemailer.createTransport(config)
}

export const validateEmailConfig = () => {
  const requiredVars = ["EMAIL_USER", "EMAIL_PASS"]
  const emailProvider = process.env.EMAIL_PROVIDER || "gmail"

  if (emailProvider === "smtp") {
    requiredVars.push("SMTP_HOST")
  }

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(", ")}`)
  }

  return true
}

export const sendOTPEmail = async (email, otp, retries = 3) => {
  try {
    validateEmailConfig()
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Your Login OTP - MERN Auth",
      html: generateOTPEmailTemplate(otp),
      text: `Your OTP for MERN Auth is: ${otp}. This OTP will expire in 5 minutes.`,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("OTP email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Email sending error:", error)

    if (retries > 0) {
      console.log(`Retrying email send... ${retries} attempts remaining`)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds
      return sendOTPEmail(email, otp, retries - 1)
    }

    throw new Error("Failed to send OTP email after multiple attempts")
  }
}

export const sendWelcomeEmail = async (email, firstName, retries = 2) => {
  try {
    validateEmailConfig()
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to MERN Auth!",
      html: generateWelcomeEmailTemplate(firstName),
      text: `Welcome ${firstName}! Your MERN Auth account has been successfully created.`,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log("Welcome email sent successfully:", result.messageId)
    return result
  } catch (error) {
    console.error("Welcome email sending error:", error)

    if (retries > 0) {
      console.log(`Retrying welcome email... ${retries} attempts remaining`)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return sendWelcomeEmail(email, firstName, retries - 1)
    }

    // Don't throw error for welcome email as it's not critical
    console.error("Failed to send welcome email after retries")
  }
}

const generateOTPEmailTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0; font-size: 28px; font-weight: 600;">MERN Auth</h1>
          <div style="width: 50px; height: 3px; background-color: #007bff; margin: 10px auto;"></div>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 24px;">Your Login OTP</h2>
        
        <p style="color: #666; font-size: 16px; margin-bottom: 30px; text-align: center; line-height: 1.6;">
          Use the following One-Time Password to complete your authentication:
        </p>
        
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; font-size: 36px; font-weight: bold; padding: 25px; border-radius: 12px; letter-spacing: 8px; margin: 30px 0; text-align: center; font-family: 'Courier New', monospace;">
          ${otp}
        </div>
        
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 25px 0;">
          <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
            ⏰ This OTP will expire in <strong>5 minutes</strong> for security reasons.
          </p>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            If you didn't request this OTP, please ignore this email or contact support if you have concerns.
          </p>
        </div>
      </div>
    </div>
  `
}

const generateWelcomeEmailTemplate = (firstName) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0; font-size: 28px; font-weight: 600;">MERN Auth</h1>
          <div style="width: 50px; height: 3px; background-color: #28a745; margin: 10px auto;"></div>
        </div>
        
        <h2 style="color: #333; margin-bottom: 20px; text-align: center; font-size: 24px;">
          Welcome, ${firstName}! 🎉
        </h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
          Thank you for joining <strong>MERN Auth</strong>. Your account has been successfully created and verified.
        </p>
        
        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
          <p style="color: #155724; font-size: 16px; margin: 0;">
            ✅ Your account is now active and ready to use!
          </p>
        </div>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
          You can now login using your email and OTP verification system. Enjoy the secure authentication experience!
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/login" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Login Now
          </a>
        </div>
        
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
          <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
            If you have any questions or need assistance, feel free to contact our support team.
          </p>
        </div>
      </div>
    </div>
  `
}

export const testEmailConnection = async () => {
  try {
    validateEmailConfig()
    const transporter = createTransporter()

    // Verify connection
    await transporter.verify()
    console.log("Email service connection verified successfully")
    return { success: true, message: "Email service is working correctly" }
  } catch (error) {
    console.error("Email service test failed:", error)
    return { success: false, message: error.message }
  }
}
