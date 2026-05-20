# SecureGate — Reflection & Engineering Analysis
**Name:** Jeremiah Udoh
**Cohort:** Design to MVP Bootcamp
**Live URL:** https://securegate-pied.vercel.app/
**GitHub Repo:** https://github.com/Jeremiah-U/securegate

---

## Part 1 — What I Built
I built a modern authentication system layer. It consists of a single auth page that renders different auth sub pages (signup, signin, password reset, and email verification) based on which is interacted with. I ensured the form input fields are well validated, error and success messages are clear and rendered at every neccessary point to prevent confusion, email verification and password reset links are implemented in a seamless way and rate limit was added to prevent misuse or spaming. 

## Part 2 — What Surprised Me
I had a really had time with the whole database aspect. juggled between neon, vercel postgres and postgresql which I finally used and was able to figure out. And then merging keys with vercel environment was another serious hurddle, but I was able to figure it out as well and actually learnt some "whys" behind the "whats".

## Part 3 — Engineering Laws Quiz
### Q1 — Murphy's Law
**Code reference:** `src/app/api/auth/[...nextauth]/route.ts` lines 34-48
**My Answer:** When creating the register and forgot password, I was forced to ground my thoughts and decisions due to the ccomplexity and importance of that process.
**What goes wrong if ignored:** If ignored or not handles intentionally, we risk building an app that is vulnerable to security breaches and also users will find it difficult with it.

### Q3 — Law of Leaky Abstractions
**My Answer:** SecureGate is an auth app with simple acess management. Social login would only add complexities which aren't needed.  
**What goes wrong if ignored:** We'd be building a bloated ui with unecessary features

### Q4 — Law of Leaky Abstractions
**My Answer:** SecureGate is an auth app with simple acess management. Social login would only add complexities which aren't needed.  
**What goes wrong if ignored:** We'd be building a bloated ui with unecessary features

## Part 4 — One Thing I Would Refactor
[Describe your identified technical debt and paste the refactored version]

## Part 5 — How This Changes How I Build
[What you now know about authentication, security, and engineering principles that you did not know before]
