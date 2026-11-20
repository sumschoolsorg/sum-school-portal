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
    description: 'Foundational learning in Tamil medium with strong English language primers, joyful activity-based discovery, numeracy, and ethical formation. UDISE: 33250800105.',
    description_en: 'Foundational learning in Tamil medium with strong English language primers, joyful activity-based discovery, numeracy, and ethical formation. UDISE: 33250800105.',
    description_ta: 'மழலையர் மற்றும் தொடக்கக் கல்வி மாணவர்களுக்கு தாய்மொழியாம் தமிழில் அடிப்படைக் கல்வி, ஆங்கில மொழி அறிமுகம், மகிழ்ச்சியான செயல்பாட்டுக் கற்றல் மற்றும் நற்பண்புப் பயிற்சி. UDISE: 33250800105.',
    classes: ['Standard I', 'Standard II', 'Standard III', 'Standard IV', 'Standard V'],
    classes_en: ['Standard I', 'Standard II', 'Standard III', 'Standard IV', 'Standard V'],
    classes_ta: ['1-ஆம் வகுப்பு', '2-ஆம் வகுப்பு', '3-ஆம் வகுப்பு', '4-ஆம் வகுப்பு', '5-ஆம் வகுப்பு'],
    subjects: [
      'Tamil Language & Literature (தமிழ்)',
      'Foundational English (ஆங்கிலம்)',
      'Basic Mathematics & Numeracy (கணிதம்)',
      'Environmental Studies (சூழ்நிலையியல்)',
      'Moral Science, Physical Health & Arts (நன்னெறி & கலை)',
    ],
    subjects_en: [
      'Tamil Language & Literature',
      'Foundational English',
      'Basic Mathematics & Numeracy',
      'Environmental Studies (EVS)',
      'Moral Science, Physical Health & Creative Arts',
    ],
    subjects_ta: [
      'தமிழ் மொழி & இலக்கியம்',
      'அடிப்படை ஆங்கிலம்',
      'கணிதம் & எண்கணிதத் திறன்',
      'சூழ்நிலையியல் (அறிவியல் & சமூகம்)',
      'நன்னெறிக் கல்வி, உடற்கல்வி & ஓவியம்',
    ],
    imageUrl: '/images/primary-section.jpg',
  },
  secondarySection: {
    title: 'Secondary Section — Classes 6 to 10 (Tamil & English Medium)',
    title_en: 'Secondary Section — Classes 6 to 10 (Tamil & English Medium)',
    title_ta: 'உயர்நிலைப் பிரிவு — வகுப்புகள் 6 முதல் 10 (தமிழ் & ஆங்கில வழி)',
    description: 'Tamil Nadu State Board (Samacheer Kalvi) syllabus offered in both Tamil Medium & English Medium from 6th to 10th standard. Rigorous preparation for 10th SSLC Public Examinations, dedicated special sections for NMMS Scholarship Exam, and special coaching for Rural Talent (TRUST) Exam.',
    description_en: 'Tamil Nadu State Board (Samacheer Kalvi) syllabus offered in both Tamil Medium & English Medium from 6th to 10th standard. Rigorous preparation for 10th SSLC Public Examinations, dedicated special sections for NMMS Scholarship Exam, and special coaching for Rural Talent (TRUST) Exam.',
    description_ta: 'தமிழ்நாடு அரசுப் பாடத்திட்டம் (சமச்சீர் கல்வி) 6-ஆம் வகுப்பு முதல் 10-ஆம் வகுப்பு வரை தமிழ் வழி மற்றும் ஆங்கில வழி ஆகிய இரு வழிகளிலும் சிறந்த முறையில் கற்பிக்கப்படுகிறது. 10-ஆம் வகுப்பு அரசு பொதுத்தேர்வில் 100% தேர்ச்சி இலக்குடன், NMMS கல்வி உதவித்தொகைத் தேர்வுக்கான தனிப் பிரிவுகள் மற்றும் ஊரகத் திறனாய்வுத் தேர்வுக்கான (TRUST Exam) சிறப்புப் பயிற்சிகள் வழங்கப்படுகின்றன.',
    classes: ['Standard VI', 'Standard VII', 'Standard VIII', 'Standard IX', 'Standard X (SSLC)'],
    classes_en: ['Standard VI', 'Standard VII', 'Standard VIII', 'Standard IX', 'Standard X (SSLC)'],
    classes_ta: ['6-ஆம் வகுப்பு', '7-ஆம் வகுப்பு', '8-ஆம் வகுப்பு', '9-ஆம் வகுப்பு', '10-ஆம் வகுப்பு (SSLC)'],
    subjects: [
      'Tamil Medium & English Medium Tracks (Classes 6 to 10)',
      'Special Sections for NMMS Scholarship Exam (Class 8)',
      'Special Training for Rural Talent Exam (TRUST Exam)',
      'Mathematics (Algebra, Geometry, Practical Geometry & Graph)',
      'Science with Physics, Chemistry & Biology Practical Labs',
      'Social Science (History, Geography, Civics & Economics)',
      'Computer Literacy & Atal Tinkering STEM Innovation',
      'Physical Education, Yoga & Silambam Training',
    ],
    subjects_en: [
      'Tamil Medium & English Medium Options (Classes 6 to 10)',
      'Special Sections for NMMS Scholarship Exam (Class 8)',
      'Special Training for Rural Talent Exam (TRUST Exam)',
      'Mathematics (Algebra, Geometry, Practical Geometry & Graph)',
      'Science with Physics, Chemistry & Biology Practical Labs',
      'Social Science (History, Geography, Civics & Economics)',
      'Computer Literacy & Atal Tinkering STEM Innovation',
      'Physical Education, Yoga & Silambam Training',
    ],
    subjects_ta: [
      'தமிழ் வழி & ஆங்கில வழி இருவழிக் கல்வி (வகுப்புகள் 6 முதல் 10)',
      'NMMS கல்வி உதவித்தொகைத் தேர்வுக்கான தனிப் பிரிவுகள் (8-ஆம் வகுப்பு)',
      'ஊரகத் திறனாய்வுத் தேர்வுக்கான (TRUST Exam) சிறப்புப் பயிற்சி',
      'கணிதம் (இயற்கணிதம், வடிவியல், செய்முறை வடிவியல் & வரைபடம்)',
      'அறிவியல் (இயற்பியல், வேதியியல், உயிரியல் செய்முறை ஆய்வகம்)',
      'சமூக அறிவியல் (வரலாறு, புவியியல், குடிமையியல், பொருளியல்)',
      'கணினி அறிவியல் & அடல் டிங்கரிங் புத்தாக்க ஆய்வகம்',
      'உடற்கல்வி, யோகா மற்றும் பாரம்பரிய சிலம்பப் பயிற்சி',
    ],
    imageUrl: '/images/secondary-section.jpg',
  },
  higherSecondarySection: {
    title: 'Higher Secondary Section — Classes 11 & 12 (Tamil & English Medium)',
    title_en: 'Higher Secondary Section — Classes 11 & 12 (Tamil & English Medium)',
    title_ta: 'மேல்நிலைப் பிரிவு — வகுப்புகள் 11 & 12 (தமிழ் & ஆங்கில வழி)',
    description: 'Tamil Nadu State Board (+1 & +2 HSC) curriculum offered in both Tamil Medium & English Medium across 4 specialized groups: Group I (Bio-Maths & Computer Science), Group II (Pure Science), Group III (Commerce, Accountancy & Economics), and Group IV (Vocational Commerce & Auditing).',
    description_en: 'Tamil Nadu State Board (+1 & +2 HSC) curriculum offered in both Tamil Medium & English Medium across 4 specialized groups: Group I (Bio-Maths & Computer Science), Group II (Pure Science), Group III (Commerce, Accountancy & Economics), and Group IV (Vocational Commerce & Auditing).',
    description_ta: 'தமிழ்நாடு மேல்நிலைக் கல்வி வாரியத்தின் (+1 & +2 HSC) கீழ் தமிழ் வழி மற்றும் ஆங்கில வழி ஆகிய இரு வழிகளிலும் 4 பிரதான குரூப்கள் (Groups) அனுபவமிக்க முதுகலை ஆசிரியர்கள் மற்றும் நவீன ஆய்வகங்களுடன் நடத்தப்படுகின்றன.',
    classes: ['Standard XI (+1)', 'Standard XII (+2)'],
    classes_en: ['Standard XI (+1)', 'Standard XII (+2)'],
    classes_ta: ['11-ஆம் வகுப்பு (+1)', '12-ஆம் வகுப்பு (+2)'],
    subjects: [
      'Group I (A) Bio-Maths: Mathematics, Physics, Chemistry, Biology (Tamil & English Medium)',
      'Group I (B) Computer Science: Mathematics, Physics, Chemistry, Computer Science (Tamil & English Medium)',
      'Group II Pure Science: Physics, Chemistry, Botany, Zoology (Tamil & English Medium)',
      'Group III (i): History, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group III (ii): Computer Applications, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group III (iii): Business Maths, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group IV Vocational: Commerce, Auditing, Accountancy, Employment Skills (Tamil & English Medium)',
    ],
    subjects_en: [
      'Group I (A) Bio-Maths: Mathematics, Physics, Chemistry, Biology (Tamil & English Medium)',
      'Group I (B) Computer Science: Mathematics, Physics, Chemistry, Computer Science (Tamil & English Medium)',
      'Group II Pure Science: Physics, Chemistry, Botany, Zoology (Tamil & English Medium)',
      'Group III (i): History, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group III (ii): Computer Applications, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group III (iii): Business Maths, Commerce, Accountancy, Economics (Tamil & English Medium)',
      'Group IV Vocational: Commerce, Auditing, Accountancy, Employment Skills (Tamil & English Medium)',
    ],
    subjects_ta: [
      'குரூப் I (A) பயோ-மேக்ஸ்: கணிதம், இயற்பியல், வேதியியல், உயிரியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் I (B) கணினி அறிவியல்: கணிதம், இயற்பியல், வேதியியல், கணினி அறிவியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் II தூய அறிவியல்: இயற்பியல், வேதியியல், தாவரவியல், விலங்கியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் III (i): வரலாறு, வணிகவியல், கணக்குப்பதிவியல், பொருளியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் III (ii): கணினிப் பயன்பாடுகள், வணிகவியல், கணக்குப்பதிவியல், பொருளியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் III (iii): வணிகக் கணிதம், வணிகவியல், கணக்குப்பதிவியல், பொருளியல் (தமிழ் & ஆங்கில வழி)',
      'குரூப் IV தொழிற்கல்வி: வணிகவியல், தணிக்கையியல் (Auditing), கணக்குப்பதிவியல், வேலைவாய்ப்புத் திறன் (தமிழ் & ஆங்கில வழி)',
    ],
    imageUrl: '/images/higher-secondary.jpg',
  },
  teachingMethodology: 'Rigorous Tamil Nadu State Board (Samacheer Kalvi) instruction provided in both Tamil and English mediums from 6th to 12th standard. Blending interactive smart classrooms, real science and computer laboratory practicals, specialized coaching for competitive scholarship exams (NMMS & TRUST), and focused model exam series ensuring 100% board exam pass rates.',
  teachingMethodology_en: 'Rigorous Tamil Nadu State Board (Samacheer Kalvi) instruction provided in both Tamil and English mediums from 6th to 12th standard. Blending interactive smart classrooms, real science and computer laboratory practicals, specialized coaching for competitive scholarship exams (NMMS & TRUST), and focused model exam series ensuring 100% board exam pass rates.',
  teachingMethodology_ta: 'தமிழ்நாடு அரசு சமச்சீர் கல்விப் பாடத்திட்டம் 6 முதல் 12-ஆம் வகுப்பு வரை தமிழ் வழி மற்றும் ஆங்கில வழிகளில் சீரிய முறையில் கற்பிக்கப்படுகிறது. டிஜிட்டல் ஸ்மார்ட் வகுப்பறைகள், நேரடி ஆய்வகச் செய்முறைகள், NMMS மற்றும் TRUST உதவித்தொகைத் தேர்வுகளுக்கான பிரத்யேகப் பயிற்சிகள் மற்றும் தொடர் மாதிரித் தேர்வுகள் மூலம் மாணவர்கள் 100% தேர்ச்சி பெற வழிவகுக்கப்படுகிறது.',
  examinationSystem: 'Continuous and Comprehensive Evaluation (CCE) for Classes 1 to 9, intensive model board exam preparation for Classes 10 (SSLC) and 12 (+2 HSC), and targeted special coaching for NMMS (Class 8) and TRUST (Rural Talent) scholarship examinations.',
  examinationSystem_en: 'Continuous and Comprehensive Evaluation (CCE) for Classes 1 to 9, intensive model board exam preparation for Classes 10 (SSLC) and 12 (+2 HSC), and targeted special coaching for NMMS (Class 8) and TRUST (Rural Talent) scholarship examinations.',
  examinationSystem_ta: '1 முதல் 9-ஆம் வகுப்பு வரை தொடர் மற்றும் முழுமையான மதிப்பீட்டு முறை (CCE), 10 மற்றும் 12-ஆம் வகுப்பு அரசு பொதுத்தேர்வுகளுக்கான மாதிரித் தேர்வுகள், மற்றும் 8-ஆம் வகுப்பு NMMS மற்றும் ஊரகத் திறனாய்வுத் தேர்வுக்கான (TRUST) சிறப்புத் தேர்வுகள்.',
  academicActivities: [
    'Tamil Medium & English Medium Instruction (Classes 6 to 12)',
    'Special Sections for NMMS Scholarship Examination (Class 8)',
    'Special Training for Rural Talent Examination (TRUST Exam)',
    '11th & 12th Groups: Bio-Maths, Computer Science, Pure Science, Commerce & Vocational Auditing',
    'Hands-on Practical Labs (Physics, Chemistry, Biology & Computer Science)',
    'Atal Tinkering STEM & Robotics Innovation Center Workshops',
    'State Board 100% Pass Model Test Series and Remedial Mentoring',
  ],
  academicActivities_en: [
    'Tamil Medium & English Medium Instruction (Classes 6 to 12)',
    'Special Sections for NMMS Scholarship Examination (Class 8)',
    'Special Training for Rural Talent Examination (TRUST Exam)',
    '11th & 12th Groups: Bio-Maths, Computer Science, Pure Science, Commerce & Vocational Auditing',
    'Hands-on Practical Labs (Physics, Chemistry, Biology & Computer Science)',
    'Atal Tinkering STEM & Robotics Innovation Center Workshops',
    'State Board 100% Pass Model Test Series and Remedial Mentoring',
  ],
  academicActivities_ta: [
    'தமிழ் வழி & ஆங்கில வழி இருவழிக் கல்வி முறை (6 முதல் 12-ஆம் வகுப்பு வரை)',
    'NMMS கல்வி உதவித்தொகைத் தேர்வுக்கான தனிப் பிரிவுகள் (8-ஆம் வகுப்பு)',
    'ஊரகத் திறனாய்வுத் தேர்வுக்கான (TRUST Exam) சிறப்புப் பயிற்சி',
    '11 & 12-ஆம் வகுப்பு குரூப்கள்: பயோ-மேக்ஸ், கணினி அறிவியல், தூய அறிவியல், வணிகவியல் & தொழிற்கல்வி ஆடிட்டிங்',
    'நேரடி செய்முறை ஆய்வகப் பயிற்சிகள் (இயற்பியல், வேதியியல், உயிரியல் & கணினி)',
    'அடல் டிங்கரிங் STEM & ரோபாட்டிக்ஸ் பயிற்சிப் பட்டறைகள்',
    'அரசு பொதுத்தேர்வில் 100% தேர்ச்சிக்கான தீவிர மாதிரித் தேர்வுகள் மற்றும் சிறப்பு வழிகாட்டல்',
  ],
  coCurricularActivities: [
    'National Cadet Corps (NCC) Army Wing Training',
    'National Service Scheme (NSS) Village Outreach',
    'Bharat Scouts and Guides Troop',
    'Junior Red Cross (JRC) First Aid & Health Society',
    'Traditional Tamil Silambam Martial Arts Academy',
    'Volleyball, Kabaddi, Kho-Kho & Track Athletics Championships',
    'State-Level Kalai Thiruvizha Arts & Cultural Competitions',
  ],
  coCurricularActivities_en: [
    'National Cadet Corps (NCC) Army Wing Training',
    'National Service Scheme (NSS) Village Outreach',
    'Bharat Scouts and Guides Troop',
    'Junior Red Cross (JRC) First Aid & Health Society',
    'Traditional Tamil Silambam Martial Arts Academy',
    'Volleyball, Kabaddi, Kho-Kho & Track Athletics Championships',
    'State-Level Kalai Thiruvizha Arts & Cultural Competitions',
  ],
  coCurricularActivities_ta: [
    'தேசிய மாணவர் படை (NCC) தரைப்படைப் பயிற்சி',
    'நாட்டு நலப்பணித் திட்டம் (NSS) கிராமப்புற சமுதாயப் பணி',
    'பாரத சாரணர் இயக்கம் (Scouts and Guides)',
    'இளம் செஞ்சிலுவைச் சங்கம் (JRC) முதலுதவிப் பயிற்சி',
    'பாரம்பரிய வீரக்கலை சிலம்பப் பயிற்சிக் கூடம்',
    'கைப்பந்து, கபடி, கோ-கோ & தடகள விளையாட்டுப் போட்டிகள்',
    'மாநில அளவிலான கலைத் திருவிழா போட்டிகள் & பரிசுகள்',
  ],
  academicCalendar: 'June: Academic Year Reopening | October: Quarterly Exams | December: Half-Yearly Exams & NMMS Exam | January: Rural Talent (TRUST) Exam | March–April: State Board SSLC & HSC Public Examinations.',
  academicCalendar_en: 'June: Academic Year Reopening | October: Quarterly Exams | December: Half-Yearly Exams & NMMS Exam | January: Rural Talent (TRUST) Exam | March–April: State Board SSLC & HSC Public Examinations.',
  academicCalendar_ta: 'ஜூன்: பள்ளிகள் திறப்பு | அக்டோபர்: காலாண்டுத் தேர்வுகள் | டிசம்பர்: அரையாண்டுத் தேர்வுகள் & NMMS உதவித்தொகைத் தேர்வு | ஜனவரி: ஊரகத் திறனாய்வுத் தேர்வு (TRUST) | மார்ச்–ஏப்ரல்: 10 & 12-ஆம் வகுப்பு அரசு பொதுத்தேர்வுகள்.',
};

export const defaultAdmissionsContent: AdmissionsContent = {
  announcement:
    'Admissions Open for Academic Year 2025–2026 from LKG to 12th Standard. Tamil Medium & English Medium options available with special NMMS and TRUST scholarship coaching and 4 Higher Secondary groups.',
  announcement_en:
    'Admissions Open for Academic Year 2025–2026 from LKG to 12th Standard. Tamil Medium & English Medium options available with special NMMS and TRUST scholarship coaching and 4 Higher Secondary groups.',
  announcement_ta:
    '2025–2026 கல்வியாண்டிற்கான மாணவர் சேர்க்கை LKG முதல் 12-ஆம் வகுப்பு வரை தொடங்கப்பட்டுள்ளது. தமிழ் மற்றும் ஆங்கில வழிக் கல்வி, NMMS & TRUST உதவித்தொகை பயிற்சி மற்றும் 4 மேல்நிலை பாடப்பிரிவுகள் உள்ளன.',
  announcementActive: true,
  eligibility:
    'Open to boys and girls across all communities. Tamil Medium and English Medium from 6th to 12th standard. Special sections for NMMS Scholarship Exam (Class 8) and Rural Talent (TRUST) Exam (Class 9). Choice of 4 Groups in 11th Standard based on 10th SSLC marks.',
  eligibility_en:
    'Open to boys and girls across all communities. Tamil Medium and English Medium from 6th to 12th standard. Special sections for NMMS Scholarship Exam (Class 8) and Rural Talent (TRUST) Exam (Class 9). Choice of 4 Groups in 11th Standard based on 10th SSLC marks.',
  eligibility_ta:
    'அனைத்து சமூகத்து மாணவ-மாணவியருக்கும் சேர்க்கை திறந்துள்ளது. 6 முதல் 12-ஆம் வகுப்பு வரை தமிழ் வழி மற்றும் ஆங்கில வழி பயிற்றுமுறை. 8-ஆம் வகுப்பில் NMMS உதவித்தொகை சிறப்புப் பிரிவுகள், 9-ஆம் வகுப்பில் TRUST ஊரகத் திறனாய்வுப் பயிற்சி, மற்றும் 10-ஆம் வகுப்பு மதிப்பெண் அடிப்படையில் 11-ஆம் வகுப்பில் 4 பிரதான குரூப்கள் தேர்ந்தெடுக்கலாம்.',
  classesAvailable: [
    'LKG & UKG (Primary School)',
    'Classes 1 to 5 (Primary Education)',
    'Classes 6 to 10 (Tamil & English Medium with NMMS / TRUST coaching)',
    'Class 11 & 12 — Group I (Bio-Maths / Computer Science)',
    'Class 11 & 12 — Group II (Pure Science)',
    'Class 11 & 12 — Group III (Commerce, Accountancy & Economics)',
    'Class 11 & 12 — Group IV (Vocational Commerce & Auditing)',
  ],
  classesAvailable_en: [
    'LKG & UKG (Primary School)',
    'Classes 1 to 5 (Primary Education)',
    'Classes 6 to 10 (Tamil & English Medium with NMMS / TRUST coaching)',
    'Class 11 & 12 — Group I (Bio-Maths / Computer Science)',
    'Class 11 & 12 — Group II (Pure Science)',
    'Class 11 & 12 — Group III (Commerce, Accountancy & Economics)',
    'Class 11 & 12 — Group IV (Vocational Commerce & Auditing)',
  ],
  classesAvailable_ta: [
    'LKG & UKG (தொடக்கப்பள்ளி மழலையர் பிரிவு)',
    '1 முதல் 5-ஆம் வகுப்பு (தொடக்கக் கல்வி)',
    '6 முதல் 10-ஆம் வகுப்பு (தமிழ் & ஆங்கில வழி, NMMS & TRUST தேர்வுகள்)',
    '11 & 12-ஆம் வகுப்பு — குரூப் I (பயோ-மேக்ஸ் / கணினி அறிவியல்)',
    '11 & 12-ஆம் வகுப்பு — குரூப் II (தூய அறிவியல்)',
    '11 & 12-ஆம் வகுப்பு — குரூப் III (வணிகவியல், கணக்குப்பதிவியல் & பொருளியல்)',
    '11 & 12-ஆம் வகுப்பு — குரூப் IV (தொழிற்கல்வி: தணிக்கையியல் & வேலைவாய்ப்புத் திறன்)',
  ],
  procedure: [
    {
      step: 1,
      title: 'Online Enquiry or Campus Visit',
      title_en: 'Online Enquiry or Campus Visit',
      title_ta: 'விண்ணப்பப் பதிவு அல்லது பள்ளி வருகை',
      description:
        'Submit the online admission form through this portal or obtain an application directly at the school office in Royappanpatti.',
      description_en:
        'Submit the online admission form through this portal or obtain an application directly at the school office in Royappanpatti.',
      description_ta:
        'வலைதளத்தில் உள்ள ஆன்லைன் படிவத்தை நிரப்பலாம் அல்லது ராயப்பன்பட்டி பள்ளி அலுவலகத்தில் விண்ணப்பத்தைப் பெற்றுக்கொள்ளலாம்.',
    },
    {
      step: 2,
      title: 'Document Submission & Verification',
      title_en: 'Document Submission & Verification',
      title_ta: 'சான்றிதழ்கள் சரிபார்ப்பு',
      description:
        'Present the student birth certificate, previous school Transfer Certificate (TC), Aadhaar card, and community certificate.',
      description_en:
        'Present the student birth certificate, previous school Transfer Certificate (TC), Aadhaar card, and community certificate.',
      description_ta:
        'மாணவரின் பிறப்புச் சான்றிதழ், முந்தைய பள்ளியின் மாற்றுச் சான்றிதழ் (TC), ஆதார் அட்டை மற்றும் சாதிச் சான்றிதழ் நகல்களை சமர்ப்பிக்கவும்.',
    },
    {
      step: 3,
      title: 'Stream & Medium Selection Counselling',
      title_en: 'Stream & Medium Selection Counselling',
      title_ta: 'வழிக் கல்வி மற்றும் பாடப்பிரிவு தேர்வு',
      description:
        'Choose Tamil or English medium (Classes 6-12) and select the Higher Secondary Group (Bio-Maths, CS, Pure Science, Commerce, or Auditing).',
      description_en:
        'Choose Tamil or English medium (Classes 6-12) and select the Higher Secondary Group (Bio-Maths, CS, Pure Science, Commerce, or Auditing).',
      description_ta:
        'தமிழ் அல்லது ஆங்கில வழி பயிற்றுமுறையைத் தேர்ந்தெடுத்து, 11-ஆம் வகுப்பு மாணவர்களுக்கான 4 குரூப்களில் விருப்பப் பிரிவைத் தேர்ந்தெடுக்க ஆசிரியர்கள் வழிகாட்டுகின்றனர்.',
    },
    {
      step: 4,
      title: 'Final Enrolment & Induction',
      title_en: 'Final Enrolment & Induction',
      title_ta: 'இறுதி சேர்க்கை மற்றும் வகுப்பில் இணைதல்',
      description:
        'Complete registration, receive student ID, uniform/books guidance, and join the orientation programme.',
      description_en:
        'Complete registration, receive student ID, uniform/books guidance, and join the orientation programme.',
      description_ta:
        'பதிவை நிறைவு செய்து, மாணவர் சேர்க்கை எண் மற்றும் சீருடை, புத்தகங்கள் பெற்று புதிய கல்வியாண்டை உற்சாகமாகத் தொடங்கவும்.',
    },
  ],
  requiredDocuments: [
    'Original Transfer Certificate (TC) from the recognized institution previously attended',
    'Student Birth Certificate (Government issued photocopy & original for verification)',
    'Community Certificate (Photocopy issued by Revenue Authority)',
    'Aadhaar Card copies of Student, Father, and Mother',
    'Recent passport-size colour photographs (4 copies)',
    'Previous Class Marksheet / EMIS Identification Number',
    'Ration Card / Family Proof photocopy for local residency records',
  ],
  requiredDocuments_en: [
    'Original Transfer Certificate (TC) from the recognized institution previously attended',
    'Student Birth Certificate (Government issued photocopy & original for verification)',
    'Community Certificate (Photocopy issued by Revenue Authority)',
    'Aadhaar Card copies of Student, Father, and Mother',
    'Recent passport-size colour photographs (4 copies)',
    'Previous Class Marksheet / EMIS Identification Number',
    'Ration Card / Family Proof photocopy for local residency records',
  ],
  requiredDocuments_ta: [
    'முந்தைய அங்கீகரிக்கப்பட்ட பள்ளியில் பெறப்பட்ட அசல் மாற்றுச் சான்றிதழ் (TC)',
    'அரசால் வழங்கப்பட்ட மாணவரின் பிறப்புச் சான்றிதழ் நகல் (சரிபார்ப்புக்கு அசல்)',
    'வருவாய்த் துறையால் வழங்கப்பட்ட சாதிச் சான்றிதழ் நகல்',
    'மாணவர், தந்தை மற்றும் தாயாரின் ஆதார் அட்டை நகல்கள்',
    'சமீபத்தில் எடுக்கப்பட்ட பாஸ்போர்ட் அளவு வண்ணப் புகைப்படங்கள் (4 பிரதிகள்)',
    'முந்தைய வகுப்பு மதிப்பெண் பட்டியல் / EMIS மாணவர் அடையாள எண்',
    'குடும்ப அட்டை / இருப்பிடச் சான்று நகல்',
  ],
  importantDates: [
    {
      title: 'Admissions Open',
      title_en: 'Admissions Open',
      title_ta: 'சேர்க்கை தொடக்கம்',
      date: 'April 2025 onwards',
      description: 'Registration opens for all grades from LKG to Class 12.',
      description_en: 'Registration opens for all grades from LKG to Class 12.',
      description_ta: 'LKG முதல் 12-ஆம் வகுப்பு வரை அனைத்துப் பிரிவுகளுக்கும் சேர்க்கை தொடங்குகிறது.',
    },
    {
      title: '11th Standard (+1) Group Allocation',
      title_en: '11th Standard (+1) Group Allocation',
      title_ta: '11-ஆம் வகுப்பு குரூப் ஒதுக்கீடு',
      date: 'Post-SSLC Results',
      description: 'Counseling and seat allotment for Bio-Maths, Computer Science, Pure Science, Commerce & Vocational streams.',
      description_en: 'Counseling and seat allotment for Bio-Maths, Computer Science, Pure Science, Commerce & Vocational streams.',
      description_ta: '10-ஆம் வகுப்பு பொதுத்தேர்வு முடிவுகள் வெளியானவுடன் அறிவியல், வணிகவியல் மற்றும் தொழிற்கல்வி பிரிவுகள் ஒதுக்கீடு.',
    },
    {
      title: 'Academic Year Commencement',
      title_en: 'Academic Year Commencement',
      title_ta: 'பள்ளி திறப்பு நாள்',
      date: 'First week of June 2025',
      description: 'Classes commence as per Tamil Nadu School Education Department calendar.',
      description_en: 'Classes commence as per Tamil Nadu School Education Department calendar.',
      description_ta: 'தமிழக பள்ளிக்கல்வித்துறை வழிகாட்டுதலின்படி பள்ளிகள் திறக்கப்பட்டு வகுப்புகள் தொடங்கும்.',
    },
  ],
  feeInformation:
    'S.U.M. Higher Secondary School is a prestigious Government-Aided Institution. Tuition is free of charge for aided sections under Tamil Nadu Government education policy. Nominal contributions apply only for special coaching, laboratory maintenance, and student welfare activities.',
  feeInformation_en:
    'S.U.M. Higher Secondary School is a prestigious Government-Aided Institution. Tuition is free of charge for aided sections under Tamil Nadu Government education policy. Nominal contributions apply only for special coaching, laboratory maintenance, and student welfare activities.',
  feeInformation_ta:
    'எஸ்.யு.எம். மேல்நிலைப்பள்ளி தமிழக அரசின் உதவிபெறும் முன்னணி கல்வி நிறுவனம் என்பதால் அரசு விதிகளின்படி கல்விக் கட்டணமின்றி இலவசக் கல்வி வழங்கப்படுகிறது. ஆய்வக பராமரிப்பு மற்றும் சிறப்புப் பயிற்சிகளுக்கான மிகக் குறைந்த அளவிலான சேவைக்கட்டணம் மட்டுமே பெறப்படும்.',
  schoolTimings: 'Monday – Friday: 9:00 AM – 4:30 PM | Saturday: 9:00 AM – 1:00 PM',
  schoolTimings_en: 'Monday – Friday: 9:00 AM – 4:30 PM | Saturday: 9:00 AM – 1:00 PM',
  schoolTimings_ta: 'திங்கள் – வெள்ளி: காலை 9:00 – மாலை 4:30 | சனிக்கிழமை: காலை 9:00 – பிற்பகல் 1:00',
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
export const verifiedAchievements: Achievement[] = [
  {
    id: 'ach-theni-hockey-2026',
    title: 'Theni Revenue District Hockey Tournament: Junior Team Champions (State Qualified), Senior & Super Senior Runners-Up',
    title_en: 'Theni Revenue District Hockey Tournament: Junior Team Champions (State Qualified), Senior & Super Senior Runners-Up',
    title_ta: 'தேனி வருவாய் மாவட்ட அளவிலான ஹாக்கி போட்டி: ஜூனியர் அணி முதலிடம் (மாநிலப் போட்டிக்கு தகுதி), சீனியர் & சூப்பர் சீனியர் அணிகள் இரண்டாமிடம்',
    description: 'S.U.M. Higher Secondary School Hockey Teams achieved historic glory at the Theni Revenue District Hockey Championship. The Junior Team emerged as Champions securing 1st Place and qualified for the Tamil Nadu State Level Tournament. Senior and Super Senior teams bagged 2nd Place.',
    description_en: 'S.U.M. Higher Secondary School Hockey Teams achieved historic glory at the Theni Revenue District Hockey Championship. The Junior Team emerged as Champions securing 1st Place and qualified for the Tamil Nadu State Level Tournament. Senior and Super Senior teams bagged 2nd Place.',
    description_ta: 'தேனி வருவாய் மாவட்ட அளவில் நடைபெற்ற ஹாக்கி போட்டியில் நம் எஸ்.யு.எம். பள்ளி ஜூனியர் பிரிவில் முதலிடம் பெற்று வரலாற்று சாதனையுடன் மாநில போட்டிக்கு தகுதி பெற்றுள்ளது. மேலும் சீனியர் மற்றும் சூப்பர் சீனியர் பிரிவுகளில் இரண்டாம் இடம் பிடித்து பள்ளிக்குப் பெருமை சேர்த்துள்ளனர்.',
    date: new Date('2026-10-15T14:00:00.000Z'),
    category: 'sports',
    studentName: 'S.U.M. School Hockey Teams (Junior, Senior, Super Senior)',
    studentName_ta: 'எஸ்.யு.எம். பள்ளி ஹாக்கி அணிகள் (ஜூனியர், சீனியர், சூப்பர் சீனியர்)',
    teamName: 'S.U.M. Hockey Squad',
    className: 'Sports Squad',
    academicYear: '2026–2027',
    examinationName: 'Theni Revenue District Annual Inter-School Hockey Championship',
    totalMarks: 0,
    totalMaxMarks: 0,
    percentage: 100,
    rank: 'Junior: 1st Place (State Qualified) | Senior & Super Senior: 2nd Place',
    hometown: 'Royappanpatti / Theni District',
    imageUrl: '/images/hockey-tournament-theni-2026.jpg',
    awardPhotoUrl: '/images/hockey-tournament-theni-2026.jpg',
    status: 'published',
    isFeatured: true,
  },
  {
    id: 'ach-kalai-thiruvizha-2026',
    title: 'Tamil Nadu State Level Kalai Thiruvizha 2026: 1st Prize in Mime, 3rd Prize in Rangoli & Puppetry',
    title_en: 'Tamil Nadu State Level Kalai Thiruvizha 2026: 1st Prize in Mime, 3rd Prize in Rangoli & Puppetry',
    title_ta: 'தமிழ்நாடு அரசுப் பள்ளிக்கல்வித்துறை மாநிலக் கலைத் திருவிழா 2026: பாவனை நடிப்பில் மாநில முதலிடம், ரங்கோலி & பொம்மலாட்டத்தில் மூன்றாமிடம்',
    description: 'S.U.M. Higher Secondary School students brought immense glory to the institution at the Tamil Nadu State Level Kalai Thiruvizha 2026! Our students won 1st Prize (State Champions) in Mime (ஊமை நாடகம் / பாவனை நடிப்பு), and 3rd Prize in Rangoli and Puppetry (பொம்மலாட்டம்) competitions.',
    description_en: 'S.U.M. Higher Secondary School students brought immense glory to the institution at the Tamil Nadu State Level Kalai Thiruvizha 2026! Our students won 1st Prize (State Champions) in Mime (ஊமை நாடகம் / பாவனை நடிப்பு), and 3rd Prize in Rangoli and Puppetry (பொம்மலாட்டம்) competitions.',
    description_ta: 'தமிழ்நாடு அரசு பள்ளிக்கல்வித்துறை நடத்திய மாநில அளவிலான கலைத் திருவிழா 2026 போட்டிகளில் நமது பள்ளி மாணவர்கள் கலந்து கொண்டு பாவனை நடிப்பில் (Mime) மாநில அளவில் முதலிடமும், ரங்கோலி மற்றும் பொம்மலாட்டம் (Puppetry) ஆகிய போட்டிகளில் மூன்றாம் இடமும் பெற்று நம் பள்ளிக்குப் பெருமை சேர்த்துள்ளனர்.',
    date: new Date('2026-01-20T10:00:00.000Z'),
    category: 'cultural',
    studentName: 'S.U.M. Cultural Troupe (Mime, Rangoli & Puppetry Teams)',
    studentName_ta: 'எஸ்.யு.எம். பள்ளி கலைக் குழுவினர் (பாவனை நடிப்பு, ரங்கோலி & பொம்மலாட்டம்)',
    teamName: 'S.U.M. Kalai Thiruvizha Team',
    className: 'High School & Higher Secondary (Classes 9 to 12)',
    academicYear: '2025–2026',
    examinationName: 'Tamil Nadu School Education Department State Level Kalai Thiruvizha',
    totalMarks: 0,
    totalMaxMarks: 0,
    percentage: 100,
    rank: 'State 1st Prize (Mime) | State 3rd Prize (Rangoli & Puppetry)',
    hometown: 'Royappanpatti / Theni District',
    imageUrl: '/images/kalai-thiruvizha-2026.jpg',
    awardPhotoUrl: '/images/kalai-thiruvizha-2026.jpg',
    status: 'published',
    isFeatured: true,
  },
];
export const verifiedAnnouncements: Announcement[] = [
  {
    id: 'ann-kalai-thiruvizha-2026',
    title: 'State Level Kalai Thiruvizha 2026: 1st Prize in Mime, 3rd in Rangoli & Puppetry',
    title_en: 'State Level Kalai Thiruvizha 2026: 1st Prize in Mime, 3rd in Rangoli & Puppetry',
    title_ta: 'மாநிலக் கலைத் திருவிழா 2026: பாவனை நடிப்பில் முதலிடம், ரங்கோலி & பொம்மலாட்டத்தில் மூன்றாமிடம் வென்று எஸ்.யு.எம். பள்ளி சாதனை!',
    description: 'S.U.M. Higher Secondary School students won State Level 1st Prize in Mime (பாவனை நடிப்பு) and 3rd Prize in Rangoli and Puppetry at Tamil Nadu Government Kalai Thiruvizha 2026.',
    description_en: 'S.U.M. Higher Secondary School students won State Level 1st Prize in Mime (பாவனை நடிப்பு) and 3rd Prize in Rangoli and Puppetry at Tamil Nadu Government Kalai Thiruvizha 2026.',
    description_ta: 'தமிழ்நாடு அரசு பள்ளிக்கல்வித்துறை நடத்திய மாநில அளவிலான கலைத் திருவிழா 2026 போட்டிகளில் நமது பள்ளி மாணவர்கள் பாவனை நடிப்பில் முதலிடமும், ரங்கோலி மற்றும் பொம்மலாட்டத்தில் மூன்றாம் இடமும் பெற்று பெருமை சேர்த்துள்ளனர்.',
    content: `தமிழ்நாடு அரசு பள்ளிக்கல்வித்துறை மாநிலக் கலைத் திருவிழா 2026 — எஸ்.யு.எம். பள்ளி மாணவர்களின் சாதனை!

மாநில அளவில் நடைபெற்ற தமிழ்நாடு அரசு பள்ளிக்கல்வித்துறையின் கலைத் திருவிழா 2026 போட்டிகளில், ராயப்பன்பட்டி சவரியப்ப உடையார் நினைவு மேல்நிலைப்பள்ளி (S.U.M.) மாணவ-மாணவியர் கலந்து கொண்டு வரலாற்று வெற்றிகளைப் பெற்றுள்ளனர்:

🏆 பாவனை நடிப்பு / ஊமை நாடகம் (Mime Competition):
மாநில அளவில் முதலிடம் (First Prize) வென்று தங்கக் கோப்பையையும், பாராட்டுச் சான்றிதழ்களையும் பெற்று பள்ளிக்கு பெரும் புகழைத் தேடித் தந்துள்ளனர்!

🥉 ரங்கோலி போட்டி (Rangoli Competition):
மாநில அளவில் மூன்றாம் இடம் (Third Prize) பெற்று சாதனை.

🥉 பொம்மலாட்டம் போட்டி (Puppetry Competition):
மாநில அளவில் மூன்றாம் இடம் (Third Prize) பெற்று சாதனை.

மாநில அளவில் சிறப்பிடம் பெற்று பள்ளிக்குப் பெருமை சேர்த்த மாணவ-மாணவியருக்கும், அவர்களுக்குத் திறம்படப் பயிற்சி அளித்த கலை ஆசிரியர்களுக்கும் பள்ளி நிர்வாகம், செயலர் & தாளாளர், தலைமையாசிரியர்கள் மற்றும் ஆசிரியர்கள் மனமார்ந்த வாழ்த்துகளையும் பாராட்டுகளையும் தெரிவித்துக் கொள்கிறார்கள்.`,
    content_en: `Tamil Nadu School Education Department State Level Kalai Thiruvizha 2026 — S.U.M. Students Achieve Historic Laurels!

At the prestigious Tamil Nadu State Level Kalai Thiruvizha 2026 organized by the Department of School Education, the talented students of Savariyappa Udaiyar Memorial Higher Secondary School delivered stellar performances winning top state honors:

🏆 Mime Competition (பாவனை நடிப்பு / ஊமை நாடகம்):
Secured State Level First Prize (Champions) with championship trophy and commendation certificates!

🥉 Rangoli Competition (ரங்கோலி):
Secured State Level Third Prize.

🥉 Puppetry Competition (பொம்மலாட்டம்):
Secured State Level Third Prize.

The School Management, Secretary & Correspondent, Headmasters, Faculty, and Students warmly congratulate our award-winning students and their guiding art mentors for bringing remarkable glory to our institution!`,
    date: new Date('2026-01-20T10:00:00.000Z'),
    category: 'general',
    imageUrl: '/images/kalai-thiruvizha-2026.jpg',
    attachmentUrl: '',
    attachmentName: '',
    status: 'published',
    featured: true,
    priority: 'high',
  },
  {
    id: 'ann-theni-hockey-2026',
    title: 'Historic Triumph: S.U.M. School Hockey Team Wins 1st Place in Theni District (State Qualified)',
    title_en: 'Historic Triumph: S.U.M. School Hockey Team Wins 1st Place in Theni District (State Qualified)',
    title_ta: 'வரலாற்று வெற்றி: தேனி வருவாய் மாவட்ட ஹாக்கி போட்டியில் எஸ்.யு.எம். பள்ளி ஜூனியர் அணி முதலிடம் (மாநிலப் போட்டிக்கு தகுதி!)',
    description: 'S.U.M. Higher Secondary School Hockey Junior Team won 1st Place in the Theni Revenue District Hockey Tournament and qualified for the State Tournament. Senior & Super Senior teams won 2nd Place.',
    description_en: 'S.U.M. Higher Secondary School Hockey Junior Team won 1st Place in the Theni Revenue District Hockey Tournament and qualified for the State Tournament. Senior & Super Senior teams won 2nd Place.',
    description_ta: 'தேனி வருவாய் மாவட்ட அளவில் நடைபெற்ற ஹாக்கி போட்டியில் நம் பள்ளி ஜூனியர் அணி முதலிடம் பெற்று மாநிலப் போட்டிக்குத் தகுதி பெற்றுள்ளது! சீனியர் மற்றும் சூப்பர் சீனியர் அணிகள் 2-ஆம் இடம் பெற்று பெருமை சேர்த்துள்ளனர்.',
    content: `தேனி வருவாய் மாவட்ட ஹாக்கி போட்டி — எஸ்.யு.எம். பள்ளிக்கு மாபெரும் வெற்றி!

தேனி வருவாய் மாவட்ட அளவில் நடைபெற்ற பள்ளி மாணவர்களுக்கான ஹாக்கி போட்டியில், ராயப்பன்பட்டி சவரியப்ப உடையார் நினைவு மேல்நிலைப்பள்ளி (S.U.M.) மாணவர்கள் அபார திறமையை வெளிப்படுத்தி மாபெரும் வெற்றி வாகை சூடியுள்ளனர்:

🏆 ஜூனியர் பிரிவு:
முதலிடம் (1st Place - Winners) பெற்று தங்கக் கோப்பையை வென்று, தமிழ்நாடு மாநில அளவிலான போட்டிக்கு தகுதி பெற்றுள்ளனர்!

🥈 சீனியர் பிரிவு:
இரண்டாம் இடம் (2nd Place - Runners-up) பிடித்து சாதனை படைத்துள்ளனர்.

🥈 சூப்பர் சீனியர் பிரிவு:
இரண்டாம் இடம் (2nd Place - Runners-up) பிடித்து சாதனை படைத்துள்ளனர்.

பள்ளிக்கு பெருமை சேர்த்த மாணவர்களுக்கும், அவர்களை சிறப்புடன் வழிநடத்திய உடற்கல்வி இயக்குநர்கள் மற்றும் ஆசிரியப் பெருமக்களுக்கும் பள்ளி நிர்வாகம், தாளாளர், தலைமையாசிரியர்கள் மற்றும் ஆசிரியர்கள் மனமார்ந்த வாழ்த்துகளையும் பாராட்டுகளையும் தெரிவித்துக் கொள்கிறார்கள்.`,
    content_en: `Theni Revenue District Hockey Tournament — Historic Victory for S.U.M. Higher Secondary School!

At the Theni Revenue District Annual Inter-School Hockey Tournament, the talented hockey squads of Savariyappa Udaiyar Memorial Higher Secondary School delivered stellar performances across all age divisions:

🏆 Junior Division:
Secured 1st Place (District Champions) and officially qualified to represent Theni District at the Tamil Nadu State Level Tournament!

🥈 Senior Division:
Secured 2nd Place (Runners-Up) with commendable performance.

🥈 Super Senior Division:
Secured 2nd Place (Runners-Up) with high sporting spirit.

The School Management, Correspondent, Headmaster, Faculty, and Students warmly congratulate our victorious players and Physical Education Directors for bringing immense honor and pride to our institution!`,
    date: new Date('2026-10-15T14:00:00.000Z'),
    category: 'general',
    imageUrl: '/images/hockey-tournament-theni-2026.jpg',
    attachmentUrl: '',
    attachmentName: '',
    status: 'published',
    featured: true,
    priority: 'high',
  },
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
export const verifiedGalleryImages: GalleryImage[] = [
  {
    id: 'gal-hockey-2026',
    title: 'Theni Revenue District Hockey Tournament Winners & Runners-Up',
    title_en: 'Theni Revenue District Hockey Tournament Winners & Runners-Up',
    title_ta: 'தேனி வருவாய் மாவட்ட ஹாக்கி போட்டியில் வெற்றி பெற்ற பள்ளி மாணவ வீரர்கள்',
    imageUrl: '/images/hockey-tournament-theni-2026.jpg',
    thumbnailUrl: '/images/hockey-tournament-theni-2026.jpg',
    albumId: 'sports-meet-2026',
    albumName: 'Sports & Athletics',
    description: 'Junior team 1st place winners & state level qualifiers with senior and super senior runners-up.',
    description_en: 'Junior team 1st place winners & state level qualifiers with senior and super senior runners-up.',
    description_ta: 'ஜூனியர் பிரிவு முதலிடம் மற்றும் மாநில போட்டி தகுதி பெற்ற மாணவர்கள், சீனியர் மற்றும் சூப்பர் சீனியர் இரண்டாமிடம் பெற்ற வீரர்கள்.',
    eventCategory: 'sports',
    academicYear: '2026–2027',
    calendarYear: 2026,
    month: 'October',
    status: 'published',
    order: 1,
    isFeatured: true,
  },
  {
    id: 'gal-chemistry-lab-2026',
    title: 'Chemistry Laboratory & Periodic Table Practical Session',
    title_en: 'Chemistry Laboratory & Periodic Table Practical Session',
    title_ta: 'வேதியியல் ஆய்வகத்தில் தனிம வரிசை அட்டவணை செய்முறைப் பயிற்சி',
    imageUrl: '/images/facility-science-lab.jpg',
    thumbnailUrl: '/images/facility-science-lab.jpg',
    albumId: 'campus-facilities-2026',
    albumName: 'Campus & Laboratories',
    description: 'Science students actively experimenting with reagent solutions and laboratory equipment under teacher supervision in front of the giant Periodic Table of Elements.',
    description_en: 'Science students actively experimenting with reagent solutions and laboratory equipment under teacher supervision in front of the giant Periodic Table of Elements.',
    description_ta: 'பிரமாண்ட தனிம வரிசை அட்டவணையின் கீழ் வேதியியல் ஆய்வகத்தில் ஆசிரியர் வழிகாட்டலில் செய்முறை சோதனைகளை மேற்கொள்ளும் மேல்நிலை மாணவர்கள்.',
    eventCategory: 'academics',
    academicYear: '2026–2027',
    calendarYear: 2026,
    month: 'November',
    status: 'published',
    order: 2,
    isFeatured: true,
  },
  {
    id: 'gal-kalai-thiruvizha-2026',
    title: 'Tamil Nadu State Level Kalai Thiruvizha 2026 Laureates',
    title_en: 'Tamil Nadu State Level Kalai Thiruvizha 2026 Laureates',
    title_ta: 'மாநிலக் கலைத் திருவிழா 2026: முதலிடம் மற்றும் மூன்றாமிடம் பெற்ற மாணவர்கள்',
    imageUrl: '/images/kalai-thiruvizha-2026.jpg',
    thumbnailUrl: '/images/kalai-thiruvizha-2026.jpg',
    albumId: 'cultural-kalai-thiruvizha-2026',
    albumName: 'Cultural & Kalai Thiruvizha',
    description: 'S.U.M. Higher Secondary School students proudly holding their State Level 1st Prize trophy in Mime alongside 3rd Prize winners in Rangoli and Puppetry on the grand stage.',
    description_en: 'S.U.M. Higher Secondary School students proudly holding their State Level 1st Prize trophy in Mime alongside 3rd Prize winners in Rangoli and Puppetry on the grand stage.',
    description_ta: 'தமிழ்நாடு அரசு மாநிலக் கலைத் திருவிழா மேடையில் பாவனை நடிப்பில் முதலிடக் கோப்பை மற்றும் ரங்கோலி, பொம்மலாட்டத்தில் மூன்றாமிடம் பெற்ற பள்ளி மாணவ-மாணவியர்.',
    eventCategory: 'cultural',
    academicYear: '2025–2026',
    calendarYear: 2026,
    month: 'January',
    status: 'published',
    order: 3,
    isFeatured: true,
  },
];
export const verifiedFacilities: Facility[] = [
  {
    id: 'fac-computer-lab',
    title: 'Modern Computer Science & ICT Laboratory',
    title_en: 'Modern Computer Science & ICT Laboratory',
    title_ta: 'நவீன கணினி அறிவியல் & தகவல் தொழில்நுட்ப ஆய்வகம்',
    description: 'High-speed networked computer systems with broadband internet, interactive smart projector display, programming environments (Python, C++, Scratch), and dedicated faculty guidance.',
    description_en: 'High-speed networked computer systems with broadband internet, interactive smart projector display, programming environments (Python, C++, Scratch), and dedicated faculty guidance.',
    description_ta: 'அதிவேக இணைய வசதியுடன் கூடிய கணினி அமைப்புகள், பெரிய ஸ்மார்ட் ப்ரொஜெக்டர் திரை, நிரலாக்கப் பயிற்சிகள் மற்றும் ஆசிரியர்களின் நேரடி வழிகாட்டலுடன் இயங்கும் நவீன கணினி ஆய்வகம்.',
    imageUrl: '/images/facility-computer-lab.jpg',
    icon: 'Laptop',
    status: 'published',
    order: 1,
  },
  {
    id: 'fac-science-lab',
    title: 'Advanced Science & Chemistry Practical Laboratory',
    title_en: 'Advanced Science & Chemistry Practical Laboratory',
    title_ta: 'நவீன அறிவியல் & வேதியியல் செய்முறை ஆய்வகம்',
    description: 'Fully equipped laboratory with wall-mounted Periodic Table of Elements, chemical reagents, glass apparatus workstations, microscopes, and teacher-guided hands-on experiments for High School and Higher Secondary students.',
    description_en: 'Fully equipped laboratory with wall-mounted Periodic Table of Elements, chemical reagents, glass apparatus workstations, microscopes, and teacher-guided hands-on experiments for High School and Higher Secondary students.',
    description_ta: 'சுவரில் பொருத்தப்பட்ட முழுமையான தனிம வரிசை அட்டவணை (Periodic Table), வேதியியல் திரவங்கள், கண்ணாடி உபகரணங்கள், நுண்ணோக்கிகள் மற்றும் ஆசிரியர் நேரடி மேற்பார்வையில் மாணவர்கள் செய்முறைப் பயிற்சி மேற்கொள்ளும் நவீன அறிவியல் ஆய்வகம்.',
    imageUrl: '/images/facility-science-lab.jpg',
    icon: 'FlaskConical',
    status: 'published',
    order: 2,
  },
  {
    id: 'fac-smart-class',
    title: 'Interactive Multimedia Smart Classrooms',
    title_en: 'Interactive Multimedia Smart Classrooms',
    title_ta: 'டிஜிட்டல் ஸ்மார்ட் வகுப்பறைகள்',
    description: 'High-definition digital projection displays, audiovisual teaching aids, and animated syllabus modules fostering intuitive conceptual mastery.',
    description_en: 'High-definition digital projection displays, audiovisual teaching aids, and animated syllabus modules fostering intuitive conceptual mastery.',
    description_ta: 'ஒலி-ஒளிக் கருவிகள், ஸ்மார்ட் திரைகள் மற்றும் நவீன அனிமேஷன் கல்வி முறையில் பாடங்களைக் கற்பிக்கும் வசதி.',
    imageUrl: '/images/facility-smart-class.jpg',
    icon: 'MonitorPlay',
    status: 'published',
    order: 3,
  },
  {
    id: 'fac-atl-robotics',
    title: 'Atal Tinkering Lab (ATL) & Robotics Center',
    title_en: 'Atal Tinkering Lab (ATL) & Robotics Center',
    title_ta: 'அடல் டிங்கரிங் ஆய்வகம் (ATL) & ரோபாட்டிக்ஸ் மையம்',
    description: 'NITI Aayog recognized innovation hub with Arduino microcontrollers, sensors, 3D modelling tools, and hands-on STEM project stations.',
    description_en: 'NITI Aayog recognized innovation hub with Arduino microcontrollers, sensors, 3D modelling tools, and hands-on STEM project stations.',
    description_ta: 'ரோபாட்டிக்ஸ், சென்சார்கள், எலக்ட்ரானிக்ஸ் மற்றும் அறிவியல் கண்டுபிடிப்புகளுக்கான நிதி ஆயோக் அங்கீகாரம் பெற்ற அடல் டிங்கரிங் மையம்.',
    imageUrl: '/images/atl/atl-workshop-learning-6.jpeg',
    icon: 'Cpu',
    status: 'published',
    order: 4,
  },
  {
    id: 'fac-library',
    title: 'Central Reference Library & Reading Room',
    title_en: 'Central Reference Library & Reading Room',
    title_ta: 'மைய நூலகம் மற்றும் வாசிப்பகம்',
    description: 'Over 5,000 academic books, encyclopedias, Tamil classical literature, competitive exam primers, and educational periodicals.',
    description_en: 'Over 5,000 academic books, encyclopedias, Tamil classical literature, competitive exam primers, and educational periodicals.',
    description_ta: 'ஆயிரக்கணக்கான பாடப் புத்தகங்கள், தமிழ் இலக்கிய நூல்கள், போட்டித் தேர்வு வழிகாட்டிகள் மற்றும் நாளிதழ்கள் கொண்ட அமைதியான நூலகம்.',
    imageUrl: '/images/students-collab.jpg',
    icon: 'BookOpen',
    status: 'published',
    order: 5,
  },
  {
    id: 'fac-sports',
    title: 'Spacious Athletic Grounds & Sports Amenities',
    title_en: 'Spacious Athletic Grounds & Sports Amenities',
    title_ta: 'பிரம்மாண்ட விளையாட்டு மைதானம் & தடகளப் பகுதி',
    description: 'Dedicated courts for Volleyball, Kabaddi, Kho-Kho, traditional Silambam, and track events preparing students for district and state tournaments.',
    description_en: 'Dedicated courts for Volleyball, Kabaddi, Kho-Kho, traditional Silambam, and track events preparing students for district and state tournaments.',
    description_ta: 'கைப்பந்து, கபடி, கோ-கோ, சிலம்பம் பயிற்சி மற்றும் தடகளப் போட்டிகளுக்கான பள்ளி விளையாட்டு மைதானம்.',
    imageUrl: '/images/og-image.jpg',
    icon: 'Trophy',
    status: 'published',
    order: 6,
  },
];
export const verifiedHeroBanners: HeroBanner[] = [];
export const defaultFaculty: Faculty[] = [];
export const defaultFacilities: Facility[] = verifiedFacilities;
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
export const defaultAchievements: Achievement[] = verifiedAchievements;
export const defaultGalleryImages: GalleryImage[] = verifiedGalleryImages;
export const defaultTimelineEntries: TimelineEntry[] = [];
export const defaultAnnouncements: Announcement[] = verifiedAnnouncements;
export const defaultTestimonials: Testimonial[] = [];
export const defaultHeroBanners: HeroBanner[] = [];
export const defaultResearchRecords: ResearchRecord[] = [];
export const defaultTransportRoutes: TransportRoute[] = [];
