# Deploying OxyGym to Render

This guide walks you through deploying the OxyGym full-stack app on [Render](https://render.com). You will create **two services**:

1. **Backend** — Web Service (Node.js)
2. **Frontend** — Static Site (Vite/React)

---

## Prerequisites

- A [Render](https://render.com) account (free tier works)
- A [MongoDB Atlas](https://mongodb.com/atlas) cluster (free tier works)
- Your Stripe keys (from [dashboard.stripe.com](https://dashboard.stripe.com))
- Your OpenAI API key

---

## Step 1 — Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → create a free cluster.
2. Create a database user (username + password).
3. Under **Network Access**, add `0.0.0.0/0` (allow all IPs — Render uses dynamic IPs).
4. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/OxyGym?retryWrites=true&w=majority
   ```

---

## Step 2 — Deploy the Backend (Web Service)

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo.
3. Configure:

   | Setting | Value |
   |---|---|
   | **Name** | `oxygym-backend` (or any name) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Instance Type** | Free |

4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | a long random string (32+ chars) |
   | `FRONTEND_URL` | *(leave blank for now — fill in after frontend is deployed)* |
   | `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` |
   | `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` (from Stripe dashboard) |
   | `OPENAI_API_KEY` | `sk-proj-...` |

5. Click **Create Web Service**. Wait for the build to complete.
6. Copy the backend URL shown at the top (e.g. `https://oxygym-backend.onrender.com`).

---

## Step 3 — Deploy the Frontend (Static Site)

1. Go to Render → **New → Static Site**
2. Connect the same GitHub repo.
3. Configure:

   | Setting | Value |
   |---|---|
   | **Name** | `oxygym-frontend` (or any name) |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm install && npm run build` |
   | **Publish Directory** | `dist` |

4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your backend URL (e.g. `https://oxygym-backend.onrender.com`) |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` |

5. Click **Create Static Site**. Wait for the build.
6. Copy the frontend URL (e.g. `https://oxygym-frontend.onrender.com`).

---

## Step 4 — Wire Frontend URL Back into Backend

1. Go to your **Backend Web Service** on Render → **Environment**.
2. Set `FRONTEND_URL` to the frontend URL you just copied:
   ```
   https://oxygym-frontend.onrender.com
   ```
3. Click **Save Changes** — Render will auto-redeploy the backend.

---

## Step 5 — Configure Stripe Webhook (Optional but Recommended)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks).
2. Add endpoint: `https://oxygym-backend.onrender.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the **Signing Secret** (`whsec_...`) and update the `STRIPE_WEBHOOK_SECRET` env var on Render.

---

## Summary of Services

| Service | Type | Render Setting |
|---|---|---|
| `oxygym-backend` | Web Service | Root: `backend`, Start: `node server.js` |
| `oxygym-frontend` | Static Site | Root: `frontend`, Publish: `dist` |

---

## Local Development

Copy env files and install:

```bash
# Backend
cp backend/.env.example backend/.env
# Fill in backend/.env with real values

# Frontend
cp frontend/.env.example frontend/.env
# Set VITE_API_URL=http://localhost:5000

# Install & run
cd backend && npm install && node server.js
cd frontend && npm install && npm run dev
```

---

## Notes

- On Render's **free tier**, web services spin down after 15 minutes of inactivity. The first request after sleep takes ~30 seconds.
- Static sites on free tier never sleep.
- Keep `.env` files out of git — they are already in `.gitignore`.
