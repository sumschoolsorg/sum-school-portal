# S.U.M. Higher Secondary & Primary School — Complete Features Specification

**Savariyappa Udaiyar Memorial Higher Secondary & Primary School**  
*Royappanpatti, Theni District, Tamil Nadu – 625526 • Established: 1963 • UDISE: 33250800109*

---

## Table of Contents
1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [Technical Architecture & Data Engineering](#2-technical-architecture--data-engineering)
3. [Public Web Portal Features](#3-public-web-portal-features)
   - 3.1 [Homepage & Dynamic Landing Experience (`/`)](#31-homepage--dynamic-landing-experience-)
   - 3.2 [Heritage, History & Founders Tribute (`/about`)](#32-heritage-history--founders-tribute-about)
   - 3.3 [Academics & Curricular Streams (`/academics`)](#33-academics--curricular-streams-academics)
   - 3.4 [Online Admissions & Enquiry System (`/admissions`)](#34-online-admissions--enquiry-system-admissions)
   - 3.5 [Public Alumni Network & Registration (`/alumni`)](#35-public-alumni-network--registration-alumni)
   - 3.6 [Transportation, Bus Routes & Live Tracking (`/transport`)](#36-transportation-bus-routes--live-tracking-transport)
   - 3.7 [Board Exam Results & Marksheet Verification (`/results`)](#37-board-exam-results--marksheet-verification-results)
   - 3.8 [Events & School Calendar (`/events`)](#38-events--school-calendar-events)
   - 3.9 [News, Circulars & Announcements (`/news`)](#39-news-circulars--announcements-news)
   - 3.10 [Campus Facilities & Infrastructure (`/facilities`)](#310-campus-facilities--infrastructure-facilities)
   - 3.11 [Faculty & Staff Directory (`/faculty`)](#311-faculty--staff-directory-faculty)
   - 3.12 [Achievements, Sports & Honors (`/achievements`)](#312-achievements-sports--honors-achievements)
   - 3.13 [Photo & Media Gallery (`/gallery`)](#313-photo--media-gallery-gallery)
   - 3.14 [Contact, Campus Locator & Maps (`/contact`)](#314-contact-campus-locator--maps-contact)
   - 3.15 [Legal, Privacy & Compliance (`/privacy`, `/terms`)](#315-legal-privacy--compliance-privacy-terms)
4. [Administrative Management Portal (`/admin`)](#4-administrative-management-portal-admin)
   - 4.1 [Overview & Analytical Dashboard](#41-overview--analytical-dashboard)
   - 4.2 [School Profile & Institutional Metadata (`/admin/school-info`)](#42-school-profile--institutional-metadata-adminschool-info)
   - 4.3 [Research & Historical Heritage Archive (`/admin/research`)](#43-research--historical-heritage-archive-adminresearch)
   - 4.4 [Admissions Info & Student Applications (`/admin/admissions`, `/admin/enquiries`)](#44-admissions-info--student-applications-adminadmissions-adminenquiries)
   - 4.5 [Academics & Stream Management (`/admin/academics`)](#45-academics--stream-management-adminacademics)
   - 4.6 [Examination Results Management (`/admin/results`)](#46-examination-results-management-adminresults)
   - 4.7 [Faculty & Staff Management (`/admin/faculty`)](#47-faculty--staff-management-adminfaculty)
   - 4.8 [Campus Facilities Management (`/admin/facilities`)](#48-campus-facilities-management-adminfacilities)
   - 4.9 [Bus Routes & Fleet Management (`/admin/transport`)](#49-bus-routes--fleet-management-admintransport)
   - 4.10 [Alumni Verification & Hall of Fame (`/admin/alumni`)](#410-alumni-verification--hall-of-fame-adminalumni)
   - 4.11 [Hero Banners & Carousel Management (`/admin/banners`)](#411-hero-banners--carousel-management-adminbanners)
   - 4.12 [Homepage Content Editor (`/admin/homepage`)](#412-homepage-content-editor-adminhomepage)
   - 4.13 [About School Editor (`/admin/about`)](#413-about-school-editor-adminabout)
   - 4.14 [Announcements & Ticker Management (`/admin/announcements`)](#414-announcements--ticker-management-adminannouncements)
   - 4.15 [School Events & Calendar Manager (`/admin/events`)](#415-school-events--calendar-manager-adminevents)
   - 4.16 [Photo Gallery & Media Manager (`/admin/gallery`)](#416-photo-gallery--media-manager-admingallery)
   - 4.17 [Achievements & Honors Manager (`/admin/achievements`)](#417-achievements--honors-manager-adminachievements)
   - 4.18 [School Timeline & Milestones (`/admin/timeline`)](#418-school-timeline--milestones-admintimeline)
   - 4.19 [Parent & Alumni Testimonials (`/admin/testimonials`)](#419-parent--alumni-testimonials-admintestimonials)
   - 4.20 [Theme, Colors & Brand Tokens (`/admin/theme`)](#420-theme-colors--brand-tokens-admintheme)
   - 4.21 [Website Settings & SEO Configuration (`/admin/settings`)](#421-website-settings--seo-configuration-adminsettings)
   - 4.22 [Role-Based Access Control & User Accounts (`/admin/users`)](#422-role-based-access-control--user-accounts-adminusers)
   - 4.23 [Data Backup, Cloud Migration & Sync (`/admin/migration`)](#423-data-backup-cloud-migration--sync-adminmigration)
   - 4.24 [Real Image Picker Modal Integration](#424-real-image-picker-modal-integration)
5. [Security, Privacy & Data Protection](#5-security-privacy--data-protection)
6. [Internationalization & Accessibility](#6-internationalization--accessibility)

---

## 1. Executive Summary & Core Philosophy

The **S.U.M. Higher Secondary & Primary School Web Portal & Admin Management System** is an enterprise-grade school web application engineered for **Savariyappa Udaiyar Memorial Higher Secondary & Primary School** in Royappanpatti, Theni District, Tamil Nadu. Established in 1963, the institution has nurtured generations of students across the Cumbum Valley.

### Key Highlights
- **Zero Static Hardcoding:** All content, banners, personnel profiles, announcements, bus routes, gallery photos, and calendar items are completely dynamic and editable via the administrative portal.
- **Dual-Layer Resilience:** Built with a resilient dual-layer architecture combining **Google Cloud Firestore** with client-side **IndexedDB**, guaranteeing zero downtime and full offline functionality even in rural connectivity settings.
- **Bilingual Tamil & English Support:** Full localized experience for Tamil (`ta`) and English (`en`) audiences.
- **Role-Based Governance:** Multi-tiered security model segregating public users, content editors, school admins, and super administrators.

---

## 2. Technical Architecture & Data Engineering

### Technology Stack
- **Framework:** Next.js 16.3.5 (App Router, Turbopack, React 19)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4, Vanilla CSS token system, responsive utility layers
- **Icons:** Lucide React
- **Cloud Infrastructure:** Firebase 12.19 (Cloud Firestore, Firebase Authentication, Firebase Storage)
- **Local Persistence:** Client-side IndexedDB database (`sum_school_local_db`) with 24 dedicated object stores
- **UI & Feedback:** Sonner toast notifications, custom accessible modals, slide-out drawers, responsive datatables
- **Print Engine:** Native `@media print` style system for official student marksheets, timetables, and admit cards

### Unified Data Repository Abstraction
The data layer (`src/lib/repositories/index.ts`) abstracts storage operations behind two generic repositories:
1. **`SingleDocRepository<T>`**: Manages singleton configuration documents (`schoolSettings`, `homepageContent`, `aboutContent`, `academicsContent`, `admissionsContent`, `themeSettings`, `websiteSettings`).
2. **`CollectionRepository<T>`**: Manages relational collection datasets (`heroBanners`, `faculty`, `facilities`, `announcements`, `events`, `gallery`, `achievements`, `timelineEntries`, `testimonials`, `enquiries`, `contactMessages`, `adminUsers`, `alumni`, `alumniPrivate`, `transportRoutes`, `studentResults`, `researchRecords`).

### Dual-Layer Storage Architecture
- **Online Mode:** Operations read from and write directly to Google Cloud Firestore with real-time sync.
- **Offline / Local Preview Mode:** Automatically mirrors operations in IndexedDB (`sum_school_local_db`), allowing full CRUD operations even when disconnected or unconfigured.
- **One-Click Cloud Sync:** Administrators can trigger bi-directional synchronization or download full JSON database backups from `/admin/migration`.

---

## 3. Public Web Portal Features

### 3.1 Homepage & Dynamic Landing Experience (`/`)
- **Hero Carousel Banner:** High-impact responsive visual slider displaying dynamic hero banners, headlines, sub-headlines, and call-to-action buttons.
- **Founders Heritage Tribute Bar:** Prominent tribute banner honoring the four founding stalwarts with clean, unnumbered portrait thumbnails and direct popup modal access to their biographies:
  - *Amarar M. Savariyappa Udaiyar* (Revered School Patron & Memorial Inspirator, Demise 01-08-1930)
  - *Amarar Thiru M. Savarimuthu Udaiyar* (Founder & Philanthropist)
  - *Amarar Thiru M. S. Savarimuthu Udaiyar* (Founder & Institutional Architect)
  - *Amarar Thiru M. S. Singarayar* (Founder & Community Pioneer)
  *(Note: Numerical badge overlays 1, 2, 3, 4 have been removed from portrait thumbnails in favor of clean, respectful photographic presentation).*
- **Live Announcement Ticker:** Real-time ticker cycling through active school notices, circulars, and urgent alerts.
- **Key Statistics Counter:** Animated counters highlighting Years of Excellence (60+), Total Students, Dedicated Faculty, Classroom counts, and State Accolades.
- **Principal's Message Section:** Dedicated address from the head of institution with photograph, official designation, and educational philosophy.
- **Academics & Streams Preview:** Interactive overview of Primary, Secondary, and Higher Secondary offerings with direct deep-links.
- **Announcements & Circulars Grid:** Highlighting the latest official notices with priority badges (Urgent, Notice, Circular) and download links.
- **Upcoming Events Widget:** Preview of sports meets, cultural days, annual days, and examination schedules.
- **Campus Facilities Showcase:** Visual cards previewing laboratories, smart classrooms, library, and sports amenities.
- **Achievements & Accolades:** Highlights of 100% board exam results, state athletic titles, and Olympiad recognitions.
- **Parent & Alumni Testimonials:** Carousel of testimonials from parents, distinguished alumni, and educationists.
- **Admissions Call-to-Action:** Direct lead-generation banner driving prospective parents to the online enquiry portal.
- **Campus Location & Contact Block:** Contact telephone numbers, email addresses, office timings, and Google Maps integration.

### 3.2 Heritage, History & Founders Tribute (`/about`)
- **Founding Story (Established 1963):** Chronological narrative of how S.U.M. School was founded in Royappanpatti to provide affordable, high-quality education to rural students of Cumbum Valley.
- **Institutional Vision & Mission:** Detailed statements outlining moral, intellectual, and physical education standards.
- **Core Educational Values:** Discipline, Integrity, Academic Excellence, Community Service, and Cultural Respect.
- **Founders Detailed Biographies:** Dedicated interactive modal and profiles detailing the land donations, administrative leadership, and historical sacrifices of the founders.
- **School Management Committee (SMC):** Profiles of the correspondent, headmaster, administrators, and committee members.
- **Historical Timeline Journey:** Milestones spanning from 1963 primary school inception, high school upgrade, higher secondary elevation, golden jubilee, up to modern smart campus transformation.

### 3.3 Academics & Curricular Streams (`/academics`)
- **Primary Section (Classes 1–5):** Bilingual (Tamil & English) foundational learning, activity-based methodology, smart visual aids. UDISE: 33250800109.
- **Middle & High School (Classes 6–10):** Tamil Nadu State Board (Samacheer Kalvi) syllabus, rigorous science and mathematics training, social sciences, computer education, and language mastery.
- **Higher Secondary Streams (Classes 11–12):**
  - *Group 1:* Physics, Chemistry, Biology, Mathematics (Bio-Maths)
  - *Group 2:* Physics, Chemistry, Computer Science, Mathematics (Computer-Maths)
  - *Group 3:* Commerce, Accountancy, Economics, Computer Applications / Business Mathematics
- **Teaching Methodology & Pedagogy:** Laboratory experiments, experiential learning, project-based assignments, remedial coaching for slow learners, and merit acceleration for high achievers.
- **Evaluation & Examination System:** Formative assessments, unit tests, quarterly/half-yearly examinations, and intensive model board exams.

### 3.4 Online Admissions & Enquiry System (`/admissions`)
- **Admissions Overview:** Clear breakdown of age criteria, required documentation (Transfer Certificate, Birth Certificate, Aadhaar card, Community Certificate), and government-aided fee structures.
- **Online Application / Enquiry Form:**
  - Student full name, date of birth, gender, and medium of instruction preference.
  - Class applying for (Standard 1 through Standard 12).
  - Stream choice for Higher Secondary applicants.
  - Parent/Guardian contact details (Father/Mother name, occupation, mobile number, alternate phone, email, residential address).
  - Previous school details and remarks.
- **Real-Time Validation & Submission:** Validates inputs, saves to Firestore and IndexedDB, assigns unique enquiry IDs, and presents immediate confirmation to the parent.
- **Downloadable Brochures:** Direct links for parents to download the school prospectus and offline application forms.

### 3.5 Public Alumni Network & Registration (`/alumni`)
- **Alumni Directory:** Searchable catalog of past students who graduated from S.U.M. School since 1963.
- **Decade & Batch Filter:** Instant filtering across decades (1963–1989, 1990–1999, 2000–2009, 2010–Present).
- **Distinguished Alumni Spotlight & Hall of Fame:** Highlighting alumni who achieved prominence in medicine, civil services, engineering, academia, business, and military service.
- **Public Alumni Registration Portal:**
  - Online submission form capturing graduation year, degree, current profession, organization, city/country of residence, and fond school memories.
  - Profile photo uploader.
  - Privacy safeguards: Sensitive phone numbers and emails are segregated into `alumniPrivate` and only visible to authorized administrators.
- **Verification Workflow:** Submissions enter a `pending` moderation queue and only appear publicly once approved by school administrators.

### 3.6 Transportation, Bus Routes & Live Tracking (`/transport`)
- **Comprehensive Route Guide:** Detailed transportation cards covering rural villages and towns across Cumbum Valley (Route 01, Route 02, Route 03, etc.).
- **Boarding Points Timeline:** Step-by-step visual timeline showing morning pickup times, evening drop times, and recognizable landmarks.
- **Driver & Vehicle Details:** Vehicle registration numbers, seating capacities, driver names, and one-tap click-to-call links for emergency parent communication.
- **Fleet Safety Certifications:** Displays compliance with school bus safety standards: GPS tracking units, speed governors (capped at 40 km/h), emergency exit doors, first-aid kits, and verified drivers.
- **Live Bus Tracking Portal (`/transport/tracking`):** Real-time GPS tracking interface ready for IoT telemetry integration with vehicle speed, route status, and estimated arrival times (ETA).

### 3.7 Board Exam Results & Marksheet Verification (`/results`)
- **Public Result Verification Engine:** Fast, student-friendly portal for checking 10th (SSLC) and 12th (HSC) Tamil Nadu State Board Examination results.
- **Secure Lookup:** Query by Student Examination Roll Number / Registration Number and Date of Birth.
- **Detailed Marksheet Breakdown:**
  - Subject-by-subject scores (Language, English, Mathematics, Science, Social Science / Physics, Chemistry, Biology, Computer Science, Commerce, Accountancy).
  - Theory and practical mark segmentation.
  - Total marks, percentage, grade, and overall Pass/Fail status.
- **Printable Marksheet Generation:** Integrated `@media print` layout formatting the result card as an official school marksheet transcript with school crest, seal placeholder, and signature block.

### 3.8 Events & School Calendar (`/events`)
- **Upcoming vs. Past Event Archives:** Automatic date-based sorting separating future events from past school memories.
- **Category Filter:** Filter by Academic, Cultural, Sports, Celebrations, and Government Observances.
- **Rich Event Cards:** Banner image, event title, date range, venue location, organizer, and full description.
- **Modal Event Details:** Expandable view providing detailed event schedules, chief guest announcements, and photo recaps.

### 3.9 News, Circulars & Announcements (`/news`)
- **Official Notice Board:** Searchable repository of school circulars, holiday notices, examination timetables, and fee circulars.
- **Priority Categorization:** Badges highlighting "Urgent", "Notice", or "Circular".
- **Dual Announcement Tickers:**
  - Sticky top header alert banner for critical notifications.
  - Bottom scrolling ticker on the homepage for ongoing circular updates.

### 3.10 Campus Facilities & Infrastructure (`/facilities`)
- **Interactive Facility Profiles:** Detailed cards showcasing:
  - Smart Classrooms with interactive digital displays.
  - Fully equipped Science Laboratories (Physics, Chemistry, Biology).
  - High-Speed Computer Science Laboratory.
  - Central Library with extensive reference books, periodicals, and vernacular literature.
  - Athletic Grounds (Volleyball, Football, Kabaddi, Kho-Kho, Track & Field).
  - Safe Drinking Water (RO filtration systems) and modern sanitation facilities.
  - Multipurpose Auditorium & Assembly Hall.

### 3.11 Faculty & Staff Directory (`/faculty`)
- **Teaching & Non-Teaching Roster:** Comprehensive list of educators and support staff.
- **Departmental Filtering:** Filter teachers by section (Primary Section, High School, Higher Secondary, Science & Maths, Humanities & Languages, Physical Education, Administrative Staff).
- **Teacher Profiles:** Photographs, academic qualifications (M.Sc., B.Ed., M.A., M.Phil.), teaching experience, subjects handled, and institutional roles.

### 3.12 Achievements, Sports & Honors (`/achievements`)
- **Academic Honors:** 100% pass percentages in 10th and 12th standard public examinations, school toppers, and centum scorers.
- **Sports & Athletics Championships:** District, zonal, and state-level medals in athletics, volleyball, kabaddi, and silambam.
- **Co-Curricular Accolades:** Science exhibition state winners, essay/oratorical prizes, quiz competitions.
- **Youth Organizations:** National Cadet Corps (NCC), National Service Scheme (NSS), Bharat Scouts & Guides, Junior Red Cross (JRC), and Green Corps activities.

### 3.13 Photo & Media Gallery (`/gallery`)
- **Categorized Albums:** Filter images by Campus & Buildings, Annual Day, Sports Meet, Science Exhibition, Independence Day / Republic Day, and Classroom Activities.
- **Lightbox Image Viewer:** High-resolution modal viewer with caption overlay, zoom capability, and keyboard navigation.

### 3.14 Contact, Campus Locator & Maps (`/contact`)
- **Direct Communication Channels:** Landline, mobile, official email addresses, and school office hours.
- **Interactive Feedback / Message Form:** Allows visitors, parents, and community members to submit direct inquiries.
- **Google Maps Integration:** Embedded map pinpointing the school campus in Royappanpatti with direct "Get Directions" navigation.

### 3.15 Legal, Privacy & Compliance (`/privacy`, `/terms`)
- **Privacy Policy:** Transparent policy explaining how student, parent, and alumni contact details are collected, stored, and protected.
- **Terms & Conditions:** Terms governing usage of the school web portal, marksheet verification disclaimer, and copyright protections.

---

## 4. Administrative Management Portal (`/admin`)

The administrative portal is accessible via `/admin` and protected by authentication and role-based permissions (`super-admin`, `admin`, `content-manager`).

### 4.1 Overview & Analytical Dashboard
- **Live Metrics Counter:** Real-time counters displaying Total Enquiries, New Unreviewed Applications, Published Announcements, Scheduled Events, Faculty count, and Gallery media assets.
- **Recent Enquiries Feed:** Instant snapshot of the latest 5 admission applicants with student name, parent contact, class applying for, and status badge.
- **Quick Action Center:** One-click shortcuts for adding announcements, publishing events, adding faculty members, and updating transport routes.
- **System Health Indicator:** Live status display showing active data mode (Cloud Firestore vs. Local Preview) and synchronization state.

### 4.2 School Profile & Institutional Metadata (`/admin/school-info`)
- **Institutional Identity:** Edit school name, short name, established year (1963), education board (Tamil Nadu State Board), school type, and tagline.
- **Official Accreditations:** Primary and Secondary UDISE codes (`33250800109`), research verification dates, government recognition details.
- **Contact Details & Timings:** Primary phone, secondary phone, official email, postal address, pin code (`625526`), office working hours.
- **Digital Assets:** Upload and manage official School Crest/Logo, Golden Jubilee Logo, Favicon, and Campus Hero banner.
- **Social Media Links:** Facebook, Instagram, Twitter/X, YouTube channel, and official WhatsApp broadcast links.

### 4.3 Research & Historical Heritage Archive (`/admin/research`)
- **Heritage Records Manager:** Archive documenting historical records, government gazettes, land registration deeds, and founder recognition dates.
- **UDISE Verification Data:** Verified historical chronology cross-referenced with Tamil Nadu School Education Department records.

### 4.4 Admissions Info & Student Applications (`/admin/admissions`, `/admin/enquiries`)
- **Admissions Content Editor (`/admin/admissions`):** Update admission dates, age requirements, fee schedules, procedure guides, and downloadable PDF links.
- **Enquiries & Applications Manager (`/admin/enquiries`):**
  - Full datatable of all online admission submissions with search and multi-column filtering.
  - **Status Pipeline:** Transition applicant status through `new` ➔ `contacted` ➔ `admitted` ➔ `closed`.
  - **Internal Admin Notes:** Keep private communication logs regarding parent phone calls or campus visits.
  - **Data Export:** One-click export of applicant lists to Excel/CSV for administrative review.

### 4.5 Academics & Stream Management (`/admin/academics`)
- **Section Configuration:** Edit class divisions for Primary, High School, and Higher Secondary sections.
- **Curriculum Details:** Manage syllabus highlights, academic calendar, laboratory rules, and examination schedules.

### 4.6 Examination Results Management (`/admin/results`)
- **Result Registry:** Add, update, or delete student board exam marks for 10th and 12th standards.
- **Subject Scores:** Configure individual subject marks (Theory + Practical), total marks, percentages, and pass status.
- **Bulk Verification:** Search and verify roll numbers prior to public declaration.

### 4.7 Faculty & Staff Management (`/admin/faculty`)
- **Staff Directory CRUD:** Add new teachers, update designations, qualifications, teaching experience, and assigned departments.
- **Profile Photo Uploader:** Upload teacher portrait or choose from pre-verified school faculty assets using the Real Image Picker.
- **Display Reordering:** Configure the visual display order of teachers within each department.

### 4.8 Campus Facilities Management (`/admin/facilities`)
- **Facility Registry:** Add and edit campus infrastructure items (Smart Classrooms, Laboratories, Sports Complex, Library).
- **Feature Lists:** Specify bullet-point features (e.g., "50 High-End Core i7 Desktops", "High-speed broadband", "Air conditioned").
- **Facility Photography:** Upload and assign high-resolution photography for each campus facility.

### 4.9 Bus Routes & Fleet Management (`/admin/transport`)
- **Route Manager:** Create and maintain bus routes (Route 01, 02, 03).
- **Fleet Information:** Bus registration numbers, seating capacities, vehicle fitness certificates.
- **Driver Profiles:** Driver name, emergency contact telephone number, and license details.
- **Dynamic Boarding Stops:** Add, remove, and reorder bus stops with pickup time (AM), drop time (PM), and landmark names.

### 4.10 Alumni Verification & Hall of Fame (`/admin/alumni`)
- **Moderation Queue:** Review pending alumni self-registrations submitted through the public portal.
- **Approval Actions:** Approve to `published` status or reject inappropriate submissions.
- **Distinction Marking:** Toggle "Hall of Fame" distinction to spotlight notable alumni on the public homepage.
- **Confidential Contact Access:** Authorized administrators can view private mobile numbers and emails without exposing them publicly.

### 4.11 Hero Banners & Carousel Management (`/admin/banners`)
- **Carousel Slide Manager:** Create dynamic hero banners displayed on the homepage.
- **Content Fields:** Slide title, subtitle, descriptive text, image URL, primary button label & link, secondary button label & link.
- **Sorting & Visibility:** Enable/disable individual banners and set custom display order indexes.

### 4.12 Homepage Content Editor (`/admin/homepage`)
- **Hero Defaults:** Configure fallback hero headlines and subtext.
- **Key Statistics Editor:** Adjust the official numbers displayed in the live stats counter (Years of Excellence, Total Students, Teachers, Classrooms, State Awards).
- **Principal's Message Editor:** Update the Principal's name, designation, portrait photo, and official statement.
- **Admission CTA Editor:** Customize the promotional text and button links driving online admission enquiries.

### 4.13 About School Editor (`/admin/about`)
- **History & Philosophy:** Edit institutional narrative, vision statement, mission statement, and core values.
- **Management Team:** Manage profiles of the School Management Committee, correspondents, and academic directors.
- **Highlights:** Add custom feature highlights with icons and descriptive summaries.

### 4.14 Announcements & Ticker Management (`/admin/announcements`)
- **Notice Board CRUD:** Create, edit, and delete school announcements.
- **Priority Tags:** Assign priority level (`Urgent`, `Notice`, `Circular`).
- **Date & Expiry Controls:** Set publication dates and optional automatic expiration dates.
- **Attachment Links:** Attach PDF circulars or external download links.

### 4.15 School Events & Calendar Manager (`/admin/events`)
- **Event Scheduling:** Add school functions, sports meets, parent-teacher meetings, and examination schedules.
- **Event Metadata:** Start date, end date, venue, category (Academic, Cultural, Sports, Celebrations), and detailed description.
- **Banner Uploader:** Attach event posters and promotional graphics.

### 4.16 Photo Gallery & Media Manager (`/admin/gallery`)
- **Media Asset Manager:** Upload, caption, and categorize school photographs.
- **Album Organization:** Assign photos to categories (Campus, Sports, Cultural, Celebrations, Infrastructure).
- **Display Ordering:** Reorder images to curate the public gallery presentation.

### 4.17 Achievements & Honors Manager (`/admin/achievements`)
- **Accolade Management:** Record academic toppers, athletic championships, and cultural awards.
- **Accolade Details:** Achievement title, category, year, recipient name/team, and certificate or trophy photograph.

### 4.18 School Timeline & Milestones (`/admin/timeline`)
- **Milestone Registry:** Record key historical milestones from 1963 to the present day.
- **Milestone Details:** Year, milestone title, description, category, and historical photograph.

### 4.19 Parent & Alumni Testimonials (`/admin/testimonials`)
- **Testimonial Management:** Curate quotes and reviews from parents, alumni, and community leaders.
- **Fields:** Author name, role/relationship (e.g., "Parent of Class 10 Student", "Alumnus Batch 1988"), star rating, and testimonial text.

### 4.20 Theme, Colors & Brand Tokens (`/admin/theme`)
- **Custom Brand Palettes:** Configure primary color, secondary color, accent color, and dark mode background tones.
- **Typography & Radii:** Adjust font token preferences and component border radius defaults.

### 4.21 Website Settings & SEO Configuration (`/admin/settings`)
- **Search Engine Optimization (SEO):** Configure meta titles, meta descriptions, Open Graph preview images, and canonical URLs.
- **Analytics & Tracking:** Configure Google Analytics / Google Tag Manager tracking IDs.
- **Maintenance Mode:** Toggle site-wide maintenance banners if needed.

### 4.22 Role-Based Access Control & User Accounts (`/admin/users`)
- **Multi-Tiered Roles:**
  - `super-admin`: Full access including user management, database migration, and cloud backups.
  - `admin`: School administrators managing admissions, results, faculty, transport, and school settings.
  - `content-manager`: Content editors restricted to news, events, banners, gallery, and achievements.
- **Account Actions:** Invite new staff accounts, reset access, toggle active/inactive status, and revoke administrative privileges.

### 4.23 Data Backup, Cloud Migration & Sync (`/admin/migration`)
- **Cloud & Local Mode Switching:** Seamlessly switch application data source between Google Cloud Firestore and local IndexedDB.
- **One-Click JSON Database Export:** Download the entire school database (all 24 collections) into an encrypted, formatted JSON backup file.
- **One-Click Database Import:** Restore a complete database backup from a JSON file with integrity validation.
- **Demo Data Seeding & Purging:** Seed sample demo data for preview testing or purge mock data to prepare the system for production data entry.

### 4.24 Real Image Picker Modal Integration
- **Zero Placeholder Guarantee:** Embedded across all image input fields (`RealImagePickerModal.tsx`), allowing administrators to either:
  1. Upload new custom photography via Firebase Storage.
  2. Select from a curated repository of authentic S.U.M. School photography (crests, founders, campus buildings, laboratory equipment, faculty, events).

---

## 5. Security, Privacy & Data Protection

### Cloud Firestore Security Rules (`firestore.rules`)
- **Public Read Access:** Public collections (`schoolSettings`, `homepageContent`, `aboutContent`, `academicsContent`, `facilities`, `faculty`, `events`, `announcements`, `gallery`, `achievements`, `timelineEntries`, `testimonials`, `transportRoutes`, `studentResults`) are publicly readable when status is `published`.
- **Public Write Restrictions:** Public visitors can ONLY create documents in `enquiries` and `alumni` (strictly with `status: 'pending'`).
- **Administrative Enforcement:** Only authenticated administrators with verified Firebase Auth tokens can modify, publish, or delete school data.
- **Private Data Protection:** The `alumniPrivate` and `adminUsers` collections are completely inaccessible to unauthenticated users.

### Firebase Storage Security Rules (`storage.rules`)
- **File Type Restrictions:** Restricts uploads strictly to valid image MIME types (`image/jpeg`, `image/png`, `image/webp`).
- **File Size Restrictions:** Imposes a strict 5MB maximum file size limit per image asset to prevent storage abuse and optimize page load speeds.

---

## 6. Internationalization & Accessibility

- **Dual-Language Engine (`src/contexts/LanguageContext.tsx`):** Complete bilingual support across English (`en`) and Tamil (`ta`).
- **Persistent Preference:** Saves the user's preferred language in browser local storage and applies it seamlessly across all navigation links, headings, badges, and form labels.
- **Semantic HTML & WCAG Compliance:** Designed with semantic HTML5 tags (`<main>`, `<section>`, `<header>`, `<footer>`, `<nav>`, `<article>`), ARIA labels on all interactive controls, and accessible contrast ratios in both light and dark themes.
- **Device Responsiveness:** Fluid layouts tested across small mobile screens (360px), tablets (768px), laptops (1024px), desktops (1440px), and ultrawide displays.
