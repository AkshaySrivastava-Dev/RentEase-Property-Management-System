# RentEase — Architecture Document

**Document:** `architecture.md`  
**Version:** 1.1  
**Status:** Updated — Vanilla Frontend MVP  
**Date:** 2026-10-07

## 1. Architecture Overview

RentEase is initially built as a practical property-management web application using HTML5, CSS3, Vanilla JavaScript, Browser LocalStorage, CSS Grid, and Flexbox.

**React is intentionally NOT used in the initial MVP.** The project will first be completed as a fully working Vanilla HTML/CSS/JavaScript application. After the MVP is practical, tested, demonstrated and reviewed, the product can be migrated to React.

The Vanilla implementation is not a throwaway prototype. It is the first implementation of the product and establishes the product flows, business rules, data model, service structure and UI system that the React version will preserve.

## 2. Key Architecture Decision

### Initial implementation

```text
HTML
  ↓
Vanilla JavaScript
  ↓
Service Layer
  ↓
Storage Layer
  ↓
Browser LocalStorage
```

### Future React implementation

```text
React UI
  ↓
React Router
  ↓
Service / API Client Layer
  ↓
Backend API
  ↓
Database
```

### Why React is delayed

The first implementation is intentionally framework-free so the developer can understand semantic HTML, CSS layout, Grid, Flexbox, DOM manipulation, events, forms, validation, LocalStorage, JavaScript modules, CRUD operations, application state and service abstraction.

React will then be introduced as an architectural evolution that solves known problems rather than as an abstraction added before understanding the underlying system.

## 3. Architecture Principles

1. Keep the initial architecture simple.
2. Complete the complete product workflow before introducing React.
3. Separate UI, business logic and persistence.
4. Centralize LocalStorage access.
5. Avoid direct LocalStorage manipulation throughout page files.
6. Keep reusable UI logic separate from page-specific logic.
7. Avoid one giant JavaScript file.
8. Use CSS Grid for two-dimensional layouts.
9. Use Flexbox for one-dimensional layouts.
10. Keep Admin and Tenant responsibilities separate.
11. Derive dashboard statistics from source data.
12. Avoid unnecessary data duplication.
13. Validate all important user input.
14. Provide meaningful empty and error states.
15. Follow the PRD as the product source of truth.
16. Follow `design.md` as the visual/UI source of truth.
17. Follow `rules.md` for AI-assisted development.
18. Follow `phases.md` for implementation order.
19. Use `memory.md` to record important development decisions.
20. Do not introduce major architecture changes without documenting the decision.

## 4. Technology Stack

### 4.1 Initial MVP

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Styling and responsive UI |
| JavaScript | Application logic |
| LocalStorage | Client-side persistence |
| CSS Grid | Dashboard and multi-column layouts |
| Flexbox | Navigation, actions and component alignment |

The following are intentionally excluded from the initial MVP: React, Redux, backend, database, real payment gateway, authentication provider, and unnecessary third-party libraries.

### 4.2 Future React Version

After the Vanilla MVP is complete:

- React
- Vite
- React Router
- JavaScript
- CSS
- Existing/adapted service logic
- API client
- Backend API
- Database

The exact backend stack will be decided later and documented separately.

## 5. High-Level Current Architecture

```text
┌──────────────────────────┐
│       HTML Pages         │
│ Login / Admin / Tenant   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│    Vanilla JavaScript    │
│ DOM / Events / Forms     │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Service Layer       │
│ Auth / Properties / etc. │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Storage Layer       │
│   Centralized Storage    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       LocalStorage       │
└──────────────────────────┘
```

## 6. Project Structure

```text
RentEase/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── signup.html
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── properties.html
│   │   ├── property-details.html
│   │   ├── tenants.html
│   │   ├── payments.html
│   │   ├── leases.html
│   │   ├── maintenance.html
│   │   └── messages.html
│   └── tenant/
│       ├── dashboard.html
│       ├── property.html
│       ├── payments.html
│       ├── lease.html
│       ├── maintenance.html
│       └── messages.html
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── globals.css
│   ├── layout.css
│   ├── components.css
│   ├── forms.css
│   ├── tables.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── propertyService.js
│   │   ├── tenantService.js
│   │   ├── leaseService.js
│   │   ├── paymentService.js
│   │   ├── maintenanceService.js
│   │   └── messageService.js
│   ├── storage/
│   │   └── storage.js
│   ├── components/
│   │   ├── sidebar.js
│   │   ├── navbar.js
│   │   ├── modal.js
│   │   ├── toast.js
│   │   └── table.js
│   ├── pages/
│   │   ├── admin/
│   │   └── tenant/
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   └── constants.js
│   └── data/
│       └── seedData.js
│
├── assets/
│   └── images/
│
├── docs/
│   ├── product-requirements.md
│   ├── architecture.md
│   ├── design.md
│   ├── rules.md
│   ├── phases.md
│   └── memory.md
│
└── README.md
```

`pages/admin/` and `pages/tenant/` contain actual HTML pages. `js/pages/admin/` and `js/pages/tenant/` contain JavaScript logic specific to those pages.

## 7. Page Architecture

### Public Pages

```text
/
├── index.html
├── login
└── signup
```

Responsibilities: product introduction, login, signup and authentication entry point.

### Admin Pages

```text
/admin/dashboard.html
/admin/properties.html
/admin/property-details.html
/admin/tenants.html
/admin/payments.html
/admin/leases.html
/admin/maintenance.html
/admin/messages.html
```

Admin capabilities: dashboard, property CRUD, tenant management, tenant assignment, lease management, payment tracking, maintenance management and messaging.

### Tenant Pages

```text
/tenant/dashboard.html
/tenant/property.html
/tenant/payments.html
/tenant/lease.html
/tenant/maintenance.html
/tenant/messages.html
```

Tenant capabilities: view dashboard, assigned property, lease, payment history/status, create and track maintenance requests, and messaging.

## 8. Authentication Architecture

### Signup Flow

```text
Signup Form → Validate Input → Check Existing Email → Create User → Save to LocalStorage → Redirect to Login
```

### Login Flow

```text
Login Form → Validate Input → Read Users → Match Credentials → Set currentUser → Check Role → Redirect
```

Admin → Admin Dashboard. Tenant → Tenant Dashboard.

### Logout

```text
Logout → Remove currentUser → Redirect to Login
```

## 9. User Roles

Two roles exist in the MVP:

```text
admin
tenant
```

Admin can manage properties, tenants, leases, payments, maintenance and messages.

Tenant can view their property, lease and payments, create/track maintenance requests, and exchange messages.

A tenant must not access Admin-only pages.

## 10. Authentication Data Model

```js
{
  id: "user_001",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  password: "demo-password",
  role: "admin",
  createdAt: "2026-10-06T00:00:00.000Z"
}
```

**Security limitation:** LocalStorage passwords are not secure. This is acceptable only for the academic MVP requirement. Production would use backend authentication, password hashing, secure sessions/tokens and server-side authorization.

## 11. Storage Architecture

All LocalStorage access must pass through `js/storage/storage.js`.

Example abstraction:

```js
storage.get(key)
storage.set(key, value)
storage.remove(key)
```

Pages and services should not repeatedly implement raw LocalStorage parsing themselves.

### Storage Keys

```text
rentEase_users
rentEase_currentUser
rentEase_properties
rentEase_leases
rentEase_payments
rentEase_maintenanceRequests
rentEase_messages
```

## 12. Service Layer

The service layer contains business operations between the UI and persistence layer.

### authService.js

- signup
- login
- logout
- getCurrentUser
- isAuthenticated
- requireAuth
- requireRole

### propertyService.js

- getProperties
- getPropertyById
- createProperty
- updateProperty
- deleteProperty

### tenantService.js

- getTenants
- getTenantById
- assignTenant
- getTenantProperty

### leaseService.js

- getLeases
- getLeaseById
- createLease
- updateLease

### paymentService.js

- getPayments
- getPaymentById
- updatePaymentStatus
- getTenantPayments

### maintenanceService.js

- getRequests
- getRequestById
- createRequest
- updateRequest
- filterRequests

### messageService.js

- getMessages
- sendMessage
- markAsRead

## 13. Data Model

### User

```js
{
  id,
  name,
  email,
  password,
  role,
  createdAt
}
```

### Property

```js
{
  id,
  title,
  address,
  city,
  type,
  rent,
  bedrooms,
  bathrooms,
  amenities,
  status,
  image,
  createdAt
}
```

### Lease

```js
{
  id,
  propertyId,
  tenantId,
  startDate,
  endDate,
  monthlyRent,
  securityDeposit,
  status,
  createdAt
}
```

### Payment

```js
{
  id,
  leaseId,
  tenantId,
  amount,
  dueDate,
  paidDate,
  status,
  createdAt
}
```

### MaintenanceRequest

```js
{
  id,
  propertyId,
  tenantId,
  title,
  description,
  priority,
  status,
  createdAt,
  updatedAt
}
```

### Message

```js
{
  id,
  senderId,
  receiverId,
  content,
  createdAt,
  read
}
```

## 14. Data Relationships

```text
User
 │
 ├── Admin
 │
 └── Tenant
       │
       ▼
    Property
       │
       ▼
     Lease
       │
       ▼
    Payment
```

Maintenance:

```text
Tenant → Property → Maintenance Request → Admin
```

Messaging:

```text
Admin ↔ Tenant
```

## 15. Source of Truth

| Data | Source of Truth |
|---|---|
| Authentication | users + currentUser |
| Properties | properties |
| Tenants | users filtered by tenant role |
| Leases | leases |
| Payments | payments |
| Maintenance | maintenanceRequests |
| Messages | messages |

Dashboard statistics must be calculated from source data, not duplicated into separate counters.

## 16. State Architecture

### Persistent State

Stored in LocalStorage:

- Users
- Current user
- Properties
- Leases
- Payments
- Maintenance requests
- Messages

### Temporary UI State

Held in JavaScript memory:

```text
currentUser
currentPageData
selectedProperty
selectedTenant
selectedMaintenanceRequest
formState
filterState
```

Temporary state should not be unnecessarily persisted.

## 17. DOM and Event Flow

```text
Page Script
    ↓
Call Service
    ↓
Receive Data
    ↓
Prepare View Data
    ↓
Render DOM
    ↓
Attach Event Handlers
    ↓
User Action
    ↓
Call Service
    ↓
Update LocalStorage
    ↓
Refresh UI
```

Example:

```text
Click "Add Property"
       ↓
Open Form
       ↓
Submit Form
       ↓
Validate
       ↓
propertyService.createProperty()
       ↓
storage.set()
       ↓
Show Success Toast
       ↓
Refresh Property List
```

## 18. Reusable UI Components

Even without React, repeated UI structures should use reusable JavaScript functions/modules:

```text
renderSidebar()
renderNavbar()
renderPropertyCard()
renderPaymentTable()
renderTenantRow()
showModal()
showToast()
renderEmptyState()
```

The goal is to avoid duplicating the same markup and logic unnecessarily.

## 19. CRUD Architecture

### Create

- Create property
- Create tenant
- Create lease
- Create maintenance request
- Send message

### Read

- View properties
- View tenants
- View payments
- View leases
- View maintenance requests

### Update

- Edit property
- Update lease
- Mark payment status
- Update maintenance status
- Mark message as read

### Delete

- Delete property
- Delete/remove appropriate records

Deletion should require confirmation where appropriate.

## 20. Form Architecture

```text
Input → Form State → Validation → Submit Handler → Service → LocalStorage → Feedback
```

Validation should cover required fields, valid email, valid numbers, valid dates, duplicate email, invalid relationships and appropriate status values.

## 21. Error States

The application must handle at least:

- Invalid login
- Duplicate signup email
- Missing required fields
- Invalid form data
- Missing property
- Missing tenant
- Missing lease
- Unauthorized page access
- Invalid record relationships
- LocalStorage failure where practical

Errors should be understandable to the user.

## 22. Empty States

Pages must not look broken when there is no data.

Examples:

```text
No properties added yet.
No payments found.
No maintenance requests.
No messages yet.
```

An appropriate action should be provided where useful.

## 23. Authorization Architecture

```text
Admin → Admin pages
Tenant → Tenant pages
```

Unauthenticated user → Login.

Tenant attempting Admin page → Unauthorized → Tenant Dashboard.

This is frontend application-level protection, not real server security.

## 24. CSS Architecture

```text
variables.css
      ↓
reset.css
      ↓
globals.css
      ↓
layout.css
      ↓
components.css
      ↓
forms.css / tables.css
      ↓
page-specific styling
      ↓
responsive.css
```

## 25. CSS Grid vs Flexbox

### Use CSS Grid for

- Dashboard statistics
- Property card grids
- Multi-column layouts
- Two-dimensional page sections
- Complex content areas

### Use Flexbox for

- Navigation
- Sidebar items
- Buttons
- Card headers
- Action groups
- Form rows
- Horizontal alignment

Rule: **Use Grid when both rows and columns matter. Use Flexbox when the layout primarily follows one direction.**

## 26. Responsive Architecture

### Desktop

```text
Sidebar | Main Content
```

### Tablet

```text
Compact Navigation + Main Content
```

### Mobile

```text
Collapsed/Drawer Navigation
       ↓
Single-column Content
```

Tables should support horizontal scrolling or an appropriate mobile representation. Property cards and dashboard grids should collapse responsively.

## 27. Seed Data

Demo data may be provided through `js/data/seedData.js`.

Seed data should initialize only when the required collection does not already exist. It must never overwrite existing user data on every page load.

```text
First launch → No collection → Create demo data
Later launch → Collection exists → Do not overwrite
```

## 28. ID Strategy

Use simple unique frontend IDs during the LocalStorage MVP:

```text
user_001
property_001
lease_001
payment_001
maintenance_001
message_001
```

IDs must remain stable once records are created.

## 29. Derived Data

Do not duplicate data that can be calculated.

Example:

```js
occupiedProperties =
  properties.filter(property => property.status === "occupied")
```

Dashboard statistics should be derived from actual source collections.

## 30. Business Logic Boundaries

### UI layer

Responsible for display, DOM, user interaction, form submission and feedback.

### Service layer

Responsible for business operations, CRUD, relationship logic, authorization checks and data preparation.

### Storage layer

Responsible for read, write, remove, serialization and deserialization.

This separation makes the future React migration easier.

## 31. Future Backend Migration

Current:

```text
HTML → JavaScript → Services → LocalStorage
```

Future:

```text
React → Services / API Client → Backend API → Database
```

The service layer should be designed so LocalStorage can later be replaced by API calls without rewriting the entire application.

## 32. React Migration Strategy

React migration will happen only after the Vanilla MVP is complete.

### Preserve

- Product requirements
- User flows
- Business rules
- Data models
- Service responsibilities
- Design system
- Validation rules
- Role separation

### Replace

```text
HTML page rendering → React components
DOM manipulation → Declarative React rendering
Manual UI state → React state/hooks
Page navigation → React Router
```

## 33. Why React Comes Later

The Vanilla MVP exposes the problems that make React useful:

```text
Repeated DOM updates → Componentization
Manual UI state → React state
Multiple pages → Client-side routing
Repeated rendering logic → Reusable components
```

React is therefore introduced because the product has reached a point where its abstractions are useful, not simply because React is popular.

## 34. Backend Migration Path

```text
┌─────────────────────┐
│    React Frontend   │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│   API / Service     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Backend Application │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│      Database       │
└─────────────────────┘
```

The backend can later provide secure authentication, password hashing, server authorization, persistent database storage, real payment integration, file/image storage, notifications and production APIs.

## 35. Current MVP Constraints

The following are explicitly out of scope for the initial implementation:

- React
- Backend
- Database
- Real payment processing
- Production authentication
- Redux
- Complex state-management libraries
- Unnecessary third-party frameworks
- AI features not required by the PRD

The project should not expand into these areas before the core MVP is complete.

## 36. Future React Constraints

When React is introduced:

1. Preserve the PRD.
2. Preserve business behavior unless a documented product decision changes it.
3. Preserve the core data model.
4. Preserve the design system.
5. Reuse/adapt service concepts.
6. Avoid unnecessary global state.
7. Use components for repeated UI.
8. Use React Router for application navigation.
9. Keep business logic out of purely presentational components.
10. Do not migrate just for the sake of using React.

## 37. Architecture Decision Records

### ADR-001 — Build MVP Without React

**Decision:** Build the first working version using Vanilla HTML/CSS/JavaScript.

**Reason:** Establish a strong understanding of the product, DOM, events, forms, state and persistence before introducing framework abstractions.

### ADR-002 — HTML/CSS/Vanilla JavaScript

**Decision:** Use standard frontend technologies for the initial MVP.

**Reason:** They are sufficient for the academic project and directly demonstrate required DTI concepts.

### ADR-003 — LocalStorage MVP Persistence

**Decision:** Use LocalStorage for persistence.

**Reason:** The review explicitly requires LocalStorage-based signup/login and storage/retrieval demonstration.

### ADR-004 — Service Layer

**Decision:** Business operations are separated into service modules.

**Reason:** Prevent tightly coupling UI code with persistence and make future React/backend migration easier.

### ADR-005 — React After Practical MVP

**Decision:** Introduce React only after the Vanilla MVP is complete and reviewed.

**Reason:** React should be learned and introduced as an evolution of a working system rather than replacing the initial learning and implementation process.

## 38. Architecture Freeze Rule

Before making a major architectural change:

```text
Identify Problem
      ↓
Evaluate Alternatives
      ↓
Make Decision
      ↓
Update architecture.md
      ↓
Record Decision in memory.md
      ↓
Continue Development
```

AI-assisted development must not silently introduce React, backend, database, Redux, new frameworks, a different folder architecture or a different persistence architecture without a documented decision.

## 39. Relationship Between Project Documents

| Document | Purpose |
|---|---|
| `product-requirements.md` | What and why |
| `architecture.md` | How the system is technically structured |
| `design.md` | Visual and UI/UX behavior |
| `rules.md` | Development and AI rules |
| `phases.md` | Implementation order |
| `memory.md` | Development history and decisions |

The documents work together but have different responsibilities.

## 40. Final Development Direction

```text
PRODUCT
   ↓
PRODUCT REQUIREMENTS
   ↓
ARCHITECTURE
   ↓
DESIGN
   ↓
RULES
   ↓
PHASES
   ↓
VANILLA HTML/CSS/JS MVP
   ↓
PRACTICAL TESTING
   ↓
DTI DEMONSTRATION
   ↓
REVIEW
   ↓
REACT MIGRATION
   ↓
REACT VERSION
   ↓
POSSIBLE BACKEND
```

The most important principle is:

> Build the product first. Understand the underlying frontend system. Then introduce React as the next architectural evolution.

## 41. Architecture Completion Criteria

- [x] Initial stack defined
- [x] React intentionally delayed
- [x] Folder structure defined
- [x] Page architecture defined
- [x] Authentication flow defined
- [x] Role architecture defined
- [x] Storage architecture defined
- [x] Service layer defined
- [x] Data models defined
- [x] Relationships defined
- [x] State architecture defined
- [x] DOM/event flow defined
- [x] CRUD architecture defined
- [x] Validation architecture defined
- [x] Error states defined
- [x] Empty states defined
- [x] CSS architecture defined
- [x] Grid/Flexbox usage defined
- [x] Responsive strategy defined
- [x] Seed data strategy defined
- [x] Authorization flow defined
- [x] React migration strategy defined
- [x] Backend migration path defined
- [x] Architecture decision records defined
- [x] Architecture freeze rule defined

## 42. Final Architecture Statement

RentEase will first be developed as a complete, practical Vanilla frontend application using HTML5, CSS3, JavaScript and LocalStorage.

The first version will demonstrate the complete product workflow, authentication, role separation, CRUD operations, forms, validation, responsive UI, DOM interaction, persistence and service-based organization.

After the Vanilla MVP is complete, tested and reviewed, the same product architecture will evolve into React.

React is therefore the **second implementation layer**, not the starting point.

This approach keeps the project practical, understandable, DTI-aligned, maintainable, extensible and ready for future React and backend migration.
