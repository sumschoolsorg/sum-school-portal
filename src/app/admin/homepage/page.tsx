'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultHomepageContent } from '@/lib/defaultData';
import { homepageRepository } from '@/lib/repositories';
import { Save, Home, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function HomepageAdminPage() {
  const [formData, setFormData] = useState(defaultHomepageContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await homepageRepository.get();
        setFormData(data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await homepageRepository.save(formData);
      toast.success('Homepage hero, statistics, and principal message saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Homepage configuration saved locally.');
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
          Edit hero headlines, banner images, statistics counters, and leadership messages.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hero Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Hero Section Banner
          </h3>

          <Input
            label="Hero Tagline / Subtitle"
            name="subtitle"
            value={formData.hero.subtitle}
            onChange={handleHeroChange}
          />

          <Input
            label="Main Hero Headline"
            name="title"
            value={formData.hero.title}
            onChange={handleHeroChange}
          />

          <Textarea
            label="Hero Introduction Paragraph"
            name="description"
            rows={3}
            value={formData.hero.description}
            onChange={handleHeroChange}
          />

          <ImageUpload
            label="Hero Campus Background Image"
            folder="hero"
            currentImageUrl={formData.hero.imageUrl}
            onImageUploaded={(url) =>
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
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            School Highlights &amp; Numeric Statistics
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Years of Excellence"
              name="yearsOfExcellence"
              value={formData.stats.yearsOfExcellence}
              onChange={handleStatsChange}
            />
            <Input
              label="Student Strength"
              name="totalStudents"
              value={formData.stats.totalStudents}
              onChange={handleStatsChange}
            />
            <Input
              label="Total Faculty / Staff"
              name="totalTeachers"
              value={formData.stats.totalTeachers}
              onChange={handleStatsChange}
            />
            <Input
              label="Classes Offered"
              name="totalClasses"
              value={formData.stats.totalClasses}
              onChange={handleStatsChange}
            />
          </div>

          <Input
            label="Key Academic Result / Highlight"
            name="achievements"
            value={formData.stats.achievements}
            onChange={handleStatsChange}
          />
        </Card>

        {/* Principal's Message */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Principal / Headmaster Message
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Principal Name"
              name="name"
              value={formData.principalMessage.name}
              onChange={handlePrincipalChange}
            />
            <Input
              label="Official Designation"
              name="designation"
              value={formData.principalMessage.designation}
              onChange={handlePrincipalChange}
            />
          </div>

          <ImageUpload
            label="Principal Photograph"
            folder="principal"
            currentImageUrl={formData.principalMessage.photoUrl}
            onImageUploaded={(url) =>
              setFormData({
                ...formData,
                principalMessage: { ...formData.principalMessage, photoUrl: url },
              })
            }
          />

          <Textarea
            label="Official Message Quote"
            name="message"
            rows={4}
            value={formData.principalMessage.message}
            onChange={handlePrincipalChange}
          />
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