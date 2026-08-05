# Rules & Coding Conventions
## Achievers Portal — Achievers Club Nashik

**Version:** 1.0.0  
**Author:** Swayam Vijay Jadhav  
**Applies To:** All code in this repository

> These rules exist to keep the codebase consistent, predictable, and maintainable by a solo developer over the full project lifecycle. When in doubt: prefer clarity over cleverness.

---

## 1. Project Philosophy

- **One source of truth.** No duplicated logic. If something changes, it changes in one place.
- **Types everywhere.** Never use `any`. Every function has typed parameters and return types.
- **Fail loudly in development, gracefully in production.** Errors should be easy to debug locally and safe for users in prod.
- **Server-first.** Prefer server components and API routes over client-side fetching where possible.
- **Mobile-first.** Write mobile styles first, then scale up with Tailwind breakpoints.

---

## 2. File & Folder Naming

| Type | Convention | Example |
|---|---|---|
| React Components | PascalCase | `MemberCard.tsx` |
| Pages (App Router) | lowercase `page.tsx` | `app/dashboard/page.tsx` |
| API Routes | lowercase `route.ts` | `app/api/members/route.ts` |
| Utility files | camelCase | `lib/auth.ts` |
| Types file | `index.ts` in `/types` | `types/index.ts` |
| Hooks | `use` prefix, camelCase | `hooks/useMembers.ts` |
| CSS/styles | camelCase (Tailwind only) | — |

---

## 3. TypeScript Rules

```ts
// ✅ ALWAYS type function params and return types
async function getUserById(id: number): Promise<User | null> { }

// ❌ NEVER use `any`
function doSomething(data: any) { }        // banned
function doSomething(data: unknown) { }    // use unknown, then narrow

// ✅ Use interfaces for object shapes
interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
}

// ✅ Use enums or const maps for fixed values
type Role = 'MEMBER' | 'MENTOR' | 'ADMIN';
type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

// ✅ Use zod for runtime validation on API routes
import { z } from 'zod';
const RegisterSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## 4. API Route Rules

Every API route must follow this structure:

```ts
// app/api/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // 1. Auth check
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Role check (if needed)
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3. Input validation (for POST/PATCH)
    // const body = await req.json();
    // const parsed = Schema.safeParse(body);
    // if (!parsed.success) return NextResponse.json({ error: parsed.error }, { status: 400 });

    // 4. Business logic
    const members = await db.query('SELECT id, full_name, email FROM users WHERE is_active = 1');

    // 5. Response
    return NextResponse.json({ data: members });

  } catch (error) {
    console.error('[GET /api/members]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### API Response Shape (always consistent)
```ts
// Success
{ data: T, message?: string }

// Error
{ error: string, details?: unknown }

// Paginated
{ data: T[], meta: { total: number, page: number, limit: number } }
```

---

## 5. Database Rules

```ts
// ✅ ALWAYS use parameterized queries — no exceptions
const [rows] = await db.execute(
  'SELECT * FROM users WHERE email = ? AND is_active = 1',
  [email]
);

// ❌ NEVER interpolate user input into SQL
const rows = await db.query(`SELECT * FROM users WHERE email = '${email}'`); // SQL injection risk

// ✅ Use transactions for multi-step writes
const conn = await db.getConnection();
await conn.beginTransaction();
try {
  await conn.execute('INSERT INTO tasks ...', [...]);
  await conn.execute('INSERT INTO task_assignments ...', [...]);
  await conn.commit();
} catch (e) {
  await conn.rollback();
  throw e;
} finally {
  conn.release();
}
```

---

## 6. Authentication Rules

- JWT stored in **HTTP-only cookie only** — never localStorage, never sessionStorage
- Cookie settings: `httpOnly: true`, `secure: true` (prod), `sameSite: 'lax'`, `maxAge: 7 days`
- JWT payload contains only: `{ id, email, role }` — nothing sensitive
- Every protected API route calls `verifyAuth(req)` as the **first line**
- Passwords: bcrypt with **12 salt rounds** minimum
- OTPs: 6-digit numeric, **10-minute expiry**, single-use, deleted after use

---

## 7. Component Rules

```tsx
// ✅ Functional components only — no class components
// ✅ Named exports for all components
// ✅ Default export only for pages

// Component file structure:
// 1. Imports
// 2. Types/interfaces (local to this file)
// 3. Component function
// 4. Sub-components (if small, same file)
// 5. Export

// Example:
import { User } from '@/types';

interface MemberCardProps {
  member: User;
  onWhatsApp: (phone: string) => void;
}

export function MemberCard({ member, onWhatsApp }: MemberCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      {/* ... */}
    </div>
  );
}
```

---

## 8. Tailwind CSS Rules

- **Mobile-first always:** write base styles for mobile, add `md:` and `lg:` for larger screens
- **No inline styles** — everything in Tailwind classes
- **No custom CSS files** unless absolutely unavoidable (animations only)
- **Consistent spacing scale:** use Tailwind's default scale (4, 6, 8, 12, 16, 24...)
- **Color tokens:** only use the palette defined in `tailwind.config.ts` — no arbitrary hex values in JSX
- **Dark mode:** not in scope for MVP; do not add `dark:` variants yet

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 md:flex-row md:gap-8">

// ❌ Bad — arbitrary values, inline styles
<div style={{ padding: '24px' }} className="flex flex-col gap-[17px]">
```

---

## 9. Error Handling

```ts
// ✅ Always log errors with context
console.error('[CONTEXT] message', error);
// e.g. console.error('[POST /api/auth/register]', error)

// ✅ Never expose raw error messages to the client
return NextResponse.json({ error: 'Internal server error' }, { status: 500 });

// ✅ Use specific HTTP status codes
// 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized,
// 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error

// ✅ Client-side: always handle loading and error states
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

---

## 10. Git Conventions

### Branch Naming
```
feature/member-directory
fix/otp-expiry-bug
chore/update-dependencies
docs/add-api-readme
```

### Commit Messages (Conventional Commits)
```
feat: add member directory with WhatsApp integration
fix: correct OTP expiry not resetting on resend
chore: update groq SDK to latest
docs: add architecture diagram
style: fix mobile padding on dashboard cards
refactor: extract auth helpers into lib/auth.ts
test: add API tests for task assignment
```

### Workflow
1. Work on `feature/*` branch
2. Self-review diff before commit
3. Merge to `main` only when feature is complete and tested
4. Every merge to `main` triggers auto-deploy to Vercel

---

## 11. Environment Rules

- **Never commit `.env` files** — `.env` is gitignored
- Keep `.env.example` updated with all required keys (no values)
- Production secrets live in Vercel Dashboard → Environment Variables
- Use `NEXT_PUBLIC_` prefix only for values safe to expose to the browser

---

## 12. Forbidden Patterns

| Pattern | Why Forbidden |
|---|---|
| `any` type | Defeats TypeScript's purpose |
| String interpolation in SQL | SQL injection vector |
| JWT in localStorage | XSS risk |
| `console.log` left in production | Leaks info, pollutes logs |
| Direct `fetch` without error handling | Silent failures |
| Hardcoded secrets in source | Security violation |
| `!important` in CSS | Cascade nightmare |
| Nested ternaries | Unreadable |
| `useEffect` for data fetching | Use server components or SWR |