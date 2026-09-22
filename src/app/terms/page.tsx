'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative py-16 lg:py-24 bg-slate-900 text-white">
          <div className="container-main text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
              {t('terms.title', 'Terms & Conditions')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              {t('terms.subtitle', 'Official Website Usage Guidelines')}
            </p>
          </div>
        </section>

        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main max-w-4xl space-y-8 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
              {t('terms.intro', 'By accessing and using the official web portal of Savariyappa Udaiyar Memorial Higher Secondary & Primary School, you agree to comply with institutional policies and guidelines.')}
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '1. விதிகளின் ஏற்பு' : '1. Acceptance of Terms'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'இந்த இணையதளத்தை அணுகிப் பயன்படுத்துவதன் மூலம், இங்கு குறிப்பிடப்பட்டுள்ள விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு இணங்க ஒப்புக்கொள்கிறீர்கள். இந்த விதிகளுக்கு உடன்படவில்லை என்றால், தயவுசெய்து இந்த தளத்தைப் பயன்படுத்த வேண்டாம்.'
                  : 'By accessing and using this website, you agree to comply with and be bound by the terms and conditions outlined herein. If you do not agree to these terms, please do not use this portal.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '2. அறிவுசார் சொத்துரிமை & பதிப்புரிமை' : '2. Intellectual Property & Copyright'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'இந்த இணையதளத்தில் உள்ள அனைத்து உள்ளடக்கங்களும் (உரைகள், பள்ளி இலச்சினை, புகைப்படங்கள், சுற்றறிக்கைகள், பாடத்திட்ட விபரங்கள்) எஸ்.யு.எம். மேல்நிலை & தொடக்கப்பள்ளியின் பிரத்யேக சொத்தாகும் மற்றும் சட்டப்பூர்வ பதிப்புரிமை விதிகளின் கீழ் பாதுகாக்கப்படுகின்றன.'
                  : 'All content on this website, including texts, school crests, logos, photographs, circulars, curriculum details, and graphics, is the property of S.U.M. Higher Secondary & Primary School and is protected under applicable copyright regulations.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '3. பள்ளித் தகவல்களின் துல்லியம்' : '3. Accuracy of School Information'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'அனைத்து கல்வி நாட்கள், தேர்வு அட்டவணைகள், கட்டண வழிகாட்டுதல்கள் மற்றும் சுற்றறிக்கைகள் துல்லியமாக இருப்பதை நிர்வாகம் உறுதி செய்தாலும், பள்ளி அலுவலகத்தால் நேரடியாக வழங்கப்படும் அச்சிடப்பட்ட சுற்றறிக்கைகளே இறுதியானது.'
                  : 'While the administration endeavors to ensure that all academic dates, examination timetables, fee guidelines, and notices are current and accurate, final official confirmations are subject to physical circulars issued directly by the school office.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '4. சேர்க்கை விசாரணைகள்' : '4. Admission Enquiries'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'சேர்க்கை விசாரணைப் படிவத்தை சமர்ப்பிப்பது முறையான சேர்க்கையை உறுதிப்படுத்தாது. ஆவணச் சரிபார்ப்பு, பள்ளித் தேர்வு மற்றும் சட்டப்பூர்வ கட்டண முறைகளுக்கு உட்பட்டே சேர்க்கை இறுதி செய்யப்படும்.'
                  : 'Submission of an admission enquiry form does not guarantee formal enrollment. All admissions are finalized only upon document verification, assessment, and settlement of statutory fee requirements.'}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
