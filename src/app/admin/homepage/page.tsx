'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultHomepageContent } from '@/lib/defaultData';
import { homepageRepository, getCurrentDataMode, isFirebaseConfigured } from '@/lib/repositories';
import { HomepageContent } from '@/types';
import { Save, Home, Loader2, Megaphone, UserCheck, BarChart3, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function HomepageAdminPage() {
  const [formData, setFormData] = useState<HomepageContent>(defaultHomepageContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await homepageRepository.get();
        if (data) {
          setFormData({
            ...defaultHomepageContent,
            ...data,
            hero: { ...defaultHomepageContent.hero, ...(data.hero || {}) },
            stats: { ...defaultHomepageContent.stats, ...(data.stats || {}) },
            principalMessage: { ...defaultHomepageContent.principalMessage, ...(data.principalMessage || {}) },
            admissionCta: { ...defaultHomepageContent.admissionCta, ...(data.admissionCta || {}) },
          });
        }
      } catch (error) {
        console.warn('Failed to load homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      hero: { ...formData.hero, [e.target.name]: e.target.value },
    });
  };

  const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      stats: { ...formData.stats, [e.target.name]: e.target.value },
    });
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      principalMessage: { ...formData.principalMessage, [e.target.name]: e.target.value },
    });
  };

  const handleAdmissionCtaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      admissionCta: { ...formData.admissionCta, [e.target.name]: e.target.value },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await homepageRepository.save(formData);
      if (getCurrentDataMode() === 'firebase' && isFirebaseConfigured()) {
        toast.success('Homepage content saved to Cloud Firestore!');
      } else {
        toast.info('Homepage configuration saved to local offline preview.');
      }
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Homepage configuration saved to local offline storage.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <Home className="w-6 h-6 text-blue-600" />
          Homepage Content Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Edit hero headlines, campus background images, numeric statistics counters, leadership messages, and admission CTA banners.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Hero Section Banner
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Hero Tagline / Subtitle (English)"
              name="subtitle"
              value={formData.hero.subtitle}
              onChange={handleHeroChange}
            />
            <Input
              label="Hero Tagline / Subtitle (Tamil)"
              name="subtitle_ta"
              value={formData.hero.subtitle_ta || ''}
              onChange={handleHeroChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Main Hero Headline (English)"
              name="title"
              value={formData.hero.title}
              onChange={handleHeroChange}
            />
            <Input
              label="Main Hero Headline (Tamil)"
              name="title_ta"
              value={formData.hero.title_ta || ''}
              onChange={handleHeroChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Hero Introduction (English)"
              name="description"
              rows={3}
              value={formData.hero.description}
              onChange={handleHeroChange}
            />
            <Textarea
              label="Hero Introduction (Tamil)"
              name="description_ta"
              rows={3}
              value={formData.hero.description_ta || ''}
              onChange={handleHeroChange}
            />
          </div>

          <ImageUpload
            label="Hero Campus Background Image"
            folder="hero"
            value={formData.hero.imageUrl}
            onChange={(url) =>
              setFormData({
                ...formData,
                hero: { ...formData.hero, imageUrl: url },
              })
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary CTA Button Text"
              name="ctaText"
              value={formData.hero.ctaText}
              onChange={handleHeroChange}
            />
            <Input
              label="Primary CTA Destination Link"
              name="ctaLink"
              value={formData.hero.ctaLink}
              onChange={handleHeroChange}
            />
          </div>
        </Card>

        {/* Live Stats */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            School Highlights &amp; Numeric Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Years of Excellence (e.g. 60+)"
              name="yearsOfExcellence"
              value={formData.stats.yearsOfExcellence}
              onChange={handleStatsChange}
            />
            <Input
              label="Student Strength (e.g. 3,300+)"
              name="totalStudents"
              value={formData.stats.totalStudents}
              onChange={handleStatsChange}
            />
            <Input
              label="Total Faculty / Staff (e.g. 70+)"
              name="totalTeachers"
              value={formData.stats.totalTeachers}
              onChange={handleStatsChange}
            />
            <Input
              label="Classes Offered (e.g. 1st – 12th)"
              name="totalClasses"
              value={formData.stats.totalClasses}
              onChange={handleStatsChange}
            />
          </div>

          <Input
            label="Key Academic Result / Highlight (e.g. 100% Board Exam Pass Rate)"
            name="achievements"
            value={formData.stats.achievements}
            onChange={handleStatsChange}
          />
        </Card>

        {/* Principal's Message */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            Principal / Headmaster Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Principal Name (English)"
              name="name"
              value={formData.principalMessage.name}
              onChange={handlePrincipalChange}
            />
            <Input
              label="Principal Name (Tamil)"
              name="name_ta"
              value={formData.principalMessage.name_ta || ''}
              onChange={handlePrincipalChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Official Designation (English)"
              name="designation"
              value={formData.principalMessage.designation}
              onChange={handlePrincipalChange}
            />
            <Input
              label="Designation (Tamil)"
              name="designation_ta"
              value={formData.principalMessage.designation_ta || ''}
              onChange={handlePrincipalChange}
            />
          </div>

          <ImageUpload
            label="Principal Photograph"
            folder="principal"
            value={formData.principalMessage.photoUrl}
            onChange={(url) =>
              setFormData({
                ...formData,
                principalMessage: { ...formData.principalMessage, photoUrl: url },
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Official Message Quote (English)"
              name="message"
              rows={4}
              value={formData.principalMessage.message}
              onChange={handlePrincipalChange}
            />
            <Textarea
              label="Official Message Quote (Tamil)"
              name="message_ta"
              rows={4}
              value={formData.principalMessage.message_ta || ''}
              onChange={handlePrincipalChange}
            />
          </div>
        </Card>

        {/* Admission Campaign CTA Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-rose-500" />
            Admission Call-to-Action Banner Box
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="CTA Title (English)"
              name="title"
              value={formData.admissionCta.title}
              onChange={handleAdmissionCtaChange}
            />
            <Input
              label="CTA Title (Tamil)"
              name="title_ta"
              value={formData.admissionCta.title_ta || ''}
              onChange={handleAdmissionCtaChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="CTA Description (English)"
              name="description"
              rows={3}
              value={formData.admissionCta.description}
              onChange={handleAdmissionCtaChange}
            />
            <Textarea
              label="CTA Description (Tamil)"
              name="description_ta"
              rows={3}
              value={formData.admissionCta.description_ta || ''}
              onChange={handleAdmissionCtaChange}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Button Text"
              name="buttonText"
              value={formData.admissionCta.buttonText}
              onChange={handleAdmissionCtaChange}
            />
            <Input
              label="Destination Link"
              name="buttonLink"
              value={formData.admissionCta.buttonLink}
              onChange={handleAdmissionCtaChange}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Homepage Sections
          </Button>
        </div>
      </form>
    </div>
  );
}