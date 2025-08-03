Discord OAuth Integration
This theme component now includes Discord OAuth integration, allowing users to link their Discord accounts directly from your Discourse forum.

🚀 New Features
One-click Discord linking from the widget dropdown
Visual Discord status showing linked usernames
Discord usernames in posts (optional)
Secure OAuth flow with CSRF protection
Mobile-friendly popup interface
Unlink functionality with confirmation dialog
📋 Setup Requirements
1. Create Discord Application
Go to Discord Developer Portal
Click "New Application" and give it a name
Go to OAuth2 > General
Add redirect URI: https://your-oauth-service.com/auth/discord/callback
Note your Client ID and Client Secret
2. Deploy OAuth Service
You need to deploy a separate OAuth service to handle the Discord authentication. We provide a complete Express.js application for this.

Quick Deploy Options:
Heroku:Show Image

Railway:Show Image

Environment Variables:
env
DISCOURSE_BASE_URL=https://your-discourse-site.com
DISCOURSE_API_KEY=your_discourse_api_key
DISCOURSE_FIELD_ID=8
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://your-oauth-service.com/auth/discord/callback
3. Create Discourse User Field
Go to Admin > Customize > User Fields
Click Add User Field
Configure:
Name: Discord Username
Description: Your Discord username
Field Type: Text
Editable: ✓ (users can edit)
Show on profile: ✓ (optional)
Note the Field ID (usually a number like 8)
4. Configure Theme Settings
In your Discourse admin:

Go to Customize > Themes
Select your Discord Widget theme
Configure these settings:
OAuth Settings:
discord_oauth_service_url: https://your-oauth-service.herokuapp.com
discord_field_id: 8 (or your user field ID)
show_discord_linking: ✓ Enable
discord_link_text: 🔗 Link Discord Account
Optional Settings:
show_discord_in_posts: Show Discord usernames in posts
require_discord_link: Require linking before accessing widget
discord_unlink_text: Text for unlink button
🎯 User Experience
For Users:
Click Discord icon in header → Widget dropdown opens
See "Link Discord Account" button → Click to start OAuth
Popup opens → Authorize on Discord
Return to Discourse → See "Linked as: username" status
Future visits → Discord username shows in posts (if enabled)
Unlinking:
Click "Unlink" button in widget
Confirm in dialog
Discord field cleared from profile
🔧 Advanced Configuration
Custom User Field Location
If you want to store Discord usernames in a different field:

Create/identify your user field
Update discord_field_id setting
Restart your OAuth service if needed
Mobile Behavior
Widget: Shows OAuth integration in dropdown
Invite Link: Direct link to Discord app (if configured)
Responsive: Optimized for mobile screens
Security Features
CSRF Protection: State tokens prevent attacks
Rate Limiting: 5 attempts per IP per 15 minutes
Input Validation: Username format verification
Secure OAuth: Official Discord OAuth 2.0 flow
🛠 Troubleshooting
Common Issues:
"OAuth service not configured"

Set discord_oauth_service_url in theme settings
Ensure OAuth service is deployed and accessible
"Permission denied"

Check Discourse API key permissions
Verify DISCOURSE_API_KEY environment variable
Popup blocked

Modern browsers may block popups
Users need to allow popups for your site
Discord app not found

Verify DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET
Check redirect URI matches exactly
Debug Mode:
Visit https://your-oauth-service.com/auth/status (development only) to see:

Active OAuth states
Recent authentication attempts
Configuration status
🔗 API Endpoints
Your OAuth service provides these endpoints:

GET /auth/discord?discourse_user=username - Start OAuth flow
GET /auth/discord/callback - OAuth callback
POST /api/unlink - Unlink Discord account
GET /api/discord-status/:username - Check link status
GET /health - Service health check
📱 Mobile Support
The theme automatically detects mobile devices and:

Uses responsive popup sizing
Falls back to invite link if configured
Optimizes button layouts for touch
🎨 Customization
Styling Discord Elements:
css
/* Custom Discord username styling */
.discord-username {
  color: #5865F2;
  font-weight: bold;
}

/* Custom link button styling */
.discord-link-button {
  background: linear-gradient(45deg, #5865F2, #7289DA);
}
Custom Link Text:
Use theme settings or modify the templates to customize:

Link button text
Unlink button text
Status messages
Error messages
🔄 Migration from Old Version
If upgrading from a previous version:

Backup your settings before updating
Deploy OAuth service (new requirement)
Update theme settings with OAuth URL
Test OAuth flow with a test user
Notify users about new linking feature
📚 Additional Resources
Discord Developer Documentation
Discourse Theme Development
OAuth 2.0 Specification
For support, please create an issue in the GitHub repository with:

Discourse version
Theme version
Error messages
Browser console logs
