# RentEase — Product Requirements Document

**Document:** `product-requirements.md`  
**Product:** RentEase — Property Management System  
**Version:** 1.0  
**Status:** Draft for Product/Scope Freeze  
**Date:** 2026-10-05

---

## 1. Product Overview

RentEase is a frontend-based property management system designed to help property owners and property managers manage properties, tenants, leases, rental payments, maintenance requests, and communication from a centralized interface.

The project is being developed as a DTI academic project and must satisfy the provided review rubric while being designed and implemented like a real software product.

The initial implementation is frontend-only and uses Local Storage for authentication and application data persistence.

> **Important:** Local Storage is being used because it is explicitly required by the academic project rubric. It is not considered production-grade authentication or data storage.

---

## 2. Problem Statement

Property owners and property managers often manage property information, tenants, rental payments, leases, and maintenance requests using disconnected tools such as spreadsheets, messaging applications, paper records, or informal communication.

This creates several problems:

- Property information is difficult to organize.
- Tenant information is scattered.
- Rental payment tracking becomes difficult.
- Lease information is difficult to monitor.
- Maintenance requests can be lost in conversations.
- Property managers lack a centralized overview of their operations.
- Tenants have limited visibility into their rental information.

RentEase aims to provide a single interface for managing these core property-management activities.

---

## 3. Product Vision

> **Build a simple, intuitive, centralized property-management experience that gives property managers operational visibility and gives tenants clear access to their rental information.**

---

## 4. Product Goals

### Primary Goals

1. Provide separate Admin and Tenant experiences.
2. Allow users to register and authenticate using Local Storage.
3. Allow Admins to manage properties.
4. Allow Admins to manage tenant information.
5. Allow the system to represent leases.
6. Allow rental payments to be tracked.
7. Allow tenants to submit maintenance requests.
8. Allow Admins to manage maintenance requests.
9. Provide useful dashboards for both roles.
10. Provide a polished, responsive, user-friendly UI.
11. Demonstrate appropriate use of CSS Grid and Flexbox.
12. Provide a complete end-to-end project demonstration.
13. Clearly connect the project to relevant DTI concepts.

### Secondary Goals

- Make the application feel like a realistic SaaS product.
- Use reusable frontend architecture.
- Keep the application maintainable.
- Demonstrate practical product-management thinking.
- Make the project suitable for portfolio presentation.

---

## 5. Non-Goals

The following are intentionally outside the initial MVP:

- Real payment processing.
- Real banking integration.
- Real email/SMS delivery.
- Production-grade backend authentication.
- Real-time chat infrastructure.
- Government/legal verification.
- Property marketplace functionality.
- AI property valuation.
- Complex accounting.
- Multi-company enterprise administration.

These may be considered as future scope but must not be added to the MVP without an explicit product decision.

---

## 6. Target Users

### 6.1 Admin / Property Manager

A person responsible for managing one or more rental properties and their tenants.

Primary needs:

- Know the current status of properties.
- Manage property information.
- Track tenants.
- Monitor rental payments.
- Manage leases.
- Handle maintenance requests.
- Communicate with tenants.

### 6.2 Tenant

A person currently renting a property managed through RentEase.

Primary needs:

- View their property information.
- View lease information.
- Track rent/payment status.
- Submit maintenance requests.
- Track maintenance request progress.
- Communicate with the property manager.

---

## 7. User Personas

### Persona A — Property Manager

**Name:** Rahul  
**Role:** Property Manager  
**Properties:** 15 rental units

**Pain points:**

- Uses spreadsheets for rent tracking.
- Uses WhatsApp for maintenance requests.
- Has difficulty knowing which properties are vacant.
- Wants one dashboard showing important information.

**Goal:**

Manage day-to-day rental operations from one place.

### Persona B — Tenant

**Name:** Priya  
**Role:** Tenant

**Pain points:**

- Does not always know whether a payment has been recorded.
- Has to message the manager for property/lease information.
- Wants an easy way to report maintenance issues.

**Goal:**

Access rental information and communicate with the property manager without unnecessary friction.

---

## 8. Product Modules

RentEase contains two mandatory primary modules.

### 8.1 Admin Module

Admin responsibilities:

- View operational dashboard.
- Add properties.
- Edit properties.
- Delete properties.
- View property details.
- View tenant information.
- Assign tenants to properties.
- Track rental payments.
- Manage lease information.
- View maintenance requests.
- Update maintenance request status.
- Communicate with tenants.

### 8.2 Tenant Module

Tenant responsibilities:

- View personal dashboard.
- View assigned property.
- View lease information.
- View payment history.
- View current payment status.
- Create maintenance requests.
- Track maintenance request status.
- Communicate with Admin.

---

## 9. MVP Scope

The MVP must include the following:

### Authentication

- Signup
- Login
- Logout
- Role selection/role assignment
- Persistent session using Local Storage
- Invalid-login handling
- Protected Admin/Tenant routes

### Admin

- Dashboard
- Property management
- Tenant management
- Payment tracking
- Lease management
- Maintenance management

### Tenant

- Dashboard
- My Property
- Payments
- Lease
- Maintenance Requests

### Shared

- Navigation
- Notifications/feedback
- Responsive layout
- Form validation
- Empty states
- Error states

---

## 10. Core User Journeys

### 10.1 Admin Journey

```text
Landing Page
    ↓
Admin Login
    ↓
Admin Dashboard
    ↓
Create Property
    ↓
View Property
    ↓
Assign Tenant
    ↓
Create/View Lease
    ↓
Track Rental Payment
    ↓
Receive Maintenance Request
    ↓
Update Maintenance Status
    ↓
Tenant sees updated status
```

### 10.2 Tenant Journey

```text
Landing Page
    ↓
Tenant Signup/Login
    ↓
Tenant Dashboard
    ↓
View Property
    ↓
View Lease
    ↓
View Payment History
    ↓
Submit Maintenance Request
    ↓
Track Request Status
```

---

## 11. Functional Requirements

### FR-01 — User Registration

The system shall allow a new user to create an account.

Required fields:

- Name
- Email
- Password
- Role

The user record must be stored in Local Storage.

### FR-02 — User Login

The system shall allow registered users to log in using their credentials.

The system shall:

1. Retrieve users from Local Storage.
2. Find the matching account.
3. Validate credentials.
4. Store the current session/user.
5. Redirect based on role.

### FR-03 — Logout

The system shall allow the current user to log out.

Logout shall clear the active session without deleting the user's registered account.

### FR-04 — Admin Dashboard

The Admin dashboard shall provide an overview of:

- Total properties
- Occupied properties
- Vacant properties
- Total tenants
- Paid/pending rental payments
- Maintenance requests
- Recent activity

### FR-05 — Property Management

Admin shall be able to:

- Create property.
- View properties.
- Edit property.
- Delete property.
- View property details.
- Change property status.

Property information should include:

- Property name/title
- Address
- City
- Property type
- Monthly rent
- Bedrooms
- Bathrooms
- Amenities
- Status
- Image

### FR-06 — Tenant Management

Admin shall be able to:

- View tenants.
- View tenant details.
- Assign a tenant to a property.
- View the tenant's associated lease.

### FR-07 — Lease Management

The system shall represent lease information including:

- Tenant
- Property
- Start date
- End date
- Monthly rent
- Security deposit
- Lease status

### FR-08 — Payment Tracking

The system shall allow rental payments to be tracked.

Payment information shall include:

- Tenant
- Property/lease
- Amount
- Due date
- Paid date
- Status

Possible status values:

- Paid
- Pending
- Overdue

The initial system shall simulate payment tracking rather than process real payments.

### FR-09 — Maintenance Requests

Tenant shall be able to create a maintenance request.

Request fields:

- Title
- Description
- Priority
- Property
- Created date

Priority:

- Low
- Medium
- High

Status:

- Pending
- In Progress
- Resolved

Admin shall be able to update request status.

### FR-10 — Tenant Dashboard

The Tenant dashboard shall show:

- Assigned property
- Monthly rent
- Next payment
- Lease status
- Payment status
- Recent maintenance requests

### FR-11 — Property Details

Tenant shall be able to view relevant information about their assigned property.

### FR-12 — Payment History

Tenant shall be able to view previous rental payments and their status.

### FR-13 — Lease Details

Tenant shall be able to view:

- Lease start date
- Lease end date
- Monthly rent
- Security deposit
- Lease status

### FR-14 — Communication

The MVP may provide a simple in-app communication/message representation between Admin and Tenant.

A real-time messaging backend is outside MVP scope.

---

## 12. Data Entities

The MVP will use these core entities:

```text
User
Property
Lease
Payment
MaintenanceRequest
Message
```

### User

```text
id
name
email
password
role
createdAt
```

### Property

```text
id
title
address
city
type
rent
bedrooms
bathrooms
amenities
status
image
createdAt
```

### Lease

```text
id
propertyId
tenantId
startDate
endDate
monthlyRent
securityDeposit
status
createdAt
```

### Payment

```text
id
leaseId
tenantId
amount
dueDate
paidDate
status
createdAt
```

### MaintenanceRequest

```text
id
propertyId
tenantId
title
description
priority
status
createdAt
updatedAt
```

### Message

```text
id
senderId
receiverId
content
createdAt
read
```

---

## 13. Business Rules

### BR-01

Only authenticated users can access protected application areas.

### BR-02

Admin users can access Admin functionality.

### BR-03

Tenant users can access Tenant functionality.

### BR-04

A property can have an occupancy status.

### BR-05

A tenant should only see their own rental information.

### BR-06

A tenant should only be able to create/view maintenance requests associated with their accessible property.

### BR-07

Payment status must be represented consistently across Admin and Tenant views.

### BR-08

Changing a maintenance request status should be reflected wherever that request is displayed.

### BR-09

Deleting a property must require confirmation.

### BR-10

Required form fields must be validated before data is stored.

### BR-11

Local Storage is the source of persistence for the frontend MVP.

### BR-12

Real payment processing is not part of the MVP.

---

## 14. UI/UX Requirements

The interface should follow a modern SaaS dashboard approach.

### Required layout principles

- CSS Grid should be used where two-dimensional layout is appropriate.
- Flexbox should be used for one-dimensional alignment and component-level layouts.
- Navigation must be consistent.
- Important actions should be visually clear.
- Tables/cards should have clear hierarchy.
- Forms should provide useful validation feedback.
- Empty states should be designed rather than showing blank screens.
- Destructive actions should require confirmation.
- The UI should work on desktop and smaller screens.

Detailed visual rules will be defined separately in `design.md`.

---

## 15. Required Screens

### Public

1. Landing Page
2. Login
3. Signup

### Admin

4. Admin Dashboard
5. Properties
6. Add Property
7. Edit Property
8. Property Details
9. Tenants
10. Tenant Details
11. Payments
12. Leases
13. Maintenance
14. Messages

### Tenant

15. Tenant Dashboard
16. My Property
17. Payments
18. Lease
19. Maintenance
20. Messages

Screens may share reusable components and layouts.

---

## 16. Acceptance Criteria for MVP

The MVP is considered complete when:

### Authentication

- [ ] User can register.
- [ ] Registration persists after page refresh.
- [ ] User can log in.
- [ ] Invalid credentials are rejected.
- [ ] User is redirected according to role.
- [ ] Protected routes cannot be accessed without authentication.
- [ ] Logout works.

### Admin

- [ ] Admin dashboard displays meaningful statistics.
- [ ] Admin can create a property.
- [ ] Admin can edit a property.
- [ ] Admin can delete a property.
- [ ] Admin can view tenants.
- [ ] Admin can manage leases.
- [ ] Admin can view/update payment status.
- [ ] Admin can manage maintenance requests.

### Tenant

- [ ] Tenant dashboard displays relevant information.
- [ ] Tenant can view their property.
- [ ] Tenant can view lease information.
- [ ] Tenant can view payment history.
- [ ] Tenant can create maintenance requests.
- [ ] Tenant can track maintenance status.

### UI

- [ ] Layout uses CSS Grid and/or Flexbox appropriately.
- [ ] UI is responsive.
- [ ] Forms have validation.
- [ ] Empty states exist.
- [ ] Error states exist.
- [ ] Navigation is consistent.
- [ ] UI follows `design.md`.

### Demonstration

- [ ] Complete Admin workflow can be demonstrated.
- [ ] Complete Tenant workflow can be demonstrated.
- [ ] Local Storage data can be demonstrated.
- [ ] Problem statement can be explained.
- [ ] Modules can be explained.
- [ ] Technologies can be explained.
- [ ] DTI concepts can be connected to the project.

---

## 17. Success Criteria

The project succeeds if a reviewer can understand the product without needing the developer to explain every screen.

A successful demonstration should show:

1. A clear business problem.
2. Clearly defined Admin and Tenant roles.
3. A coherent user journey.
4. Persistent Local Storage data.
5. Meaningful property-management workflows.
6. Consistent UI/UX.
7. Proper frontend architecture.
8. Complete MVP functionality.
9. Clear DTI connection.
10. A professional final presentation.

---

## 18. DTI Alignment

The project should demonstrate DTI concepts through implementation rather than merely mentioning them.

Relevant concepts include:

### Problem Identification

Identifying the operational problems faced by property managers and tenants.

### User-Centric Design

Designing separate workflows based on the needs of Admins and Tenants.

### Modular Design

Separating the system into Admin and Tenant modules.

### Iterative Development

Building the project through defined phases and validating each phase before proceeding.

### Requirement Analysis

Converting the problem statement into functional requirements and acceptance criteria.

### UI/UX Design

Designing an interface that is usable, responsive, and organized around user workflows.

### Data Management

Using structured entities and Local Storage to demonstrate persistence.

### Testing and Validation

Validating each feature against its acceptance criteria.

---

## 19. Future Scope

Potential future versions may include:

- Backend API.
- Secure authentication.
- Password hashing.
- Database integration.
- Real payment gateway.
- Email notifications.
- SMS/WhatsApp notifications.
- Real-time chat.
- Document upload for lease agreements.
- Maintenance image attachments.
- Advanced analytics.
- Automated rent reminders.
- Multi-property organizations.
- Role-based permissions beyond Admin/Tenant.
- Mobile application.
- AI-assisted property and maintenance insights.

These features are not part of the MVP unless explicitly approved later.

---

## 20. Product Scope Protection

The following rule applies throughout development:

> **A feature is not automatically part of RentEase because it sounds useful. It must have a clear user problem, product value, and place within the defined product scope.**

Any major scope change must be recorded as a product decision and reflected in the relevant project documentation.

---

## 21. Document Dependencies

This document defines **what** RentEase must accomplish.

Other project documents define:

- `architecture.md` → how the system is technically structured.
- `design.md` → how the system looks and behaves visually.
- `rules.md` → rules that must be followed during development.
- `phases.md` → the order in which the product will be built.
- `memory.md` → decisions, progress, changes, and development history.

The Product Requirements Document takes precedence over implementation convenience.

---

## 22. Current Product Status

**Status:** Product definition in progress.

### Completed

- Initial business problem identified.
- Admin module identified.
- Tenant module identified.
- Initial MVP scope identified.
- Core entities identified.
- Initial user journeys identified.
- Academic rubric requirements mapped.

### Pending

- Architecture definition.
- UI/UX design system.
- Development rules.
- Development phases.
- Project memory initialization.

---

## 23. Approval Gate

Before implementation begins, the following must be finalized:

- [ ] Product scope approved.
- [ ] MVP approved.
- [ ] Admin responsibilities approved.
- [ ] Tenant responsibilities approved.
- [ ] Core entities approved.
- [ ] User journeys approved.
- [ ] Architecture documented.
- [ ] Design system documented.
- [ ] Development rules documented.
- [ ] Development phases documented.

Once these are approved, implementation can begin.
