# October — 31 Days of You ❤️

This is the private website package made for Khushi.

## Admin inbox
- URL after deployment: `/admin`
- Admin password: `f#eaIZHR8gPPQjNz$WJR`
- Keep this password private.
- The password is stored server-side in `.env`; it is not embedded in the public JavaScript.
- Change it before public deployment if you want.

## Run locally
1. Install Node.js 18+.
2. Open a terminal in this folder.
3. Run: `npm install`
4. Run: `npm start`
5. Open: `http://localhost:3000`
6. Admin inbox: `http://localhost:3000/admin`

## Important for deployment
Use HTTPS. Do not commit or publicly upload `.env`.
The message inbox is stored in `data/messages.json`. For a production deployment, use a persistent/private database or persistent disk so messages survive redeployments.

## Day 3
The uploaded photo is included at:
`public/assets/day3-memory.jpg`

## Day 5
The uploaded audio is included at:
`public/assets/nakhre-tere.m4a`

A lyric panel is included, but the full copyrighted lyrics are not embedded. If you have permission to use the lyrics, paste them into `lyrics.txt`; the page will load that text.

## October locking
The calendar uses the real date. On October 1, 2026 Day 1 unlocks; each following day unlocks on its date. Outside October 2026 the calendar is shown locked.
