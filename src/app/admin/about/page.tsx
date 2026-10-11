'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultAboutContent } from '@/lib/defaultData';
import { aboutRepository } from '@/lib/repositories';
import { AboutContent, ManagementMember, SchoolHighlight } from '@/types';
import { Save, Info, Plus, Trash2, Loader2, Users, Award, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function AboutAdminPage() {
  const [formData, setFormData] = useState<AboutContent>(defaultAboutContent);
  const [newValue, setNewValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await aboutRepository.get();
        if (data) {
          setFormData({
            ...defaultAboutContent,
            ...data,
            coreValues: data.coreValues || defaultAboutContent.coreValues,
            management: data.management || defaultAboutContent.management,
            highlights: data.highlights || defaultAboutContent.highlights,
          });
        }
      } catch (error) {
        console.warn('Failed to load about data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCoreValue = () => {
    if (!newValue.trim()) return;
    setFormData({
      ...formData,
      coreValues: [...(formData.coreValues || []), newValue.trim()],
    });
    setNewValue('');
  };

  const handleRemoveCoreValue = (index: number) => {
    setFormData({
      ...formData,
      coreValues: (formData.coreValues || []).filter((_, i) => i !== index),
    });
  };

  // Management Members Handlers
  const handleAddManagementMember = () => {
    const current = formData.management || [];
    const nextOrder = current.length + 1;
    const newMember: ManagementMember = {
      name: 'Management Committee Member',
      designation: 'Trustee / Official',
      photoUrl: '/images/principal-photo.jpg',
      message: 'Committed to rural education excellence and value-based development.',
      order: nextOrder,
    };
    setFormData({
      ...formData,
      management: [...current, newMember],
    });
  };

  const handleUpdateManagementMember = (index: number, field: keyof ManagementMember, val: string | number) => {
    const updated = [...(formData.management || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, management: updated });
  };

  const handleRemoveManagementMember = (index: number) => {
    const updated = (formData.management || [])
      .filter((_, i) => i !== index)
      .map((m, idx) => ({ ...m, order: idx + 1 }));
    setFormData({ ...formData, management: updated });
  };

  // School Highlights Handlers
  const handleAddHighlight = () => {
    const newHighlight: SchoolHighlight = {
      title: 'New Institutional Milestone',
      description: 'Highlighting heritage, academic performance, or technological adoption.',
      icon: 'Award',
    };
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), newHighlight],
    });
  };

  const handleUpdateHighlight = (index: number, field: keyof SchoolHighlight, val: string) => {
    const updated = [...(formData.highlights || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, highlights: updated });
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: (formData.highlights || []).filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await aboutRepository.save(formData);
      toast.success('About page content, vision, and management records saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('About page content updated locally.');
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
          <Info className="w-6 h-6 text-blue-600" />
          About School Content Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage institutional history, founding vision, mission statement, leadership committee, and educational philosophy.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Introduction & History */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Introduction &amp; 1963 Heritage
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="School Introduction (English)"
              name="introduction"
              rows={4}
              value={formData.introduction}
              onChange={handleChange}
            />
            <Textarea
              label="School Introduction (Tamil)"
              name="introduction_ta"
              rows={4}
              value={formData.introduction_ta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Historical Background (English)"
              name="history"
              rows={4}
              value={formData.history}
              onChange={handleChange}
            />
            <Textarea
              label="Historical Background (Tamil)"
              name="history_ta"
              rows={4}
              value={formData.history_ta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Educational Philosophy (English)"
              name="educationalPhilosophy"
              rows={3}
              value={formData.educationalPhilosophy}
              onChange={handleChange}
            />
            <Textarea
              label="Educational Philosophy (Tamil)"
              name="educationalPhilosophy_ta"
              rows={3}
              value={formData.educationalPhilosophy_ta || ''}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Vision & Mission */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Vision &amp; Mission Statements
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Institutional Vision (English)"
              name="vision"
              rows={3}
              value={formData.vision}
              onChange={handleChange}
            />
            <Textarea
              label="Institutional Vision (Tamil)"
              name="vision_ta"
              rows={3}
              value={formData.vision_ta || ''}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Institutional Mission (English)"
              name="mission"
              rows={3}
              value={formData.mission}
              onChange={handleChange}
            />
            <Textarea
              label="Institutional Mission (Tamil)"
              name="mission_ta"
              rows={3}
              value={formData.mission_ta || ''}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Core Values */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Core Institutional Values
          </h3>

          <div className="flex gap-2">
            <Input
              placeholder="e.g. Integrity & Ethical Discipline"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCoreValue();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddCoreValue}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Value
            </Button>
          </div>

          <div className="space-y-2 pt-2">
            {(formData.coreValues || []).map((val, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium"
              >
                <span>{val}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCoreValue(idx)}
                  className="p-1 text-slate-400 hover:text-red-500 transition"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Management & Leadership Committee */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                School Management &amp; Trust Leadership
              </h3>
              <p className="text-xs text-slate-500">
                School Correspondent, Secretary, Headmaster, and Managing Trustees.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddManagementMember}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Member
            </Button>
          </div>

          <div className="space-y-6 pt-2">
            {(formData.management || []).map((member, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Leader #{member.order || idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveManagementMember(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Official Name (English)"
                    value={member.name}
                    onChange={(e) => handleUpdateManagementMember(idx, 'name', e.target.value)}
                  />
                  <Input
                    label="Official Name (Tamil)"
                    value={member.name_ta || ''}
                    onChange={(e) => handleUpdateManagementMember(idx, 'name_ta', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Designation / Role (English)"
                    value={member.designation}
                    onChange={(e) => handleUpdateManagementMember(idx, 'designation', e.target.value)}
                  />
                  <Input
                    label="Designation (Tamil)"
                    value={member.designation_ta || ''}
                    onChange={(e) => handleUpdateManagementMember(idx, 'designation_ta', e.target.value)}
                  />
                </div>

                <ImageUpload
                  label="Leader Portrait / Photograph"
                  value={member.photoUrl}
                  onChange={(url) => handleUpdateManagementMember(idx, 'photoUrl', url)}
                  folder="management"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Textarea
                    label="Official Message / Quote (English)"
                    rows={2}
                    value={member.message}
                    onChange={(e) => handleUpdateManagementMember(idx, 'message', e.target.value)}
                  />
                  <Textarea
                    label="Official Message (Tamil)"
                    rows={2}
                    value={member.message_ta || ''}
                    onChange={(e) => handleUpdateManagementMember(idx, 'message_ta', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* School Highlights */}
        <Card className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Institutional Highlights &amp; Accreditations
              </h3>
              <p className="text-xs text-slate-500">
                Key recognitions: Diamond Jubilee, UDISE standards, and regional distinctions.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddHighlight}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Highlight
            </Button>
          </div>

          <div className="space-y-4 pt-2">
            {(formData.highlights || []).map((highlight, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Highlight #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
                    title="Delete Highlight"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Highlight Title"
                    value={highlight.title}
                    onChange={(e) => handleUpdateHighlight(idx, 'title', e.target.value)}
                  />
                  <Input
                    label="Icon Name"
                    value={highlight.icon}
                    onChange={(e) => handleUpdateHighlight(idx, 'icon', e.target.value)}
                  />
                </div>

                <Textarea
                  label="Description"
                  rows={2}
                  value={highlight.description}
                  onChange={(e) => handleUpdateHighlight(idx, 'description', e.target.value)}
                />
              </div>
            ))}
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
            Save About School Content
          </Button>
        </div>
      </form>
    </div>
  );
}
