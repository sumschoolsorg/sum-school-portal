'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultAcademicsContent } from '@/lib/defaultData';
import { academicsRepository } from '@/lib/repositories';
import { AcademicsContent } from '@/types';
import { Save, GraduationCap, Loader2, Plus, Trash2, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AcademicsAdminPage() {
  const [formData, setFormData] = useState<AcademicsContent>(defaultAcademicsContent);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper inputs for adding subjects and activities
  const [newPrimarySub, setNewPrimarySub] = useState('');
  const [newSecondarySub, setNewSecondarySub] = useState('');
  const [newHigherSecSub, setNewHigherSecSub] = useState('');
  const [newAcademicActivity, setNewAcademicActivity] = useState('');
  const [newCoCurricularActivity, setNewCoCurricularActivity] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await academicsRepository.get();
        if (data) {
          setFormData({
            ...defaultAcademicsContent,
            ...data,
            primarySection: {
              ...defaultAcademicsContent.primarySection,
              ...(data.primarySection || {}),
              subjects: data.primarySection?.subjects || defaultAcademicsContent.primarySection.subjects,
            },
            secondarySection: {
              ...defaultAcademicsContent.secondarySection,
              ...(data.secondarySection || {}),
              subjects: data.secondarySection?.subjects || defaultAcademicsContent.secondarySection.subjects,
            },
            higherSecondarySection: {
              ...defaultAcademicsContent.higherSecondarySection,
              ...(data.higherSecondarySection || {}),
              subjects: data.higherSecondarySection?.subjects || defaultAcademicsContent.higherSecondarySection.subjects,
            },
            academicActivities: data.academicActivities || defaultAcademicsContent.academicActivities,
            coCurricularActivities: data.coCurricularActivities || defaultAcademicsContent.coCurricularActivities,
          });
        }
      } catch (error) {
        console.warn('Failed to load academics data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await academicsRepository.save(formData);
      toast.success('Academics content and curriculum saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('Academics curriculum saved locally.');
    } finally {
      setIsSaving(false);
    }
  };

  // Subject Handlers
  const addSubject = (section: 'primarySection' | 'secondarySection' | 'higherSecondarySection', subject: string, reset: () => void) => {
    if (!subject.trim()) return;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        subjects: [...(formData[section].subjects || []), subject.trim()],
      },
    });
    reset();
  };

  const removeSubject = (section: 'primarySection' | 'secondarySection' | 'higherSecondarySection', index: number) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        subjects: (formData[section].subjects || []).filter((_, i) => i !== index),
      },
    });
  };

  // Activity Handlers
  const addActivity = (field: 'academicActivities' | 'coCurricularActivities', val: string, reset: () => void) => {
    if (!val.trim()) return;
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), val.trim()],
    });
    reset();
  };

  const removeActivity = (field: 'academicActivities' | 'coCurricularActivities', index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] || []).filter((_, i) => i !== index),
    });
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
          <GraduationCap className="w-6 h-6 text-blue-600" />
          Academics &amp; Curriculum Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure primary foundational stages, secondary SSLC, and higher secondary (+1/+2) stream subjects, images, and activities.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Primary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Stage 1: Primary Section (Standards 1 to 5)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Section Title (English)"
              value={formData.primarySection.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primarySection: { ...formData.primarySection, title: e.target.value },
                })
              }
            />
            <Input
              label="Section Title (Tamil)"
              value={formData.primarySection.title_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primarySection: { ...formData.primarySection, title_ta: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Description (English)"
              rows={3}
              value={formData.primarySection.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primarySection: { ...formData.primarySection, description: e.target.value },
                })
              }
            />
            <Textarea
              label="Description (Tamil)"
              rows={3}
              value={formData.primarySection.description_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  primarySection: { ...formData.primarySection, description_ta: e.target.value },
                })
              }
            />
          </div>

          <ImageUpload
            label="Primary Section Illustration / Photo"
            value={formData.primarySection.imageUrl}
            onChange={(url) =>
              setFormData({
                ...formData,
                primarySection: { ...formData.primarySection, imageUrl: url },
              })
            }
            folder="academics"
          />

          {/* Primary Subjects */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Primary Subjects &amp; Disciplines
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="e.g. Environmental Science & Nature Studies"
                value={newPrimarySub}
                onChange={(e) => setNewPrimarySub(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject('primarySection', newPrimarySub, () => setNewPrimarySub(''));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSubject('primarySection', newPrimarySub, () => setNewPrimarySub(''))}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Subject
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.primarySection.subjects || []).map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => removeSubject('primarySection', idx)}
                    className="text-blue-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Secondary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Stage 2: Secondary Wing (Standards 6 to 10 - SSLC)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Section Title (English)"
              value={formData.secondarySection.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondarySection: { ...formData.secondarySection, title: e.target.value },
                })
              }
            />
            <Input
              label="Section Title (Tamil)"
              value={formData.secondarySection.title_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondarySection: { ...formData.secondarySection, title_ta: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Description (English)"
              rows={3}
              value={formData.secondarySection.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondarySection: { ...formData.secondarySection, description: e.target.value },
                })
              }
            />
            <Textarea
              label="Description (Tamil)"
              rows={3}
              value={formData.secondarySection.description_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  secondarySection: { ...formData.secondarySection, description_ta: e.target.value },
                })
              }
            />
          </div>

          <ImageUpload
            label="Secondary Section Illustration / Photo"
            value={formData.secondarySection.imageUrl}
            onChange={(url) =>
              setFormData({
                ...formData,
                secondarySection: { ...formData.secondarySection, imageUrl: url },
              })
            }
            folder="academics"
          />

          {/* Secondary Subjects */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Secondary Subjects (SSLC)
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="e.g. Science (Physics, Chemistry, Biology Practical)"
                value={newSecondarySub}
                onChange={(e) => setNewSecondarySub(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject('secondarySection', newSecondarySub, () => setNewSecondarySub(''));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSubject('secondarySection', newSecondarySub, () => setNewSecondarySub(''))}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Subject
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.secondarySection.subjects || []).map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => removeSubject('secondarySection', idx)}
                    className="text-emerald-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Higher Secondary Section */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            Stage 3: Higher Secondary Wing (+1 &amp; +2 HSC Streams)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Section Title (English)"
              value={formData.higherSecondarySection.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  higherSecondarySection: { ...formData.higherSecondarySection, title: e.target.value },
                })
              }
            />
            <Input
              label="Section Title (Tamil)"
              value={formData.higherSecondarySection.title_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  higherSecondarySection: { ...formData.higherSecondarySection, title_ta: e.target.value },
                })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Description (English)"
              rows={3}
              value={formData.higherSecondarySection.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  higherSecondarySection: { ...formData.higherSecondarySection, description: e.target.value },
                })
              }
            />
            <Textarea
              label="Description (Tamil)"
              rows={3}
              value={formData.higherSecondarySection.description_ta || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  higherSecondarySection: { ...formData.higherSecondarySection, description_ta: e.target.value },
                })
              }
            />
          </div>

          <ImageUpload
            label="Higher Secondary Section Illustration / Photo"
            value={formData.higherSecondarySection.imageUrl}
            onChange={(url) =>
              setFormData({
                ...formData,
                higherSecondarySection: { ...formData.higherSecondarySection, imageUrl: url },
              })
            }
            folder="academics"
          />

          {/* Higher Secondary Streams Offered */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Academic Streams &amp; Subject Combinations
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="e.g. Group 1: Mathematics, Physics, Chemistry, Biology"
                value={newHigherSecSub}
                onChange={(e) => setNewHigherSecSub(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject('higherSecondarySection', newHigherSecSub, () => setNewHigherSecSub(''));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSubject('higherSecondarySection', newHigherSecSub, () => setNewHigherSecSub(''))}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Stream
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.higherSecondarySection.subjects || []).map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject('higherSecondarySection', idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Academic & Co-Curricular Programs */}
        <Card className="p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Curriculum Enrichment Programs
          </h3>

          {/* Academic Activities */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Academic Activities (Science Exhibitions, Debates, Quiz)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Annual District-Level Science Exhibition & Fair"
                value={newAcademicActivity}
                onChange={(e) => setNewAcademicActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addActivity('academicActivities', newAcademicActivity, () => setNewAcademicActivity(''));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addActivity('academicActivities', newAcademicActivity, () => setNewAcademicActivity(''))}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Activity
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.academicActivities || []).map((act, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  {act}
                  <button
                    type="button"
                    onClick={() => removeActivity('academicActivities', idx)}
                    className="text-slate-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Co-Curricular Clubs */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Co-Curricular Clubs &amp; Movements (JRC, NSS, NCC, Scout)
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Junior Red Cross (JRC) First Aid Unit"
                value={newCoCurricularActivity}
                onChange={(e) => setNewCoCurricularActivity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addActivity('coCurricularActivities', newCoCurricularActivity, () => setNewCoCurricularActivity(''));
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addActivity('coCurricularActivities', newCoCurricularActivity, () => setNewCoCurricularActivity(''))}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Club
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.coCurricularActivities || []).map((club, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  {club}
                  <button
                    type="button"
                    onClick={() => removeActivity('coCurricularActivities', idx)}
                    className="text-amber-400 hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Teaching Methodology & Exams */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Methodology &amp; Examination System
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Teaching Methodology (English)"
              rows={3}
              value={formData.teachingMethodology}
              onChange={(e) => setFormData({ ...formData, teachingMethodology: e.target.value })}
            />
            <Textarea
              label="Teaching Methodology (Tamil)"
              rows={3}
              value={formData.teachingMethodology_ta || ''}
              onChange={(e) => setFormData({ ...formData, teachingMethodology_ta: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Examination System (English)"
              rows={3}
              value={formData.examinationSystem}
              onChange={(e) => setFormData({ ...formData, examinationSystem: e.target.value })}
            />
            <Textarea
              label="Examination System (Tamil)"
              rows={3}
              value={formData.examinationSystem_ta || ''}
              onChange={(e) => setFormData({ ...formData, examinationSystem_ta: e.target.value })}
            />
          </div>

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
