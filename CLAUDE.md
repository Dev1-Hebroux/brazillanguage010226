# CLAUDE.md - Project Context for Claude Code

## Project Overview

**Name:** Horizonte Café - English for Impact
**Type:** Full-stack English language learning platform
**Location:** Brasília, Brazil
**Organization:** RCCG (The Redeemed Christian Church of God) volunteer initiative

### Mission
A free, inclusive English learning community that helps people grow in confidence and opportunity through practical English education. The platform combines structured cohorts, social meetups ("English Café"), and community support.

### Core Values
1. **Welcome first** - Inclusive, non-judgmental environment
2. **Progress over perfection** - Mistakes are part of learning
3. **Practice together** - Language is for connection
4. **Respect always** - Dignity and kindness
5. **Faith is optional** - Christian initiative but open to everyone

---

## Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Routing:** Wouter (lightweight client-side routing)
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui (built on Radix UI)
- **State Management:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **Framework:** Express 4 with TypeScript
- **ORM:** Drizzle ORM with PostgreSQL
- **Auth:** Passport.js with local strategy
- **Sessions:** express-session

### Database
- PostgreSQL 16 with Drizzle ORM
- Migration tool: Drizzle Kit

---

## Project Structure

```
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── Cohorts.tsx         # 3 learning tracks
│   │   │   ├── Events.tsx          # English Café meetups
│   │   │   ├── Resources.tsx       # Placement tool, lessons
│   │   │   ├── Community.tsx       # Values & rules
│   │   │   └── CohortDashboard.tsx # Student dashboard
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   └── layout/Layout.tsx   # Main layout
│   │   ├── lib/
│   │   │   ├── i18n.tsx            # Bilingual support (EN/PT)
│   │   │   ├── queryClient.ts      # React Query config
│   │   │   └── utils.ts            # Utilities
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── App.tsx                 # Router setup
│   │   └── main.tsx                # Entry point
├── server/                          # Express backend
│   ├── index.ts                     # Server entry + middleware
│   ├── routes.ts                    # API routes (to be implemented)
│   ├── storage.ts                   # Storage interface
│   └── vite.ts                      # Dev server setup
├── shared/                          # Shared code
│   └── schema.ts                    # Drizzle database schema
└── attached_assets/                 # Images and resources
```

---

## Current Status

### Completed
- Full frontend with 6 public pages + dashboard
- Responsive design (mobile, tablet, desktop)
- Bilingual UI (English / Portuguese)
- Beautiful marketing pages with animations
- shadcn/ui component library integrated
- Language switcher functionality
- Curriculum map with week-by-week breakdown
- Express server infrastructure
- Database schema defined (users table)
- TypeScript strict mode enabled

### Needs Implementation

**Priority 1 - MVP Critical:**
- [ ] Database connection & Drizzle ORM integration
- [ ] User authentication endpoints (login, signup, logout)
- [ ] Session management with Passport.js
- [ ] API endpoints for:
  - User registration/login
  - Cohort enrollment
  - Student progress tracking
  - Lesson completion
  - Event registration

**Priority 2 - Content:**
- [ ] Admin dashboard for content management
- [ ] Lesson content management system
- [ ] Student group assignments
- [ ] Progress tracking and analytics

**Priority 3 - Advanced:**
- [ ] Voice/audio recording for daily practice
- [ ] Email notifications
- [ ] Payment integration (future)

---

## Design System

### Colors
- **Primary Blue:** Used for main actions, links
- **Green:** Success states, progress indicators
- **Yellow/Orange:** Highlights, warnings
- **Gradients:** Hero sections use gradient text overlays

### Typography
- System font stack via Tailwind
- Responsive text sizing

### Components
All UI components are from shadcn/ui. Find them in `client/src/components/ui/`:
- Button, Card, Dialog, Sheet, Tabs, Badge
- Input, Select, Checkbox, Radio
- Toast, Alert, Progress
- And 20+ more

---

## Code Patterns

### Internationalization (i18n)
```tsx
import { useTranslation } from '@/lib/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

Translations are in `client/src/lib/i18n.tsx`. Add new keys to the `translations` object.

### API Requests (React Query)
```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(r => r.json())
});

// Mutate data
const mutation = useMutation({
  mutationFn: (data) => fetch('/api/users', { method: 'POST', body: JSON.stringify(data) })
});
```

### Form Handling
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const form = useForm({
  resolver: zodResolver(schema)
});
```

### Styling with Tailwind
```tsx
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  isActive && "active-classes"
)} />
```

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# TypeScript check
npm run check

# Push database migrations
npm run db:push
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `client/src/lib/i18n.tsx` | All translations (EN/PT) |
| `client/src/pages/CohortDashboard.tsx` | Student learning experience |
| `shared/schema.ts` | Database schema (Drizzle) |
| `server/routes.ts` | API endpoints (implement here) |
| `server/storage.ts` | Data storage interface |

---

## Business Context

### Three Learning Tracks
1. **Foundations (A0-A1)** - Complete beginners, 8 weeks
2. **Confidence (A2-B1)** - Low-intermediate, 8 weeks
3. **English Café** - Community practice meetups

### Weekly Structure
- **Days 1-5:** Daily micro-lessons (vocabulary, grammar, listening)
- **Day 6:** Conversation circle (WhatsApp group practice)
- **Day 7:** Rest + English Café meetup (in-person)

### Meetup Location
Edifício Boulevard Centro Empresarial, SDS Bloco P, Loja 43, Asa Sul, Brasília - DF

---

## Environment Variables

```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
```

---

## Notes for Claude Code

1. **Storage is in-memory** - The `storage.ts` file uses MemStorage. Database integration needed.
2. **Routes are empty** - `server/routes.ts` has the structure but no endpoints implemented.
3. **Forms don't submit** - Frontend forms exist but backend handlers are not connected.
4. **WhatsApp links** - Currently static links, no actual API integration.
5. **Assets folder** - `attached_assets/` contains marketing images and logos.

When implementing features, maintain the existing patterns:
- Use TypeScript strict mode
- Follow shadcn/ui component patterns
- Use React Query for server state
- Add translations to i18n.tsx for any new UI text
- Keep the bilingual (EN/PT) support working
