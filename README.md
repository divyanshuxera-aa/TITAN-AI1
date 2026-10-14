# TITAN-FF.AI — Final website package

Responsive community gaming website with sign-in/sign-up UI, official Garena esports links, leaderboard guidance, UID lookup form, community squad/event sections, and policy pages.

## Files
- `index.html` — site and authentication dialog
- `style.css` — responsive dark/crimson design
- `app.js` — Firebase Authentication integration and UI logic
- `firebase-config.js` — **your Firebase web configuration goes here**
- `favicon.svg`, `privacy.html`, `terms.html`, `rules.html`, `contact.html`

## Before real login can work
This package is prepared for Firebase, but cannot use a real project until you add your own project settings:
1. Open Firebase Console and create a project, then register a Web app.
2. Copy the Web app config values into `firebase-config.js`.
3. In Authentication → Sign-in method, enable Email/Password. Enable Google only if needed.
4. In Authentication settings, add your deployed domain to Authorized domains.
5. Deploy this folder to an HTTPS static host and test login/signup there.

Never share your Firebase password or service-account/private keys. The browser config contains public app identifiers only; protect all data using Security Rules.

## Official Free Fire links
- Esports roadmap and official tournament announcements: https://ff.garena.com/en/article/1605/
- Official Free Fire website/news: https://ff.garena.com/en/

## Honest feature limits
- UID lookup validates the entered UID format only. Live profile details require an authorized game-data API and a secure backend. Do not enter a Garena password here.
- The official live leaderboard is shown inside Free Fire/Free Fire MAX. No official public live leaderboard API is configured in this static package, so it does not invent ranks.
- Community tournament cards are examples, not actual registered events. Real registrations, squad persistence, and a community leaderboard require a database/backend plus security rules.
- Google login needs the Google provider enabled in Firebase. Phone OTP is not active in this package because it requires a reCAPTCHA verifier and additional setup.

TITAN-FF.AI is an independent community project and is not affiliated with or endorsed by Garena or Free Fire.
