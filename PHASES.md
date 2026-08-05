# Development Phases
## Achievers Portal — Achievers Club Nashik

**Version:** 1.0.0  
**Author:** Swayam Vijay Jadhav  
**Total Duration:** 27 Working Days

---

## Overview

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5
 Setup    Backend  Frontend  Integrate  Deploy   Handover
 Day 1-3  Day 4-10  Day 11-20  Day 21-25  Day 26   Day 27
```

---

## Phase 0 — Requirements & Setup (Days 1–3)

**Goal:** Lock scope, set up all tooling, finalize DB schema.

### Tasks

#### Day 1 — Kickoff
- [ ] Final requirements walkthrough with Azim Sayyed
- [ ] Lock MVP feature list (no scope changes after this)
- [ ] Collect from client: logo files, official content, club info for Achibot system prompt
- [ ] Set up accounts: Vercel, TiDB Cloud, Resend, Groq, Supabase, GitHub

#### Day 2 — Project Bootstrap
- [ ] `npx create-next-app@latest achievers-portal --typescript --tailwind --app`
- [ ] Configure Tailwind v4 with custom color palette
- [ ] Set up ESLint, Prettier, TypeScript strict mode
- [ ] Create `.env.example` and `.env.local`
- [ ] Initialize GitHub repo, push first commit
- [ ] Connect Vercel to GitHub (auto-deploy on push to main)

#### Day 3 — Database
- [ ] Create TiDB Cloud cluster
- [ ] Write and run all migration SQL (`/sql/migrations/`)
- [ ] Seed admin user (Azim Sayyed)
- [ ] Test DB connection from local dev via `lib/db.ts`
- [ ] Verify connection pooling works

**Deliverable:** Repo initialized, DB live, all tools connected, `.env` configured.

---

## Phase 1 — Backend API Development (Days 4–10)

**Goal:** All API endpoints built, tested, and documented.

### Day 4 — Auth Foundations
- [ ] `lib/auth.ts` — JWT sign, verify, extract from cookie
- [ ] `lib/email.ts` — Resend wrapper for OTP emails
- [ ] `middleware.ts` — Route protection logic
- [ ] `POST /api/auth/register` — validate, hash, insert, send OTP
- [ ] `POST /api/auth/verify-otp` — verify, issue cookie

### Day 5 — Auth Completion + Me
- [ ] `POST /api/auth/login` — validate, bcrypt compare, issue cookie
- [ ] `POST /api/auth/logout` — clear cookie
- [ ] `GET /api/auth/me` — return current user from JWT
- [ ] `POST /api/auth/forgot-password` — send reset OTP
- [ ] `POST /api/auth/reset-password` — validate OTP, update hash
- [ ] Test all auth flows with Postman

### Day 6 — Members API
- [ ] `GET /api/members` — paginated list, search, filter by city
- [ ] `GET /api/members/[id]` — single member profile
- [ ] `PATCH /api/members/[id]` — update profile (owner or admin)
- [ ] `DELETE /api/members/[id]` — soft-delete (admin only)
- [ ] `POST /api/upload/avatar` — Supabase Storage upload

### Day 7 — Tasks API
- [ ] `GET /api/tasks` — list tasks (role-filtered: member sees own, admin sees all)
- [ ] `POST /api/tasks` — create task + bulk assign (admin/mentor)
- [ ] `GET /api/tasks/[id]` — task detail with assignment statuses
- [ ] `PATCH /api/tasks/[id]` — update task (admin/mentor)
- [ ] `PATCH /api/tasks/[id]/status` — member updates own status
- [ ] `POST /api/tasks/[id]/feedback` — mentor adds feedback

### Day 8 — Events API
- [ ] `GET /api/events` — list upcoming events
- [ ] `POST /api/events` — create event (admin)
- [ ] `GET /api/events/[id]` — event detail
- [ ] `POST /api/events/[id]/register` — member registers
- [ ] `DELETE /api/events/[id]/register` — member unregisters
- [ ] `GET /api/events/[id]/attendees` — list (admin)

### Day 9 — Chatbot + Analytics API
- [ ] `lib/groq.ts` — Groq client, system prompt with club knowledge base
- [ ] `POST /api/chat` — stream Achibot response
- [ ] `GET /api/analytics/summary` — KPI counts for admin dashboard
- [ ] `GET /api/analytics/registrations` — last 7 days chart data
- [ ] `GET /api/analytics/tasks` — completion rate data

### Day 10 — API Hardening
- [ ] Add Zod validation to all POST/PATCH routes
- [ ] Add rate limiting on auth endpoints (via Edge Middleware)
- [ ] Full Postman collection with all endpoints
- [ ] Fix any bugs found during testing
- [ ] API documentation in `/docs/api.md`

**Deliverable:** All API endpoints functional, tested with Postman, no known bugs.

---

## Phase 2 — Frontend UI Development (Days 11–20)

**Goal:** Complete, pixel-polished, mobile-responsive UI for all pages.

### Day 11 — Design System & Layout Shell
- [ ] `tailwind.config.ts` — custom colors, fonts, spacing
- [ ] Base UI components: `Button`, `Input`, `Label`, `Card`, `Badge`, `Spinner`
- [ ] `components/layout/Sidebar.tsx` — collapsible, role-aware nav links
- [ ] `components/layout/Topbar.tsx` — user avatar, name, logout
- [ ] `components/layout/MobileNav.tsx` — bottom nav for mobile
- [ ] Root layout with font (Inter or Outfit from Google Fonts)

### Day 12 — Auth Pages
- [ ] `/login` — email + password form, show/hide password, loading state
- [ ] `/register` — multi-field form with validation feedback
- [ ] `/verify-otp` — 6-box OTP input, resend countdown timer
- [ ] `/forgot-password` — email entry → OTP → new password
- [ ] Redirect logic: already logged in → /dashboard
- [ ] Auth pages: clean centered layout, Achievers Club branding

### Day 13 — Member Dashboard
- [ ] Role-aware dashboard: renders different content per role
- [ ] **Member view:** KPI cards (pending tasks, completed, events), upcoming tasks list, next event card
- [ ] **Mentor view:** Mentees list with completion bars, overdue tasks
- [ ] **Admin view:** Full KPI row, charts, recent activity feed, quick action buttons
- [ ] `KpiCard` component: icon + label + number + trend indicator
- [ ] Loading skeletons for all async data

### Day 14 — Charts & Analytics (Admin)
- [ ] Recharts `BarChart` — new registrations last 7 days
- [ ] Recharts `PieChart` — task status distribution
- [ ] Recharts `LineChart` — event registrations over time
- [ ] Activity feed: timestamped log of recent member actions
- [ ] Quick actions panel: "Add Member", "Create Task", "Create Event" buttons → modals

### Day 15 — Member Directory
- [ ] Grid layout: member cards with photo, name, city, role badge
- [ ] Search bar (debounced, 300ms) — search by name, city
- [ ] Filters: city dropdown, role filter, join date range
- [ ] WhatsApp button on each card → `https://wa.me/91XXXXXXXXXX`
- [ ] Pagination: 20 per page with prev/next controls
- [ ] Empty state: "No members found" illustration
- [ ] Loading skeleton for card grid

### Day 16 — Task Management UI
- [ ] Task list: table view (desktop) + card view (mobile)
- [ ] Status badge: color-coded (gray = pending, blue = in progress, green = completed)
- [ ] Overdue highlighting (red border if past due_date and not completed)
- [ ] Member: click task → detail modal → update status button
- [ ] Admin/Mentor: "Create Task" button → modal with form + multi-select member assignment
- [ ] Progress bar per member (% tasks completed)
- [ ] Mentor feedback input on completed task modal

### Day 17 — Events UI
- [ ] Event cards: date, title, venue, spots remaining badge
- [ ] "Register" button → confirmation modal → success toast
- [ ] Registered state: button changes to "Registered ✓" + "Cancel" link
- [ ] Admin: "Create Event" button → modal form
- [ ] Admin: event detail → attendee list with export CSV button
- [ ] Calendar icon with formatted date display

### Day 18 — Profile Page
- [ ] Profile header: large avatar, name, role badge, join date
- [ ] Avatar upload: click avatar → file picker → preview → save
- [ ] Edit form: name, phone, city, bio with inline save
- [ ] Task history tab: paginated list of own tasks
- [ ] Event history tab: events registered
- [ ] Change password section

### Day 19 — Achibot Chat Widget
- [ ] Floating chat button (bottom-right, all pages)
- [ ] Chat drawer/panel: slides up on mobile, panel on desktop
- [ ] Message bubbles: user (right, gold accent) / bot (left, gray)
- [ ] Typing indicator (three dots animation) while streaming
- [ ] Input: text field + send button + Enter to send
- [ ] Streaming response rendering (character by character)
- [ ] Auto-scroll to latest message
- [ ] Clear chat button

### Day 20 — Polish & Responsive Fixes
- [ ] Full audit: every page on 375px (mobile), 768px (tablet), 1280px (desktop)
- [ ] Fix any overflow, truncation, or layout issues
- [ ] Keyboard navigation: Tab order, focus rings on all interactive elements
- [ ] Toast notification system (success/error/info)
- [ ] Empty states on every list page
- [ ] 404 page
- [ ] Loading states / Suspense boundaries

**Deliverable:** All pages complete, mobile-responsive, no console errors.

---

## Phase 3 — Integration & Testing (Days 21–25)

**Goal:** Frontend fully wired to backend, all flows E2E tested.

### Day 21 — Connect Auth Flows
- [ ] Wire register → OTP → login flow end-to-end
- [ ] Test JWT cookie set/read/clear
- [ ] Test middleware protecting /dashboard/*
- [ ] Test role-based UI rendering

### Day 22 — Connect Core Features
- [ ] Member directory connected to GET /api/members
- [ ] Search and filter working with API query params
- [ ] Task list connected, status update wired
- [ ] Chat widget connected to POST /api/chat, streaming working

### Day 23 — Connect Admin Features
- [ ] Admin dashboard charts pulling real data
- [ ] Create task modal → API → task appears in list
- [ ] Create event modal → API → event card appears
- [ ] Member approval / role change working

### Day 24 — Bug Bash
- [ ] Manual E2E test: Register → Verify → Login → Use all features → Logout
- [ ] Test all three roles independently (member, mentor, admin)
- [ ] Test on Chrome, Firefox, Safari (desktop)
- [ ] Test on Android Chrome (375px)
- [ ] Fix all bugs found — prioritize by severity

### Day 25 — Performance & Security Audit
- [ ] Run Lighthouse audit (target: Performance > 85, Accessibility > 90)
- [ ] Check all API routes for missing auth guards
- [ ] Verify no sensitive data in API responses (no password_hash)
- [ ] Check all SQL queries are parameterized
- [ ] Remove all `console.log` statements

**Deliverable:** Fully integrated, E2E tested, no P0/P1 bugs.

---

## Phase 4 — Deployment (Day 26)

- [ ] Set all production env vars in Vercel dashboard
- [ ] Push to main → verify Vercel build succeeds
- [ ] Run DB migrations on production TiDB cluster
- [ ] Seed production admin user
- [ ] Smoke test all critical flows on production URL
- [ ] Configure custom domain (if client provides one)
- [ ] Enable Vercel Analytics

**Deliverable:** Live production URL, all systems green.

---

## Phase 5 — Handover (Day 27)

- [ ] Record Loom walkthrough video (admin panel tour)
- [ ] Write user manual for admin (`/docs/admin-guide.md`)
- [ ] Hand over GitHub repo access to client
- [ ] Hand over all account credentials (Vercel, TiDB, Resend, Groq, Supabase)
- [ ] Deliver final invoice
- [ ] 1-month free support period starts

**Deliverable:** Client can independently operate and manage the portal.

---

## Post-MVP Backlog (Future Phases)

| Feature | Priority | Estimated Effort |
|---|---|---|
| Marathi / Hindi language toggle | Medium | 3 days |
| Certificate generation (PDF) | Medium | 2 days |
| WhatsApp Business API notifications | High | 4 days |
| Native mobile app (React Native) | Low | 30 days |
| FLP business module | Low | 15 days |
| Video session integration | Low | 10 days |
| Bulk email campaigns | Medium | 3 days |