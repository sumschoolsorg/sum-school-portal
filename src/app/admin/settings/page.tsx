'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultWebsiteSettings } from '@/lib/defaultData';
import { websiteSettingsRepository } from '@/lib/repositories';
import { Save, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function WebsiteSettingsAdminPage() {
  const [formData, setFormData] = useState(defaultWebsiteSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await websiteSettingsRepository.get();
        setFormData(data);
      } catch (error) {
        console.warn('Failed to load settings data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await websiteSettingsRepository.save(formData);
      toast.success('Website SEO and global configuration updated in Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Website settings updated locally.');
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
          <Settings className="w-6 h-6 text-blue-600" />
          Global Website Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search engine optimization (SEO), footer content, legal terms, and maintenance controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SEO Meta */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Search Engine Optimization (SEO)
          </h3>

          <Input
            label="Default Page Meta Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
          />

          <Textarea
            label="Meta Description (Appears on Google Search)"
            name="seoDescription"
            rows={3}
            value={formData.seoDescription}
            onChange={handleChange}
          />

          <Input
            label="Social Share Preview Image Path (Open Graph)"
            name="ogImageUrl"
            value={formData.ogImageUrl}
            onChange={handleChange}
          />
        </Card>

        {/* Footer & Legal */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Footer Text &amp; Copyright Notice
          </h3>

          <Textarea
            label="Footer Mission Excerpt"
            name="footerText"
            rows={2}
            value={formData.footerText}
            onChange={handleChange}
          />

          <Input
            label="Copyright Text"
            name="copyrightText"
            value={formData.copyrightText}
            onChange={handleChange}
          />
        </Card>

        {/* Maintenance Mode */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Maintenance Status
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={(e) =>
                setFormData({ ...formData, maintenanceMode: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="maintenanceMode"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Enable Maintenance Mode (Restricts Public Browsing)
            </label>
          </div>

          {formData.maintenanceMode && (
            <Input
              label="Maintenance Message"
              name="maintenanceMessage"
              value={formData.maintenanceMessage}
              onChange={handleChange}
            />
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Global Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
