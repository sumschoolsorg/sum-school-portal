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
  management: [
    {
      name: 'Mrs. K. Rajeswari Suresh',
      name_en: 'Mrs. K. Rajeswari Suresh',
      name_ta: 'திருமதி. K. ராஜேஸ்வரி சுரேஷ்',
      designation: 'President',
      designation_en: 'President',
      designation_ta: 'தலைவர்',
      photoUrl: '/images/school-crest.png',
      message: 'Leading S.U.M. Institutions with dedication to value-centered rural education.',
      message_en: 'Leading S.U.M. Institutions with dedication to value-centered rural education.',
      message_ta: 'கிராமப்புற மாணவர்களுக்கு நற்பண்புகளுடன் கூடிய தரமான கல்வியை வழங்குவதில் உறுதுணை.',
      order: 1,
    },
    {
      name: 'Mr. M.S. Prabakar M.A.',
      name_en: 'Mr. M.S. Prabakar M.A.',
      name_ta: 'உயர்திரு. M.S. பிரபாகர் M.A.',
      designation: 'Secretary & Correspondent',
      designation_en: 'Secretary & Correspondent',
      designation_ta: 'செயலர் மற்றும் தாளாளர்',
      photoUrl: '/images/school-crest.png',
      message: 'Upholding the glorious legacy of our founders and steering the institution towards modern excellence.',
      message_en: 'Upholding the glorious legacy of our founders and steering the institution towards modern excellence.',
      message_ta: 'நிறுவனர்களின் சீரிய நோக்கங்களை முன்னெடுத்து, பள்ளியை நவீன வளர்ச்சிப் பாதையில் வழிநடத்துகிறோம்.',
      order: 2,
    },
    {
      name: 'Mr. R. Xavier Sundara Pandiyan M.A.',
      name_en: 'Mr. R. Xavier Sundara Pandiyan M.A.',
      name_ta: 'திரு. R. சேவியர் சுந்தர பாண்டியன் M.A.',
      designation: 'Treasurer',
      designation_en: 'Treasurer',
      designation_ta: 'பொருளாளர்',
      photoUrl: '/images/school-crest.png',
      message: 'Ensuring transparent, robust financial governance to support every student and educational initiative.',
      message_en: 'Ensuring transparent, robust financial governance to support every student and educational initiative.',
      message_ta: 'மாணவர்களின் கல்வி மற்றும் வளர்ச்சித் திட்டங்களைச் செம்மையாக நிர்வகித்தல்.',
      order: 3,
    },
    {
      name: 'Mr. S. Thomas M.Sc., M.Ed.',
      name_en: 'Mr. S. Thomas M.Sc., M.Ed.',
      name_ta: 'திரு. S. தாமஸ் M.Sc., M.Ed.',
      designation: 'Headmaster, S.U.M. Higher Secondary School',
      designation_en: 'Headmaster, S.U.M. Higher Secondary School',
      designation_ta: 'தலைமையாசிரியர், S.U.M. மேல்நிலைப்பள்ளி',
      photoUrl: '/images/headmaster.jpg',
      message: 'Empowering students to achieve 100% academic results, moral integrity, and state-level accolades.',
      message_en: 'Empowering students to achieve 100% academic results, moral integrity, and state-level accolades.',
      message_ta: 'மாணவர்கள் 100% தேர்ச்சி மற்றும் ஒழுக்கத்துடன் மாநில அளவிலான சாதனைகள் படைக்க வழிகாட்டுதல்.',
      order: 4,
    },
    {
      name: 'Mrs. M. Meenakshi M.A., M.Ed., M.Phil.',
      name_en: 'Mrs. M. Meenakshi M.A., M.Ed., M.Phil.',
      name_ta: 'திருமதி. M. மீனாட்சி M.A., M.Ed., M.Phil.',
      designation: 'Headmistress, S.U.M. Primary School',
      designation_en: 'Headmistress, S.U.M. Primary School',
      designation_ta: 'தலைமையாசிரியர், S.U.M. தொடக்கப்பள்ளி',
      photoUrl: '/images/school-crest.png',
      message: 'Nurturing young minds with foundational literacy, joyful learning, and ethical values.',
      message_en: 'Nurturing young minds with foundational literacy, joyful learning, and ethical values.',
      message_ta: 'தொடக்கப்பள்ளி மழலைகளுக்கு மகிழ்ச்சியான முறையில் அடிப்படைக் கல்வி மற்றும் நற்பண்புகள் கற்பித்தல்.',
      order: 5,
    },
    {
      name: 'Mrs. M. Nirmala Sagayarani M.Sc., M.Ed., M.Phil.',
      name_en: 'Mrs. M. Nirmala Sagayarani M.Sc., M.Ed., M.Phil.',
      name_ta: 'திருமதி. M. நிர்மலா சகாயராணி M.Sc., M.Ed., M.Phil.',
      designation: 'PG Assistant Headmistress',
      designation_en: 'PG Assistant Headmistress',
      designation_ta: 'முதுகலை உதவித்தலைமையாசிரியர்',
      photoUrl: '/images/school-crest.png',
      message: 'Fostering academic excellence and holistic student development across higher secondary streams.',
      message_en: 'Fostering academic excellence and holistic student development across higher secondary streams.',
      message_ta: 'மேல்நிலைப் பிரிவு மாணவர்களின் உயர்கல்வி வெற்றி மற்றும் சீரிய முன்னேற்றத்திற்கு வழிகாட்டுதல்.',
      order: 6,
    },
  ],
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
export const verifiedAnnouncements: Announcement[] = [
  {
    id: 'ann-annual-day-63',
    title: '63rd Annual Day Celebration Invitation — S.U.M. Higher Secondary & Primary School',
    title_en: '63rd Annual Day Celebration Invitation — S.U.M. Higher Secondary & Primary School',
    title_ta: '63 ஆம் ஆண்டு விழா அழைப்பிதழ் — எஸ்.யு.எம். மேல்நிலைப்பள்ளி மற்றும் தொடக்கப்பள்ளி',
    description: 'The 63rd Annual Day celebration of S.U.M. Schools will be held on Saturday, 21.11.2026 at 4:30 PM at the school campus in Royappanpatti, presided by Hon. Thiru. PLA. Jaganath Mishra MLA.',
    description_en: 'The 63rd Annual Day celebration of S.U.M. Schools will be held on Saturday, 21.11.2026 at 4:30 PM at the school campus in Royappanpatti, presided by Hon. Thiru. PLA. Jaganath Mishra MLA.',
    description_ta: 'நம் எஸ்.யு.எம். பள்ளிகளின் 63 ஆம் ஆண்டு விழா நம் பள்ளி வளாகத்தில் 21.11.2026 சனிக்கிழமை மாலை 4.30 மணியளவில் கம்பம் சட்டமன்ற உறுப்பினர் உயர்திரு. PLA. ஜெகநாத் மிஸ்ரா MLA அவர்கள் தலைமையில் சீரும் சிறப்புமாக நடைபெற இருக்கிறது. அனைவரும் வருக!',
    content: `63 ஆம் ஆண்டு விழா அழைப்பிதழ்

நாள்: 21-11-2026 சனிக்கிழமை | நேரம்: மாலை 4.30 மணி
இடம்: நம் பள்ளி வளாகம், சவரிமுத்து லூர்து நகர், இராயப்பன்பட்டி - 625 526, தேனி மாவட்டம்.

தலைமை:
உயர்திரு. PLA. ஜெகநாத் மிஸ்ரா MLA அவர்கள் (கம்பம் சட்டமன்ற உறுப்பினர்)

முன்னிலை (எம் பள்ளியின் மேனாள் மாணவர்கள்):
• Dr. M. மணிகண்டன் MBBS., DLO (மாவட்ட தலைமை மருத்துவமனை, இடுக்கி, கேரளா)
• Dr. சரிதா MBBS., M.S (OG) (மகப்பேறு மருத்துவர், மலப்புரம், கேரளா)
• Dr. A. சசிக்குமார் MBBS., DPH (இணை இயக்குநர், பொது சுகாதாரத் துறை, திருவனந்தபுரம், கேரளா)

நிகழ்ச்சி நிரல்:
1. இறைவணக்கம்
2. தமிழ்த்தாய் வாழ்த்து
3. வரவேற்பு நடனம் (தொடக்க & மேல்நிலைப்பள்ளி மாணாக்கியர்)
4. வரவேற்புரை (செயலர் & தாளாளர் உயர்திரு. M.S. பிரபாகர் M.A., எஸ்.யு.எம். பள்ளிகள்)
5. ஆசிரியர்களைப் பாராட்டுதல்:
   - பாராட்டுப் பெறும் ஆசிரியர்: ஓய்வு பெற்ற இடைநிலை ஆசிரியர் திருமதி. R. காயத்ரி M.A., B.Ed.
   - மற்றும் கற்பித்தல் பணியில் வெள்ளி விழா கண்ட ஆசிரியப் பெருமக்களைப் பாராட்டுதல்
6. பரிசு வழங்குதல்: 2025-2026 ஆம் கல்வியாண்டில் கல்வி மற்றும் விளையாட்டில் சிறப்பிடம் பெற்ற மாணவ மாணவியருக்குப் பரிசு வழங்குதல்
7. வாழ்த்துரை: தலைவர் மற்றும் முன்னிலை வகிப்போர்
8. ஆண்டறிக்கை: மேல்நிலைப்பள்ளி தலைமையாசிரியர் திரு. S. தாமஸ் M.Sc., M.Ed.
9. நன்றியுரை: திருமதி. M. நிர்மலா சகாயராணி M.Sc., M.Ed., M.Phil. (முதுகலை உதவித்தலைமையாசிரியர்)
10. கலை நிகழ்ச்சிகள் & நாட்டுப்பண்

இவ்வண்,
உயர்திரு. M.S. பிரபாகர் M.A. (செயலர் & தாளாளர்),
திருமதி. K. ராஜேஸ்வரி சுரேஷ் (தலைவர்),
திரு. S. தாமஸ் M.Sc., M.Ed. (தலைமையாசிரியர், மேல்நிலைப்பள்ளி),
திருமதி. M. மீனாட்சி M.A., M.Ed., M.Phil. (தலைமையாசிரியர், தொடக்கப்பள்ளி),
ஆசிரியப் பெருமக்கள், ஊழியர்கள் மற்றும் மாணவ மாணவியர்.`,
    content_en: `63rd Annual Day Celebration Invitation

Date: Saturday, 21st November 2026 | Time: 4:30 PM
Venue: School Campus, Savarimuthu Lourdu Nagar, Royappanpatti - 625 526, Theni District.

Presidential Address / Chief Guest:
Hon. Thiru. PLA. Jaganath Mishra MLA (Member of Legislative Assembly, Cumbum Constituency)

Special Guests (Distinguished Alumni of S.U.M. School):
• Dr. M. Manikandan MBBS., DLO (District Head Hospital, Idukki, Kerala)
• Dr. Saritha MBBS., M.S (OG) (Gynaecologist & Obstetrician, Malappuram, Kerala)
• Dr. A. Sasikumar MBBS., DPH (Joint Director, Directorate of Public Health, Thiruvananthapuram, Kerala)

Programme Schedule:
1. Prayer Song & Tamil Thai Vaazhthu
2. Welcome Dance by Primary & Higher Secondary Students
3. Welcome Address by Secretary & Correspondent Thiru. M.S. Prabakar M.A.
4. Teacher Felicitation:
   - Honoring Retired Middle School Teacher Mrs. R. Gayathri M.A., B.Ed.
   - Honoring Silver Jubilee Dedicated Faculty Members
5. Prize Distribution for Academic & Sports Achievers (Academic Year 2025–2026)
6. Felicitations by Chief Guest & Dignitaries
7. Annual Report by Headmaster Mr. S. Thomas M.Sc., M.Ed.
8. Vote of Thanks by Mrs. M. Nirmala Sagayarani M.Sc., M.Ed., M.Phil. (PG Assistant Headmistress)
9. Vibrant Student Cultural Performances & National Anthem

Cordially Invited by:
Mr. M.S. Prabakar M.A. (Secretary & Correspondent),
Mrs. K. Rajeswari Suresh (President),
Mr. S. Thomas M.Sc., M.Ed. (Headmaster, S.U.M. Higher Secondary School),
Mrs. M. Meenakshi M.A., M.Ed., M.Phil. (Headmistress, S.U.M. Primary School),
Teachers, Staff and Students.`,
    content_ta: `63 ஆம் ஆண்டு விழா அழைப்பிதழ்

நாள்: 21-11-2026 சனிக்கிழமை | நேரம்: மாலை 4.30 மணி
இடம்: நம் பள்ளி வளாகம், சவரிமுத்து லூர்து நகர், இராயப்பன்பட்டி - 625 526, தேனி மாவட்டம்.

தலைமை:
உயர்திரு. PLA. ஜெகநாத் மிஸ்ரா MLA அவர்கள் (கம்பம் சட்டமன்ற உறுப்பினர்)

முன்னிலை (எம் பள்ளியின் மேனாள் மாணவர்கள்):
• Dr. M. மணிகண்டன் MBBS., DLO (மாவட்ட தலைமை மருத்துவமனை, இடுக்கி, கேரளா)
• Dr. சரிதா MBBS., M.S (OG) (மகப்பேறு மருத்துவர், மலப்புரம், கேரளா)
• Dr. A. சசிக்குமார் MBBS., DPH (இணை இயக்குநர், பொது சுகாதாரத் துறை, திருவனந்தபுரம், கேரளா)

நிகழ்ச்சி நிரல்:
1. இறைவணக்கம்
2. தமிழ்த்தாய் வாழ்த்து
3. வரவேற்பு நடனம் (தொடக்க & மேல்நிலைப்பள்ளி மாணாக்கியர்)
4. வரவேற்புரை (செயலர் & தாளாளர் உயர்திரு. M.S. பிரபாகர் M.A., எஸ்.யு.எம். பள்ளிகள்)
5. ஆசிரியர்களைப் பாராட்டுதல்:
   - பாராட்டுப் பெறும் ஆசிரியர்: ஓய்வு பெற்ற இடைநிலை ஆசிரியர் திருமதி. R. காயத்ரி M.A., B.Ed.
   - மற்றும் கற்பித்தல் பணியில் வெள்ளி விழா கண்ட ஆசிரியப் பெருமக்களைப் பாராட்டுதல்
6. பரிசு வழங்குதல்: 2025-2026 ஆம் கல்வியாண்டில் கல்வி மற்றும் விளையாட்டில் சிறப்பிடம் பெற்ற மாணவ மாணவியருக்குப் பரிசு வழங்குதல்
7. வாழ்த்துரை: தலைவர் மற்றும் முன்னிலை வகிப்போர்
8. ஆண்டறிக்கை: மேல்நிலைப்பள்ளி தலைமையாசிரியர் திரு. S. தாமஸ் M.Sc., M.Ed.
9. நன்றியுரை: திருமதி. M. நிர்மலா சகாயராணி M.Sc., M.Ed., M.Phil. (முதுகலை உதவித்தலைமையாசிரியர்)
10. கலை நிகழ்ச்சிகள் & நாட்டுப்பண்

இவ்வண்,
உயர்திரு. M.S. பிரபாகர் M.A. (செயலர் & தாளாளர்),
திருமதி. K. ராஜேஸ்வரி சுரேஷ் (தலைவர்),
திரு. S. தாமஸ் M.Sc., M.Ed. (தலைமையாசிரியர், மேல்நிலைப்பள்ளி),
திருமதி. M. மீனாட்சி M.A., M.Ed., M.Phil. (தலைமையாசிரியர், தொடக்கப்பள்ளி),
ஆசிரியப் பெருமக்கள், ஊழியர்கள் மற்றும் மாணவ மாணவியர்.`,
    category: 'circular',
    imageUrl: '/images/annual-day-63-invitation-1.jpg',
    attachmentUrl: '/images/annual-day-63-invitation-2.jpg',
    attachmentName: '63-Annual-Day-Schedule-Pamphlet.jpg',
    status: 'published',
    featured: true,
    priority: 'urgent',
    date: new Date('2026-11-21T16:30:00'),
    publishDate: '2026-11-20',
    link: '/events',
  },
];
export const verifiedTimelineEntries: TimelineEntry[] = [];
export const verifiedGalleryImages: GalleryImage[] = [];
export const verifiedFacilities: Facility[] = [];
export const verifiedHeroBanners: HeroBanner[] = [];
export const defaultFaculty: Faculty[] = [];
export const defaultFacilities: Facility[] = [];
export const defaultEvents: SchoolEvent[] = [
  {
    id: 'event-annual-day-63',
    title: '63rd Annual Day Celebration 2026',
    title_en: '63rd Annual Day Celebration 2026',
    title_ta: '63 ஆம் ஆண்டு விழா 2026',
    description: 'Grand 63rd Annual Day celebration of S.U.M. Higher Secondary & Primary School presided by Hon. Thiru. PLA. Jaganath Mishra MLA, Cumbum Constituency.',
    description_en: 'Grand 63rd Annual Day celebration of S.U.M. Higher Secondary & Primary School presided by Hon. Thiru. PLA. Jaganath Mishra MLA, Cumbum Constituency.',
    description_ta: 'கம்பம் சட்டமன்ற உறுப்பினர் உயர்திரு. PLA. ஜெகநாத் மிஸ்ரா MLA அவர்கள் தலைமையில் நடைபெறும் எஸ்.யு.எம். பள்ளிகளின் 63 ஆம் ஆண்டு விழா.',
    content: `நம் எஸ்.யு.எம். பள்ளிகளின் 63 ஆம் ஆண்டு விழா நம் பள்ளி வளாகத்தில் 21.11.2026 சனிக்கிழமை மாலை 4.30 மணியளவில் சீரும் சிறப்புமாக நடைபெற இருக்கிறது. தாங்கள் இவ்விழாவில் கலந்து கொண்டு சிறப்பிக்க அன்புடன் அழைக்கிறோம்.`,
    content_en: `The 63rd Annual Day celebration of S.U.M. Schools will be held on Saturday, 21.11.2026 at 4:30 PM at the school campus in Royappanpatti. Cordially invited by Secretary & Correspondent, Headmasters, Staff and Students.`,
    content_ta: `நம் எஸ்.யு.எம். பள்ளிகளின் 63 ஆம் ஆண்டு விழா நம் பள்ளி வளாகத்தில் 21.11.2026 சனிக்கிழமை மாலை 4.30 மணியளவில் சீரும் சிறப்புமாக நடைபெற இருக்கிறது. தாங்கள் இவ்விழாவில் கலந்து கொண்டு சிறப்பிக்க அன்புடன் அழைக்கிறோம்.`,
    date: new Date('2026-11-21T16:30:00'),
    endDate: new Date('2026-11-21T21:00:00'),
    time: 'மாலை 4.30 மணி (4:30 PM)',
    venue: 'பள்ளி வளாகம், சவரிமுத்து லூர்து நகர், இராயப்பன்பட்டி - 625 526, தேனி மாவட்டம்',
    venue_en: 'S.U.M. School Campus, Savarimuthu Lourdu Nagar, Royappanpatti - 625 526, Theni District',
    venue_ta: 'பள்ளி வளாகம், சவரிமுத்து லூர்து நகர், இராயப்பன்பட்டி - 625 526, தேனி மாவட்டம்',
    imageUrl: '/images/annual-day-63-invitation-1.jpg',
    category: 'celebration',
    academicYear: '2026-2027',
    calendarYear: 2026,
    month: 'November',
    chiefGuest: 'Hon. Thiru. PLA. Jaganath Mishra MLA (Cumbum Constituency)',
    chiefGuest_ta: 'உயர்திரு. PLA. ஜெகநாத் மிஸ்ரா MLA அவர்கள், கம்பம் சட்டமன்ற உறுப்பினர்',
    organizer: 'S.U.M. School Management & Teachers',
    status: 'published',
    isFeatured: true,
  },
];
export const defaultAchievements: Achievement[] = [];
export const defaultGalleryImages: GalleryImage[] = [];
export const defaultTimelineEntries: TimelineEntry[] = [];
export const defaultAnnouncements: Announcement[] = verifiedAnnouncements;
export const defaultTestimonials: Testimonial[] = [];
export const defaultHeroBanners: HeroBanner[] = [];
export const defaultResearchRecords: ResearchRecord[] = [];
export const defaultTransportRoutes: TransportRoute[] = [];
