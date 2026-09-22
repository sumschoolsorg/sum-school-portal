'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { defaultAboutContent } from '@/lib/defaultData';
import { setDocument } from '@/lib/firestore';
import { Save, Info, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AboutAdminPage() {
  const [formData, setFormData] = useState(defaultAboutContent);
  const [newValue, setNewValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCoreValue = () => {
    if (!newValue.trim()) return;
    setFormData({
      ...formData,
      coreValues: [...formData.coreValues, newValue.trim()],
    });
    setNewValue('');
  };

  const handleRemoveCoreValue = (index: number) => {
    setFormData({
      ...formData,
      coreValues: formData.coreValues.filter((_, i) => i !== index),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDocument('about', 'content', formData);
      toast.success('About page content, vision, and core values saved to Firestore!');
    } catch (error) {
      console.warn('Saved in offline mode:', error);
      toast.info('About page content updated locally.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600" />
          About School Content Manager
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage institutional history, founding vision, mission statement, and educational philosophy.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Introduction &amp; 1963 Heritage
          </h3>

          <Textarea
            label="School Introduction"
            name="introduction"
            rows={4}
            value={formData.introduction}
            onChange={handleChange}
          />

          <Textarea
            label="Historical Background (Savariyappa Udaiyar Memorial)"
            name="history"
            rows={4}
            value={formData.history}
            onChange={handleChange}
          />

          <Textarea
            label="Educational Philosophy &amp; Pedagogy"
            name="educationalPhilosophy"
            rows={3}
            value={formData.educationalPhilosophy}
            onChange={handleChange}
          />
        </Card>

        {/* Vision & Mission */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Vision &amp; Mission Statements
          </h3>

          <Textarea
            label="Institutional Vision"
            name="vision"
            rows={3}
            value={formData.vision}
            onChange={handleChange}
          />

          <Textarea
            label="Institutional Mission"
            name="mission"
            rows={3}
            value={formData.mission}
            onChange={handleChange}
          />
        </Card>

        {/* Core Values */}
        <Card className="p-6 sm:p-8 space-y-4">
          <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Core Institutional Values
          </h3>

          <div className="space-y-2">
            {formData.coreValues.map((val, idx) => (
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

          <div className="flex items-center gap-2 pt-2">
            <Input
              placeholder="e.g. Environmental Care &amp; Cleanliness"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
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
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save About Content
          </Button>
        </div>
      </form>
    </div>
  );
}
