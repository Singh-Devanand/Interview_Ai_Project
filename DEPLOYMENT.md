# Vercel Deployment

Deploy the frontend and backend as two separate Vercel projects.

## Backend

Create a Vercel project from this repository and set its **Root Directory** to `Backend`.
Add these environment variables in Vercel Project Settings:

- `MONGO_URI`: MongoDB connection string. Use a newly rotated database password.
- `JWT_SECRET`: a new, long random secret. Rotating it signs out existing users.
- `GOOGLE_GENAI_API_KEY`: a newly generated Google GenAI key.
- `FRONTEND_URLS`: the frontend's exact `https://` Vercel domain. Add any additional allowed frontend domains as a comma-separated list, without trailing slashes.

Vercel supplies `NODE_ENV=production`. The backend exports a serverless request handler from `server.js` and also supports local startup with `npm run dev`.

## Frontend

Create another Vercel project from the same repository and set its **Root Directory** to `Frontend`.
Set `VITE_API_BASE_URL` to the backend's deployed origin, for example `https://your-backend.vercel.app`, with no trailing slash. Vite embeds this value at build time, so redeploy the frontend after changing it.

For local development, the frontend defaults to `http://localhost:3000`; `Frontend/.env.example` shows the optional override.

## Credentials

Never commit `.env` files or put database/API secrets in frontend variables. Anything prefixed with `VITE_` is public in the built frontend. The credentials previously shared in chat should be rotated before deployment.