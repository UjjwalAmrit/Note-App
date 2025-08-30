# MERN Authentication Backend

## Setup Instructions

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Update the `.env` file with your actual values:
   - MongoDB connection string
   - JWT secret key
   - Google OAuth credentials
   - Email service credentials

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Endpoints

### Authentication Routes
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and signup
- `POST /api/auth/login` - Login with email and OTP
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile (protected)

### Health Check
- `GET /api/health` - Server health check
