export const emailProviders = {
  gmail: {
    service: "gmail",
    description: "Gmail SMTP service",
    requiredEnvVars: ["EMAIL_USER", "EMAIL_PASS"],
  },
  outlook: {
    service: "hotmail",
    description: "Outlook/Hotmail SMTP service",
    requiredEnvVars: ["EMAIL_USER", "EMAIL_PASS"],
  },
  smtp: {
    description: "Custom SMTP server",
    requiredEnvVars: ["EMAIL_USER", "EMAIL_PASS", "SMTP_HOST"],
    optionalEnvVars: ["SMTP_PORT", "SMTP_SECURE"],
  },
}

export const getEmailProviderConfig = (provider = "gmail") => {
  const config = emailProviders[provider.toLowerCase()]
  if (!config) {
    throw new Error(`Unsupported email provider: ${provider}`)
  }
  return config
}

export const validateEmailEnvironment = () => {
  const provider = process.env.EMAIL_PROVIDER || "gmail"
  const config = getEmailProviderConfig(provider)

  const missing = config.requiredEnvVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    return {
      valid: false,
      missing,
      provider,
      message: `Missing required environment variables for ${provider}: ${missing.join(", ")}`,
    }
  }

  return {
    valid: true,
    provider,
    message: `Email configuration for ${provider} is valid`,
  }
}
