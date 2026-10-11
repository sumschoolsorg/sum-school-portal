'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultAdmissionsContent } from '@/lib/defaultData';
import { admissionsRepository } from '@/lib/repositories';
import { AdmissionsContent, AdmissionStep, ImportantDate } from '@/types';
import { Save, FileCheck, Loader2, Plus, Trash2, Calendar, ListChecks, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

export default function AdmissionsAdminPage() {
  const [formData, setFormData] = useState<AdmissionsContent>(defaultAdmissionsContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Local helper states for list additions
  const [newClass, setNewClass] = useState('');
  const [newDoc, setNewDoc] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await admissionsRepository.get();
        if (data) {
          setFormData({
            ...defaultAdmissionsContent,
            ...data,
            classesAvailable: data.classesAvailable || defaultAdmissionsContent.classesAvailable,
            procedure: data.procedure || defaultAdmissionsContent.procedure,
            requiredDocuments: data.requiredDocuments || defaultAdmissionsContent.requiredDocuments,
            importantDates: data.importantDates || defaultAdmissionsContent.importantDates,
          });
        }
      } catch (error) {
        console.warn('Failed to load admissions data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Classes Available Handlers
  const handleAddClass = () => {
    if (!newClass.trim()) return;
    setFormData({
      ...formData,
      classesAvailable: [...(formData.classesAvailable || []), newClass.trim()],
    });
    setNewClass('');
  };

  const handleRemoveClass = (index: number) => {
    setFormData({
      ...formData,
      classesAvailable: (formData.classesAvailable || []).filter((_, i) => i !== index),
    });
  };

  // Required Documents Handlers
  const handleAddDoc = () => {
    if (!newDoc.trim()) return;
    setFormData({
      ...formData,
      requiredDocuments: [...(formData.requiredDocuments || []), newDoc.trim()],
    });
    setNewDoc('');
  };

  const handleRemoveDoc = (index: number) => {
    setFormData({
      ...formData,
      requiredDocuments: (formData.requiredDocuments || []).filter((_, i) => i !== index),
    });
  };

  // Procedure Steps Handlers
  const handleAddStep = () => {
    const currentSteps = formData.procedure || [];
    const nextStepNum = currentSteps.length + 1;
    const newStep: AdmissionStep = {
      step: nextStepNum,
      title: `Step ${nextStepNum}: New Stage`,
      description: 'Describe this stage of the admission verification process.',
    };
    setFormData({
      ...formData,
      procedure: [...currentSteps, newStep],
    });
  };

  const handleUpdateStep = (index: number, field: keyof AdmissionStep, value: string | number) => {
    const updated = [...(formData.procedure || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, procedure: updated });
  };

  const handleRemoveStep = (index: number) => {
    const updated = (formData.procedure || [])
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, step: idx + 1 }));
    setFormData({ ...formData, procedure: updated });
  };

  // Important Dates Handlers
  const handleAddDate = () => {
    const newDateItem: ImportantDate = {
      title: 'New Important Milestone',
      date: 'May 2026',
      description: 'Details regarding application verification and counseling.',
    };
    setFormData({
      ...formData,
      importantDates: [...(formData.importantDates || []), newDateItem],
    });
  };

  const handleUpdateDate = (index: number, field: keyof ImportantDate, value: string) => {
    const updated = [...(formData.importantDates || [])];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, importantDates: updated });
  };

  const handleRemoveDate = (index: number) => {
    setFormData({
      ...formData,
      importantDates: (formData.importantDates || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await admissionsRepository.save(formData);
      toast.success('Admissions guidelines and criteria saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Admissions content updated locally.');
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Announcement Banner Text (English)"
              name="announcement"
              value={formData.announcement}
              onChange={handleChange}
            />
            <Input
              label="Announcement Banner Text (Tamil)"
              name="announcement_ta"
              value={formData.announcement_ta || ''}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Classes Available */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Classes Offered for Admission
              </h3>
              <p className="text-xs text-slate-500">
                Standards and streams open for new academic enrollments.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Standard 6 (English Medium)"
              value={newClass}
              onChange={(e) => setNewClass(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddClass();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddClass}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Class
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {(formData.classesAvailable || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveClass(idx)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Class"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Admission Procedure Steps */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5 text-blue-600" />
                Step-by-Step Admission Procedure
              </h3>
              <p className="text-xs text-slate-500">
                Sequenced stages shown to parents on the public admissions page.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddStep}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Step
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            {(formData.procedure || []).map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Step {step.step}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Step"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Input
                  label="Step Title"
                  value={step.title}
                  onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                />

                <Textarea
                  label="Description"
                  rows={2}
                  value={step.description}
                  onChange={(e) => handleUpdateStep(idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Required Documents Checklist */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-600" />
                Required Documents Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Certificates and verification proofs required at the time of admission.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Original Transfer Certificate (TC) signed by Headmaster"
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddDoc();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddDoc}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Document
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {(formData.requiredDocuments || []).map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800"
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {doc}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveDoc(idx)}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Important Admission Dates */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-500" />
                Admission Calendar &amp; Important Dates
              </h3>
              <p className="text-xs text-slate-500">
                Key milestones: Form release, submission deadlines, scrutiny and allotment dates.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Date
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            {(formData.importantDates || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Milestone #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDate(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    title="Delete Date"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Milestone Title"
                    value={item.title}
                    onChange={(e) => handleUpdateDate(idx, 'title', e.target.value)}
                  />
                  <Input
                    label="Date / Period"
                    value={item.date}
                    onChange={(e) => handleUpdateDate(idx, 'date', e.target.value)}
                  />
                </div>

                <Input
                  label="Description / Notes"
                  value={item.description}
                  onChange={(e) => handleUpdateDate(idx, 'description', e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Eligibility & Fees */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Eligibility Norms &amp; Fee Policy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Eligibility Criteria (English)"
              name="eligibility"
              rows={3}
              value={formData.eligibility}
              onChange={handleChange}
            />
            <Textarea
              label="Eligibility Criteria (Tamil)"
              name="eligibility_ta"
              rows={3}
              value={formData.eligibility_ta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Official Fee Policy & Subsidies (English)"
              name="feeInformation"
              rows={3}
              value={formData.feeInformation}
              onChange={handleChange}
            />
            <Textarea
              label="Official Fee Policy (Tamil)"
              name="feeInformation_ta"
              rows={3}
              value={formData.feeInformation_ta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="School Office Admission Timings (English)"
              name="schoolTimings"
              value={formData.schoolTimings}
              onChange={handleChange}
            />
            <Input
              label="Admission Timings (Tamil)"
              name="schoolTimings_ta"
              value={formData.schoolTimings_ta || ''}
              onChange={handleChange}
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
            Save Admission Guidelines
          </Button>
        </div>
      </form>
    </div>
  );
}
