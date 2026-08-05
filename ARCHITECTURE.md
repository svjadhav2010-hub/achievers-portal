# Architecture Document
## Achievers Portal — Achievers Club Nashik

**Version:** 1.0.0  
**Date:** April 2026  
**Author:** Swayam Vijay Jadhav

---

## 1. System Overview

Achievers Portal follows a **monolithic Next.js full-stack architecture** — frontend and backend co-located in a single repository, deployed as a unified Vercel application. This decision was made deliberately for a solo developer context: no microservices overhead, no cross-service auth plumbing, single deployment pipeline.

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT BROWSER                   │
│           Next.js 15 App Router (React 18)          │
└────────────────────────┬────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────┐
│               VERCEL EDGE NETWORK                   │
│         Next.js API Routes (/api/*)                 │
│         Middleware (auth guard, role check)         │
└───────┬────────────────┬────────────────┬───────────┘
        │                │                │
┌───────▼──────┐ ┌───────▼──────┐ ┌──────▼────────┐
│  TiDB Cloud  │ │  Groq API    │ │  Resend API   │
│  MySQL DB    │ │  (Achibot)   │ │  (Email OTP)  │
└──────────────┘ └──────────────┘ └───────────────┘
        │
┌───────▼──────┐
│   Supabase   │
│   Storage    │
│ (Profile Img)│
└──────────────┘
```

---

## 2. Tech Stack

### Frontend
| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | Next.js | 15.x | App Router, SSR, API Routes in one |
| UI Library | React | 18.x | Component model, hooks |
| Language | TypeScript | 5.x | Type safety across full stack |
| Styling | Tailwind CSS | v4 | Utility-first, no runtime CSS |
| Icons | Lucide React | Latest | Consistent icon system |
| Charts | Recharts | Latest | Admin dashboard analytics |

### Backend (Next.js API Routes)
| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js 20 | Vercel default |
| Auth | jose (JWT) | Lightweight, edge-compatible |
| Password | bcryptjs | Standard, no native deps |
| DB Client | mysql2 | TiDB-compatible MySQL driver |
| Email | Resend SDK | Simple transactional email |
| AI | Groq SDK | Fast inference, Llama 3.3 70B |

### Database
| Layer | Technology | Reason |
|---|---|---|
| DB Engine | MySQL 8.0 | Relational, familiar SQL |
| Hosting | TiDB Cloud | Distributed SQL, free tier, MySQL-compatible |
| ORM | Raw SQL (mysql2) | Direct control, no ORM magic on free tier |

### Infrastructure
| Service | Purpose | Tier |
|---|---|---|
| Vercel | Frontend + API hosting | Free (Hobby) |
| TiDB Cloud | Database | Free (Developer) |
| Supabase | Profile image storage | Free |
| Resend | Transactional email | Free (100/day) |
| Groq | AI inference | Free tier |
| GitHub | Source control + CI/CD | Free |

---

## 3. Directory Structure

```
achievers-portal/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (font, metadata)
│   ├── page.tsx                  # Landing / login redirect
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify-otp/page.tsx
│   ├── (dashboard)/              # Protected route group
│   │   ├── layout.tsx            # Sidebar + auth guard
│   │   ├── dashboard/page.tsx    # Role-aware dashboard
│   │   ├── members/page.tsx      # Member directory
│   │   ├── tasks/page.tsx        # Task list
│   │   ├── events/page.tsx       # Event list
│   │   └── profile/page.tsx      # User profile
│   └── api/                      # API Routes (backend)
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   ├── verify-otp/route.ts
│       │   └── me/route.ts
│       ├── members/
│       │   ├── route.ts          # GET list, POST create
│       │   └── [id]/route.ts     # GET, PATCH, DELETE
│       ├── tasks/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── events/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── chat/route.ts         # Achibot endpoint
│       └── upload/route.ts       # Profile photo upload
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── KpiCard.tsx
│   │   ├── TasksChart.tsx
│   │   └── ActivityFeed.tsx
│   └── chatbot/
│       ├── ChatWidget.tsx
│       └── ChatMessage.tsx
├── lib/
│   ├── db.ts                     # TiDB connection pool
│   ├── auth.ts                   # JWT sign / verify helpers
│   ├── email.ts                  # Resend wrapper
│   ├── groq.ts                   # Groq client + system prompt
│   └── supabase.ts               # Supabase storage client
├── middleware.ts                 # Route protection + role check
├── types/
│   └── index.ts                  # Shared TypeScript types
├── hooks/
│   ├── useAuth.ts
│   ├── useMembers.ts
│   └── useTasks.ts
└── public/
    └── assets/                   # Logos, images
```

---

## 4. Database Schema

### 4.1 Entity Relationship Overview

```
users ──< tasks_assignments >── tasks
users ──< event_registrations >── events
users ──  (mentor_id FK) ──> users
```

### 4.2 Tables

#### `users`
```sql
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  phone         VARCHAR(15),
  city          VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('MEMBER','MENTOR','ADMIN') DEFAULT 'MEMBER',
  mentor_id     INT REFERENCES users(id),
  avatar_url    VARCHAR(500),
  bio           TEXT,
  is_verified   BOOLEAN DEFAULT FALSE,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `otp_tokens`
```sql
CREATE TABLE otp_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(150) NOT NULL,
  token      VARCHAR(6) NOT NULL,
  purpose    ENUM('VERIFY','RESET') NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `tasks`
```sql
CREATE TABLE tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  due_date    DATE,
  created_by  INT REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### `task_assignments`
```sql
CREATE TABLE task_assignments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  task_id     INT REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     INT REFERENCES users(id) ON DELETE CASCADE,
  status      ENUM('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
  feedback    TEXT,
  completed_at TIMESTAMP NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_assignment (task_id, user_id)
);
```

#### `events`
```sql
CREATE TABLE events (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  venue       VARCHAR(300),
  event_date  DATETIME NOT NULL,
  capacity    INT DEFAULT 100,
  created_by  INT REFERENCES users(id),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `event_registrations`
```sql
CREATE TABLE event_registrations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  event_id     INT REFERENCES events(id) ON DELETE CASCADE,
  user_id      INT REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_registration (event_id, user_id)
);
```

#### `chat_messages` *(optional persistence)*
```sql
CREATE TABLE chat_messages (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT REFERENCES users(id),
  role       ENUM('user','assistant') NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Authentication Flow

```
REGISTER
User fills form → POST /api/auth/register
  → Validate input
  → Check email uniqueness
  → Hash password (bcrypt, 12 rounds)
  → Insert user (is_verified=false)
  → Generate 6-digit OTP → store in otp_tokens
  → Send OTP email via Resend
  → Redirect to /verify-otp

VERIFY OTP
User enters OTP → POST /api/auth/verify-otp
  → Find unexpired, unused token
  → Mark used, set is_verified=true
  → Issue JWT → set HTTP-only cookie
  → Redirect to /dashboard

LOGIN
User logs in → POST /api/auth/login
  → Find user by email
  → Check is_verified=true
  → bcrypt.compare password
  → Issue JWT (7-day expiry) → HTTP-only cookie
  → Redirect to /dashboard

PROTECTED ROUTES
middleware.ts intercepts every /dashboard/* request
  → Read JWT from cookie
  → Verify with jose
  → Attach user payload to request headers
  → Role check for admin-only routes
  → 401/403 → redirect to /login
```

---

## 6. API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | None | Register new member |
| POST | /api/auth/verify-otp | None | Verify OTP |
| POST | /api/auth/login | None | Login |
| POST | /api/auth/logout | User | Clear cookie |
| GET | /api/auth/me | User | Get current user |

### Members
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/members | User | List members (paginated) |
| GET | /api/members/[id] | User | Get member profile |
| PATCH | /api/members/[id] | Owner/Admin | Update profile |
| DELETE | /api/members/[id] | Admin | Deactivate member |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/tasks | User | List tasks (role-filtered) |
| POST | /api/tasks | Admin/Mentor | Create task |
| GET | /api/tasks/[id] | User | Get task detail |
| PATCH | /api/tasks/[id] | Admin/Mentor | Update task |
| PATCH | /api/tasks/[id]/status | Member | Update own status |

### Events
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | /api/events | User | List events |
| POST | /api/events | Admin | Create event |
| POST | /api/events/[id]/register | Member | Register for event |
| GET | /api/events/[id]/attendees | Admin | List attendees |

### Chatbot
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/chat | User | Send message to Achibot |

---

## 7. Deployment Architecture

```
GitHub (main branch)
       │
       │ git push → auto-deploy
       ▼
  Vercel CI/CD
       │
       ├── Build: next build
       ├── Environment: .env.production (set in Vercel dashboard)
       └── Deploy: Vercel Edge Network (global CDN)
                │
                ├── Static assets → Edge Cache
                ├── SSR pages     → Serverless Functions
                └── API Routes    → Serverless Functions
                         │
                         ├── TiDB Cloud (MySQL, Singapore region)
                         ├── Groq API   (US region)
                         ├── Resend     (US region)
                         └── Supabase   (Storage)
```

---

## 8. Environment Variables

```env
# Database
DATABASE_URL=mysql://user:pass@host:port/achievers_portal

# Auth
JWT_SECRET=<256-bit-random-string>

# Email
RESEND_API_KEY=re_...

# AI
GROQ_API_KEY=gsk_...

# Storage
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# App
NEXT_PUBLIC_APP_URL=https://achievers-portal.vercel.app
```

---

## 9. Security Considerations

| Threat | Mitigation |
|---|---|
| SQL Injection | Parameterized queries (mysql2 prepared statements) |
| XSS | React's JSX escaping; Content-Security-Policy headers |
| CSRF | Same-site cookie + origin check on mutations |
| Auth token theft | HTTP-only, Secure, SameSite=Lax cookie |
| Brute force login | Rate limiting via Vercel Edge Middleware |
| Sensitive data exposure | Passwords never returned in API responses |
| OTP abuse | 10-minute expiry; single-use; rate-limit send endpoint |