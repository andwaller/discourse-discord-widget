// File: javascripts/discourse/initializers/discord-oauth.js
import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";

export default {
  name: "discord-oauth-integration",
  
  initialize() {
    withPluginApi("0.8.31", (api) => {
      
      // Global functions for OAuth
      window.linkDiscordAccount = function() {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
          bootbox.alert("Please log in to link your Discord account.");
          return;
        }
        
        const oauthServiceUrl = settings.discord_oauth_service_url;
        if (!oauthServiceUrl) {
          bootbox.alert("Discord OAuth service is not configured. Please contact an administrator.");
          return;
        }
        
        const username = currentUser.username;
        const oauthUrl = `${oauthServiceUrl}/auth/discord?discourse_user=${username}`;
        
        // Open OAuth in popup
        const popup = window.open(
          oauthUrl,
          "discord-oauth",
          `width=${settings.oauth_popup_width || 500},height=${settings.oauth_popup_height || 600},scrollbars=yes,resizable=yes`
        );
        
        // Listen for completion
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Refresh to show linked status
            window.location.reload();
          }
        }, 1000);
      };
      
      window.unlinkDiscordAccount = function() {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
          return;
        }
        
        bootbox.confirm("Are you sure you want to unlink your Discord account?", (result) => {
          if (result) {
            const oauthServiceUrl = settings.discord_oauth_service_url;
            if (!oauthServiceUrl) {
              bootbox.alert("Discord OAuth service is not configured.");
              return;
            }
            
            // Call unlink API
            fetch(`${oauthServiceUrl}/api/unlink`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                discourse_user: currentUser.username
              })
            })
            .then(response => {
              if (response.ok) {
                window.location.reload();
              } else {
                throw new Error('Unlink failed');
              }
            })
            .catch(() => {
              bootbox.alert("Failed to unlink Discord account. Please try again.");
            });
          }
        });
      };

      // Show Discord usernames in posts if enabled
      if (settings.show_discord_in_posts) {
        api.decorateWidget("poster-name:after", (helper) => {
          const attrs = helper.getModel();
          if (!attrs.user || !attrs.user.user_fields) return;

          const discordField = attrs.user.user_fields[settings.discord_field_id];
          if (discordField && discordField.trim()) {
            return helper.h("span.discord-username", [
              helper.h("i.fab.fa-discord"),
              " ",
              discordField
            ]);
          }
        });
      }

      // Add Discord status to user cards
      api.decorateWidget("user-card:after", (helper) => {
        const user = helper.attrs.user;
        if (!user || !user.user_fields) return;

        const discordField = user.user_fields[settings.discord_field_id];
        if (discordField && discordField.trim()) {
          return helper.h("div.discord-user-card", [
            helper.h("div.discord-info", [
              helper.h("i.fab.fa-discord"),
              helper.h("span", ` Discord: ${discordField}`)
            ])
          ]);
        }
      });

      // Add styles
      const discordStyles = `
        .discord-username {
          margin-left: 8px;
          color: #5865F2;
          font-size: 0.85em;
          font-weight: normal;
        }
        
        .discord-username i {
          margin-right: 4px;
        }
        
        .discord-user-card {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--primary-low);
        }
        
        .discord-info {
          color: #5865F2;
          font-size: 0.9em;
        }
        
        .discord-info i {
          margin-right: 6px;
        }
        
        /* OAuth Widget Styles */
        .discord-oauth-section {
          margin: 12px 0;
          padding: 12px;
          background: var(--secondary-very-low);
          border-radius: 6px;
          border: 1px solid var(--primary-low);
        }
        
        .discord-linked-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(88, 101, 242, 0.1);
          border-radius: 4px;
          color: #5865F2;
          font-size: 0.9em;
        }
        
        .discord-linked-info {
          display: flex;
          align-items: center;
        }
        
        .discord-linked-info i {
          margin-right: 8px;
        }
        
        .discord-unlink-btn {
          background: none;
          border: 1px solid #ed4245;
          color: #ed4245;
          padding: 4px 8px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.8em;
          transition: all 0.2s;
        }
        
        .discord-unlink-btn:hover {
          background: #ed4245;
          color: white;
        }
        
        .discord-not-linked {
          text-align: center;
          padding: 12px;
        }
        
        .discord-not-linked p {
          margin-bottom: 10px;
          color: var(--primary-medium);
          font-size: 0.9em;
        }
        
        .discord-link-button {
          background: #5865F2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9em;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        
        .discord-link-button:hover {
          background: #4752C4;
          transform: translateY(-1px);
        }
        
        .discord-link-button i {
          font-size: 14px;
        }
        
        .discord-link-required {
          text-align: center;
          padding: 20px;
          color: var(--primary-medium);
          font-style: italic;
          background: var(--primary-very-low);
          border-radius: 6px;
          border: 1px dashed var(--primary-low);
        }
        
        .discord-widget-container {
          position: relative;
        }
        
        .discord-widget-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(var(--primary-rgb), 0.1);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
        }
      `;

      // Inject styles if not already present
      if (!document.getElementById("discord-oauth-styles")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "discord-oauth-styles";
        styleSheet.textContent = discordStyles;
        document.head.appendChild(styleSheet);
      }
    });
  }
};
