# SpiderQueens Project Documentation

## Executive Overview
**SpiderQueens** is a global competition and discovery platform for female Spider-Verse cosplay creators. The application allows cosplayers to submit entries, gain votes from fans, compete in monthly/weekly competitions for cash prizes and titles, and track real-time rankings on global leaderboards.

---

## 1. Directory & Folder Structure

```
/
├── .env.example                       # Environment variable definitions (APP_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── package.json                       # Project configuration, dependencies (React 18, Vite, Lucide-React, Supabase JS SDK)
├── metadata.json                      # Application metadata and frame permissions
├── README.md                          # General project readme
├── PROJECT_DOCUMENTATION.md           # Full technical and architectural reference documentation
├── src/
│   ├── main.tsx                       # Main entry point mounting React root
│   ├── App.tsx                        # Master layout controller, view routing, global state, and modal management
│   ├── types.ts                       # Shared TypeScript interfaces, types, and enums
│   ├── vite-env.d.ts                  # Vite client type declarations and static image import definitions
│   ├── index.css                      # Global styles & Tailwind CSS imports
│   ├── assets/                        # Static assets and generated cosplay images
│   ├── components/                    # UI Components
│   │   ├── Header.tsx                 # Desktop sticky navigation bar with language selector & Super Vote badge
│   │   ├── MobileNav.tsx              # Bottom navigation bar for mobile touch screens
│   │   ├── LandingPage.tsx            # Hero landing section, CTA banners, featured queens, and prize overview
│   │   ├── FeedPage.tsx               # Main contestant discovery feed with search, category/country filters, & view modes
│   │   ├── ContestantCard.tsx         # Reusable card component for rendering contestant info, votes, & voting actions
│   │   ├── LeaderboardPage.tsx        # Real-time rankings podium (#1, #2, #3), full ranking table, and Hall of Fame
│   │   ├── WeeklyCompetitionsPage.tsx # Monthly/weekly competition hub, live countdown timer, and archive
│   │   ├── UploadPage.tsx             # Cosplay submission form with live image preview
│   │   ├── ProfilePage.tsx            # User profile dashboard displaying submission statuses and Super Vote balance
│   │   ├── AdminDashboard.tsx         # Admin moderation dashboard for reviewing, approving, rejecting, or deleting entries
│   │   ├── AdminLoginModal.tsx        # Password-protected dialog modal for accessing admin controls
│   │   ├── SuperVoteModal.tsx         # Modal dialog for purchasing Super Vote packages and executing boosted votes
│   │   ├── MonetizationBanners.tsx    # Sponsored partner banners & affiliate offer slots
│   │   ├── DatabaseSchemaView.tsx     # In-app SQL editor viewer & Supabase connection setup utility
│   │   └── PwaPrompt.tsx              # Progressive Web App installation banner prompt
│   ├── database/
│   │   └── schema.sql                 # PostgreSQL database schema script for Supabase tables & RLS policies
│   ├── i18n/
│   │   ├── LanguageContext.tsx        # React Context providing global i18n language state (TR / EN)
│   │   └── translations.ts            # Translation dictionary for Turkish and English localizations
│   ├── lib/
│   │   └── supabase.ts                # Primary Supabase client initialization, env config check, & connection test runner
│   ├── services/
│   │   └── spiderService.ts           # Business logic layer, local storage state persistence, and mock data provider
│   └── supabase/
│       └── client.ts                  # Re-export bridge for Supabase client & runtime credential management
```

---

## 2. Pages & View Routes

The application uses state-based tab routing (`activeTab`) managed within `src/App.tsx`:

| Tab Key | Page Title | Description |
| :--- | :--- | :--- |
| `landing` | **Home / Landing Page** | Hero section with high-impact visuals, CTA buttons, featured queens carousel, monthly prize breakdown, and sponsor highlights. |
| `feed` | **Contestant Feed** | Searchable grid/stories feed displaying approved cosplayers. Filterable by country, cosplay category, and sort order. |
| `leaderboard` | **Leaderboard & Hall of Fame** | Real-time standings with top 3 podium spotlight (1st, 2nd, 3rd) and past weekly/monthly competition winners archive. |
| `competitions` | **Competitions Hub** | Active monthly competition page featuring live countdown timer (Days, Hours, Minutes, Seconds), rules, and prize info. |
| `upload` | **Cosplay Submission** | Form for cosplayers to upload and submit their Spider-Verse cosplay entries for admin moderation. |
| `profile` | **User Profile** | User dashboard showing profile details, Super Vote balance, and submitted cosplay entries with live status tags. |
| `admin` | **Admin Moderation Dashboard** | Password-protected moderation page for approving/rejecting submissions, managing content, and crowning winners. |

---

## 3. Detailed Component Breakdown

### Core Layout Components
* **`Header.tsx`**: Top navigation header featuring SpiderQueens branding logo, navigation tabs, i18n language toggle (`TR` / `EN`), Super Vote token counter button, and Admin login entry trigger.
* **`MobileNav.tsx`**: Mobile-optimized bottom navigation drawer bar fixed at the bottom of touch screens for rapid tab switching (`Home`, `Feed`, `Upload`, `Leaderboard`, `Profile`).
* **`MonetizationBanners.tsx`**: Reusable banner container displaying sponsored Spider-Verse partner brands, gear discounts, and affiliate offers.
* **`PwaPrompt.tsx`**: Banner component prompting mobile browser users to add SpiderQueens as a Progressive Web App (PWA) to their home screen.

### Page Views
* **`LandingPage.tsx`**: Visual hero section with dynamic calls-to-action (`Join Competition`, `Vote Now`, `View Leaderboard`), top featured queens showcase, competition rules, and prize overview ($1,000 cash + Spider Crown).
* **`FeedPage.tsx`**: Interactive discovery feed with real-time text search, category filters (`Spider-Gwen`, `Silk`, `Spider-Woman`, `Venomized`, `Spider-Girl`, `Original Spider-Queen`), country filter, sort options (Most Votes / Newest), and view mode toggles (`Grid` vs `Stories/Reels`).
* **`ContestantCard.tsx`**: Card component displaying cosplay photo, category tag, country flag, bio, vote count, standard vote button (1 vote/day rule), and Super Vote boost trigger.
* **`LeaderboardPage.tsx`**: High-impact leaderboard page displaying top 3 podium positions (#1 Leader with gold border, #2 Silver, #3 Bronze), full rankings table (#4 to #N), and past weekly winners archive.
* **`WeeklyCompetitionsPage.tsx`**: Competition status page featuring live countdown timer, competition description, prize pool breakdown, and rules.
* **`UploadPage.tsx`**: Multi-field submission page allowing cosplayers to submit entry details and preview their contestant card in real-time before submitting.
* **`ProfilePage.tsx`**: Personal user dashboard displaying current role (`User`, `Contestant`, `Admin`), token balance, and submission history with color-coded status badges (`APPROVED`, `PENDING MODERATION`, `REJECTED`).
* **`AdminDashboard.tsx`**: Moderation control center listing pending, approved, and rejected submissions with quick actions to approve, reject with reason, delete content, crown weekly winners, or update n8n webhook settings.
* **`DatabaseSchemaView.tsx`**: Utility component displaying the complete Supabase PostgreSQL SQL schema script and manual configuration instructions.

### Modals & Dialogs
* **`AdminLoginModal.tsx`**: Modal dialog requiring password verification (`spiderqueen2026`) to gain access to the Admin Dashboard.
* **`SuperVoteModal.tsx`**: Interstitial modal dialog allowing users to purchase Super Vote token packages ($1.99 / 10 tokens, $4.99 / 30 tokens, $9.99 / 75 tokens) and cast +10 boosted votes for a preselected contestant.

---

## 4. System Features & Workflows

### 4.1 Voting System
1. **Free Standard Vote**:
   - Each user can cast **1 free vote per day** per contestant.
   - Enforced client-side via `hasUserVotedToday` checking `YYYY-MM-DD` timestamps.
   - Updates contestant `voteCount` by +1 immediately.
2. **Super Vote (Boosted Vote)**:
   - Super Votes cost tokens from the user's `superVoteBalance`.
   - Each Super Vote applies **+10 votes** instantly to the contestant's total count.
   - Users can acquire tokens via the simulated Super Vote token shop modal.

### 4.2 Cosplay Upload & Moderation Workflow
1. Cosplayer navigates to the **Upload** page (`activeTab === "upload"`).
2. Fills out submission form (Display Name, Username, Instagram URL, Country, Category, Bio, Profile Photo, Cosplay Image URL).
3. Live preview updates on the right column.
4. On submission:
   - Form creates a new `Contestant` record with `status: "pending"` (or `"approved"` if `autoApprove` setting is enabled in Admin).
   - User's role updates from `"user"` to `"contestant"`.
   - Entry appears immediately in the user's **Profile Page** with a `PENDING MODERATION` badge.
5. Admin opens **Admin Dashboard** to review pending submissions:
   - **Approve**: Changes status to `"approved"`, making the entry visible on the main Feed, Leaderboard, and Landing Page.
   - **Reject**: Changes status to `"rejected"` and attaches an optional rejection reason string.
   - **Delete**: Permanently removes the submission from storage.

### 4.3 Admin & Crown Winner System
- Protected via `AdminLoginModal` requiring password `spiderqueen2026`.
- Admins can trigger `crownWeeklyWinner(contestantId)` to record the top contestant into the `winners` archive (Hall of Fame) for the current month/week.

---

## 5. Existing Forms, Dialogs & Modals

| Interface Name | Type | Key Fields / Options |
| :--- | :--- | :--- |
| **Cosplay Upload Form** | Form | `displayName`, `username`, `instagramUrl`, `country`, `category`, `bio`, `profilePhotoUrl`, `cosplayPhotoUrl` |
| **Admin Login Dialog** | Modal | `password` (Default: `spiderqueen2026`) |
| **Super Vote Purchase & Cast** | Modal | Token packages ($1.99 / 10, $4.99 / 30, $9.99 / 75) & Contestant dropdown selector |
| **Rejection Reason Form** | Modal / Inline | Rejection reason text input for admin moderation |
| **n8n Webhook Settings** | Form | `webhookUrl`, `enabled`, `telegramNotify`, `autoApprove` |

---

## 6. Data Models & TypeScript Types

The application types are strictly defined in `src/types.ts`:

### User Roles & Statuses
```typescript
export type UserRole = "user" | "contestant" | "admin";
export type UploadStatus = "pending" | "approved" | "rejected";
export type CosplayCategory =
  | "Spider-Gwen"
  | "Silk"
  | "Spider-Woman"
  | "Venomized"
  | "Spider-Girl"
  | "Original Spider-Queen";
```

### Key Entities
```typescript
export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string;
  superVoteBalance: number;
  country: string;
  createdAt: string;
}

export interface Contestant {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  instagramUrl: string;
  country: string;
  countryCode: string;
  profilePhotoUrl: string;
  cosplayPhotoUrl: string;
  category: CosplayCategory;
  bio: string;
  status: UploadStatus;
  rejectionReason?: string;
  voteCount: number;
  superVoteCount: number;
  competitionId: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Vote {
  id: string;
  userId: string;
  contestantId: string;
  createdAt: string;
}

export interface SuperVote {
  id: string;
  userId: string;
  contestantId: string;
  amount: number;
  createdAt: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "ended" | "upcoming";
  prizePool: string;
  weekNumber: number;
}

export interface Winner {
  id: string;
  competitionId: string;
  competitionTitle: string;
  contestantId: string;
  displayName: string;
  country: string;
  cosplayPhotoUrl: string;
  totalVotes: number;
  weekNumber: number;
  crownedAt: string;
}
```

---

## 7. Current State Persistence vs. Missing Backend Functionality

Currently, the core application logic in `src/services/spiderService.ts` relies on `localStorage` for client-side persistence and seed data initialization (`sq_contestants_v2`, `sq_votes_v2`, `sq_super_votes_v2`, `sq_current_user_v2`).

### Configured Supabase Infrastructure
- Supabase JS SDK is installed and configured in `src/lib/supabase.ts` and `src/supabase/client.ts`.
- Environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) are defined and tested via `testSupabaseConnection()` on app startup.
- Full SQL database schema script is available in `src/database/schema.sql`.

### Missing Backend Functionality (To Be Connected to Supabase)
1. **Database Tables & Data Sync**:
   - `users`, `competitions`, `contestants`, `votes`, `super_votes`, and `winners` tables need to be created in Supabase PostgreSQL database.
   - `spiderService.ts` methods (`getApprovedContestants`, `submitContestant`, `castVote`, `castSuperVote`, `approveContestant`) should be upgraded to perform live SQL queries (`supabase.from('contestants').select(...)`) instead of relying solely on local browser storage.
2. **User Authentication (Supabase Auth)**:
   - Registration & Login flows (Email/Password or OAuth like Google/Discord/Instagram).
   - Session persistence and RLS (Row Level Security) validation for user profiles and roles.
3. **File Storage (Supabase Storage Bucket)**:
   - Image uploads currently rely on external image URL links. A dedicated Supabase storage bucket (`cosplays`) is needed to host image uploads directly from file inputs.
4. **Server-Side Authorization & RLS Enforcement**:
   - Enforce row-level security on votes (prevent duplicate vote spoofing) and admin moderation actions at the database level.
5. **Real-time Webhook Integration (n8n & Telegram)**:
   - Triggering active n8n HTTP webhooks upon new contestant uploads for automated Telegram notifications and AI image moderation checks.
