# Design System & UI Style Rules

The UI must follow a clean, minimal, production-grade authentication design style.

Focus on clarity, usability, accessibility, and consistency over visual experimentation.

---

## Design Direction

Use:

- flat design principles
- minimal visual noise
- subtle depth only where necessary
- clean spacing and typography
- professional SaaS-style interfaces

Avoid:

- glassmorphism
- neumorphism
- excessive gradients
- heavy shadows
- overly decorative UI
- overly animated interactions

The interface should feel:

- modern
- lightweight
- secure
- trustworthy
- easy to scan

---

# Color Rules

Use a restrained semantic color system.

## Primary Colors

- Primary: black
- Backgrounds: white or very light grey
- Text: near-black
- Neutral surfaces: soft grey tones

## Semantic Colors

- Error: red
- Success: green
- Warning: amber/yellow only if necessary
- Info: muted blue if needed

Requirements:

- maintain strong readability
- maintain accessible contrast ratios
- avoid oversaturated colors
- avoid random color usage
- colors must communicate purpose

Do NOT:

- use colorful gradients unnecessarily
- use glowing UI effects
- use harsh contrast borders

---

# Shadows & Borders

Use extremely subtle depth.

Rules:

- avoid hard/heavy shadows
- avoid large blur shadows
- avoid dark shadow spreads
- prefer soft low-opacity shadows if needed

Borders:

- use soft neutral border colors
- avoid pure black outlines
- avoid visually aggressive strokes
- use subtle separation instead of heavy containers

---

# Layout & Spacing

The UI must demonstrate strong visual hierarchy.

Ensure proper:

- alignment
- spacing
- grouping
- proximity
- balance
- whitespace usage
- typography hierarchy

Requirements:

- consistent padding and margin scale
- predictable spacing system
- clean form layouts
- readable line lengths
- balanced component sizing

Forms should feel:

- uncluttered
- easy to complete
- visually calm

---

# Responsive Design Rules

Use responsive units correctly.

Preferred units:

- rem
- em
- %
- clamp()
- minmax()
- flex/grid responsive layouts

Avoid:

- excessive fixed px values
- rigid layouts
- viewport-breaking widths

The application must work properly across:

- mobile
- tablet
- desktop

Forms and cards should scale gracefully.

---

# Typography

Typography should prioritize readability.

Requirements:

- clear font hierarchy
- readable font sizes
- sufficient line-height
- strong label readability
- accessible contrast

Avoid:

- tiny text
- overly bold UI everywhere
- decorative fonts

Prefer:

- clean sans-serif typography
- medium font weights
- restrained emphasis

---

# Icons

Use outline-style icons only.

Rules:

- icons must support functionality
- icons should never dominate the UI
- use icons sparingly
- maintain consistent stroke width
- align icons properly with text

Avoid:

- filled icon sets
- mixed icon styles
- oversized icons

---

# Form UX Standards

Authentication forms must feel production-ready.

Requirements:

- clear labels
- visible focus states
- proper disabled states
- loading indicators
- inline validation feedback
- accessible error messaging
- password visibility toggle
- keyboard accessibility

Validation states must:

- communicate clearly
- avoid overwhelming the user
- never leak sensitive backend information

---

# Interaction Rules

Interactions should be subtle and functional.

Use:

- small hover transitions
- soft focus states
- lightweight animations only where useful

Avoid:

- dramatic motion
- bouncing animations
- distracting microinteractions

All interactions should reinforce:

- trust
- clarity
- responsiveness

---

# Overall UI Goal

The final UI should resemble:

- modern SaaS authentication systems
- Stripe-style simplicity
- Linear-inspired cleanliness
- professional enterprise login systems

The UI should communicate:

- reliability
- security
- professionalism
- engineering maturity

Prioritize usability and clarity over visual creativity.
