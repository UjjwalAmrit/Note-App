import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import session from "express-session"
import passport from "./config/passport.js"
import connectDB from "./config/database.js"
import path from 'path';
import { fileURLToPath } from 'url';


// Import routes
import authRoutes from "./routes/auth.js"
import notesRoutes from "./routes/notesRoutes.js"



connectDB()

const app = express()

app.set('trust proxy', 1);


// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session middleware for passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  }),
)


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/notes", notesRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running successfully!" })
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})


const PORT = process.env.PORT || 8000

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
