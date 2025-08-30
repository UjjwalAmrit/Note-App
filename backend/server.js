import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import passport from "./config/passport.js"
import connectDB from "./config/database.js"
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from "./routes/auth.js"
import notesRoutes from "./routes/notesRoutes.js"

// Load environment variables
dotenv.config()

connectDB()

const app = express()


// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", notesRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 8000

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running successfully!" })
})

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Option 1: Redirect to a new frontend route
    res.redirect('http://localhost:3000/my-new-component'); 
    // Option 2: If using query params to pass a token
    // res.redirect(`http://localhost:3000/my-new-component?token=${req.user.token}`);
  }
);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
