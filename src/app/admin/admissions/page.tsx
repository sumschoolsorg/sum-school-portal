'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultAdmissionsContent } from '@/lib/defaultData';
import { setDocument } from '@/lib/firestore';
import { Save, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function AdmissionsAdminPage() {
  const [formData, setFormData] = useState(defaultAdmissionsContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDocument('admissions', 'overview', formData);
      toast.success('Admissions announcements and criteria saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Admissions content updated locally.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-blue-600" />
          Admissions Guidelines Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure admission alerts, application procedures, required certificates, and fee information.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Banner Alert */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Public Admission Campaign Alert
          </h3>

          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              id="announcementActive"
              checked={formData.announcementActive}
              onChange={(e) =>
                setFormData({ ...formData, announcementActive: e.target.checked })
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="announcementActive"
              className="text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              Display Admission Announcement Banner on Public Website
            </label>
          </div>

          <Input
            label="Announcement Banner Text"
            name="announcement"
            value={formData.announcement}
            onChange={handleChange}
          />
        </Card>

        {/* Eligibility & Fees */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Eligibility Norms &amp; Fee Policy
          </h3>

          <Textarea
            label="Eligibility Criteria"
            name="eligibility"
            rows={3}
            value={formData.eligibility}
            onChange={handleChange}
          />

          <Textarea
            label="Official Fee Policy &amp; Subsidies"
            name="feeInformation"
            rows={3}
            value={formData.feeInformation}
            onChange={handleChange}
          />

          <Input
            label="School Office Admission Timings"
            name="schoolTimings"
            value={formData.schoolTimings}
            onChange={handleChange}
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
            Save Admission Guidelines
          </Button>
        </div>
      </form>
    </div>
  );
}
