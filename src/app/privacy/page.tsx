'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicyPage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main id="main-content" className="flex-1">
        <section className="relative py-16 lg:py-24 bg-slate-900 text-white">
          <div className="container-main text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading">
              {t('privacy.title', 'Privacy Policy')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2">
              {language === 'ta'
                ? 'கடைசியாக புதுப்பிக்கப்பட்டது: கல்வியாண்டு 2025–2026'
                : 'Last updated: Academic Year 2025–2026'}
            </p>
          </div>
        </section>

        <section className="section-padding bg-white dark:bg-slate-950">
          <div className="container-main max-w-4xl space-y-8 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-200">
              {t('privacy.intro', 'S.U.M. Higher Secondary & Primary School, Royappanpatti respects the privacy of students, parents, alumni, and website visitors. This Privacy Policy explains how information gathered through our official digital portal is collected, stored, and protected.')}
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '1. நாங்கள் சேகரிக்கும் தகவல்கள்' : '1. Information We Collect'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'இணையதளம் வழியாக மாணவர் சேர்க்கை விசாரணை அல்லது தொடர்பு படிவத்தை நீங்கள் சமர்ப்பிக்கும் போது, பெற்றோர்/பாதுகாவலர் பெயர், மாணவர் பெயர், தொடர்பு தொலைபேசி எண், மின்னஞ்சல் முகவரி மற்றும் குறிப்பிட்ட கல்வி விபரங்களை நாங்கள் சேகரிக்கிறோம்.'
                  : 'When you submit an admission enquiry or contact form through this website, we collect personal information such as parent/guardian name, student name, contact phone numbers, email addresses, and specific academic inquiries.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '2. தகவல்களை எவ்வாறு பயன்படுத்துகிறோம்' : '2. How We Use Your Information'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'சேகரிக்கப்பட்ட தகவல்கள் ராயப்பன்பட்டி சவரியப்ப உடையார் நினைவு மேல்நிலை & தொடக்கப்பள்ளியின் நிர்வாக அலுவலகத்தால் மட்டுமே பயன்படுத்தப்படும்:'
                  : 'The collected information is used solely by the official administrative office of S.U.M. Higher Secondary & Primary School for:'}
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  {language === 'ta'
                    ? 'மாணவர் சேர்க்கை விசாரணைகளைச் செயல்படுத்திப் பதிலளித்தல்.'
                    : 'Processing and responding to student admission inquiries.'}
                </li>
                <li>
                  {language === 'ta'
                    ? 'கல்வி அட்டவணைகள், சுற்றறிக்கைகள் மற்றும் பள்ளி அறிவிப்புகளைத் தெரிவித்தல்.'
                    : 'Communicating academic schedules, circulars, and school notices.'}
                </li>
                <li>
                  {language === 'ta'
                    ? 'திட்டமிடப்பட்ட வளாகப் பார்வைகள் மற்றும் பெற்றோர்-ஆலோசகர் சந்திப்புகளை ஒருங்கிணைத்தல்.'
                    : 'Facilitating scheduled campus visits and parent-counselor meetings.'}
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '3. தரவுப் பாதுகாப்பு & ரகசியத்தன்மை' : '3. Data Protection & Confidentiality'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'நாங்கள் மாணவர் அல்லது பெற்றோர் தகவல்களை மூன்றாம் தரப்பு வணிக நிறுவனங்களுக்கு விற்கவோ, வாடகைக்கு விடவோ மாட்டோம். படிவத் தரவுகளுக்கான அணுகல் அங்கீகரிக்கப்பட்ட பள்ளி நிர்வாகப் பணியாளர்களுக்கு மட்டுமே கட்டுப்படுத்தப்பட்டுள்ளது.'
                  : 'We do not sell, rent, or lease student or parent information to third-party commercial organizations. Access to stored form submissions is restricted to authorized school administrative personnel.'}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3">
                {language === 'ta' ? '4. பள்ளி நிர்வாகத்தைத் தொடர்பு கொள்ள' : '4. Contacting the Administration'}
              </h2>
              <p>
                {language === 'ta'
                  ? 'எங்கள் தனியுரிமைக் கொள்கை குறித்த கேள்விகள் இருந்தால் அல்லது முன்னர் சமர்ப்பித்த தகவல்களைப் புதுப்பிக்க விரும்பினால், தயவுசெய்து எங்களின் அதிகாரப்பூர்வ மின்னஞ்சல் அல்லது தொலைபேசி மூலமாக பள்ளி அலுவலகத்தைத் தொடர்பு கொள்ளவும்.'
                  : 'If you have questions regarding our privacy practices or wish to update information previously submitted, please contact the school office directly via our official email or telephone lines.'}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
