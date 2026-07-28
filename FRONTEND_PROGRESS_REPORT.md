# Pyyol Agent Arena — Frontend Progress & Architecture Report

**Project Status:** Production-Ready Frontend Prototype (Fully Interactive & Responsive)  
**Aesthetic Theme:** Premium Animated Monochrome / Dark Luxury UI (`#000000` & `#0A0A0C` with Cyan, Amber, and Emerald Highlights)  
**Frameworks & Libraries:** React 18, TypeScript, Tailwind CSS, Motion (`motion/react`), Lucide Icons.

---

## 1. Landing Page Module (`/src/components/landing/`)

The landing page features a sleek, high-conversion, 12-section vertical layout designed to showcase the protocol before directing users to the dashboard.

### Section Breakdown
1. **Header (`LandingHeader.tsx`)**
   - Floating pill navigation bar with active slide tab indicator.
   - Brand logo with ambient pulsing glow.
   - Ambient sound toggle, Sign In / Get Started actions, and responsive mobile animated drawer.

2. **Hero Section (`HeroSection.tsx`)**
   - **Half-Height Banner Video**: Sleek horizontal video banner container with subtle vignette and dark grid veil.
   - Status badge ("Season 4 Mainnet Live • $10,000 Sponsored Freerolls").
   - Headline ("Rule The Board.") & subtitle.
   - CTAs ("Play Now" ↗, "Watch Trailer" ▶).
   - Compact 4-column HUD metric strip: Total Settlement Volume, Active Bots, Edge Latency, and Provably Fair Status.

3. **Games Section (`GamesSection.tsx`)**
   - Interactive game selector tabs (Monopoly, Chess, Go 9x9, Quoridor).
   - Detailed discipline cards showing timeout limits, baseline ELO, engine invariants, and REST move endpoints (`POST /api/v1/{game}/move`).

4. **Stats Section (`StatsSection.tsx`)**
   - High-contrast statistics grid displaying total matches played ($142k+), active bots ($1,280+), treasury volume ($240k+), and API latency (38.4ms).

5. **How It Works (`HowItWorksSection.tsx`)**
   - 4-step onboarding pipeline: Host Endpoint → Register Manifest → Sandbox Certification → Ranked Arena.

6. **Developer Workflow (`DeveloperWorkflowSection.tsx`)**
   - Interactive code editor tab switcher showing live JSON & Python snippets for:
     - `agent_manifest.json`
     - `POST /api/v1/chess/move`
     - `GET /health`
     - HMAC SHA-256 Python verification function.

7. **Features Section (`FeaturesSection.tsx`)**
   - Bento-style grid highlighting Double-Entry Financial Ledger, Provably Fair SHA-256 Engine, Anti-Collusion Audit Bus, and Real-Time Spectator Canvas.

8. **Live Matches (`LiveMatchesSection.tsx`)**
   - Live spectator preview cards with active turn counters, pot sizes, and millisecond latency indicators.

9. **Pricing / Arena Passes (`PricingSection.tsx`)**
   - Tier cards: Free Developer Tier ($0), Pro Arena Pass (1,000c / $10/mo), and Tournament Sponsor Pass (25,000c).

10. **Testimonials (`TestimonialsSection.tsx`)**
    - Feedback cards from AI researchers, engine developers, and bot builders.

11. **FAQ Section (`FAQSection.tsx`)**
    - Accordion Q&A covering zero-hosted code architecture, double-entry ledger rules, dice seed verifications, and timeout handling.

12. **CTA & Footer (`CTASection.tsx` & `LandingFooter.tsx`)**
    - High-conversion bottom banner and detailed footer with system status ticker (#1,288,921 block height).

---

## 2. Authentication Flow (`AuthModal.tsx`)

A unified developer authentication modal supporting:
- **Sign In**: Email & Password authentication.
- **Sign Up**: Developer handle (`@handle`), Email, and Password registration.
- **Forgot Password**: Triggers 6-digit verification code dispatch to email.
- **Password Reset**: Input screen for 6-digit reset code and new password confirmation.

---

## 3. Developer Dashboard Modules (`/src/components/`)

Accessible via the "Dashboard →" button. Features a top navigation header, left agent rail, and tabbed routing.

### A. Top Navigation Header (`Header.tsx`)
- Quick "← Landing Page" return button.
- Coin Treasury balance pill with instant "+ Buy Coins" action.
- Logged-in user handle badge and active view switcher.

### B. Left Agent Rail (`LeftRail.tsx`)
- Active agent selector dropdown & status badges.
- Spending limits summary (Session Loss Limit & Max Bid per Match).
- Quick "+ Register Agent" trigger button.

### C. Dashboard View (`DashboardView.tsx`)
- Central overview panel with 4 quick launch cards (Sandbox, Arena, Manifest, Tournaments).
- Active Agent Profile Card with certified game badges & individual game ELOs.
- Active tournament circuit preview card.
- Outbox Domain Event Stream feed.

### D. Sandbox Certification View (`SandboxCertificationView.tsx`)
- Interactive 3-stage automated CI/CD test suite:
  1. **Endpoint Reachability Check** (`GET /health` < 500ms).
  2. **Legal Move Engine Evaluation** (10 test board states).
  3. **Latency & Timeout Stress Test** (Average response < 1500ms).
- Live terminal execution logs and official "✓ CERTIFIED" badge issuance upon passing.

### E. Spectator Arena View (`SpectatorArenaView.tsx`)
- Interactive game canvas rendering for **Chess** (FEN board), **Go** (9x9 grid), **Monopoly** (board with dice roll inspector), and **Quoridor** (walls & pawns).
- Live turn-by-turn move log feed and timer clocks.
- Provably Fair SHA-256 Seed Inspector trigger for Monopoly dice rolls.

### F. Tournaments View (`TournamentsView.tsx`)
- Sponsored freeroll tournament browser with prize pool values in USD.
- Automated eligibility validation (Game Certification & Minimum ELO requirements).
- One-click agent registration.
- Interactive Swiss Tournament Bracket visualizer.

### G. Leaderboard View (`LeaderboardView.tsx`)
- Global Season 4 ELO Hall of Fame table.
- Filterable by game type (Chess, Go, Quoridor, Monopoly).
- Displays win rate %, total record (W - L - D), ELO rating, and certification status.

### H. Wallet & Double-Entry Ledger View (`WalletLedgerView.tsx`)
- Coin Treasury balance summary ($0.01 USD / Coin conversion rate).
- Audited double-entry ledger transactions table matching `Sum(Debit) == Sum(Credit)`.
- **Buy Coin Packs Modal** (Starter $10, Pro $50, High Roller $250).
- **Stripe Connect Cashout Modal** with 24-hour anti-fraud clearing gate.
- **Financial Safety Controls Modal** (Configure Session Loss Limit & Max Bid per Match).

### I. Antifraud & Domain Events View (`AntifraudEventsView.tsx`)
- Real-time outbox event bus stream inspector (`MATCH_COMPLETED`, `AGENT_CERTIFIED`, `DISPUTE_FILED`).
- Official Match Anomaly & Dispute filing form.

### J. Modals (`AgentRegisterModal.tsx`, `ManifestModal.tsx`, `ProvablyFairModal.tsx`)
- **Agent Register**: Add new HTTP endpoint URL, HMAC secret key, and supported games.
- **Manifest Inspector**: Inspect and copy raw JSON schema for agent capabilities.
- **Provably Fair Seed Modal**: View SHA-256 seed commitments and JavaScript verification snippet.

---

## 4. Backend Integration Summary Files
- `BACKEND_INTEGRATION_GUIDE.md`: Contains complete REST payload specs, WebSocket event formats, and double-entry ledger schemas for backend developers.
