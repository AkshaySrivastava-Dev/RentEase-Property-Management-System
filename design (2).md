# RentEase — Design System & UI/UX Specification

**Document:** `design.md`  
**Version:** 1.0  
**Status:** Initial Design System  
**Date:** 2026-10-07

---

# 1. Purpose

This document defines the visual language, UI/UX behavior and reusable design rules for RentEase.

It is the visual source of truth for the project.

The purpose is to ensure that:

- All pages feel like one product.
- Admin and Tenant interfaces remain consistent.
- Components are reusable.
- AI-assisted development does not randomly change the visual design.
- The Vanilla HTML/CSS/JavaScript implementation has a clear design system.
- The same design system can later be migrated into React.

---

# 2. Design Philosophy

RentEase is a property-management product, so the interface should communicate:

- Professional
- Clean
- Reliable
- Organized
- Modern
- Easy to understand
- Business-oriented

The UI should prioritize clarity over visual decoration.

The product should feel like a real SaaS dashboard rather than a college-project interface.

---

# 3. Visual Direction

The overall design direction is:

```text
Modern SaaS Dashboard
        +
Property Management
        +
Clean Enterprise UI
```

The interface should use:

- Clean cards
- Clear hierarchy
- Consistent spacing
- Subtle borders
- Moderate shadows
- Strong typography hierarchy
- Clear status indicators
- Minimal decorative elements

Avoid:

- Excessive gradients
- Excessive animations
- Large decorative illustrations everywhere
- Too many colors
- Inconsistent card styles
- Excessive rounded elements
- Random UI patterns

---

# 4. Design Principles

## 4.1 Clarity First

Users should immediately understand:

- Where they are
- What they can do
- What data they are viewing
- What action is available

---

## 4.2 Consistency

The same component should look and behave the same across pages.

For example:

- Primary buttons should always follow the same style.
- Status badges should use the same visual language.
- Tables should follow one structure.
- Form fields should remain consistent.

---

## 4.3 Information Hierarchy

Important information should visually stand out.

Hierarchy:

```text
Page Title
   ↓
Page Description
   ↓
Primary Action
   ↓
Important Metrics
   ↓
Main Content
   ↓
Secondary Information
```

---

## 4.4 Minimal Cognitive Load

Users should not need to think about how the interface works.

Navigation, buttons, forms and actions should be predictable.

---

# 5. Design Tokens

Design tokens should be centralized in:

```text
css/variables.css
```

---

# 6. Color System

RentEase uses a restrained professional color palette.

## 6.1 Primary

```css
--color-primary: #2563eb;
--color-primary-hover: #1d4ed8;
--color-primary-light: #eff6ff;
```

Primary is used for:

- Main buttons
- Active navigation
- Links
- Important interactive elements
- Selected states

---

## 6.2 Neutral Colors

```css
--color-background: #f8fafc;
--color-surface: #ffffff;
--color-border: #e2e8f0;

--color-text-primary: #0f172a;
--color-text-secondary: #475569;
--color-text-muted: #94a3b8;
```

---

## 6.3 Semantic Colors

Success:

```css
--color-success: #16a34a;
--color-success-light: #f0fdf4;
```

Warning:

```css
--color-warning: #d97706;
--color-warning-light: #fffbeb;
```

Danger:

```css
--color-danger: #dc2626;
--color-danger-light: #fef2f2;
```

Info:

```css
--color-info: #0284c7;
--color-info-light: #f0f9ff;
```

---

# 7. Color Usage Rules

Do not use colors randomly.

### Primary

Use for:

- Main CTA
- Active state
- Important links

### Success

Use for:

- Paid
- Completed
- Active
- Successful actions

### Warning

Use for:

- Pending
- Upcoming
- Attention required

### Danger

Use for:

- Failed
- Overdue
- Delete
- Critical issues

### Neutral

Use for:

- Secondary actions
- Disabled elements
- Supporting information

---

# 8. Typography

Use a modern sans-serif font.

Preferred stack:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

---

## 8.1 Typography Hierarchy

### Page Title

```text
28–32px
font-weight: 700
```

### Section Heading

```text
20–24px
font-weight: 600
```

### Card Heading

```text
16–18px
font-weight: 600
```

### Body Text

```text
14–16px
font-weight: 400
```

### Small Text

```text
12–13px
```

---

# 9. Spacing System

Use a consistent spacing scale.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

Prefer these values instead of arbitrary spacing.

---

# 10. Border Radius

Use moderate rounding.

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

Recommended:

- Inputs: `8px`
- Buttons: `8px`
- Cards: `12px`
- Modals: `12px`
- Large containers: `16px`

Avoid excessive pill-shaped UI unless appropriate for badges.

---

# 11. Shadows

Shadows should be subtle.

```css
--shadow-sm:
  0 1px 2px rgba(15, 23, 42, 0.05);

--shadow-md:
  0 4px 12px rgba(15, 23, 42, 0.08);

--shadow-lg:
  0 10px 30px rgba(15, 23, 42, 0.12);
```

Cards should generally use borders and very subtle shadows rather than heavy floating effects.

---

# 12. Page Layout

Admin and Tenant dashboards follow:

```text
┌──────────────┬──────────────────────────────┐
│              │                              │
│   Sidebar    │        Main Content          │
│              │                              │
│              │                              │
└──────────────┴──────────────────────────────┘
```

Desktop:

- Fixed/collapsible sidebar
- Main content fills remaining width

---

# 13. Sidebar

The sidebar contains:

- RentEase logo/name
- Dashboard
- Properties
- Tenants
- Leases
- Payments
- Maintenance
- Messages
- Logout

Tenant sidebar contains only relevant tenant navigation.

---

## 13.1 Sidebar States

### Default

Neutral background and text.

### Hover

Subtle background highlight.

### Active

Primary background/accent with strong text contrast.

### Disabled

Reduced opacity and non-interactive behavior.

---

# 14. Top Navbar

The top navigation area should contain:

- Page context if needed
- Search/filter where relevant
- Notifications where applicable
- User name/avatar
- Profile/logout action

The navbar should remain visually lightweight.

---

# 15. Main Content Container

Recommended:

```css
max-width: 1440px;
margin: 0 auto;
padding: 24px 32px;
```

On smaller screens, padding decreases.

---

# 16. Page Header

Every major page should use:

```text
Page Title
Short description
                         Primary Action
```

Example:

```text
Properties
Manage your rental properties

                         + Add Property
```

The title and description should remain visually grouped.

---

# 17. Dashboard Layout

Dashboard structure:

```text
Page Header
     ↓
Metric Cards
     ↓
Primary Content
     ↓
Secondary Content
```

Example:

```text
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│Property │ │Tenants  │ │Payments │ │Pending  │
│  24     │ │  18     │ │ ₹42K    │ │   5     │
└─────────┘ └─────────┘ └─────────┘ └─────────┘

┌─────────────────────────┐ ┌──────────────────┐
│ Recent Payments         │ │ Maintenance      │
│                         │ │ Requests         │
└─────────────────────────┘ └──────────────────┘
```

Use CSS Grid for this layout.

---

# 18. Metric Cards

Each metric card contains:

```text
Label
Value
Optional supporting information
Optional icon
```

Example:

```text
Total Properties

24

+3 this month
```

Rules:

- Keep content concise.
- Do not overload cards.
- Use consistent height.
- Use the same padding.
- Highlight the number more strongly than the label.

---

# 19. Cards

Standard card:

```text
┌──────────────────────────────┐
│ Card Header                  │
│                              │
│ Card Content                 │
│                              │
│ Card Footer / Actions        │
└──────────────────────────────┘
```

Cards should use:

- White surface
- Border
- Moderate radius
- Consistent padding

Recommended padding:

```text
20–24px
```

---

# 20. Property Cards

Property cards should contain:

- Property image
- Property name
- Location
- Property type
- Rent
- Status
- Main action

Example:

```text
┌──────────────────────────────┐
│                              │
│        Property Image        │
│                              │
├──────────────────────────────┤
│ Sunrise Residency            │
│ Hyderabad, Telangana         │
│                              │
│ ₹25,000 / month              │
│ [Occupied]                   │
│                              │
│ View Details                 │
└──────────────────────────────┘
```

Use CSS Grid for the property collection.

---

# 21. Tables

Tables are preferred when users need to compare structured records.

Use tables for:

- Tenants
- Payments
- Leases
- Maintenance requests where appropriate

Example:

```text
Tenant | Property | Rent | Status | Action
```

Rules:

- Clear column headers
- Adequate cell spacing
- Status badges
- Consistent action area
- Avoid excessive borders
- Maintain horizontal scrolling on small screens

---

# 22. Buttons

Three main button types:

## Primary

Used for the main action.

Examples:

```text
Add Property
Create Lease
Submit Request
```

---

## Secondary

Used for supporting actions.

Examples:

```text
Cancel
View
Filter
```

---

## Danger

Used for destructive actions.

Examples:

```text
Delete
Remove
```

Deletion must normally require confirmation.

---

# 23. Button Rules

Buttons should:

- Have clear labels
- Have adequate click area
- Maintain consistent height
- Use consistent radius
- Provide hover state
- Provide focus state
- Provide disabled state where applicable

Avoid vague labels such as:

```text
Click
Go
Do it
```

Prefer:

```text
Add Property
Save Changes
View Lease
Submit Request
```

---

# 24. Forms

Forms should be visually structured.

```text
Label
Input
Helper/Error Text
```

Example:

```text
Property Name

[________________________]

Enter the name of the property.
```

---

# 25. Input Design

Inputs should have:

- Clear border
- Moderate radius
- Consistent height
- Adequate horizontal padding
- Visible focus state

Focus state should clearly indicate the active input.

---

# 26. Form Validation UI

Invalid input:

```text
Input
  ↓
Red/error border
  ↓
Error message
```

Example:

```text
Email

[invalid@email]

Please enter a valid email address.
```

Errors should appear close to the field they describe.

---

# 27. Modal Design

Use modals for:

- Add property
- Edit property
- Confirmation
- Important short forms

Structure:

```text
Overlay
   ↓
Modal
 ├── Header
 ├── Content
 └── Actions
```

Example:

```text
┌─────────────────────────────┐
│ Add Property            X   │
├─────────────────────────────┤
│                             │
│ Property Name               │
│ [_______________________]   │
│                             │
│ Monthly Rent                │
│ [_______________________]   │
│                             │
│              Cancel  Save   │
└─────────────────────────────┘
```

---

# 28. Toast Notifications

Use toast notifications for short feedback.

Success:

```text
Property added successfully.
```

Error:

```text
Unable to save property.
```

Informational:

```text
Payment marked as pending.
```

Toasts should:

- Be noticeable
- Not block the interface
- Disappear automatically when appropriate
- Be accessible

---

# 29. Status Badges

Statuses should be visually distinct.

Examples:

### Property

```text
Available
Occupied
Maintenance
```

### Payment

```text
Paid
Pending
Overdue
```

### Lease

```text
Active
Expired
Upcoming
```

### Maintenance

```text
Open
In Progress
Resolved
```

Use semantic colors consistently.

---

# 30. Confirmation Dialogs

Destructive actions should ask for confirmation.

Example:

```text
Delete Property?

This action cannot be easily undone.

          Cancel    Delete
```

Danger actions should be visually differentiated.

---

# 31. Empty States

An empty page should communicate:

1. What is missing
2. Why it matters
3. What the user can do next

Example:

```text
No properties yet

Add your first property to start managing your portfolio.

        + Add Property
```

Avoid showing a completely blank page.

---

# 32. Loading States

If an operation takes noticeable time, provide appropriate feedback.

Examples:

```text
Saving...
```

```text
Loading properties...
```

For the LocalStorage MVP, loading states can remain lightweight because operations are local and fast.

---

# 33. Error States

Error screens/messages should clearly communicate:

- What went wrong
- What the user can do

Example:

```text
Unable to load this property.

Please return to the properties page and try again.
```

Avoid technical error messages such as:

```text
TypeError: Cannot read properties of undefined
```

in the user-facing UI.

---

# 34. Admin Dashboard Design

The Admin Dashboard should prioritize operational overview.

Recommended sections:

```text
Page Header
     ↓
Property Metrics
     ↓
Tenant / Payment Metrics
     ↓
Recent Payments
     ↓
Maintenance Requests
     ↓
Quick Actions
```

The Admin should be able to understand the current property-management situation quickly.

---

# 35. Admin Properties Page

Structure:

```text
Page Header
     ↓
Search / Filter
     ↓
Property Grid
```

Actions:

- Add
- View
- Edit
- Delete

---

# 36. Admin Tenants Page

Structure:

```text
Page Header
     ↓
Search / Filter
     ↓
Tenant Table
```

Information:

- Tenant name
- Email
- Assigned property
- Lease status
- Payment status
- Actions

---

# 37. Admin Payments Page

Use a structured table.

Columns may include:

```text
Tenant
Property
Amount
Due Date
Paid Date
Status
Action
```

Filters:

- Status
- Date
- Tenant/property where useful

---

# 38. Admin Lease Page

Show:

- Tenant
- Property
- Start date
- End date
- Monthly rent
- Security deposit
- Status

Provide:

- Create
- View
- Edit
- Appropriate status updates

---

# 39. Admin Maintenance Page

Use status-based organization.

Information:

```text
Request
Property
Tenant
Priority
Status
Created
Action
```

Priority levels:

```text
Low
Medium
High
Urgent
```

---

# 40. Tenant Dashboard Design

Tenant dashboard should be simpler than Admin Dashboard.

Recommended structure:

```text
Welcome / Page Header
        ↓
Property Summary
        ↓
Lease Summary
        ↓
Payment Summary
        ↓
Maintenance Summary
```

The Tenant should see only information relevant to their account.

---

# 41. Tenant Property Page

Show:

- Property image
- Property name
- Address
- Property type
- Rent
- Amenities
- Lease information

Avoid exposing unrelated properties.

---

# 42. Tenant Payments Page

Show:

```text
Amount
Due Date
Paid Date
Status
```

Use clear status badges.

---

# 43. Tenant Lease Page

Show:

- Property
- Lease start
- Lease end
- Monthly rent
- Security deposit
- Lease status

---

# 44. Tenant Maintenance Page

Primary action:

```text
+ New Maintenance Request
```

Request form:

- Title
- Description
- Priority

Request list:

```text
Title
Priority
Status
Created
Updated
```

---

# 45. Tenant Messages Page

Messaging UI should clearly distinguish:

```text
Sent
Received
Read
Unread
```

The conversation interface should remain simple for the MVP.

---

# 46. Responsive Design

## Desktop

Use:

- Sidebar
- Multi-column dashboard
- Property grid
- Full tables

---

## Tablet

Use:

- Compact navigation
- Reduced grid columns
- Flexible content widths
- Scrollable tables when needed

---

## Mobile

Use:

- Collapsed/drawer navigation
- Single-column content
- Full-width buttons where appropriate
- Stacked forms
- Horizontally scrollable tables
- Smaller page padding

---

# 47. Responsive Breakpoint Strategy

Use practical breakpoints rather than excessive device-specific rules.

Suggested:

```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-large: 1280px;
```

The exact breakpoints may be adjusted during implementation if required by the actual layout.

---

# 48. Accessibility

The interface should follow basic accessibility principles.

Required:

- Semantic HTML
- Labels for form fields
- Keyboard-accessible controls
- Visible focus states
- Sufficient text contrast
- Meaningful button labels
- Alt text for meaningful images
- Do not rely only on color to communicate status

Example:

Bad:

```text
Red = overdue
```

Better:

```text
[Overdue]
```

with the color providing additional visual support.

---

# 49. Icon Usage

Icons may be used for:

- Navigation
- Actions
- Status
- Dashboard metrics

Icons should support the text rather than replace important labels.

Avoid excessive icon-only buttons.

Icon-only actions must have accessible labels/tooltips where appropriate.

---

# 50. Animation

Animations should be subtle and purposeful.

Acceptable:

- Modal opening
- Toast appearing
- Hover transitions
- Sidebar transitions

Avoid:

- Excessive page animations
- Constant motion
- Distracting effects
- Long transitions

Recommended transition duration:

```text
150–250ms
```

---

# 51. Images

Property images should:

- Use consistent aspect ratios
- Have rounded corners where appropriate
- Use `object-fit: cover`
- Avoid distorted proportions

Example:

```css
object-fit: cover;
```

Placeholder images should be provided when a property has no image.

---

# 52. Navigation Rules

Navigation should remain predictable.

Admin navigation:

```text
Dashboard
Properties
Tenants
Leases
Payments
Maintenance
Messages
Logout
```

Tenant navigation:

```text
Dashboard
My Property
Lease
Payments
Maintenance
Messages
Logout
```

Do not expose irrelevant navigation items.

---

# 53. Search and Filters

Search/filter interfaces should be introduced where they improve usability.

Examples:

Properties:

```text
Search
Property Type
Status
```

Payments:

```text
Tenant
Status
Date
```

Maintenance:

```text
Priority
Status
Property
```

Filters should remain visually simple.

---

# 54. UI Consistency Rules

Every new UI component must answer:

1. Does an existing component already solve this?
2. Can the existing component be reused?
3. Does the new component follow the same spacing?
4. Does it use the existing color system?
5. Does it use the existing typography?
6. Does it follow the same interaction patterns?

Do not create visually different versions of an existing component without a clear reason.

---

# 55. AI-Assisted Design Rules

AI must follow this document when generating UI.

AI must not:

- Randomly change colors
- Introduce a new design system
- Replace the typography without reason
- Add excessive gradients
- Add unnecessary animations
- Change spacing randomly
- Create inconsistent buttons
- Create different card styles for every page
- Introduce a UI library without approval
- Redesign existing pages without a product/design decision

If a design improvement is genuinely required, the design decision should be documented.

---

# 56. Design Change Process

Before a major design change:

```text
Identify UI Problem
       ↓
Evaluate Existing Component
       ↓
Decide Whether Reuse Is Possible
       ↓
Make Design Decision
       ↓
Update design.md
       ↓
Implement
```

Small implementation adjustments are allowed when they preserve the design system.

---

# 57. Vanilla CSS Implementation

The design system should be implemented primarily through reusable CSS classes and variables.

Example:

```css
:root {
  --color-primary: #2563eb;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;

  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #94a3b8;

  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;

  --radius-md: 8px;
  --radius-lg: 12px;
}
```

Components should consume these variables instead of repeatedly hardcoding values.

---

# 58. React Migration of the Design System

When React is introduced, the visual system should remain substantially the same.

The migration changes:

```text
HTML templates
      ↓
React components
```

but should preserve:

```text
Colors
Typography
Spacing
Components
Layout
Responsive behavior
Interaction patterns
```

The React version should not automatically become visually different simply because the technology changed.

---

# 59. Design Quality Checklist

Before considering a page complete:

- [ ] Page title is clear
- [ ] Primary action is obvious
- [ ] Layout follows the design system
- [ ] Spacing is consistent
- [ ] Typography hierarchy is correct
- [ ] Buttons are consistent
- [ ] Forms are consistent
- [ ] Status badges are semantic
- [ ] Empty state exists where required
- [ ] Error state exists where required
- [ ] Responsive layout works
- [ ] Keyboard interaction works
- [ ] Focus states are visible
- [ ] No unnecessary visual decoration
- [ ] No duplicated UI patterns
- [ ] Admin/Tenant permissions are respected

---

# 60. Final Design Direction

RentEase should look and behave like a professional property-management SaaS product.

The design priority is:

```text
Clarity
  ↓
Consistency
  ↓
Usability
  ↓
Accessibility
  ↓
Visual polish
```

The product should be modern without becoming visually complicated.

The design system must remain stable across the Vanilla MVP and future React implementation.

---

# 61. Design Source-of-Truth Rule

For UI decisions:

```text
product-requirements.md
        ↓
defines WHAT the product needs

architecture.md
        ↓
defines HOW the product is structured

design.md
        ↓
defines HOW the product looks and behaves visually

rules.md
        ↓
defines HOW development should be performed

phases.md
        ↓
defines WHEN features should be implemented

memory.md
        ↓
records WHAT decisions have already been made
```

Any AI-assisted implementation must respect all six documents together.

