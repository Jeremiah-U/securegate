# SecureGate — Production-Grade Authentication System (Next.js 14)

## Role

You are a senior-level software engineer with deep expertise in scalable backend systems, authentication architecture, application security, and production engineering.

You strictly follow real-world engineering principles including:

- Murphy’s Law
- YAGNI
- Kerckhoffs's Principle
- Postel’s Law
- Defensive Programming
- Gall’s Law
- Principle of Least Surprise
- Technical Debt awareness
- Security by Design
- Least Privilege
- Fail Securely
- ORM abstraction awareness
- Boy Scout Rule

You do NOT overengineer.
You do NOT add features outside scope.
You build simple systems correctly first.

---

# Project

Build **SecureGate** — a standalone, production-ready authentication system using Next.js 14 App Router.

This is NOT a full SaaS app.

It is a focused authentication platform designed to isolate and study the auth layer used inside serious real-world applications.

The project must demonstrate:

- secure authentication flows
- production backend architecture
- secure token handling
- proper session management
- secure password storage
- protected route handling
- brute-force protection
- defensive coding practices
- clean scalable folder architecture

The final system must feel deployable to production.

---

# Core Features

## 1. Sign Up

Build a registration flow with:

- full server-side validation using Zod
- email validation
- strong password rules
- password strength indicator on frontend
- duplicate email prevention
- secure password hashing using bcryptjs
- email verification requirement before account access

After signup:

- generate secure verification token
- send verification email using Resend + React Email

---

## 2. Login

Build secure login flow with:

- email + password authentication
- NextAuth/Auth.js credentials provider
- secure session handling
- generic error messages
- no leaking whether email or password was incorrect
- reject unverified users

Sessions must:

- use JWT or database sessions properly
- be production-safe
- support logout cleanly

---

## 3. Email Verification

Build full verification flow:

- token stored in database
- token expiration enforced
- verification route validates token securely
- user marked verified in database
- token invalidated after use
- expired/invalid token handling

---

## 4. Protected Dashboard

Build dashboard page accessible ONLY to:

- authenticated users
- verified users

Requirements:

- airtight redirect logic
- middleware protection
- no client-side-only security
- unauthorized users redirected safely

---

## 5. Forgot Password

Build secure password reset system:

- request reset by email
- generate reset token
- send reset email
- reset form validates token
- token expires
- token invalidated after successful reset
- old passwords no longer usable

---

## 6. Rate Limiting

Protect authentication endpoints:

- brute-force protection on login
- Upstash rate limiting OR custom middleware
- prevent abuse/spam
- configurable thresholds

---

## 7. Logout

Implement secure logout:

- session destruction
- cookie invalidation
- redirect to login

---

# Tech Stack

Use EXACTLY these technologies:

| Area             | Tech                                   |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 14 App Router                  |
| Language         | TypeScript                             |
| Database         | PostgreSQL                             |
| ORM              | Prisma                                 |
| Auth             | NextAuth.js / Auth.js                  |
| Password Hashing | bcryptjs                               |
| Validation       | Zod                                    |
| Email            | Resend                                 |
| Email Templates  | React Email                            |
| Rate Limiting    | Upstash Ratelimit or custom middleware |
| Deployment       | Vercel                                 |
| Version Control  | GitHub                                 |

---

# Database Design

Design proper Prisma schema including:

- User table
- VerificationToken table
- PasswordResetToken table
- Session table if needed
- proper indexes
- proper unique constraints
- expiration timestamps
- relational integrity

Passwords must NEVER be stored unhashed.

---

# Security Requirements

Critical requirements:

- never trust client input
- validate everything server-side
- sanitize inputs
- prevent timing leaks where possible
- secure token generation using crypto
- use environment variables correctly
- avoid sensitive error leakage
- avoid exposing internal implementation details
- prevent replay attacks
- invalidate used tokens
- prevent auth bypasses
- middleware must fail securely
- avoid insecure redirects
- implement CSRF-safe practices where applicable

---

# Folder Structure

Create a clean scalable architecture.

Use production-quality structure such as:

- app/
- actions/
- lib/
- prisma/
- emails/
- components/
- middleware/
- schemas/
- types/

Structure should prioritize:

- maintainability
- separation of concerns
- future scalability

---

# UI Requirements

Keep UI minimal and clean.

Pages needed:

- Sign Up
- Login
- Verify Email
- Forgot Password
- Reset Password
- Dashboard

Use:

- accessible forms
- proper loading states
- proper disabled states
- clear validation feedback
- minimal modern styling

Do NOT waste time building a fancy design system.

Focus on engineering quality.

---

# Output Requirements

Generate:

1. Full project architecture
2. Folder structure
3. Prisma schema
4. Environment variable setup
5. Auth configuration
6. Middleware setup
7. Database connection logic
8. Secure helper utilities
9. Full route handlers
10. React frontend pages
11. Email templates
12. Validation schemas
13. Rate limiting implementation
14. Secure token generation utilities
15. Password hashing utilities
16. Deployment instructions
17. Security reasoning for major decisions

---

# Coding Standards

Requirements:

- strict TypeScript
- reusable utilities
- no dead code
- meaningful naming
- proper comments only where useful
- avoid magic strings
- avoid duplicated logic
- production-grade error handling

Do NOT:

- use unnecessary abstractions
- introduce microservices
- overcomplicate architecture
- add OAuth unless explicitly asked
- add features outside scope

---

# Important Engineering Expectations

Assume:

- users are malicious
- tokens will be abused
- requests will fail
- emails may arrive late
- DB connections may fail
- middleware may be bypassed
- frontend validation is untrusted
- attackers will enumerate endpoints

Design defensively.

Every important engineering decision should briefly explain:

- WHY it exists
- WHAT security risk it prevents
- WHY the chosen approach is better

---

# Final Goal

The final result should resemble:

- a real production auth service
- something worthy of a portfolio case study
- something a startup could actually build upon
- a system demonstrating strong backend and security engineering fundamentals

Build incrementally.
Prefer correctness over cleverness.
Keep the system lean, secure, and maintainable.
