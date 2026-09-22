// ============================================================
// S.U.M. Higher Secondary & Primary School
// TypeScript interfaces for all Firestore collections
// ============================================================

import { Timestamp } from 'firebase/firestore';

// --- Base types ---

export interface FirestoreDoc {
  id?: string;
  createdAt?: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

export type PublishStatus = 'published' | 'draft';

// --- School Settings (single doc) ---

export interface SchoolSettings extends FirestoreDoc {
  schoolName: string;
  shortName: string;
  tagline: string;
  establishedYear: string;
  schoolType: string;
  educationBoard: string;
  mediumOfInstruction: string;
  classesOffered: string;
  schoolTimings: string;
  logoUrl: string;
  jubileeLogoUrl?: string;
  faviconUrl: string;
  heroImageUrl?: string;
  principalName?: string;
  primaryUdiseCode?: string;
  secondaryUdiseCode?: string;
  researchVerifiedDate?: string;
  phone: string;
  phone2: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    whatsapp: string;
  };
}

// --- Homepage (single doc) ---

export interface HomepageContent extends FirestoreDoc {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    title_en?: string;
    title_ta?: string;
    subtitle_en?: string;
    subtitle_ta?: string;
    description_en?: string;
    description_ta?: string;
    ctaText_en?: string;
    ctaText_ta?: string;
    secondaryCtaText_en?: string;
    secondaryCtaText_ta?: string;
  };
  stats: {
    yearsOfExcellence: string;
    totalStudents: string;
    totalTeachers: string;
    totalClasses: string;
    achievements: string;
    yearsOfExcellence_en?: string;
    yearsOfExcellence_ta?: string;
    totalStudents_en?: string;
    totalStudents_ta?: string;
    totalTeachers_en?: string;
    totalTeachers_ta?: string;
    totalClasses_en?: string;
    totalClasses_ta?: string;
    achievements_en?: string;
    achievements_ta?: string;
  };
  principalMessage: {
    name: string;
    designation: string;
    photoUrl: string;
    message: string;
    name_en?: string;
    name_ta?: string;
    designation_en?: string;
    designation_ta?: string;
    message_en?: string;
    message_ta?: string;
  };
  admissionCta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    title_en?: string;
    title_ta?: string;
    description_en?: string;
    description_ta?: string;
    buttonText_en?: string;
    buttonText_ta?: string;
  };
}

// --- About (single doc) ---

export interface AboutContent extends FirestoreDoc {
  introduction: string;
  history: string;
  vision: string;
  mission: string;
  coreValues: string[];
  educationalPhilosophy: string;
  management: ManagementMember[];
  highlights: SchoolHighlight[];
  introduction_en?: string;
  introduction_ta?: string;
  history_en?: string;
  history_ta?: string;
  vision_en?: string;
  vision_ta?: string;
  mission_en?: string;
  mission_ta?: string;
  coreValues_en?: string[];
  coreValues_ta?: string[];
  educationalPhilosophy_en?: string;
  educationalPhilosophy_ta?: string;
}

export interface ManagementMember {
  name: string;
  designation: string;
  photoUrl: string;
  message: string;
  order: number;
  name_en?: string;
  name_ta?: string;
  designation_en?: string;
  designation_ta?: string;
  message_en?: string;
  message_ta?: string;
}

export interface SchoolHighlight {
  title: string;
  description: string;
  icon: string;
  title_en?: string;
  title_ta?: string;
  description_en?: string;
  description_ta?: string;
}

// --- Academics (single doc) ---

export interface AcademicsContent extends FirestoreDoc {
  primarySection: AcademicSection;
  secondarySection: AcademicSection;
  higherSecondarySection: AcademicSection;
  teachingMethodology: string;
  examinationSystem: string;
  academicActivities: string[];
  coCurricularActivities: string[];
  academicCalendar: string;
  teachingMethodology_en?: string;
  teachingMethodology_ta?: string;
  examinationSystem_en?: string;
  examinationSystem_ta?: string;
  academicActivities_en?: string[];
  academicActivities_ta?: string[];
  coCurricularActivities_en?: string[];
  coCurricularActivities_ta?: string[];
  academicCalendar_en?: string;
  academicCalendar_ta?: string;
}

export interface AcademicSection {
  title: string;
  description: string;
  classes: string[];
  subjects: string[];
  imageUrl: string;
  title_en?: string;
  title_ta?: string;
  description_en?: string;
  description_ta?: string;
  classes_en?: string[];
  classes_ta?: string[];
  subjects_en?: string[];
  subjects_ta?: string[];
}

// --- Admissions (single doc) ---

export interface AdmissionsContent extends FirestoreDoc {
  announcement: string;
  announcementActive: boolean;
  eligibility: string;
  classesAvailable: string[];
  procedure: AdmissionStep[];
  requiredDocuments: string[];
  importantDates: ImportantDate[];
  feeInformation: string;
  schoolTimings: string;
  announcement_en?: string;
  announcement_ta?: string;
  eligibility_en?: string;
  eligibility_ta?: string;
  classesAvailable_en?: string[];
  classesAvailable_ta?: string[];
  procedure_en?: AdmissionStep[];
  procedure_ta?: AdmissionStep[];
  requiredDocuments_en?: string[];
  requiredDocuments_ta?: string[];
  importantDates_en?: ImportantDate[];
  importantDates_ta?: ImportantDate[];
  feeInformation_en?: string;
  feeInformation_ta?: string;
  schoolTimings_en?: string;
  schoolTimings_ta?: string;
}

export interface AdmissionStep {
  step: number;
  title: string;
  description: string;
  title_en?: string;
  title_ta?: string;
  description_en?: string;
  description_ta?: string;
}

export interface ImportantDate {
  title: string;
  date: string;
  description: string;
  title_en?: string;
  title_ta?: string;
  description_en?: string;
  description_ta?: string;
}

// --- Faculty (multiple docs) ---

export interface Faculty extends FirestoreDoc {
  name: string;
  photoUrl: string;
  designation: string;
  qualification: string;
  subject: string;
  section: 'primary' | 'secondary' | 'higher-secondary' | 'administration';
  experience: string;
  biography: string;
  status: PublishStatus;
  order: number;
}

// --- Facilities (multiple docs) ---

export interface Facility extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  imageUrl: string;
  icon: string;
  status: PublishStatus;
  order: number;
}

// --- Announcements (multiple docs) ---

export interface Announcement extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  content: string;
  content_en?: string;
  content_ta?: string;
  date: Timestamp | Date;
  category: 'general' | 'exam' | 'holiday' | 'admission' | 'circular' | 'other';
  imageUrl: string;
  attachmentUrl: string;
  attachmentName: string;
  status: PublishStatus;
  featured: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  link?: string;
  publishDate?: string;
  expiryDate?: string;
}

// --- Events (multiple docs) ---

export interface SchoolEvent extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  content: string;
  content_en?: string;
  content_ta?: string;
  date: Timestamp | Date;
  endDate: Timestamp | Date | null;
  time: string;
  venue: string;
  venue_en?: string;
  venue_ta?: string;
  imageUrl: string;
  category: 'academic' | 'sports' | 'cultural' | 'celebration' | 'other';
  academicYear?: string;
  calendarYear?: number;
  month?: string;
  chiefGuest?: string;
  registrationLink?: string;
  status: PublishStatus;
  isFeatured?: boolean;
}

// --- Gallery (multiple docs) ---

export interface GalleryImage extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  imageUrl: string;
  thumbnailUrl: string;
  albumId: string;
  albumName: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  academicYear?: string;
  calendarYear?: number;
  month?: string;
  eventCategory?: string;
  eventDate?: string;
  status: PublishStatus;
  order: number;
  isFeatured?: boolean;
}

export interface GalleryAlbum extends FirestoreDoc {
  name: string;
  name_en?: string;
  name_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  coverImageUrl: string;
  academicYear?: string;
  calendarYear?: number;
  month?: string;
  category?: string;
  status: PublishStatus;
  order: number;
  imageCount: number;
}

// --- Achievements (multiple docs) ---

export interface Achievement extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  date: Timestamp | Date;
  category: 'academic' | 'sports' | 'cultural' | 'award' | 'competition' | 'topper' | 'other';
  studentName: string;
  studentName_ta?: string;
  teamName?: string;
  imageUrl: string;
  className?: string;
  academicYear?: string;
  examinationName?: string;
  totalMarks?: number;
  totalMaxMarks?: number;
  percentage?: number;
  rank?: string;
  hometown?: string;
  awardPhotoUrl?: string;
  certificateUrl?: string;
  status: PublishStatus;
  isFeatured?: boolean;
}

// --- School Journey Timeline Entries ---

export interface TimelineEntry extends FirestoreDoc {
  year: string;
  title: string;
  title_en?: string;
  title_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  category: 'founding' | 'infrastructure' | 'academics' | 'jubilee' | 'milestone';
  imageUrl?: string;
  order: number;
  status: PublishStatus;
}

// --- Testimonials (multiple docs) ---

export interface Testimonial extends FirestoreDoc {
  name: string;
  role: string;
  message: string;
  photoUrl: string;
  rating: number;
  status: PublishStatus;
  order: number;
  name_en?: string;
  name_ta?: string;
  role_en?: string;
  role_ta?: string;
  message_en?: string;
  message_ta?: string;
}

// --- Enquiries (multiple docs) ---

export interface Enquiry extends FirestoreDoc {
  applicationNumber?: string;
  parentName: string;
  studentName: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other' | string;
  phone: string;
  email: string;
  address?: string;
  classApplyingFor: string;
  previousSchool?: string;
  message: string;
  source: 'admission' | 'contact' | 'other';
  status: 'new' | 'contacted' | 'follow-up' | 'approved' | 'rejected' | 'resolved';
  notes: string;
  applicationDate?: string;
}

// --- Contact Messages (multiple docs) ---

export interface ContactMessage extends FirestoreDoc {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

// --- Admin Users (multiple docs) ---

export interface AdminUser extends FirestoreDoc {
  name: string;
  email: string;
  photoUrl: string;
  role: 'super-admin' | 'admin' | 'content-manager';
  status: 'active' | 'inactive';
  uid: string;
  lastLogin: Timestamp | Date | null;
}

// --- Website Settings (single doc) ---

export interface WebsiteSettings extends FirestoreDoc {
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  footerText: string;
  copyrightText: string;
  privacyPolicy: string;
  termsAndConditions: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

// --- Homepage Hero Banners (multiple docs) ---

export type BannerAnimationStyle = 'fade' | 'slide' | 'zoom' | 'float';

export interface HeroBanner extends FirestoreDoc {
  title: string;
  title_en?: string;
  title_ta?: string;
  subtitle: string;
  subtitle_en?: string;
  subtitle_ta?: string;
  description: string;
  description_en?: string;
  description_ta?: string;
  imageUrl: string;
  ctaText: string;
  ctaText_en?: string;
  ctaText_ta?: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaText_en?: string;
  secondaryCtaText_ta?: string;
  secondaryCtaLink?: string;
  order: number;
  status: PublishStatus;
  animationStyle: BannerAnimationStyle;
  startDate?: string | null;
  endDate?: string | null;
}

// --- Research & Verification Records (multiple docs) ---

export type VerificationStatus =
  | 'Officially Confirmed'
  | 'Cross-Checked'
  | 'Research Found'
  | 'Unverified'
  | 'Rejected';

export interface ResearchRecord extends FirestoreDoc {
  title: string;
  value: string;
  category: 'General' | 'History' | 'Academic' | 'Contact' | 'Facility' | 'Official Records';
  sourceUrl: string;
  sourceName: string;
  sourceType: 'Government Record' | 'Admissions Record' | 'Directory' | 'School Document' | 'Other';
  researchDate: string;
  verificationStatus: VerificationStatus;
  confidenceNote: string;
  adminApproval: boolean;
  published: boolean;
}

// --- Theme & Branding Settings (single doc) ---

export interface ThemeSettings extends FirestoreDoc {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  fontFamily: string;
  borderRadius: string;
}

// --- Migration & Local Storage Statistics ---

export interface CollectionStat {
  collectionName: string;
  displayName: string;
  localCount: number;
  cloudCount?: number;
  status: 'synced' | 'local-only' | 'pending';
}

// --- Alumni Network & Hall of Fame (multiple docs) ---

export interface AlumniMember extends FirestoreDoc {
  name: string;
  batchYear: number;
  courseCompleted?: string;
  qualification: string;
  currentDesignation: string;
  companyOrOrg: string;
  location: string;
  photoUrl: string;
  message?: string;
  email?: string;
  phone?: string;
  linkedinOrSocial?: string;
  isDistinguished: boolean;
  distinctionSummary?: string;
  status: 'published' | 'pending' | 'draft';
  order?: number;
}

// --- School Bus & Transport Routes (multiple docs) ---

export interface TransportStop {
  id: string;
  name: string;
  name_ta?: string;
  morningPickupTime: string;
  eveningDropTime: string;
  landmark?: string;
  feeMonthly?: number;
  order: number;
}

export interface TransportRoute extends FirestoreDoc {
  routeNumber: string;
  routeName: string;
  routeName_ta?: string;
  busRegistrationNumber: string;
  driverName: string;
  driverPhone: string;
  conductorName?: string;
  conductorPhone?: string;
  capacity: number;
  morningDepartureTime: string;
  eveningDepartureTime: string;
  startPoint: string;
  endPoint: string;
  stops: TransportStop[];
  status: PublishStatus;
  order: number;
  notes?: string;
}

// --- Student Results & Marksheets (multiple docs) ---

export interface SubjectScore {
  code: string;
  name: string;
  name_ta?: string;
  maxMarks: number;
  passingMarks: number;
  marksObtained: number;
  grade: string;
  isPassed: boolean;
}

export interface StudentResult extends FirestoreDoc {
  rollNumber: string;
  registerNumber: string;
  studentName: string;
  studentName_ta?: string;
  dob: string; // YYYY-MM-DD
  className: string; // e.g. "10th Standard" or "12th Standard - Science"
  section?: string;
  examName: string; // e.g. "SSLC Annual Board Examination" or "HSC Revision Test 2026"
  academicYear: string; // e.g. "2025–2026"
  subjects: SubjectScore[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  overallGrade: string;
  resultStatus: 'PASS' | 'FAIL' | 'WITHHELD';
  remarks?: string;
  issueDate: string;
  status: PublishStatus;
}

