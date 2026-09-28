OCTOBER — 31 DAYS OF YOU | NETLIFY VERSION

IMPORTANT: The website itself is in the /public folder. netlify.toml tells Netlify to publish it.

NETLIFY SETUP
1. Upload/import this project to Netlify (prefer GitHub import or a logged-in Netlify deploy).
2. Netlify will use:
   Publish directory: public
   Functions directory: netlify/functions
3. In Netlify: Project configuration -> Environment variables, add:
   ADMIN_PASSWORD = your private admin password
4. Redeploy after adding the environment variable.
5. Open your site's netlify.app URL.
6. Admin inbox: your-site.netlify.app/admin

Messages are stored in Netlify Blobs, so they persist across deploys. No Gmail address is required.

The old .env file was intentionally removed so the password is not shipped with the site.
