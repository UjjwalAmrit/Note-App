# Google OAuth Setup Guide

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

## 2. Create OAuth 2.0 Credentials

1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`

## 3. Configure Environment Variables

Add to your `.env` file:
\`\`\`
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
\`\`\`

## 4. Frontend Configuration

Add to your frontend `.env` file:
\`\`\`
VITE_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

## 5. Testing

1. Start your backend server
2. Start your frontend server
3. Navigate to login/signup page
4. Click "Continue with Google"
5. Complete OAuth flow

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure the callback URL in Google Console matches your backend route
2. **Invalid client**: Check that CLIENT_ID and CLIENT_SECRET are correct
3. **CORS issues**: Ensure your frontend URL is in the CORS configuration

### Error Messages

- `google_auth_failed`: Google OAuth process failed
- `auth_error`: General authentication error
- `auth_failed`: User cancelled or authentication failed
