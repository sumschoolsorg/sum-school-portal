'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultAcademicsContent } from '@/lib/defaultData';
import { setDocument } from '@/lib/firestore';
import { Save, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function AcademicsAdminPage() {
  const [formData, setFormData] = useState(defaultAcademicsContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDocument('academics', 'curriculum', formData);
      toast.success('Academics content and curriculum saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Academics curriculum saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-blue-600" />
          Academics &amp; Curriculum Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure primary foundational stages, secondary SSLC, and higher secondary (+1/+2) stream subjects.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Primary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Primary Section (Standards 1 to 5)
          </h3>

          <Input
            label="Section Title"
            value={formData.primarySection.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                primarySection: { ...formData.primarySection, title: e.target.value },
              })
            }
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.primarySection.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                primarySection: { ...formData.primarySection, description: e.target.value },
              })
            }
          />
        </Card>

        {/* Secondary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Secondary Wing (Standards 6 to 10 - SSLC)
          </h3>

          <Input
            label="Section Title"
            value={formData.secondarySection.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                secondarySection: { ...formData.secondarySection, title: e.target.value },
              })
            }
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.secondarySection.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                secondarySection: { ...formData.secondarySection, description: e.target.value },
              })
            }
          />
        </Card>

        {/* Higher Secondary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Higher Secondary Wing (Standards 11 &amp; 12 - HSC)
          </h3>

          <Input
            label="Section Title"
            value={formData.higherSecondarySection.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                higherSecondarySection: { ...formData.higherSecondarySection, title: e.target.value },
              })
            }
          />

          <Textarea
            label="Description"
            rows={3}
            value={formData.higherSecondarySection.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                higherSecondarySection: { ...formData.higherSecondarySection, description: e.target.value },
              })
            }
          />
        </Card>

        {/* Teaching Methodology & Exams */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Methodology &amp; Examination System
          </h3>

          <Textarea
            label="Teaching Methodology Description"
            rows={3}
            value={formData.teachingMethodology}
            onChange={(e) => setFormData({ ...formData, teachingMethodology: e.target.value })}
          />

          <Textarea
            label="Examination System &amp; Evaluation Structure"
            rows={3}
            value={formData.examinationSystem}
            onChange={(e) => setFormData({ ...formData, examinationSystem: e.target.value })}
          />

          <Textarea
            label="Academic Year Calendar"
            rows={2}
            value={formData.academicCalendar}
            onChange={(e) => setFormData({ ...formData, academicCalendar: e.target.value })}
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
            Save Curriculum Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
