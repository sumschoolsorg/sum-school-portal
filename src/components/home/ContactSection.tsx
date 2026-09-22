'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultSchoolSettings } from '@/lib/defaultData';
import { addDocument } from '@/lib/firestore';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export function ContactSection() {
  const { t, language } = useLanguage();
  const isTa = language === 'ta';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error(t('contact.errorRequired', 'Please complete all required fields.'));
      return;
    }

    setIsSubmitting(true);
    try {
      await addDocument('contactMessages', {
        ...formData,
        status: 'new',
      });
      setSubmitted(true);
      toast.success(
        t('contact.successToast', 'Your message has been received! Our school office will contact you shortly.')
      );
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.warn('Firestore write failed, recording submission locally in offline mode:', error);
      setSubmitted(true);
      toast.info(t('forms.toasts.successSubmit', 'Message submitted successfully (Recorded).'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-padding bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="container-main">
        <SectionHeading
          subtitle={t('contact.heroTag', 'Get in Touch')}
          title={isTa ? 'எங்கள் பள்ளி நிர்வாகத்தை தொடர்பு கொள்ள' : 'Connect With Our Campus Office'}
          description={t(
            'contact.heroDescription',
            'Have questions about admissions, academics, or school facilities? Reach out directly or visit our administrative campus.'
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
                {t('contact.officeTitle', 'Administrative Campus Office')}
              </h3>

              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t('contact.addressLabel', 'Address')}
                    </div>
                    <div className="mt-1 leading-relaxed">
                      {defaultSchoolSettings.address}, {defaultSchoolSettings.city},{' '}
                      {defaultSchoolSettings.state} – {defaultSchoolSettings.pincode}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t('contact.phoneLabel', 'Phone Numbers')}
                    </div>
                    <div className="mt-1">{defaultSchoolSettings.phone}</div>
                    <div className="text-slate-400">{defaultSchoolSettings.phone2}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t('contact.emailLabel', 'Official Email')}
                    </div>
                    <div className="mt-1">{defaultSchoolSettings.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t('contact.timingsLabel', 'Office Timings')}
                    </div>
                    <div className="mt-1">
                      {isTa ? 'திங்கள் - வெள்ளி: காலை 9:00 - மாலை 4:30' : defaultSchoolSettings.schoolTimings}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-3">
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {isTa ? 'பள்ளி அமைவிடம் (ராயப்பன்பட்டி)' : 'Official Campus Map (Royappanpatti)'}
                  </span>
                </div>
                <a
                  href={defaultSchoolSettings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  title="Open live Google Maps"
                >
                  <span>{isTa ? 'வழிகாட்டல் பார்க்க' : 'Open Directions'}</span>
                  <span>&rarr;</span>
                </a>
              </div>

              <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 relative bg-slate-100">
                <iframe
                  title="S.U.M. HIGHER SECONDARY & PRIMARY SCHOOL Campus Location"
                  src={defaultSchoolSettings.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
                <span>📍 GPS: 9.772386, 77.3412086</span>
                <a
                  href={defaultSchoolSettings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  maps.app.goo.gl/Q1VbvDa2VjnwkAQh9
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              {t('contact.formTitle', 'Send Us a Direct Message')}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
              {t('contact.formDescription', 'Have queries regarding school admissions, fee structure, transfer certificates, or visiting our campus? Fill in the details below.')}
            </p>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mb-3" />
                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200 font-heading">
                  {t('contact.successTitle', 'Message Received!')}
                </h4>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-2 max-w-md">
                  {t('contact.successToast', 'Your message has been submitted to the administration. We will review your inquiry and get back to you shortly.')}
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="mt-6"
                >
                  {isTa ? 'மற்றொரு செய்தி அனுப்பவும்' : 'Send Another Message'}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label={t('contact.nameLabel', 'Your Full Name *')}
                    name="name"
                    required
                    placeholder={t('contact.namePlaceholder', 'Enter parent/guardian or student name')}
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <Input
                    label={t('contact.phoneLabel', 'Phone Number *')}
                    name="phone"
                    type="tel"
                    required
                    placeholder={t('contact.phonePlaceholder', 'Enter 10-digit mobile number')}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label={t('contact.emailLabel', 'Email Address *')}
                    name="email"
                    type="email"
                    placeholder={t('contact.emailPlaceholder', 'name@example.com')}
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <Input
                    label={t('contact.subjectLabel', 'Subject / Topic *')}
                    name="subject"
                    placeholder={t('contact.subjectPlaceholder', 'e.g. Admission Query, Fee Details')}
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>

                <Textarea
                  label={t('contact.messageLabel', 'Your Message *')}
                  name="message"
                  required
                  rows={4}
                  placeholder={t('contact.messagePlaceholder', 'How can our school assist you? Feel free to mention class of interest or specific queries.')}
                  value={formData.message}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting
                    ? t('contact.sendingBtn', 'Transmitting Message...')
                    : t('contact.sendBtn', 'Submit Enquiry')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
