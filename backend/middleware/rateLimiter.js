// Simple in-memory rate limiter
const requests = new Map()

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 10 // Max 10 requests per window

  // Clean old entries
  for (const [key, data] of requests.entries()) {
    if (now - data.firstRequest > windowMs) {
      requests.delete(key)
    }
  }

  // Check current IP
  if (!requests.has(ip)) {
    requests.set(ip, {
      count: 1,
      firstRequest: now,
    })
    return next()
  }

  const userData = requests.get(ip)

  if (now - userData.firstRequest > windowMs) {
    // Reset window
    requests.set(ip, {
      count: 1,
      firstRequest: now,
    })
    return next()
  }

  if (userData.count >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    })
  }

  userData.count++
  next()
}
