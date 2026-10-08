# RentEase — Development Rules

**Document:** `rules.md`  
**Version:** 1.0  
**Status:** Project Constitution  
**Date:** 2026-10-07

---

# 1. Purpose

This document defines the rules that must be followed while developing RentEase.

It is especially important for AI-assisted or vibe-coded development.

The purpose is to prevent:

- Random architecture changes
- Unnecessary features
- Inconsistent UI
- Duplicate logic
- Poor folder organization
- AI-generated code that does not follow the project decisions
- Premature React/backend implementation
- Breaking previously completed functionality

These rules apply throughout the project unless a documented decision changes them.

---

# 2. Source-of-Truth Hierarchy

When making a development decision, use the project documents in this order:

```text
Product Requirements
        ↓
Architecture
        ↓
Design
        ↓
Rules
        ↓
Phases
        ↓
Memory
```

More specifically:

| Document | Authority |
|---|---|
| `product-requirements.md` | Product scope, requirements and business behavior |
| `architecture.md` | Technical structure |
| `design.md` | UI/UX and visual behavior |
| `rules.md` | Development rules |
| `phases.md` | Implementation sequence |
| `memory.md` | Decisions, history and current project context |

No implementation should contradict a higher-level decision without a documented change.

---

# 3. Core Development Principles

## Rule 1 — Build the Product, Not Just Screens

Every page must connect to an actual product workflow.

Do not build visually impressive screens that have no meaningful functionality.

---

## Rule 2 — Complete the Workflow Before Adding Polish

Priority:

```text
Functionality
    ↓
Correct Data Flow
    ↓
Validation
    ↓
Error Handling
    ↓
Responsive UI
    ↓
Visual Polish
```

---

## Rule 3 — Understand Before Abstracting

The initial MVP uses:

```text
HTML
CSS
Vanilla JavaScript
LocalStorage
```

Do not introduce React merely because it is a popular frontend technology.

---

## Rule 4 — Vanilla First

The initial implementation must remain framework-free.

Do not introduce:

- React
- Redux
- React Router
- Next.js
- UI frameworks
- State-management libraries

unless the project has officially entered the React migration phase.

---

# 4. Scope Rules

## 4.1 Follow the PRD

The PRD defines the MVP scope.

Do not add features simply because an AI model suggests them.

Before implementing a new feature, determine:

1. Is it required by the PRD?
2. Is it required for an existing workflow?
3. Is it necessary for the DTI review?
4. Is it a clearly documented future feature?

If none apply, do not add it to the MVP automatically.

---

## 4.2 Avoid Scope Creep

Do not add unrelated features such as:

- Real payment gateway
- Advanced analytics
- AI chatbot
- Complex notifications
- Backend
- Social login
- Subscription system
- Multi-language support
- Advanced reporting

unless explicitly approved as a project decision.

---

# 5. Architecture Rules

## Rule 5.1 — Respect the Architecture

Current architecture:

```text
HTML
 ↓
Vanilla JavaScript
 ↓
Service Layer
 ↓
Storage Layer
 ↓
LocalStorage
```

Do not bypass this structure without a documented reason.

---

## Rule 5.2 — No Silent Architecture Changes

AI must never silently:

- Convert the project to React
- Add a backend
- Add a database
- Add Redux
- Replace LocalStorage
- Change the folder structure
- Introduce a framework
- Introduce a large dependency

Any major architectural change requires:

```text
Problem
 ↓
Alternatives
 ↓
Decision
 ↓
Update architecture.md
 ↓
Record in memory.md
```

---

# 6. Folder Structure Rules

Use the structure defined in `architecture.md`.

Do not randomly create:

```text
misc/
temp/
components2/
new/
final/
final2/
```

or similar uncontrolled folders.

Every new file must have a clear responsibility.

---

# 7. HTML Rules

Use semantic HTML where possible.

Prefer:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
<form>
<button>
```

over unnecessary generic `<div>` structures.

---

## 7.1 Forms

Every form field must have an associated label.

Bad:

```html
<input placeholder="Email">
```

Preferred:

```html
<label for="email">Email</label>
<input id="email" type="email">
```

---

## 7.2 Buttons

Use `<button>` for actions.

Do not use clickable `<div>` elements when a button is appropriate.

---

## 7.3 Links

Use `<a>` for navigation.

Use `<button>` for actions.

---

# 8. CSS Rules

## 8.1 Use the Design System

Use the variables defined in:

```text
css/variables.css
```

Do not repeatedly hardcode colors, spacing and radii.

---

## 8.2 Grid vs Flexbox

Use CSS Grid for:

- Dashboard layouts
- Property grids
- Multi-column structures

Use Flexbox for:

- Navigation
- Button groups
- Card headers
- Horizontal alignment
- Form rows

---

## 8.3 Avoid Inline Styles

Avoid:

```html
style="color:red"
```

unless there is a very specific reason.

Prefer reusable classes.

---

## 8.4 Avoid `!important`

Do not use `!important` as a normal way to solve CSS conflicts.

If styles conflict, fix the underlying specificity or architecture.

---

## 8.5 Responsive by Default

Every major page must be checked at:

- Desktop
- Tablet
- Mobile

Do not build desktop-only layouts.

---

# 9. JavaScript Rules

## 9.1 Keep Files Focused

Do not create one massive:

```text
app.js
```

containing the entire application.

Use:

```text
services/
components/
pages/
utils/
storage/
```

as defined in the architecture.

---

## 9.2 Use Modules

Where supported by the project setup, use ES modules:

```js
import ...
export ...
```

This keeps responsibilities separated.

---

## 9.3 Avoid Duplicate Logic

If the same operation appears in multiple places, consider creating a reusable function/service.

Example:

Do not implement property retrieval separately in five pages.

Use:

```js
propertyService.getProperties()
```

---

# 10. Service Layer Rules

Business operations belong in services.

Example:

```text
UI
 ↓
propertyService.createProperty()
 ↓
storage.set()
```

Avoid:

```text
UI
 ↓
localStorage.setItem(...)
```

throughout page code.

---

## 10.1 Services Should Have Clear Responsibilities

`propertyService.js` should handle property-related operations.

It should not become a general-purpose file containing unrelated authentication, payment and messaging logic.

---

# 11. LocalStorage Rules

All LocalStorage interaction should be centralized.

Use:

```text
js/storage/storage.js
```

The application should not scatter:

```js
localStorage.getItem(...)
localStorage.setItem(...)
localStorage.removeItem(...)
```

throughout every page.

---

## 11.1 Storage Keys

Use the defined keys:

```text
rentEase_users
rentEase_currentUser
rentEase_properties
rentEase_leases
rentEase_payments
rentEase_maintenanceRequests
rentEase_messages
```

Do not create random variations such as:

```text
users
userData
allUsers
rent_users
```

unless the architecture is intentionally changed.

---

# 12. Data Rules

## 12.1 Use Defined Data Models

Follow the models in `architecture.md`.

Do not randomly add properties to entities without a reason.

---

## 12.2 Stable IDs

Every record must have a stable unique ID.

Example:

```text
property_001
property_002
property_003
```

---

## 12.3 Avoid Data Duplication

Do not store the same business information in multiple places unnecessarily.

For example, do not duplicate:

```text
tenantName
tenantEmail
```

inside every unrelated record if they can be derived from `tenantId`.

---

# 13. CRUD Rules

CRUD operations must follow predictable patterns.

```text
Create
Read
Update
Delete
```

Every CRUD feature should have:

- Validation
- Success feedback
- Error handling
- UI refresh
- Appropriate confirmation for destructive actions

---

# 14. Authentication Rules

Authentication is an MVP implementation using LocalStorage.

Required:

- Signup
- Login
- Logout
- Current user
- Role
- Protected pages

---

## 14.1 Signup

Before creating a user:

1. Validate fields.
2. Check duplicate email.
3. Create unique ID.
4. Store user.
5. Provide feedback.
6. Redirect appropriately.

---

## 14.2 Login

Login must:

1. Validate input.
2. Read users.
3. Match credentials.
4. Store current user.
5. Check role.
6. Redirect.

---

## 14.3 Logout

Logout must remove the current-user session state and return the user to login.

---

# 15. Authorization Rules

Admin and Tenant are separate roles.

Admin pages must not be accessible to tenants.

Tenant pages must not expose unrelated users' data.

Before rendering protected content:

```text
Check Authentication
        ↓
Check Role
        ↓
Allow or Redirect
```

---

# 16. Security Rules

The LocalStorage authentication mechanism is an academic limitation.

Do not describe it as production-secure.

Never claim:

```text
LocalStorage authentication is secure.
```

The production architecture would require:

- Backend authentication
- Password hashing
- Secure session/token handling
- Server-side authorization

---

# 17. Validation Rules

Validate user input before saving.

At minimum:

- Required fields
- Email format
- Numeric values
- Dates
- Duplicate email
- Valid relationships
- Valid statuses

Validation should happen before service execution.

---

# 18. Error Handling Rules

Never silently fail.

Bad:

```js
try {
  ...
} catch {}
```

Errors should be:

- Handled
- Logged when useful for development
- Communicated to the user appropriately

Do not expose raw technical errors to users.

---

# 19. Empty State Rules

Never leave a page completely blank when there is no data.

Use:

```text
Empty State
+
Explanation
+
Next Action
```

Example:

```text
No properties yet.

Add your first property to start managing your portfolio.

[Add Property]
```

---

# 20. UI Consistency Rules

Follow `design.md`.

Do not create random:

- Colors
- Buttons
- Card designs
- Border radii
- Shadows
- Typography
- Spacing

If an existing component works, reuse it.

---

# 21. Component Reuse Rules

Even without React, repeated UI should be reusable.

Examples:

```text
renderSidebar()
renderNavbar()
renderPropertyCard()
renderPaymentTable()
showModal()
showToast()
renderEmptyState()
```

Before creating a new component, ask:

> Does an existing component already solve this problem?

---

# 22. Accessibility Rules

Every important interaction should be usable with basic keyboard navigation.

Required:

- Labels
- Focus states
- Semantic elements
- Meaningful button text
- Alt text for meaningful images
- Color should not be the only status indicator

---

# 23. Responsive Rules

Do not fix mobile problems by simply shrinking everything.

Instead:

- Change column count
- Stack content
- Collapse navigation
- Allow table scrolling
- Adjust spacing
- Resize typography where appropriate

The product must remain usable.

---

# 24. Image Rules

Property images should:

- Maintain aspect ratio
- Use `object-fit: cover`
- Have meaningful alt text where applicable
- Have sensible fallbacks

Do not allow images to break the layout.

---

# 25. Naming Rules

Use descriptive names.

Good:

```text
propertyService.js
maintenanceService.js
renderPropertyCard()
getTenantPayments()
```

Bad:

```text
stuff.js
data2.js
thing()
abc()
temp()
```

Variables should communicate their purpose.

---

# 26. Comments Rules

Comments should explain **why**, not obvious syntax.

Bad:

```js
// Add 1 to count
count++;
```

Good:

```js
// Recalculate dashboard metrics after a property mutation
updateDashboardStats();
```

Do not fill every line with unnecessary comments.

---

# 27. AI/Vibe Coding Rules

When using AI to build the project, AI must:

1. Read the relevant project documents first.
2. Understand the existing architecture.
3. Modify only the required files.
4. Preserve working functionality.
5. Reuse existing components.
6. Follow existing naming conventions.
7. Follow `design.md`.
8. Follow the current implementation phase.
9. Explain significant changes when requested.
10. Avoid unrelated improvements.

---

# 28. AI Must Not

AI must not:

- Rewrite the entire project unnecessarily.
- Introduce React early.
- Introduce a backend early.
- Replace LocalStorage without approval.
- Create unnecessary dependencies.
- Change the visual system randomly.
- Delete working functionality to simplify its task.
- Duplicate existing services.
- Create multiple versions of the same component.
- Add features outside the current phase.
- Pretend a feature works when it has not been tested.
- Hide errors.
- Modify architecture silently.

---

# 29. Before Coding a New Feature

Use this process:

```text
Understand Requirement
        ↓
Check PRD
        ↓
Check Architecture
        ↓
Check Design
        ↓
Check Current Phase
        ↓
Inspect Existing Code
        ↓
Reuse Existing Logic
        ↓
Implement
        ↓
Test
        ↓
Update Memory
```

---

# 30. Feature Development Rule

A feature is not complete merely because its UI exists.

For example:

```text
Add Property
```

is not complete if:

- Form exists
- But data is not saved
- Or validation does not work
- Or list does not update
- Or refresh loses data
- Or tenant/admin relationship breaks

A feature is complete only when the full workflow works.

---

# 31. Bug-Fixing Rules

When fixing a bug:

1. Reproduce it.
2. Identify the actual cause.
3. Fix the smallest appropriate area.
4. Test the affected workflow.
5. Check related functionality.
6. Avoid unnecessary rewrites.

Do not rewrite the whole application for a localized bug.

---

# 32. Regression Rules

After changing a shared component/service, check all affected pages.

For example:

Changing:

```text
propertyService.js
```

may affect:

- Admin dashboard
- Properties page
- Property details
- Tenant property page

Shared changes require broader testing.

---

# 33. Testing Rules

Testing should cover the actual user workflows.

## Authentication

- Signup
- Duplicate signup
- Login
- Invalid login
- Logout
- Protected page

## Admin

- Create property
- Read property
- Edit property
- Delete property
- Manage tenant
- Create/update lease
- Update payment
- Manage maintenance

## Tenant

- View property
- View lease
- View payments
- Create maintenance request
- Track request
- Messages

---

# 34. Persistence Testing

Important test:

```text
Create Data
   ↓
Refresh Browser
   ↓
Data Still Exists
```

If data disappears unexpectedly, LocalStorage integration is not working correctly.

---

# 35. Role Testing

Test:

```text
Admin login → Admin dashboard
Tenant login → Tenant dashboard
```

Also test:

```text
Tenant → Admin URL
```

and ensure unauthorized access is blocked.

---

# 36. Responsive Testing

Each major page should be checked at:

```text
Desktop
Tablet
Mobile
```

Check:

- Navigation
- Cards
- Tables
- Forms
- Modals
- Buttons
- Text wrapping
- Horizontal overflow

---

# 37. Git Rules

Commit changes in meaningful units.

Good commit examples:

```text
feat: add authentication flow
feat: add property CRUD
feat: add tenant management
feat: add maintenance workflow
style: implement dashboard design system
fix: correct tenant authorization
```

Avoid meaningless commits such as:

```text
update
changes
done
final
final2
```

---

# 38. Commit Strategy

The Git history should reflect the actual development journey.

Prefer:

```text
Foundation
 ↓
Authentication
 ↓
Layout
 ↓
Properties
 ↓
Tenants
 ↓
Leases
 ↓
Payments
 ↓
Maintenance
 ↓
Messages
 ↓
Responsive polish
 ↓
Testing
```

Do not intentionally fabricate fake development history.

---

# 39. Dependency Rules

Do not add a dependency unless it solves a real project requirement.

Before adding one:

1. Identify the problem.
2. Determine whether Vanilla JS/CSS can reasonably solve it.
3. Evaluate complexity.
4. Document the decision if it materially affects architecture.

---

# 40. No Premature Optimization

Do not optimize code before the product works.

Priority:

```text
Correctness
 ↓
Maintainability
 ↓
Usability
 ↓
Performance Optimization
```

---

# 41. No Premature React

React should not be introduced because:

- A component is repeated
- DOM code feels long
- AI recommends React
- The project looks like a good React candidate

React migration happens according to the project phase and architecture decision.

---

# 42. React Migration Rules

When React migration begins:

- Preserve product behavior.
- Preserve data models.
- Preserve design system.
- Preserve service responsibilities.
- Preserve validation.
- Preserve role separation.
- Replace rendering architecture deliberately.
- Do not rewrite business rules unnecessarily.

The goal is:

```text
Same Product
+
Better UI Architecture
```

not:

```text
Completely Different Product
```

---

# 43. Backend Rules

Backend development is future scope.

Do not add a backend during the Vanilla MVP unless explicitly approved.

When backend work begins:

- Move authentication to the server.
- Move sensitive operations to server-side authorization.
- Replace LocalStorage persistence with API/database persistence.
- Preserve frontend service concepts where practical.

---

# 44. Documentation Rules

When an important decision changes:

Update:

```text
architecture.md
```

and/or:

```text
design.md
phases.md
memory.md
```

Do not allow documentation to become inconsistent with the implementation.

---

# 45. Definition of Done

A feature is considered done only when:

- [ ] Requirement is understood
- [ ] Correct page exists
- [ ] UI follows `design.md`
- [ ] Validation works
- [ ] Business logic works
- [ ] Data is persisted correctly
- [ ] Success state works
- [ ] Error state works
- [ ] Empty state works where applicable
- [ ] Authorization works
- [ ] Responsive behavior works
- [ ] Existing functionality is not broken
- [ ] Relevant workflow has been tested

---

# 46. Phase Completion Rule

A phase is complete only when its acceptance criteria are satisfied.

Do not move forward simply because the page visually exists.

Example:

```text
Property Management Phase

UI exists                 ✓
Create works              ✓
Read works                ✓
Update works              ✓
Delete works              ✓
Validation works          ✓
Persistence works         ✓
Authorization works      ✓
Responsive UI works      ✓
```

Only then is the phase complete.

---

# 47. Change Request Process

For a significant new requirement:

```text
New Requirement
      ↓
Is it in PRD?
      ↓
Yes → Implement in current/appropriate phase
      ↓
No
      ↓
Evaluate scope
      ↓
Approve or reject
      ↓
If approved → Update relevant documentation
```

Never silently expand the product.

---

# 48. Conflict Resolution

If two documents appear to conflict:

1. Stop implementation of the conflicting part.
2. Identify the conflict.
3. Determine which decision is newer/authoritative.
4. Update the affected document.
5. Record the decision in `memory.md`.
6. Continue implementation.

Do not silently choose one.

---

# 49. Project Quality Standard

RentEase should satisfy three standards:

## Academic Standard

The project must clearly demonstrate:

- Modules
- UI
- LocalStorage
- Authentication
- CRUD
- DTI concepts
- Working functionality

## Product Standard

The application should have:

- Clear user journeys
- Logical business rules
- Consistent UX
- Useful workflows

## Engineering Standard

The project should have:

- Organized structure
- Separation of concerns
- Reusable logic
- Maintainable code
- Clear documentation

---

# 50. Final Rule

The most important rule is:

> Do not let AI make product or architecture decisions silently.

AI is an implementation assistant.

The product decisions remain controlled by the project requirements, architecture, design system and documented development decisions.

The development sequence remains:

```text
PRD
 ↓
Architecture
 ↓
Design
 ↓
Rules
 ↓
Phases
 ↓
Vanilla MVP
 ↓
Testing
 ↓
DTI Review
 ↓
React Migration
 ↓
Future Backend
```

Every implementation decision should support this direction.
