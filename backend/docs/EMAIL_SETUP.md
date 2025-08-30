# Email Service Setup Guide

## Supported Email Providers

### Gmail (Recommended)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Set environment variables:
   \`\`\`
   EMAIL_PROVIDER=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM=your-email@gmail.com
   \`\`\`

### Outlook/Hotmail
1. Set environment variables:
   \`\`\`
   EMAIL_PROVIDER=outlook
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASS=your-password
   EMAIL_FROM=your-email@outlook.com
   \`\`\`

### Custom SMTP
1. Set environment variables:
   \`\`\`
   EMAIL_PROVIDER=smtp
   EMAIL_USER=your-email@domain.com
   EMAIL_PASS=your-password
   EMAIL_FROM=your-email@domain.com
   SMTP_HOST=smtp.your-provider.com
   SMTP_PORT=587
   SMTP_SECURE=false
   \`\`\`

## Testing Email Configuration

Visit `GET /api/auth/test-email` in development mode to verify your email setup.

## Troubleshooting

### Gmail Issues
- Make sure 2FA is enabled
- Use App Password, not regular password
- Check "Less secure app access" if using regular password (not recommended)

### Common Errors
- "Invalid login": Check credentials and 2FA setup
- "Connection timeout": Check SMTP settings and firewall
- "Authentication failed": Verify email provider settings
