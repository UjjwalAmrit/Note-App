// --- IMPORTS ---
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";

// --- CUSTOM MODULES & CONFIG ---
import passport from "./config/passport.js";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notesRoutes.js";

// --- INITIALIZATION ---
// Load environment variables immediately
dotenv.config();

// Establish database connection
connectDB();

const app = express();

// --- CORE MIDDLEWARE ---
// Trust the first proxy for secure cookies in production (Render)
app.set('trust proxy', 1);

const clientURL = process.env.CLIENT_URL;
console.log(`SERVER LOG: Allowing requests from origin: ${clientURL}`); 

// Configure CORS to allow requests from your frontend client
const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD", // Explicitly allow methods
  credentials: true,
};
app.use(cors(corsOptions));

// Body parsers for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for Passport authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // Required for cross-site cookies
    },
  }),
);

// Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());


// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// Health check route to verify the server is running
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running successfully!" });
});




// --- ERROR HANDLING MIDDLEWARE ---
// This should be the last `app.use()`
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong internally!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});


// --- SERVER STARTUP ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
