'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { themeRepository } from '@/lib/repositories';
import { ThemeSettings } from '@/types';
import { defaultThemeSettings } from '@/lib/defaultData';
import { Palette, Check, RotateCcw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ThemeAdminPage() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await themeRepository.get();
        if (data) setTheme(data);
      } catch (err) {
        console.warn('Using default theme settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadTheme();
  }, []);

  const handleColorChange = (key: keyof ThemeSettings, val: string) => {
    setTheme((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setTheme(defaultThemeSettings);
    toast.info('Theme reset to default S.U.M. School palette.');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await themeRepository.save(theme);

      // Apply CSS root variables if in browser
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primaryColor);
        root.style.setProperty('--color-secondary', theme.secondaryColor);
        root.style.setProperty('--color-accent', theme.accentColor);
      }

      toast.success('Theme & Branding configuration saved successfully!');
    } catch (err) {
      console.error('Error saving theme:', err);
      toast.error('Failed to save theme settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-extrabold text-slate-900">
              Theme & Branding Configuration
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Color Tokens
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Customize the school branding colors, typography tokens, and visual styling.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-1.5 text-xs">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Color Palette Controls */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 space-y-6 border-slate-200">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Palette className="w-4 h-4 text-blue-600" />
              Primary School Brand Palette
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Color (Deep Navy)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                  />
                  <Input
                    value={theme.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    placeholder="#0f2b5c"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Secondary Color (Royal Blue)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                  />
                  <Input
                    value={theme.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    placeholder="#1e40af"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Accent Color (Academic Gold)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                  />
                  <Input
                    value={theme.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    placeholder="#d97706"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Body Text Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-1"
                  />
                  <Input
                    value={theme.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    placeholder="#0f172a"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                Typography & Border Settings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Primary Font Family"
                  value={theme.fontFamily}
                  onChange={(e) => handleColorChange('fontFamily', e.target.value)}
                  options={[
                    { label: 'Outfit + Inter (Academic Standard)', value: 'Outfit, Inter, sans-serif' },
                    { label: 'Inter (Clean Sans)', value: 'Inter, sans-serif' },
                    { label: 'Roboto (Modern Neutral)', value: 'Roboto, sans-serif' },
                  ]}
                />

                <Select
                  label="Card & Button Corner Radius"
                  value={theme.borderRadius}
                  onChange={(e) => handleColorChange('borderRadius', e.target.value)}
                  options={[
                    { label: 'Medium (0.5rem - Modern Clean)', value: '0.5rem' },
                    { label: 'Large (0.75rem - Academic Rounded)', value: '0.75rem' },
                    { label: 'Extra Large (1rem - Soft Glass)', value: '1rem' },
                  ]}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Live UI Component Preview */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-6 border-slate-200 bg-slate-50/50">
            <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Live Design Preview
            </h2>

            {/* Mock Header Card */}
            <div
              className="p-5 rounded-2xl text-white shadow-lg space-y-3"
              style={{
                backgroundColor: theme.primaryColor,
                borderRadius: theme.borderRadius,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: '#ffffff',
                  }}
                >
                  Since 1963
                </span>
                <span className="text-xs text-slate-200 font-mono">Royappanpatti</span>
              </div>
              <h3 className="text-lg font-heading font-extrabold leading-snug">
                S.U.M. Higher Secondary School
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2">
                Sample preview showing header text, badge accents, and background contrast.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  className="px-4 py-1.5 rounded-lg text-xs font-bold shadow-md transition"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: '#ffffff',
                    borderRadius: theme.borderRadius,
                  }}
                >
                  Admissions Open
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/30 text-white hover:bg-white/10"
                  style={{ borderRadius: theme.borderRadius }}
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Mock Card */}
            <div
              className="p-5 bg-white border shadow-sm space-y-3"
              style={{
                borderColor: theme.borderColor,
                borderRadius: theme.borderRadius,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: theme.secondaryColor }}
                />
                <span className="text-xs font-bold uppercase" style={{ color: theme.secondaryColor }}>
                  Academic Section
                </span>
              </div>
              <h4 className="text-sm font-bold" style={{ color: theme.textColor }}>
                Higher Secondary Science Stream
              </h4>
              <p className="text-xs text-slate-500">
                Mathematics, Physics, Chemistry, Biology & Computer Science laboratory courses.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
