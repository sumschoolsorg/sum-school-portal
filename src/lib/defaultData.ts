// ============================================================
// Clean Institutional Structural Baseline (Zero Demo Collections)
// S.U.M. Higher Secondary & Primary School, Royappanpatti
// All dynamic collections start empty ([]) and load strictly
// from Firebase Cloud Firestore / administrator-entered records.
// ============================================================

import {
  SchoolSettings,
  HomepageContent,
  AboutContent,
  AcademicsContent,
  AdmissionsContent,
  Facility,
  Faculty,
  Announcement,
  SchoolEvent,
  Achievement,
  Testimonial,
  WebsiteSettings,
  HeroBanner,
  ResearchRecord,
  ThemeSettings,
  AdminUser,
  GalleryImage,
  AlumniMember,
  TransportRoute,
  StudentResult,
  Enquiry,
  TimelineEntry,
} from '@/types';

export const defaultSchoolSettings: SchoolSettings = {
  schoolName: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
  shortName: 'S.U.M. Hr. Sec. & Primary School, Royappanpatti',
  tagline: 'Inspiring Wisdom, Integrity, and Academic Excellence Since 1963',
  establishedYear: '1963',
  schoolType: 'Government-Aided Recognized Minority Institution (Co-Educational)',
  educationBoard: 'Tamil Nadu State Board (DGE Tamil Nadu)',
  mediumOfInstruction: 'Tamil & English Medium',
  classesOffered: 'Classes 1 to 12',
  schoolTimings: 'Monday – Friday: 9:00 AM – 4:30 PM | Saturday: 9:00 AM – 1:00 PM',
  logoUrl: '/images/school-crest.png',
  jubileeLogoUrl: '/images/diamond-jubilee-logo.png',
  faviconUrl: '/favicon.ico',
  heroImageUrl: '/images/hero-campus.jpg',
  principalName: 'S. THOMAS M.Sc., M.Ed.',
  principalDesignation: 'HEADMASTER',
  primaryUdiseCode: '33250800105',
  secondaryUdiseCode: '33250800109',
  researchVerifiedDate: '',
  phone: '',
  phone2: '',
  email: 'sumschool.royappanpatti@gmail.com',
  address: '105/W-2, Savarimuthu Lourdu Nagar / East Street, Royappanpatti',
  city: 'Royappanpatti, Uthamapalayam Taluk',
  state: 'Tamil Nadu',
  pincode: '625526',
  googleMapsUrl: 'https://maps.app.goo.gl/Q1VbvDa2VjnwkAQh9',
  googleMapsEmbedUrl:
    'https://maps.google.com/maps?q=9.772386,77.3412086+(S.U.M.+HIGHER+SECONDARY+%26+PRIMARY+SCHOOL)&t=&z=16&ie=UTF8&iwloc=B&output=embed',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
  },
};

export const defaultHomepageContent: HomepageContent = {
  hero: {
    title: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
    subtitle: 'Royappanpatti, Theni District, Tamil Nadu • Established 1963',
    description:
      'Government-aided institution dedicated to value-rich, accessible, and high-quality education from Primary through Higher Secondary.',
    imageUrl: '/images/hero-campus.jpg',
    ctaText: 'Apply for Admission',
    ctaLink: '/admissions',
    secondaryCtaText: 'Explore Academics',
    secondaryCtaLink: '/academics',
  },
  stats: {
    yearsOfExcellence: '60+ Years',
    totalStudents: '3,346+',
    totalTeachers: '72+',
    totalClasses: 'Classes 1 to 12',
    achievements: '85+ Rooms',
  },
  principalMessage: {
    name: 'S. THOMAS M.Sc., M.Ed.',
    name_en: 'S. THOMAS M.Sc., M.Ed.',
    name_ta: 'உயர்திரு எஸ். தாமஸ், M.Sc., M.Ed.',
    designation: 'HEADMASTER',
    designation_en: 'HEADMASTER',
    designation_ta: 'தலைமை ஆசிரியர் (HEADMASTER)',
    photoUrl: '/images/principal-photo.jpg',
    message: '',
  },
  admissionCta: {
    title: 'Admissions Open',
    description:
      'Enroll your child at S.U.M. School, Royappanpatti. Offering Tamil Nadu State Board curriculum in Tamil and English mediums.',
    buttonText: 'Submit Admission Enquiry',
    buttonLink: '/admissions',
  },
};

export const defaultAboutContent: AboutContent = {
  introduction: '',
  introduction_en: '',
  introduction_ta: '',
  history: '',
  history_en: '',
  history_ta: '',
  vision: '',
  vision_en: '',
  vision_ta: '',
  mission: '',
  mission_en: '',
  mission_ta: '',
  coreValues: [],
  coreValues_en: [],
  coreValues_ta: [],
  educationalPhilosophy: '',
  educationalPhilosophy_en: '',
  educationalPhilosophy_ta: '',
  management: [],
  highlights: [],
  timelineSubtitle: 'Our Heritage',
  timelineSubtitle_en: 'Our Heritage',
  timelineSubtitle_ta: 'வரலாற்றுப் பயணம்',
  timelineTitle: 'Our Historic Journey',
  timelineTitle_en: 'Our Historic Journey',
  timelineTitle_ta: 'எஸ்.யு.எம். பள்ளி வரலாற்று மைல்கற்கள்',
  timelineDescription: '',
  timelineDescription_en: '',
  timelineDescription_ta: '',
};

export const defaultAcademicsContent: AcademicsContent = {
  primarySection: {
    title: 'Primary Section (Classes 1 to 5)',
    title_en: 'Primary Section (Classes 1 to 5)',
    title_ta: 'தொடக்கப்பள்ளிப் பிரிவு (வகுப்புகள் 1 முதல் 5)',
    description: '',
    description_en: '',
    description_ta: '',
    classes: [],
    classes_en: [],
    classes_ta: [],
    subjects: [],
    subjects_en: [],
    subjects_ta: [],
    imageUrl: '',
  },
  secondarySection: {
    title: 'Secondary Section (Classes 6 to 10)',
    title_en: 'Secondary Section (Classes 6 to 10)',
    title_ta: 'உயர்நிலைப் பிரிவு (வகுப்புகள் 6 முதல் 10)',
    description: '',
    description_en: '',
    description_ta: '',
    classes: [],
    classes_en: [],
    classes_ta: [],
    subjects: [],
    subjects_en: [],
    subjects_ta: [],
    imageUrl: '',
  },
  higherSecondarySection: {
    title: 'Higher Secondary Section (Classes 11 & 12)',
    title_en: 'Higher Secondary Section (Classes 11 & 12)',
    title_ta: 'மேல்நிலைப் பிரிவு (வகுப்புகள் 11 & 12)',
    description: '',
    description_en: '',
    description_ta: '',
    classes: [],
    classes_en: [],
    classes_ta: [],
    subjects: [],
    subjects_en: [],
    subjects_ta: [],
    imageUrl: '',
  },
  teachingMethodology: '',
  teachingMethodology_en: '',
  teachingMethodology_ta: '',
  examinationSystem: '',
  examinationSystem_en: '',
  examinationSystem_ta: '',
  academicActivities: [],
  academicActivities_en: [],
  academicActivities_ta: [],
  coCurricularActivities: [],
  coCurricularActivities_en: [],
  coCurricularActivities_ta: [],
  academicCalendar: '',
  academicCalendar_en: '',
  academicCalendar_ta: '',
};

export const defaultAdmissionsContent: AdmissionsContent = {
  announcement: '',
  announcementActive: false,
  eligibility: '',
  classesAvailable: [],
  procedure: [],
  requiredDocuments: [],
  importantDates: [],
  feeInformation: '',
  schoolTimings: 'Monday – Friday: 9:00 AM – 4:30 PM | Saturday: 9:00 AM – 1:00 PM',
};

export const defaultWebsiteSettings: WebsiteSettings = {
  seoTitle: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
  seoDescription:
    'Official website of S.U.M. Higher Secondary & Primary School, Royappanpatti, Theni District, Tamil Nadu. Established in 1963.',
  ogImageUrl: '/images/og-image.jpg',
  footerText:
    'Savariyappa Udaiyar Memorial Higher Secondary & Primary School, Royappanpatti, Theni District, Tamil Nadu – 625526.',
  copyrightText: '© S.U.M. Higher Secondary & Primary School, Royappanpatti. All rights reserved.',
  privacyPolicy: '',
  termsAndConditions: '',
  maintenanceMode: false,
  maintenanceMessage: 'The website is currently undergoing scheduled maintenance. Please check back shortly.',
  maxPhotoUploadSizeMB: 25,
  autoCompressLargePhotos: true,
};

export const defaultThemeSettings: ThemeSettings = {
  primaryColor: '#0f2b5c',
  secondaryColor: '#1e40af',
  accentColor: '#d97706',
  backgroundColor: '#ffffff',
  textColor: '#0f172a',
  borderColor: '#e2e8f0',
  fontFamily: 'Outfit, Inter, sans-serif',
  borderRadius: '0.75rem',
};

// ============================================================
// All Collection Defaults Are Strictly Empty (Zero Demo Data)
// ============================================================
export const defaultAdminUsers: AdminUser[] = [];
export const verifiedAlumni: AlumniMember[] = [];
export const defaultAlumni: AlumniMember[] = [];
export const defaultStudentResults: StudentResult[] = [];
export const sampleEnquiriesSeed: Enquiry[] = [];
export const defaultEnquiries: Enquiry[] = [];
export const verifiedAchievements: Achievement[] = [];
export const verifiedAnnouncements: Announcement[] = [];
export const verifiedTimelineEntries: TimelineEntry[] = [];
export const verifiedGalleryImages: GalleryImage[] = [];
export const verifiedFacilities: Facility[] = [];
export const verifiedHeroBanners: HeroBanner[] = [];
export const defaultFaculty: Faculty[] = [];
export const defaultFacilities: Facility[] = [];
export const defaultEvents: SchoolEvent[] = [];
export const defaultAchievements: Achievement[] = [];
export const defaultGalleryImages: GalleryImage[] = [];
export const defaultTimelineEntries: TimelineEntry[] = [];
export const defaultAnnouncements: Announcement[] = [];
export const defaultTestimonials: Testimonial[] = [];
export const defaultHeroBanners: HeroBanner[] = [];
export const defaultResearchRecords: ResearchRecord[] = [];
export const defaultTransportRoutes: TransportRoute[] = [];
