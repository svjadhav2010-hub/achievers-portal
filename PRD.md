# Product Requirements Document (PRD)
## Achievers Portal — Achievers Club Nashik

**Version:** 1.0.0  
**Date:** April 2026  
**Author:** Swayam Vijay Jadhav  
**Client:** Achievers Club Nashik (Azim Sayyed, Founder)  
**Status:** Active Development

---

## 1. Executive Summary

Achievers Portal is a full-stack web application designed to digitize and streamline the operations of Achievers Club Nashik — a youth entrepreneurship training organization operating under the motto "Start Young, Retire Young." The platform replaces manual WhatsApp-based coordination with a structured, role-aware system for member onboarding, task management, mentorship, and community engagement.

---

## 2. Problem Statement

Achievers Club Nashik currently manages its members, mentors, training tasks, and events through informal WhatsApp groups and manual tracking. This leads to:

- No centralized member registry or profile system
- Task assignments lost in chat threads with no accountability
- No visibility into member progress or training outcomes
- Mentors unable to efficiently track or guide their assigned members
- Admins lacking analytics on community health or participation
- No automated onboarding — everything done manually

---

## 3. Goals & Success Metrics

### Goals
- Digitize complete member lifecycle (registration → onboarding → training → graduation)
- Provide role-based dashboards for Members, Mentors, and Admins
- Enable AI-assisted 24/7 member support via a chatbot (Achibot)
- Deliver real-time community analytics for leadership decisions

### Success Metrics
| Metric | Target |
|---|---|
| Member registration completion rate | > 85% |
| Task completion rate (30-day) | > 70% |
| Chatbot deflection rate | > 60% of common queries |
| Admin time saved on manual tasks | > 5 hrs/week |
| Mobile usage share | > 60% of sessions |

---

## 4. User Personas

### 4.1 Member (Primary User)
- Age: 18–28, college student or early-career
- Goal: Learn entrepreneurship, complete training modules, connect with peers
- Pain: No visibility into their own progress; doesn't know what task to do next
- Device: Primarily mobile (Android)

### 4.2 Mentor
- Age: 25–40, experienced entrepreneur or senior member
- Goal: Guide assigned members, track their task completion, provide feedback
- Pain: No structured way to follow up with multiple mentees at once

### 4.3 Admin (Azim Sayyed / Leadership Team)
- Goal: Full visibility into community health, manage events, approve registrations
- Pain: Manual data collection; no unified analytics view

---

## 5. Scope

### In Scope (MVP)
- Member registration with OTP email verification
- Role-based access: MEMBER, MENTOR, ADMIN
- Member directory with WhatsApp deep-link integration
- Task management system with status tracking
- AI chatbot (Achibot) powered by Groq API
- Admin dashboard with analytics
- Event management (create, view, register)
- Profile management with photo upload

### Out of Scope (Post-MVP)
- Mobile native apps (iOS / Android)
- Payment gateway integration
- Certificate generation
- Video call / live session hosting
- Multi-language support (Marathi/Hindi)
- FLP (Forever Living Products) business module

---

## 6. Features

### 6.1 Authentication & Onboarding
- **Registration:** Full name, email, phone, city, referral
- **OTP Verification:** Email OTP via Resend API (6-digit, 10-min expiry)
- **Login:** Email + password with JWT (HTTP-only cookie, 7-day expiry)
- **Password Reset:** Email-based OTP flow
- **Role Assignment:** Default MEMBER; ADMIN manually promotes to MENTOR/ADMIN

### 6.2 Member Directory
- Searchable, filterable list of all active members
- Member cards: name, photo, city, WhatsApp button (wa.me deep link)
- Pagination (20 per page)
- Filter by city, join date, status

### 6.3 Task Management
- Admin/Mentor creates tasks with: title, description, due date, assigned members
- Members: view assigned tasks, update status (Pending → In Progress → Completed)
- Progress bar visualization per member
- Overdue task highlighting
- Mentor can add feedback comments on task completion

### 6.4 AI Chatbot — Achibot
- Powered by Groq API (Llama 3.3 70B model)
- System prompt seeded with club-specific knowledge:
  - About Achievers Club, its programs, FLP
  - FAQs about membership, events, tasks
  - Contact details and escalation paths
- Persistent conversation per session
- Fallback: "Contact mentor or admin" for unknown queries
- Available on all authenticated pages via floating widget

### 6.5 Dashboards

**Member Dashboard**
- Tasks overview (pending / in progress / completed counts)
- Upcoming events
- Quick links: directory, chatbot, profile

**Mentor Dashboard**
- List of assigned mentees with task completion rates
- Overdue tasks across all mentees
- Quick message link per mentee

**Admin Dashboard**
- Total members, mentors, tasks, events (KPI cards)
- New registrations (last 7 days) — bar chart
- Task completion rate — donut chart
- Recent activity feed
- Quick actions: approve member, create task, create event

### 6.6 Event Management
- Admin creates events: title, description, date/time, venue, capacity
- Members register for events (one-click)
- Member sees registered events in dashboard
- Admin sees attendee list per event

### 6.7 Profile Management
- Edit: name, phone, city, bio
- Profile photo upload (stored via Supabase Storage)
- View own task history and event history

---

## 7. Non-Functional Requirements

| Requirement | Specification |
|---|---|
| Performance | Page load < 2s on 4G |
| Uptime | 99.5% (Vercel SLA) |
| Mobile Responsive | All breakpoints: 320px → 1440px |
| Security | HTTPS enforced, parameterized SQL, HTTP-only cookies |
| Accessibility | WCAG 2.1 AA (keyboard nav, contrast ratios) |
| Browser Support | Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ |

---

## 8. Constraints

- Budget: ₹5,000 initial advance (₹60,000 total)
- Timeline: 27 working days
- Hosting: Free tier (Vercel + TiDB Cloud) initially
- Developer: Solo (Swayam Jadhav)
- Client must provide: logo files, official content, third-party account access

---

## 9. Stakeholders

| Name | Role | Responsibility |
|---|---|---|
| Azim Sayyed | Founder / Authorized Signatory | Final approval, content, stamp |
| Achievers Club Team | Core Users | UAT, feedback |
| Swayam Jadhav | Developer | Design, build, deploy |

---

## 10. Timeline Summary

| Phase | Duration |
|---|---|
| Requirements & DB Design | 3 days |
| Backend API Development | 7 days |
| Frontend UI Development | 10 days |
| Integration & Testing | 5 days |
| Deployment & Handover | 2 days |
| **Total** | **27 days** |