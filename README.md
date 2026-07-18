# CareHMS — Hospital Management System (MEAN Stack)

A full-stack hospital management system built with MongoDB, Express.js, Angular, and Node.js.
Modules: Login/Signup, Dashboard, Patient Registration, Doctor Management, Appointment Scheduling.

## Project structure

```
hospital-management-system/
├── backend/     Node.js + Express REST API, Mongoose models for MongoDB, JWT auth
└── frontend/    Angular 18 application
```

## Authentication

The app includes a full sign-in / sign-up system:

- **Backend:** `backend/routes/auth.js` — `/api/auth/register`, `/api/auth/login`, `/api/auth/me`.
  Passwords are hashed with bcrypt; sessions use JWT tokens (7-day expiry).
- **Frontend:** `/login` and `/signup` pages, an `AuthService` that stores the token,
  and an `authGuard` that blocks the dashboard/patients/doctors/appointments routes
  until you're signed in.

**Demo login (works out of the box, no setup):**
```
Email:    sanal@carehms.in
Password: password123
```

You can also click "Create one" on the login page to sign up a new account —
it works immediately against the in-memory store, no database needed for local dev.

In production (`MONGODB_URI` set), accounts are stored as real MongoDB documents via
the `User` model in `backend/models/User.js`, so signups persist permanently.

## Run it locally

**Backend**
```
cd backend
npm install
npm start          # runs on http://localhost:4500
```
By default it runs on an in-memory demo data store, so it works instantly with
no database setup. To use real MongoDB, create a `.env` file:
```
PORT=4500
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=some-long-random-string
```

**Frontend**
```
cd frontend
npm install
npm start           # runs on http://localhost:4300
```

Open `http://localhost:4300` — you'll land on the login page first.

## Deploying it live (free tier, ~15 minutes)

**1. Database — MongoDB Atlas**
- Create a free cluster at mongodb.com/cloud/atlas
- Create a database user, allow network access from anywhere (0.0.0.0/0)
- Copy the connection string

**2. Backend — Render.com**
- Push the `backend/` folder to a GitHub repo
- On Render: New → Web Service → connect the repo
- Build command: `npm install`  |  Start command: `node server.js`
- Add environment variables `MONGODB_URI` and `JWT_SECRET`
- Deploy — you'll get a URL like `https://your-app.onrender.com`

**3. Frontend — Netlify or Vercel**
- In `frontend/src/app/services/hospital.service.ts` and `auth.service.ts`, change the
  `base` URL from `http://localhost:4500/api...` to your deployed Render backend URL
  (e.g. `https://your-app.onrender.com/api...`)
- Run `npm run build` — this creates `frontend/dist/frontend/browser`
- Drag that folder into Netlify's "deploy manually" box, or connect the repo
  for automatic deploys
- You'll get a live URL like `https://carehms.netlify.app`

**4. Update your resume/GitHub**
- Push the whole project to `github.com/<your-username>/hospital-management-system`
- Add the live Netlify/Render URLs to the repo's README and to your resume

## Tech stack

- **Frontend:** Angular 18 (standalone components), TypeScript, custom CSS
- **Backend:** Node.js, Express.js, REST API, JWT authentication, bcrypt password hashing
- **Database:** MongoDB with Mongoose schemas (User, Patient, Doctor, Appointment)
- **Fallback:** in-memory data store for zero-config local development/demo
