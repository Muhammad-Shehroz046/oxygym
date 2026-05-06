# OxyGym — Fitness Management System

A full-stack gym management web application with role-based dashboards for members, trainers, and admins. Includes an AI-powered fitness chatbot personalized to each member's profile.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How to Run the Project](#how-to-run-the-project)
- [Environment Variables](#environment-variables)
- [Important Modules](#important-modules)
  - [Authentication](#authentication)
  - [Role-Based Access Control](#role-based-access-control)
  - [AI Fitness Chatbot](#ai-fitness-chatbot)
  - [Workout & Diet Plans](#workout--diet-plans)
  - [Payment Integration](#payment-integration)
  - [Real-Time Updates](#real-time-updates)
- [API Reference](#api-reference)
- [User Roles & Flows](#user-roles--flows)

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---|---|---|
| Node.js | - | Runtime |
| Express.js | ^5.1.0 | HTTP server & routing |
| MongoDB | - | Database |
| Mongoose | ^8.16.0 | MongoDB ODM |
| JSON Web Token | ^9.0.2 | Authentication tokens |
| bcryptjs | ^3.0.2 | Password hashing |
| Socket.IO | ^4.8.1 | Real-time WebSocket communication |
| Stripe | ^18.2.1 | Payment processing |
| OpenAI | latest | AI chatbot (GPT-4o-mini) |
| dotenv | ^16.5.0 | Environment variable management |
| cors | ^2.8.5 | Cross-origin requests |

### Frontend
| Package | Version | Purpose |
|---|---|---|
| React | ^18.3.1 | UI library |
| Vite | ^5.4.19 | Build tool & dev server |
| React Router DOM | ^6.30.1 | Client-side routing |
| Axios | ^1.10.0 | HTTP requests |
| Socket.IO Client | ^4.8.1 | Real-time connection |
| Framer Motion | ^12.23.11 | Animations |
| React Toastify | ^10.0.6 | Toast notifications |
| React Icons | ^5.5.0 | Icon library |
| Stripe React | ^3.7.0 | Payment UI components |
| QRCode.React | ^1.0.0 | QR code generation |

---

## Project Structure

```
final project/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT validation & role guards
│   ├── models/
│   │   ├── User.js                # User schema (member/trainer/admin)
│   │   └── dietplanmodal.js       # Diet plan schema
│   ├── routes/
│   │   ├── authRoutes.js          # Register, login, token validation
│   │   ├── userRoutes.js          # Profile management, trainer selection
│   │   ├── trainerRoutes.js       # Trainer profile & assigned users
│   │   ├── adminRoutes.js         # Admin CRUD on users
│   │   ├── workoutPlanRoutes.js   # Workout plan save & fetch
│   │   ├── dietPlanModal.js       # Diet plan CRUD
│   │   ├── paymentRoutes.js       # Stripe payment intents & webhooks
│   │   ├── membershipRoutes.js    # Membership email validation
│   │   └── chatRoutes.js          # AI fitness chatbot endpoint
│   ├── server.js                  # Express app + Socket.IO entry point
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx    # Global auth state (login/logout/token)
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx
        │   │   └── Footer.jsx
        │   ├── routing/
        │   │   ├── ProtectedRoute.jsx   # Requires authentication
        │   │   └── RoleRoute.jsx        # Requires specific role
        │   └── ChatBot.jsx              # AI chatbot floating widget
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   ├── Register.jsx
        │   │   └── RegisterOptions.jsx
        │   ├── dashboard/
        │   │   ├── Dashboard.jsx        # Role-based redirect router
        │   │   ├── UserDashboard.jsx
        │   │   ├── TrainerDashboard.jsx
        │   │   └── AdminDashboard.jsx
        │   ├── user/
        │   │   ├── ProfileForm.jsx      # Complete profile after registration
        │   │   └── TrainerSelection.jsx
        │   └── admin/
        │       ├── UsersList.jsx
        │       └── EditUser.jsx
        ├── App.jsx                # Routes + global component layout
        └── main.jsx               # React entry point
```

---

## How to Run the Project

### Prerequisites
- Node.js v18 or higher
- MongoDB running locally on port `27017`
- An OpenAI API key
- A Stripe account (for payments)

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create/edit `backend/.env` (see [Environment Variables](#environment-variables) section below).

### 3. Start the Servers

**Option A — Run separately (recommended for development):**

```bash
# Terminal 1: start backend
cd backend
node server.js

# Terminal 2: start frontend
cd frontend
npm run dev
```

**Option B — Run both together from the frontend folder:**

```bash
cd frontend
npm start
```

### 4. Access the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

---

## Environment Variables

Create a file at `backend/.env` with the following:

```env
# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your_strong_jwt_secret_minimum_32_chars

# Database
MONGODB_URI=mongodb://localhost:27017/OxyGym

# OpenAI (for AI chatbot)
OPENAI_API_KEY=sk-proj-...

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Important Modules

### Authentication

**Files:** `backend/routes/authRoutes.js`, `backend/middleware/authMiddleware.js`, `frontend/src/context/AuthContext.jsx`

The app uses **JWT (JSON Web Tokens)** for stateless authentication.

**Flow:**
1. User registers or logs in via `POST /api/auth/register` or `POST /api/auth/login`
2. Server hashes the password with bcrypt and issues a signed JWT (30-day expiry) containing the user's `_id` and `role`
3. The token is stored in `localStorage` on the frontend
4. Every protected API request sends the token in the `Authorization: Bearer <token>` header
5. The `protect` middleware on the backend validates the token and attaches the full user object to `req.user`

**AuthContext** manages global auth state in React — it exposes `user`, `login`, `logout`, `register`, and `updateProfile` to all components via `useAuth()`.

---

### Role-Based Access Control

**Files:** `frontend/src/components/routing/ProtectedRoute.jsx`, `frontend/src/components/routing/RoleRoute.jsx`, `backend/middleware/authMiddleware.js`

Three roles exist in the system:

| Role | Dashboard Route | Access |
|---|---|---|
| `user` | `/user/dashboard` | Own profile, workout/diet plans, AI chatbot |
| `trainer` | `/trainer/dashboard` | Assigned members, create workout/diet plans |
| `admin` | `/admin/dashboard` | Full user management (CRUD) |

- **`ProtectedRoute`** — redirects to `/login` if no token is present
- **`RoleRoute`** — redirects to `/dashboard` if the user's role doesn't match the required role
- The `/dashboard` route reads the user's role and redirects to the correct dashboard automatically
- New users with incomplete profiles are sent to `/user/profile-form` first, then `/user/select-trainer`

---

### AI Fitness Chatbot

**Files:** `backend/routes/chatRoutes.js`, `frontend/src/components/ChatBot.jsx`

A floating chat widget powered by **OpenAI GPT-4o-mini**, personalized to each member.

**How it works:**
1. The `ChatBot` component renders as a fixed red button in the bottom-right corner — only visible to users with `role === 'user'`
2. When a message is sent, the full conversation history is posted to `POST /api/chat` with the JWT token
3. The backend fetches the user's complete profile from MongoDB (name, age, height, weight, fitness goal, medical conditions, assigned trainer)
4. A system prompt is constructed with the user's profile data and strict rules limiting responses to fitness/gym/nutrition topics only
5. The conversation (system prompt + history) is sent to OpenAI and the reply is returned to the frontend

**Restrictions:** The chatbot will refuse any off-topic questions (coding, politics, general knowledge, etc.) and redirect the user back to fitness topics.

**Conversation memory:** The entire chat history is sent on each request, giving the AI full context of the conversation within a session.

---

### Workout & Diet Plans

**Files:** `backend/routes/workoutPlanRoutes.js`, `backend/routes/dietPlanModal.js`, `backend/models/dietplanmodal.js`

**Workout Plans:**
- Stored per user email in the `workoutplans` MongoDB collection
- Schema: a plan object with 7 days (Monday–Sunday), each day having a `type` (e.g. "Push Day") and an array of exercises (`name`, `sets`, `reps`)
- Trainers create/update plans via `POST /api/plan/save`
- Members view their plan via `GET /api/plan/:email`

**Diet Plans:**
- Stored per user ID in the `dietplans` collection
- Trainers create plans via `POST /api/diet-plans`
- Members fetch their plan via `GET /api/diet-plans/user/:id`

---

### Payment Integration

**Files:** `backend/routes/paymentRoutes.js`, `frontend/src/pages/Checkout.jsx`

Gym membership payments are handled via **Stripe**.

**Flow:**
1. User selects a membership plan on the `/memberships` page
2. Frontend calls `POST /api/payments/create-payment-intent` with plan details
3. Backend creates a Stripe `PaymentIntent` and returns the `clientSecret`
4. Frontend uses `@stripe/react-stripe-js` to render the payment form and confirm the payment
5. Stripe sends a webhook event to `POST /api/payments/webhook` on success/failure
6. Payment status can be checked via `GET /api/payments/payment-status/:id`

---

### Real-Time Updates

**Files:** `backend/server.js` (Socket.IO server), frontend components using `socket.io-client`

Socket.IO runs on the same port as Express (5000) using a shared HTTP server.

**Events:**
| Event | Direction | Description |
|---|---|---|
| `connection` | Server receives | Logs when a client connects |
| `disconnect` | Server receives | Logs when a client disconnects |
| `dataUpdate` | Client → Server | Signals that data has changed |
| `dataRefresh` | Server → All clients | Broadcasts a refresh trigger to all connected clients |

This allows real-time UI updates when a trainer updates a member's workout or diet plan.

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Authenticate & get token |
| GET | `/api/auth/validate` | Protected | Validate JWT |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users/profile` | User | Get own profile |
| PUT | `/api/users/profile` | User | Update profile details |
| GET | `/api/users/trainers` | Protected | List all trainers |
| PUT | `/api/users/select-trainer` | User | Assign a trainer |

### Trainers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/trainers/profile` | Trainer | Get trainer profile |
| GET | `/api/trainers/assigned-users` | Trainer | Get assigned members |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | List all users |
| POST | `/api/admin/users` | Admin | Create user |
| GET | `/api/admin/users/:id` | Admin | Get user by ID |
| PUT | `/api/admin/users/:id` | Admin | Update user |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |

### Plans
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/plan/save` | Trainer | Save/update workout plan |
| GET | `/api/plan/:email` | Protected | Get workout plan by email |
| POST | `/api/diet-plans` | Trainer | Create diet plan |
| GET | `/api/diet-plans/user/:id` | Protected | Get diet plan by user ID |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/create-payment-intent` | Protected | Initialize Stripe payment |
| POST | `/api/payments/webhook` | Public (Stripe) | Handle Stripe events |
| GET | `/api/payments/payment-status/:id` | Protected | Check payment status |

### Chat
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/chat` | User | Send message to AI chatbot |

---

## User Roles & Flows

### New Member Flow
1. Register at `/register/user`
2. Complete profile (age, height, weight, fitness goal, medical conditions) at `/user/profile-form`
3. Select a trainer at `/user/select-trainer`
4. Land on `/user/dashboard` — view stats, workout plan, diet plan, and use AI chatbot

### Trainer Flow
1. Register at `/register/trainer` (or created by admin)
2. Log in → redirected to `/trainer/dashboard`
3. View assigned members and create/update their workout and diet plans

### Admin Flow
1. Log in → redirected to `/admin/dashboard`
2. View, create, edit, or delete any user account at `/admin/users`
