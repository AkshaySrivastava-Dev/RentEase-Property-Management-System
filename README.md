# RentEase - Property Management System (MVP)

RentEase is a modern, responsive Property Management System built with Vanilla HTML5, CSS3, and JavaScript, leveraging LocalStorage for zero-dependency local persistence.

---

## 🚀 Key Features

### 🏢 Property Manager / Admin Module
- **Dashboard Overview:** KPI stats (total properties, occupancy rate, pending maintenance, monthly revenue collected).
- **Property Management:** Full CRUD (Create, Read, Update, Delete) with image URLs, room details, amenities, rent, and status tracking.
- **Tenant Directory:** Directory of tenants with contact info and lease association.
- **Lease Management:** Create and track lease agreements tied to properties and tenants.
- **Payment Tracking:** Monitor rent invoices, overdue alerts, and record manual payments.
- **Maintenance Requests:** Priority tagging (Low, Medium, High, Urgent), status progression (Pending, In Progress, Resolved).
- **In-App Messaging:** Communicate directly with tenants.

### 👤 Tenant / Resident Module
- **Resident Dashboard:** Active lease summary, current balance, open tickets, and recent messages.
- **My Home / Property View:** Details of assigned rental home and landlord contact info.
- **My Lease:** Lease agreement terms, monthly rent, security deposit, and dates.
- **Rent Payments:** Pay outstanding rent invoices with 1-click simulation, download payment history.
- **Maintenance Portal:** Submit work orders with title, description, and priority level.
- **Messaging:** Direct messaging channel with property manager.

---

## 🛠️ Technology Stack & Architecture

- **Markup & Layout:** HTML5 Semantic Elements, CSS3 (CSS Grid, Flexbox, CSS Custom Properties).
- **Logic:** Modular Vanilla JavaScript (ES6+).
- **Data Persistence:** Browser `LocalStorage` via centralized abstraction layer (`js/storage/storage.js`).
- **No Build Step Required:** Runs directly in any modern browser.

### Architecture Layers:
```
HTML Pages (UI Presentation)
   ↓
Page Controllers & Components (`js/pages/*`, `js/components/*`)
   ↓
Service Layer (`js/services/*`)
   ↓
Storage Layer (`js/storage/storage.js`)
   ↓
LocalStorage
```

---

## 👥 Demo Accounts (Pre-seeded)

You can use the **1-Click Demo Login** buttons on the landing page or log in manually:

| Role | Email | Password |
|---|---|---|
| **Admin / Manager** | `admin@rentease.demo` | `admin123` |
| **Tenant** | `tenant@rentease.demo` | `tenant123` |

---

## 📂 Project Directory Structure

```
RentEase/
├── index.html                  # Landing page & demo portal
├── README.md                   # Documentation
├── pages/
│   ├── login.html              # Standard login
│   ├── signup.html             # New user registration
│   ├── admin/                  # Admin module pages
│   └── tenant/                 # Tenant module pages
├── css/
│   ├── variables.css           # Design tokens & color system
│   ├── reset.css               # Box-sizing & browser resets
│   ├── globals.css             # Base typography & layout
│   ├── layout.css              # Dashboard shell & grid
│   ├── components.css          # Cards, buttons, badges, modals
│   ├── forms.css               # Input fields & validation
│   ├── tables.css              # Data tables
│   └── responsive.css          # Media queries & mobile navigation
├── js/
│   ├── app.js                  # Global application lifecycle
│   ├── components/             # Reusable UI components
│   ├── data/seedData.js        # Initial demo dataset
│   ├── pages/                  # Page-specific controllers
│   ├── services/               # Business logic services
│   ├── storage/storage.js      # LocalStorage abstraction
│   └── utils/                  # Formatting, validation, helpers
```

---

## 💻 How to Run

1. Open `index.html` in any web browser (Chrome, Firefox, Safari, Edge).
2. Alternatively, serve via any static HTTP server (e.g., Live Server or `npx serve .`).
3. Click **"Try Admin Demo"** or **"Try Tenant Demo"** on the landing page to instantly test the platform.

