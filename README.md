ChatGPT a dit :
BOOKSHOW · Interactive Library (React + TypeScript + Tailwind)

A modern, glass-morphism library app for exploring books and authors. Includes fast, scoped search; keyboard-navigable tabs; Google Books quick-fill; and a refined neon-night theme

Table of Contents

Overview

Key Features

Screenshots

Architecture

Tech Stack

Getting Started

Configuration

Available Scripts

Project Structure

Services & Data Flow

Accessibility

Troubleshooting

Roadmap

License

Overview

BOOKSHOW is a lightweight library dashboard that demonstrates clean component design, a thoughtful UI system (glass panels, gradient glows, OKLCH tokens), and pragmatic client-side data handling (optimistic updates with rollback). It is production-ready for small collections or can be used as a reference UI for larger projects.

Key Features

Polished UI System

Neon glass aesthetic with OKLCH color tokens and reusable utilities.

Responsive layout with a hero, divider band, and raised content surface.

Smart Navigation

Tablist with keyboard controls (Left/Right, Home/End).

Navbar search that filters both books and authors.

Book & Author Management

Book grid with cover images, author labels, and delete (optimistic).

Author cards with counts, hover states, and safe delete flow.

Create Flows

Add Book: Google Books quick-fill by typing title (prefills year, author, ISBN, cover).

Add Author: Validated form with country selector.

Type-Safe Services

DTOs for data contracts and a clean service layer (authorsService, booksService, googleBooksService).

Screenshots

Replace with your own images or GIFs.

Home / Books
[screenshot here]

Authors
[screenshot here]

Add Book (Google quick-fill)
[screenshot here]

Architecture

React + TS components with a small, clear state model.

Service layer abstracts REST calls.

Optimistic UI: delete operations update the UI immediately and rollback on error.

Tailwind v4 with @theme inline and a custom design system:

Utilities: glass-panel, bg-starfield, animate-float, twinkle.

Components: .tab, .tab-active, .glass-input, .btn-primary, .btn-ghost, .form-card, .section-divider.

Tech Stack

UI: React 18, Tailwind CSS v4, TypeScript

Build: Vite

Data: REST services (authors/books), Google Books (public endpoint, optional key)

Styling: OKLCH color space, glass-morphism patterns

Getting Started
# 1) Install
pnpm install      # or: yarn / npm install

# 2) Run development server
pnpm dev          # or: yarn dev / npm run dev

# 3) Build & preview
pnpm build
pnpm preview


Path aliases: @ → src. Example: import Navbar from "@/components/Navbar";.

Configuration
Optional: Google Books API Key

Public search works without a key. If you have a key, create .env:

VITE_GOOGLE_BOOKS_API_KEY=your_key_here


The service reads the key if present and includes it in requests.

Backend Endpoints

Update base URLs in:

src/services/authorsService.ts

src/services/booksService.ts

Available Scripts
pnpm dev         # Start Vite dev server
pnpm build       # Production build
pnpm preview     # Preview built assets
pnpm lint        # If ESLint is configured
pnpm format      # If Prettier is configured

Project Structure
src/
  components/
    AuthorCard.tsx
    BookCard.tsx
    HeroSection.tsx
    Navbar.tsx
    SectionDivider.tsx
    tabs/
      AddAuthorForm.tsx
      AddBookForm.tsx
      NavogationTabs.tsx
  services/
    authorsService.ts
    booksService.ts
    googleBooksService.ts
  types/
    Authors.ts
    dtos.ts
  App.tsx
  main.tsx
index.css          # Tailwind theme, utilities, component classes

Services & Data Flow

Authors

getAll(): Promise<AuthorDto[]>

create({ name }): Promise<AuthorDto>

remove(id): Promise<void>

Books

getAll(): Promise<BookDto[]>

create({ title, year, authorId? }): Promise<BookDto>

remove(id): Promise<void>

Google Books

searchBooksByTitle(q): Promise<GoogleBook[]>
Returns { title, author, publishedDate, isbn, thumbnail } for quick-fill.

Optimistic Updates

Deletes remove items from state immediately.

On failure, UI rolls back to the previous snapshot and shows an error.

Accessibility

Proper roles: role="tablist" and role="tab" with aria-selected and tabIndex.

Keyboard navigation: ArrowLeft, ArrowRight, Home, End.

Focus indicators: visible focus rings across interactive elements.

Color contrast: tuned OKLCH tokens for dark theme readability.

Troubleshooting

Unknown at rule @custom-variant / @utility:
This is an editor warning. Tailwind v4 processes these directives at build time. Ensure Tailwind v4 is installed and restart the dev server after CSS changes.

“Cannot apply unknown utility class ‘glass-panel’”:
Ensure glass-panel is defined under @layer utilities using @utility (already in index.css). Restart Vite.

Type mismatches in forms:

AddBookForm → onSubmit(book) includes UI-only fields (isbn, coverUrl, description).

AddAuthorForm → onSubmit(author: AuthorInput).
Verify prop signatures when customizing.

Roadmap

Edit flows (book/author)

Pagination + lazy image loading

Details modal with richer metadata

Toast notifications

Theming toggle (light/dark — tokens already prepared)

Tests (Vitest + React Testing Library / Playwright)