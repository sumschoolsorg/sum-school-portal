# S.U.M. Higher Secondary & Primary School — Web Portal & Admin Management System
**Savariyappa Udaiyar Memorial Higher Secondary & Primary School**  
*Royappanpatti, Theni District, Tamil Nadu – 625526 &bull; Established: 1963 &bull; UDISE: 33250800109*

A modern, responsive, real-data-driven school platform built with **Next.js 16 (App Router + Turbopack)**, **Tailwind CSS 4**, and **Firebase (Firestore, Storage, Authentication)**, featuring dual-layer offline persistence via **IndexedDB**.

---

## The Six Core Architectural Features

### 1. Alumni Registration & Verification
- **Purpose:** Connect generations of alumni who studied at S.U.M. School since 1963. Allows former students to submit registration profiles online while school administrators verify and approve entries before they appear on the public directory.
- **Main Functionality:**
  - Public registration modal capturing joining/pass-out batch year, qualification, designation, organization, location, memories, and profile photo.
  - Admin approval dashboard ([`/admin/alumni`](http://localhost:3000/admin/alumni)) with status toggles (`pending` &rarr; `published`), Hall of Fame distinction marking, and search/filter.
  - Public directory ([`/alumni`](http://localhost:3000/alumni)) with decade filters (1963–1989, 1990s, 2000s, 2010+) and Distinguished Alumni Spotlight.
- **Firebase Integration:**
  - **Firestore:** `alumni` collection stores records with status (`published`, `pending`, `draft`).
  - **Firebase Storage:** Uploads profile pictures to `/alumni/` bucket path.
  - **Security Rules:** Public can create with `status: 'pending'`, while only authenticated admins can update `status` to `published` or delete records.

### 2. School Bus Route Tracking & Logistics
- **Purpose:** Assist parents, students, and administration in tracking school transportation across Cumbum Valley, Uthamapalayam, Chinnamanur, Kombai, and surrounding rural villages.
- **Main Functionality:**
  - Public transport guide ([`/transport`](http://localhost:3000/transport)) displaying interactive route cards (Route 01, 02, 03).
  - Step-by-step timeline of boarding points with morning pickup time, evening drop time, and local landmarks.
  - Direct driver click-to-call links and fleet safety certifications (speed governors, GPS, trained drivers).
  - Admin management ([`/admin/transport`](http://localhost:3000/admin/transport)) for adding routes, vehicle registration numbers, driver contacts, and dynamic stops.
- **Firebase Integration:**
  - **Firestore:** `transportRoutes` collection stores route documents with embedded `stops` sub-arrays and status.
  - **GPS Integration Ready:** Compatible with real-time IoT GPS telemetry sources via Firestore document updates or Geohash listeners without fabricated location fallbacks.

### 3. Upcoming Events & School Calendar
- **Purpose:** Inform students, parents, and the local community about school sports meets, annual days, board exam practical schedules, and cultural celebrations.
- **Main Functionality:**
  - Public events feed ([`/events`](http://localhost:3000/events)) categorized by Cultural, Academic, Sports, and Celebrations.
  - Automatic chronological sorting into **Upcoming Events** and **Past Event Archives**.
  - Admin event editor ([`/admin/events`](http://localhost:3000/admin/events)) supporting event banner upload, venue, start/end dates, and description.
- **Firebase Integration:**
  - **Firestore:** `events` collection with timestamp-based indexing (`date` field query with `where('date', '>=', now)`).
  - **Firebase Storage:** Stores event banners in `/events/` folder.

### 4. Admission Registration & Enquiry Portal
- **Purpose:** Allow prospective parents to submit online admission applications and enquiries for Standards 1st through 12th (Tamil & English mediums).
- **Main Functionality:**
  - Bilingual admission enquiry form ([`/admissions`](http://localhost:3000/admissions)) capturing student details, parent contacts, preferred class, and academic year.
  - Admin enquiries portal ([`/admin/enquiries`](http://localhost:3000/admin/enquiries)) with status pipelines (`new`, `contacted`, `admitted`, `closed`), notes, and Excel export.
- **Firebase Integration:**
  - **Firestore:** `enquiries` collection stores incoming admissions.
  - **Security Rules:** Public write access for submitting enquiries; read/update restricted strictly to authenticated school administrators.

### 5. Responsive Mobile, Laptop & Desktop Design
- **Purpose:** Provide an optimal viewing experience on every screen size without layout breaks, horizontal scrolling, or degraded readability.
- **Supported Form Factors:**
  - **Mobile Phone (360px – 640px):** Single-column touch-friendly cards, slide-out hamburger navigation, tap-to-call buttons, and responsive tables.
  - **Tablet (768px – 1024px):** 2-column adaptive grids and compact toolbars.
  - **Laptop & Desktop PC (1280px+):** Full multi-column navigation, wide datatables, and comprehensive admin dashboard layout.
  - **Accessibility & Print:** Native `@media print` stylesheets for official marksheets and documents.

### 6. Firebase Live Data & Secure Admin Management
- **Purpose:** Real-time data synchronization between the public website and the administrative backend without hardcoded static data locks.
- **Main Services:**
  - **Firebase Authentication:** Role-based administrative access control (`super-admin`, `admin`, `content-manager`).
  - **Cloud Firestore:** Collections for `school_settings`, `alumni`, `events`, `announcements`, `transportRoutes`, `studentResults`, `faculty`, `facilities`, and `enquiries`.
  - **Firebase Storage:** Asset storage with size and MIME-type restrictions.
  - **Local-First Fallback:** IndexedDB mirror ensures zero downtime during offline conditions or development preview.

---

## Technology Stack

- **Framework:** Next.js 16.3.5 (App Router, Turbopack)
- **Language:** TypeScript 5
- **UI & Styling:** Tailwind CSS 4, Vanilla CSS utilities, Lucide React icons
- **State & Storage:** Firebase 12.19, IndexedDB (`sum_school_local_db`)
- **Localization:** Bilingual English (`en`) and Tamil (`ta`)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase (.env.local)
Copy `.env.example` to `.env.local` and add your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
*(Note: If left unconfigured, the application operates in local IndexedDB development preview mode with full CRUD capability).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Public Website:** [http://localhost:3000](http://localhost:3000)
- **Admin Portal:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
