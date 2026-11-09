'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultWebsiteSettings } from '@/lib/defaultData';
import { websiteSettingsRepository } from '@/lib/repositories';
import { Save, Settings, Loader2, HardDrive } from 'lucide-react';
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

          <ImageUpload
            label="Social Share Preview Image (Open Graph)"
            value={formData.ogImageUrl}
            onChange={(url) => setFormData({ ...formData, ogImageUrl: url })}
            folder="settings"
          />
        </Card>

        {/* Media & Photo Upload Controls */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              Media &amp; Photo Upload Control (All Admin Controls)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure maximum file size limit and smart optimization policies across all image upload controls in the portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Maximum Photo Upload Size (MB)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.maxPhotoUploadSizeMB || 25}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPhotoUploadSizeMB: parseInt(e.target.value, 10) || 25,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard: 25MB (permits full-resolution camera photos from smartphones).
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="autoCompressLargePhotos"
                  checked={formData.autoCompressLargePhotos ?? true}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      autoCompressLargePhotos: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="autoCompressLargePhotos"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Enable Client-side Auto-Compression
                </label>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 pl-7">
                Automatically optimizes 5MB–25MB camera photos to high-visual-quality WebP/JPEG under 2MB for fast loading and zero Firebase quota strain.
              </p>
            </div>
          </div>
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
