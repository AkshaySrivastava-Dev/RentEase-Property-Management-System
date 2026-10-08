# RentEase — Development Phases

**Document:** `phases.md`  
**Version:** 1.0  
**Status:** Initial Development Roadmap  
**Date:** 2026-10-07

---

# 1. Purpose

This document defines the implementation order for RentEase.

The project must be built phase-by-phase rather than attempting to generate the entire application at once.

Each phase has:

- Objective
- Scope
- Tasks
- Dependencies
- Expected output
- Acceptance criteria
- Definition of Done
- Explicit out-of-scope items

A phase is not considered complete simply because its UI exists. The underlying workflow must work.

---

# 2. Development Strategy

The overall strategy is:

```text
Foundation
   ↓
Design System
   ↓
Authentication
   ↓
Admin Foundation
   ↓
Property Management
   ↓
Tenant Management
   ↓
Lease Management
   ↓
Payment Management
   ↓
Maintenance Management
   ↓
Messaging
   ↓
Tenant Experience
   ↓
Validation / Error States
   ↓
Responsive / Accessibility
   ↓
Full Testing
   ↓
DTI Review
   ↓
React Migration
```

---

# 3. Global Development Rules

Before starting any phase:

1. Read the relevant requirements in `product-requirements.md`.
2. Follow `architecture.md`.
3. Follow the visual system in `design.md`.
4. Follow development rules in `rules.md`.
5. Check previous decisions in `memory.md`.
6. Do not silently introduce new architecture.
7. Do not skip acceptance criteria.

---

# 4. Phase 0 — Project Foundation

## Objective

Create the basic project structure and establish the development foundation.

## Tasks

- Create RentEase folder structure.
- Create `index.html`.
- Create required page folders.
- Create CSS folders/files.
- Create JavaScript folders/files.
- Create assets folder.
- Create docs folder.
- Create README.
- Set up ES module usage if applicable.
- Create initial CSS variables.
- Create basic global styles.
- Create storage abstraction.
- Create constants/helpers structure.

## Expected Structure

```text
RentEase/
├── index.html
├── pages/
├── css/
├── js/
├── assets/
├── docs/
└── README.md
```

## Dependencies

None.

## Acceptance Criteria

- Project opens successfully.
- Folder structure matches `architecture.md`.
- CSS loads correctly.
- JavaScript loads correctly.
- No broken initial references.
- Basic page renders.

## Definition of Done

- [ ] Folder structure created
- [ ] Base HTML works
- [ ] CSS loads
- [ ] JS loads
- [ ] Storage abstraction exists
- [ ] No console-breaking errors

## Do Not Build Yet

- Authentication
- Admin dashboard
- Tenant dashboard
- CRUD modules
- React
- Backend

---

# 5. Phase 1 — Base UI & Design System

## Objective

Implement the reusable visual foundation.

## Tasks

- Implement design tokens.
- Implement typography.
- Implement spacing.
- Implement buttons.
- Implement inputs.
- Implement cards.
- Implement tables.
- Implement badges.
- Implement modal structure.
- Implement toast structure.
- Implement page layout.
- Implement sidebar.
- Implement navbar.
- Implement responsive base styles.

## Files

Primarily:

```text
css/variables.css
css/reset.css
css/globals.css
css/layout.css
css/components.css
css/forms.css
css/tables.css
css/responsive.css

js/components/
```

## Acceptance Criteria

- Common components have consistent styling.
- Sidebar works visually.
- Navbar works visually.
- Buttons have all required states.
- Forms have consistent styling.
- Cards and tables follow `design.md`.
- Mobile layout foundation exists.

## Definition of Done

- [ ] Design tokens implemented
- [ ] Typography implemented
- [ ] Buttons implemented
- [ ] Forms implemented
- [ ] Cards implemented
- [ ] Tables implemented
- [ ] Sidebar implemented
- [ ] Navbar implemented
- [ ] Modal structure implemented
- [ ] Toast structure implemented
- [ ] Responsive foundation implemented

## Do Not Build Yet

- Real authentication
- Property CRUD
- Payments
- Maintenance
- React

---

# 6. Phase 2 — Authentication

## Objective

Implement signup, login, logout and role-based access using LocalStorage.

## Tasks

### Signup

- Signup form
- Input validation
- Duplicate email check
- User creation
- LocalStorage persistence

### Login

- Login form
- Credential validation
- Current-user storage
- Role detection
- Role-based redirect

### Logout

- Clear current user
- Redirect to login

### Authorization

- Protected pages
- Role checks
- Unauthorized redirects

## Files

```text
pages/login.html
pages/signup.html
js/services/authService.js
js/storage/storage.js
js/utils/validators.js
```

## Acceptance Criteria

A new user can:

```text
Signup
 ↓
Stored in LocalStorage
 ↓
Login
 ↓
Role detected
 ↓
Redirected
```

Invalid login must be rejected.

Tenant cannot access Admin pages.

## Definition of Done

- [ ] Signup works
- [ ] Duplicate email validation works
- [ ] Login works
- [ ] Invalid credentials rejected
- [ ] Current user persists
- [ ] Logout works
- [ ] Protected pages work
- [ ] Role protection works
- [ ] Refresh preserves authentication state

## Do Not Build Yet

- Real backend authentication
- Password hashing
- OAuth
- Social login

---

# 7. Phase 3 — Admin Dashboard Foundation

## Objective

Create the Admin application shell and dashboard.

## Tasks

- Admin sidebar
- Admin navbar
- Dashboard page
- Metric cards
- Quick actions
- Recent activity sections
- Empty states

Initial metrics can be derived from existing LocalStorage data.

## Acceptance Criteria

Admin login leads to:

```text
Admin Dashboard
```

Dashboard displays:

- Property count
- Tenant count
- Payment information
- Maintenance information

Stats must be derived from source data.

## Definition of Done

- [ ] Admin layout works
- [ ] Sidebar works
- [ ] Navbar works
- [ ] Dashboard loads
- [ ] Metrics are dynamic
- [ ] Empty states work
- [ ] Logout works

## Do Not Build Yet

- Advanced analytics
- Charts unless required
- AI analytics
- Backend

---

# 8. Phase 4 — Property Management

## Objective

Implement complete Admin property CRUD.

## Tasks

### Create

- Add property form
- Validation
- Save property

### Read

- Property grid
- Property details
- Search/filter where required

### Update

- Edit property
- Update LocalStorage

### Delete

- Delete property
- Confirmation dialog
- Refresh property list

## Data

Use the `Property` model from `architecture.md`.

## Acceptance Criteria

Admin can:

```text
Add Property
 ↓
View Property
 ↓
Edit Property
 ↓
Delete Property
```

Data survives browser refresh.

## Definition of Done

- [ ] Property model implemented
- [ ] Create works
- [ ] Read works
- [ ] Update works
- [ ] Delete works
- [ ] Validation works
- [ ] Confirmation works
- [ ] Persistence works
- [ ] Empty state works
- [ ] Responsive property grid works

## Do Not Build Yet

- Tenant assignment
- Lease creation
- Real image upload service

---

# 9. Phase 5 — Tenant Management

## Objective

Allow Admin to view and manage tenants.

## Tasks

- Tenant list
- Tenant details
- Search/filter
- Property assignment relationship
- Tenant status where required

Tenant records are derived from:

```text
users
where role === "tenant"
```

## Acceptance Criteria

Admin can:

- View tenants
- Identify assigned property
- View tenant information
- Manage tenant-property relationships

## Definition of Done

- [ ] Tenant list works
- [ ] Tenant filtering works
- [ ] Tenant details work
- [ ] Property relationship works
- [ ] Data is derived correctly
- [ ] No unrelated tenant data is exposed to tenants

## Do Not Build Yet

- Tenant self-service dashboard
- Advanced tenant analytics

---

# 10. Phase 6 — Lease Management

## Objective

Implement lease creation and management.

## Tasks

- Create lease
- View lease
- Edit lease
- Lease status
- Property-tenant relationship
- Monthly rent
- Security deposit
- Start/end dates

## Acceptance Criteria

Admin can create:

```text
Property
+
Tenant
+
Lease Details
```

and generate a valid lease record.

Lease relationships must reference existing property and tenant IDs.

## Definition of Done

- [ ] Lease model implemented
- [ ] Create works
- [ ] Read works
- [ ] Update works
- [ ] Validation works
- [ ] Relationship validation works
- [ ] Status works
- [ ] Persistence works

## Do Not Build Yet

- Electronic signatures
- Legal document generation
- Online contract signing

---

# 11. Phase 7 — Payment Management

## Objective

Implement payment tracking.

## Tasks

- Payment records
- Payment table
- Payment status
- Due date
- Paid date
- Tenant payment history
- Admin payment overview

Statuses:

```text
Paid
Pending
Overdue
```

## Acceptance Criteria

Admin can view payment records and update appropriate payment status.

Tenant can view their own payment information.

## Definition of Done

- [ ] Payment model implemented
- [ ] Payment list works
- [ ] Status works
- [ ] Admin view works
- [ ] Tenant view works
- [ ] Tenant data is restricted
- [ ] Persistence works
- [ ] Empty state works

## Do Not Build Yet

- Real payment gateway
- Stripe/Razorpay integration
- Actual financial transactions

---

# 12. Phase 8 — Maintenance Management

## Objective

Implement maintenance request workflow.

## Tenant Flow

```text
Tenant
 ↓
Create Request
 ↓
Priority
 ↓
Submit
 ↓
Admin Receives
```

## Admin Flow

```text
View Request
 ↓
Update Status
 ↓
Resolved
```

Statuses:

```text
Open
In Progress
Resolved
```

Priority:

```text
Low
Medium
High
Urgent
```

## Acceptance Criteria

Tenant can create a maintenance request.

Admin can view and update it.

Tenant can see the updated status.

## Definition of Done

- [ ] Request creation works
- [ ] Validation works
- [ ] Priority works
- [ ] Admin view works
- [ ] Status update works
- [ ] Tenant tracking works
- [ ] Persistence works
- [ ] Empty states work

---

# 13. Phase 9 — Messaging

## Objective

Implement basic Admin ↔ Tenant messaging.

## Tasks

- Message list
- Send message
- Receiver
- Timestamp
- Read/unread state
- Basic conversation UI

## Acceptance Criteria

Admin can send a message to a tenant.

Tenant can view and respond.

Read/unread status works.

## Definition of Done

- [ ] Send works
- [ ] Receive works
- [ ] Read/unread works
- [ ] Timestamps work
- [ ] Role restrictions work
- [ ] Persistence works

## Do Not Build Yet

- Real-time WebSockets
- Push notifications
- Email notifications

---

# 14. Phase 10 — Tenant Experience

## Objective

Complete the Tenant-side application.

## Pages

```text
Tenant Dashboard
My Property
Lease
Payments
Maintenance
Messages
```

## Tenant Dashboard

Show:

- Assigned property
- Lease summary
- Payment summary
- Maintenance summary

## Acceptance Criteria

Tenant sees only relevant personal/property information.

## Definition of Done

- [ ] Tenant dashboard works
- [ ] Property page works
- [ ] Lease page works
- [ ] Payments page works
- [ ] Maintenance page works
- [ ] Messages work
- [ ] Unauthorized data is not shown

---

# 15. Phase 11 — Validation, Error & Empty States

## Objective

Make the application robust rather than merely functional.

## Tasks

Review every module for:

- Required fields
- Invalid inputs
- Duplicate data
- Missing relationships
- Unauthorized access
- Empty collections
- Invalid IDs
- Failed operations

## Acceptance Criteria

No major page should fail silently.

Every important operation should provide appropriate feedback.

## Definition of Done

- [ ] Forms validated
- [ ] Errors handled
- [ ] Empty states implemented
- [ ] Success feedback implemented
- [ ] Delete confirmations implemented
- [ ] Unauthorized states handled

---

# 16. Phase 12 — Responsive & Accessibility

## Objective

Make the complete application usable across screen sizes.

## Tasks

Test:

```text
Desktop
Tablet
Mobile
```

Review:

- Sidebar
- Navbar
- Dashboard
- Property cards
- Tables
- Forms
- Modals
- Buttons
- Typography
- Overflow

Accessibility review:

- Semantic HTML
- Labels
- Keyboard navigation
- Focus states
- Alt text
- Status labels

## Definition of Done

- [ ] Desktop works
- [ ] Tablet works
- [ ] Mobile works
- [ ] No major horizontal overflow
- [ ] Forms usable
- [ ] Tables usable
- [ ] Keyboard focus visible
- [ ] Semantic structure present

---

# 17. Phase 13 — Full Integration Testing

## Objective

Verify the complete product as one connected system.

## Test Flow 1 — Admin

```text
Signup/Login
 ↓
Dashboard
 ↓
Create Property
 ↓
Create/Manage Tenant
 ↓
Assign Property
 ↓
Create Lease
 ↓
Track Payment
 ↓
View Maintenance
 ↓
Update Maintenance
 ↓
Message Tenant
```

## Test Flow 2 — Tenant

```text
Signup/Login
 ↓
Dashboard
 ↓
View Property
 ↓
View Lease
 ↓
View Payments
 ↓
Create Maintenance Request
 ↓
Track Status
 ↓
Message Admin
```

## Persistence Test

```text
Create Data
 ↓
Refresh Browser
 ↓
Data Still Exists
```

## Authorization Test

```text
Tenant → Admin URL
```

must be blocked.

## Definition of Done

- [ ] Admin workflow passes
- [ ] Tenant workflow passes
- [ ] Persistence passes
- [ ] Authorization passes
- [ ] CRUD passes
- [ ] Validation passes
- [ ] Responsive checks pass
- [ ] No major console errors

---

# 18. Phase 14 — DTI Review Preparation

## Objective

Prepare the project for academic review.

## Required Demonstration

Explain:

### Problem

Property management becomes difficult when information is scattered across spreadsheets, messages and manual records.

### Solution

RentEase centralizes:

- Properties
- Tenants
- Leases
- Payments
- Maintenance
- Communication

### Modules

```text
Admin
Tenant
```

### Technologies

```text
HTML5
CSS3
JavaScript
LocalStorage
CSS Grid
Flexbox
```

## Demonstrate

- Signup
- Login
- LocalStorage
- Role-based access
- Admin module
- Tenant module
- CRUD
- Responsive UI
- Maintenance workflow
- Payment workflow
- Project architecture

## Definition of Done

- [ ] Project runs without major errors
- [ ] Demo accounts/data prepared
- [ ] Main workflows demonstrated
- [ ] DTI concepts explainable
- [ ] Documentation ready
- [ ] LinkedIn article material available

---

# 19. Phase 15 — React Migration Preparation

React must NOT begin until the Vanilla MVP has passed review.

## Preconditions

All of the following should be true:

- [ ] MVP is complete
- [ ] Main workflows work
- [ ] LocalStorage persistence works
- [ ] Authentication works
- [ ] Admin module works
- [ ] Tenant module works
- [ ] DTI review completed
- [ ] Existing architecture understood

---

# 20. Phase 16 — React Migration

## Objective

Reimplement the same product using React without unnecessarily changing product behavior.

## Migration

Current:

```text
HTML
 ↓
DOM Manipulation
 ↓
Services
 ↓
LocalStorage
```

Future:

```text
React Components
 ↓
React State
 ↓
React Router
 ↓
Services
 ↓
LocalStorage initially
```

The first React migration can continue using LocalStorage.

Backend migration does not have to happen simultaneously.

---

# 21. React Migration Tasks

## Step 1

Create React/Vite project.

## Step 2

Recreate design tokens.

## Step 3

Create shared components:

```text
Sidebar
Navbar
Button
Card
Modal
Toast
Table
Badge
```

## Step 4

Create routes.

## Step 5

Migrate authentication UI.

## Step 6

Migrate Admin pages.

## Step 7

Migrate Tenant pages.

## Step 8

Adapt existing service layer.

## Step 9

Test behavior against Vanilla version.

---

# 22. React Migration Acceptance Criteria

The React version must preserve:

- User roles
- Authentication behavior
- CRUD behavior
- Data relationships
- Validation
- Design system
- Responsive behavior
- Main workflows

The migration should not become a reason to add unrelated features.

---

# 23. Backend Phase — Future Scope

Backend development is intentionally after React migration.

Possible architecture:

```text
React
 ↓
API Client
 ↓
Backend API
 ↓
Database
```

Potential future capabilities:

- Secure authentication
- Password hashing
- Database persistence
- Real payment integration
- File storage
- Notifications
- Production authorization

This phase is outside the academic MVP.

---

# 24. Phase Dependencies

```text
Phase 0
  ↓
Phase 1
  ↓
Phase 2
  ↓
Phase 3
  ↓
Phase 4
  ↓
Phase 5
  ↓
Phase 6
  ↓
Phase 7
  ↓
Phase 8
  ↓
Phase 9
  ↓
Phase 10
  ↓
Phase 11
  ↓
Phase 12
  ↓
Phase 13
  ↓
Phase 14
  ↓
Phase 15
  ↓
Phase 16
```

Some small implementation tasks may overlap, but the major dependency order should remain intact.

---

# 25. Feature Priority

## P0 — Must Have

- Authentication
- Admin module
- Tenant module
- Property management
- Tenant management
- Lease management
- Payment tracking
- Maintenance management
- LocalStorage
- Role-based access
- Responsive UI
- CRUD
- Validation

## P1 — Important

- Messaging
- Search
- Filters
- Better empty states
- Better feedback

## P2 — Future

- Backend
- Real payment gateway
- Notifications
- Analytics
- AI features
- Real-time communication

---

# 26. What Must Not Delay the MVP

Do not delay the MVP because of:

- Perfect animations
- Advanced charts
- Complex AI features
- Backend architecture
- Real payment integration
- Perfect image upload
- Advanced authentication
- React migration
- Production deployment infrastructure

The MVP must first prove the core product workflow.

---

# 27. Phase Completion Template

For every future phase, use:

```text
Phase:
Objective:

Tasks:
- 
- 
- 

Dependencies:
- 

Files/Modules:
- 

Acceptance Criteria:
- 
- 
- 

Definition of Done:
- [ ]
- [ ]
- [ ]

Out of Scope:
- 
- 
```

---

# 28. Definition of MVP Complete

The RentEase Vanilla MVP is considered complete when:

- [ ] Public pages work
- [ ] Signup works
- [ ] Login works
- [ ] Logout works
- [ ] LocalStorage persistence works
- [ ] Admin module works
- [ ] Tenant module works
- [ ] Property CRUD works
- [ ] Tenant management works
- [ ] Lease management works
- [ ] Payment tracking works
- [ ] Maintenance workflow works
- [ ] Messaging works
- [ ] Role protection works
- [ ] Validation works
- [ ] Error states work
- [ ] Empty states work
- [ ] Responsive UI works
- [ ] Accessibility basics are implemented
- [ ] Full workflows pass
- [ ] DTI demonstration is ready
- [ ] Documentation is synchronized

---

# 29. Final Development Roadmap

The official roadmap is:

```text
┌─────────────────────────────┐
│ Phase 0 — Foundation        │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 1 — Design System     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 2 — Authentication    │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 3 — Admin Dashboard   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 4 — Properties        │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 5 — Tenants           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 6 — Leases            │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 7 — Payments          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 8 — Maintenance       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 9 — Messaging         │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 10 — Tenant Experience│
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 11 — Robustness       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 12 — Responsive       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 13 — Integration Test │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 14 — DTI Review       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 15 — React Prep       │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Phase 16 — React Migration  │
└─────────────────────────────┘
```

---

# 30. Final Rule

The project should move forward only when the current phase is sufficiently complete.

The sequence is intentionally:

```text
Build
 ↓
Understand
 ↓
Test
 ↓
Review
 ↓
Improve
 ↓
Migrate
```

Not:

```text
Generate Everything
 ↓
Hope It Works
```

The goal is to create a product that is both technically understandable and practically functional.
