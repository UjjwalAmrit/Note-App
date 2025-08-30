// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}

// Name validation
export const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50
}

// Date validation (user must be at least 13 years old)
export const isValidDOB = (dob) => {
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age >= 13 && age <= 120
}

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input
  return input.trim().replace(/[<>]/g, "")
}
