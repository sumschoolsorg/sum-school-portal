'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { heroBannerRepository } from '@/lib/repositories';
import { HeroBanner, BannerAnimationStyle } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ArrowRight,
  Eye,
  MoveUp,
  MoveDown,
  Layers,
  Globe,
  Languages,
} from 'lucide-react';
import { toast } from 'sonner';

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewBanner, setPreviewBanner] = useState<HeroBanner | null>(null);
  const [previewLang, setPreviewLang] = useState<'en' | 'ta'>('en');
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<'en' | 'ta' | 'settings'>('en');

  const [formData, setFormData] = useState<Partial<HeroBanner>>({
    title: '',
    title_en: '',
    title_ta: '',
    subtitle: '',
    subtitle_en: '',
    subtitle_ta: '',
    description: '',
    description_en: '',
    description_ta: '',
    imageUrl: '/images/hero-campus.jpg',
    ctaText: 'Explore Admissions',
    ctaText_en: 'Explore Admissions',
    ctaText_ta: 'சேர்க்கை விவரங்கள்',
    ctaLink: '/admissions',
    secondaryCtaText: 'Our Heritage',
    secondaryCtaText_en: 'Our Heritage',
    secondaryCtaText_ta: 'எங்கள் பாரம்பரியம்',
    secondaryCtaLink: '/about',
    order: 1,
    status: 'published',
    animationStyle: 'fade',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await heroBannerRepository.getAll();
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(data);
    } catch (err) {
      console.error('Error loading banners:', err);
      toast.error('Failed to load hero banners.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    heroBannerRepository.getAll().then((data) => {
      if (!isMounted) return;
      data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(data);
    }).catch((err) => {
      console.error('Error loading banners:', err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormTab('en');
    setFormData({
      title: '',
      title_en: '',
      title_ta: '',
      subtitle: '',
      subtitle_en: '',
      subtitle_ta: '',
      description: '',
      description_en: '',
      description_ta: '',
      imageUrl: '/images/hero-campus.jpg',
      ctaText: 'Explore Admissions',
      ctaText_en: 'Explore Admissions',
      ctaText_ta: 'சேர்க்கை விவரங்கள்',
      ctaLink: '/admissions',
      secondaryCtaText: 'Campus Tour',
      secondaryCtaText_en: 'Campus Tour',
      secondaryCtaText_ta: 'வளாகப் பார்வை',
      secondaryCtaLink: '/facilities',
      order: banners.length + 1,
      status: 'published',
      animationStyle: 'fade',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: HeroBanner) => {
    setEditingBanner(b);
    setFormTab('en');
    setFormData({
      ...b,
      title: b.title_en || b.title || '',
      title_en: b.title_en || b.title || '',
      title_ta: b.title_ta || '',
      subtitle: b.subtitle_en || b.subtitle || '',
      subtitle_en: b.subtitle_en || b.subtitle || '',
      subtitle_ta: b.subtitle_ta || '',
      description: b.description_en || b.description || '',
      description_en: b.description_en || b.description || '',
      description_ta: b.description_ta || '',
      ctaText: b.ctaText_en || b.ctaText || '',
      ctaText_en: b.ctaText_en || b.ctaText || '',
      ctaText_ta: b.ctaText_ta || '',
      secondaryCtaText: b.secondaryCtaText_en || b.secondaryCtaText || '',
      secondaryCtaText_en: b.secondaryCtaText_en || b.secondaryCtaText || '',
      secondaryCtaText_ta: b.secondaryCtaText_ta || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenPreview = (b: HeroBanner) => {
    setPreviewBanner(b);
    setPreviewLang('en');
    setIsPreviewOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryTitle = formData.title_en || formData.title || '';
    if (!primaryTitle || !formData.imageUrl) {
      toast.error('Please provide a banner title and image.');
      return;
    }

    try {
      const bannerPayload: HeroBanner = {
        ...(editingBanner || {}),
        id: editingBanner?.id || `banner-${Date.now()}`,
        title: primaryTitle,
        title_en: primaryTitle,
        title_ta: formData.title_ta || '',
        subtitle: formData.subtitle_en || formData.subtitle || '',
        subtitle_en: formData.subtitle_en || formData.subtitle || '',
        subtitle_ta: formData.subtitle_ta || '',
        description: formData.description_en || formData.description || '',
        description_en: formData.description_en || formData.description || '',
        description_ta: formData.description_ta || '',
        imageUrl: formData.imageUrl || '/images/hero-campus.jpg',
        ctaText: formData.ctaText_en || formData.ctaText || 'Explore Admissions',
        ctaText_en: formData.ctaText_en || formData.ctaText || 'Explore Admissions',
        ctaText_ta: formData.ctaText_ta || '',
        ctaLink: formData.ctaLink || '/admissions',
        secondaryCtaText: formData.secondaryCtaText_en || formData.secondaryCtaText || '',
        secondaryCtaText_en: formData.secondaryCtaText_en || formData.secondaryCtaText || '',
        secondaryCtaText_ta: formData.secondaryCtaText_ta || '',
        secondaryCtaLink: formData.secondaryCtaLink || '',
        order: Number(formData.order) || (editingBanner ? editingBanner.order : banners.length + 1),
        status: formData.status || 'published',
        animationStyle: formData.animationStyle || 'fade',
      };

      const saved = await heroBannerRepository.save(bannerPayload);
      if (editingBanner) {
        setBanners((prev) =>
          prev
            .map((b) => (b.id === saved.id ? saved : b))
            .sort((a, b) => (a.order || 0) - (b.order || 0))
        );
        toast.success('Bilingual hero banner updated successfully!');
      } else {
        setBanners((prev) =>
          [...prev, saved].sort((a, b) => (a.order || 0) - (b.order || 0))
        );
        toast.success('New bilingual banner added to homepage carousel!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving banner:', err);
      toast.error('Failed to save banner.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await heroBannerRepository.delete(deleteTargetId);
      setBanners((prev) => prev.filter((b) => b.id !== deleteTargetId));
      toast.success('Banner deleted.');
      setDeleteTargetId(null);
    } catch (err) {
      console.error('Error deleting banner:', err);
      toast.error('Failed to delete banner.');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[index];
    newBanners[index] = newBanners[targetIndex];
    newBanners[targetIndex] = temp;

    newBanners.forEach((b, i) => {
      b.order = i + 1;
    });

    setBanners(newBanners);

    try {
      await Promise.all([
        heroBannerRepository.save(newBanners[index]),
        heroBannerRepository.save(newBanners[targetIndex]),
      ]);
      toast.success('Banner order updated.');
    } catch (err) {
      console.error('Error updating banner order:', err);
      toast.error('Failed to update order in database.');
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
              Homepage Hero Banner Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Bilingual (EN / தமிழ்)
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Manage animated homepage carousel banners with dedicated English and Tamil content.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Banner
        </Button>
      </div>

      {/* Banner Cards List */}
      <div className="space-y-4">
        {banners.map((banner, index) => {
          const hasTamil = Boolean(banner.title_ta || banner.description_ta);
          return (
            <Card
              key={banner.id}
              className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800"
            >
              {/* Banner Thumbnail & Visual Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                <div className="relative w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-950 flex-shrink-0 border border-slate-200 dark:border-slate-800">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[11px] font-bold">
                    #{banner.order}
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-900/40">
                      {banner.subtitle || 'S.U.M. School'}
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      Animation: {banner.animationStyle}
                    </span>
                    <Badge variant={banner.status === 'published' ? 'success' : 'outline'}>
                      {banner.status === 'published' ? 'Active / Live' : 'Draft'}
                    </Badge>
                    {hasTamil ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        தமிழ் + EN
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        EN Only
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                    {banner.title_en || banner.title}
                  </h3>

                  {banner.title_ta && (
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                      தமிழ்: {banner.title_ta}
                    </p>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {banner.description_en || banner.description}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-xs text-blue-700 dark:text-blue-400 font-medium">
                    <span className="flex items-center gap-1">
                      Primary CTA: <span className="underline">{banner.ctaText}</span> ({banner.ctaLink})
                    </span>
                    {banner.secondaryCtaText && (
                      <span className="text-slate-500 dark:text-slate-400">
                        • Secondary: {banner.secondaryCtaText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Ordering & Actions */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 bg-slate-50 dark:bg-slate-900">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition"
                    title="Move Up"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1.5 rounded hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition"
                    title="Move Down"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenPreview(banner)}
                  className="flex items-center gap-1 text-slate-700 dark:text-slate-300"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(banner)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTargetId(banner.id || null)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {banners.length === 0 && !isLoading && (
          <Card className="p-12 text-center text-slate-500">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">No Banners Found</h3>
            <p className="text-sm mt-1">Add a new hero banner to display on the homepage.</p>
          </Card>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Bilingual Homepage Banner' : 'Add Bilingual Homepage Banner'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
          {/* Language / Section Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-4 gap-2">
            <button
              type="button"
              onClick={() => setFormTab('en')}
              className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                formTab === 'en'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              English Content (EN) *
            </button>
            <button
              type="button"
              onClick={() => setFormTab('ta')}
              className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                formTab === 'ta'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Languages className="w-3.5 h-3.5 text-amber-500" />
              தமிழ் உள்ளடக்கம் (TA)
            </button>
            <button
              type="button"
              onClick={() => setFormTab('settings')}
              className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                formTab === 'settings'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Media &amp; Link Settings
            </button>
          </div>

          {/* Tab 1: English Content */}
          {formTab === 'en' && (
            <div className="space-y-4">
              <Input
                label="Banner Main Heading (English) *"
                placeholder="e.g. Inspiring Wisdom & Academic Excellence Since 1963"
                value={formData.title_en || formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title_en: e.target.value, title: e.target.value })
                }
                required
              />

              <Input
                label="Subtitle / Eyebrow Tag (English)"
                placeholder="e.g. Savariyappa Udaiyar Memorial Higher Secondary School"
                value={formData.subtitle_en || formData.subtitle || ''}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle_en: e.target.value, subtitle: e.target.value })
                }
              />

              <Textarea
                label="Banner Supporting Description (English)"
                placeholder="Write a clear, inspiring description of the school programs, values, and facilities."
                value={formData.description_en || formData.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description_en: e.target.value,
                    description: e.target.value,
                  })
                }
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary CTA Button Text (English)"
                  placeholder="e.g. Explore Admissions"
                  value={formData.ctaText_en || formData.ctaText || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, ctaText_en: e.target.value, ctaText: e.target.value })
                  }
                />

                <Input
                  label="Secondary Button Text (English)"
                  placeholder="e.g. View Campus Facilities"
                  value={formData.secondaryCtaText_en || formData.secondaryCtaText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      secondaryCtaText_en: e.target.value,
                      secondaryCtaText: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Tab 2: Tamil Content */}
          {formTab === 'ta' && (
            <div className="space-y-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/30">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold mb-2">
                தமிழ் மொழிபெயர்ப்பு (பயனர் தளத்தில் &quot;தமிழ்&quot; தேர்வு செய்யும்போது காண்பிக்கப்படும்)
              </div>

              <Input
                label="பதாகை முதன்மைத் தலைப்பு (தமிழ்)"
                placeholder="எ.கா. 1963 முதல் கல்விச் சிறப்பும் விழுமியங்களும் வளர்க்கும் உன்னத பள்ளி"
                value={formData.title_ta || ''}
                onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              />

              <Input
                label="துணைத் தலைப்பு / குறிச்சொல் (தமிழ்)"
                placeholder="எ.கா. சவரியப்ப உடையார் நினைவு மேல்நிலைப் பள்ளி • ராயப்பன்பட்டி"
                value={formData.subtitle_ta || ''}
                onChange={(e) => setFormData({ ...formData, subtitle_ta: e.target.value })}
              />

              <Textarea
                label="பதாகை விரிவான விளக்கம் (தமிழ்)"
                placeholder="பள்ளியின் வரலாறு, கல்வித் திட்டங்கள் மற்றும் விழுமியங்கள் குறித்த சுருக்கமான அறிமுகம்..."
                value={formData.description_ta || ''}
                onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
                rows={3}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="முதன்மை பொத்தான் உரை (தமிழ்)"
                  placeholder="எ.கா. சேர்க்கை விவரங்கள்"
                  value={formData.ctaText_ta || ''}
                  onChange={(e) => setFormData({ ...formData, ctaText_ta: e.target.value })}
                />

                <Input
                  label="இரண்டாம் நிலை பொத்தான் உரை (தமிழ்)"
                  placeholder="எ.கா. வளாக வசதிகள்"
                  value={formData.secondaryCtaText_ta || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaText_ta: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Tab 3: Media & Link Settings */}
          {formTab === 'settings' && (
            <div className="space-y-4">
              <ImageUpload
                label="Banner Background Image *"
                currentImageUrl={formData.imageUrl || ''}
                onImageSelect={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="banners"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary CTA Target Link"
                  placeholder="e.g. /admissions or #contact"
                  value={formData.ctaLink || ''}
                  onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                />

                <Input
                  label="Secondary Button Link"
                  placeholder="e.g. /facilities"
                  value={formData.secondaryCtaLink || ''}
                  onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Animation Style"
                  value={formData.animationStyle || 'fade'}
                  onChange={(e) =>
                    setFormData({ ...formData, animationStyle: e.target.value as BannerAnimationStyle })
                  }
                  options={[
                    { label: 'Fade In', value: 'fade' },
                    { label: 'Slide In', value: 'slide' },
                    { label: 'Zoom Out Reveal', value: 'zoom' },
                    { label: 'Floating Gentle Wave', value: 'float' },
                  ]}
                />

                <Input
                  label="Display Order"
                  type="number"
                  min={1}
                  value={formData.order || 1}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                />

                <Select
                  label="Status"
                  value={formData.status || 'published'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as HeroBanner['status'] })}
                  options={[
                    { label: 'Published (Active)', value: 'published' },
                    { label: 'Draft (Inactive)', value: 'draft' },
                  ]}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              {formData.title_ta ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Tamil translation provided
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">
                  Note: Tamil translation optional (will fallback to English)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Live Preview Modal */}
      {previewBanner && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Hero Banner Live Preview"
        >
          <div className="space-y-4">
            {/* Language preview toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Preview Language:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    previewLang === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('ta')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    previewLang === 'ta'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  தமிழ்
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 text-white min-h-[360px] flex items-center p-8 border border-slate-800 shadow-2xl">
              <Image
                src={previewBanner.imageUrl}
                alt={previewBanner.title}
                fill
                className="object-cover opacity-35"
              />
              <div className="relative z-10 max-w-xl space-y-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950">
                  {previewLang === 'ta'
                    ? previewBanner.subtitle_ta || previewBanner.subtitle || 'எஸ்.யு.எம். பள்ளி'
                    : previewBanner.subtitle_en || previewBanner.subtitle || 'S.U.M. School, Royappanpatti'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight text-white">
                  {previewLang === 'ta'
                    ? previewBanner.title_ta || previewBanner.title
                    : previewBanner.title_en || previewBanner.title}
                </h2>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {previewLang === 'ta'
                    ? previewBanner.description_ta || previewBanner.description
                    : previewBanner.description_en || previewBanner.description}
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold">
                    {previewLang === 'ta'
                      ? previewBanner.ctaText_ta || previewBanner.ctaText
                      : previewBanner.ctaText_en || previewBanner.ctaText}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  {(previewBanner.secondaryCtaText || previewBanner.secondaryCtaText_ta) && (
                    <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                      {previewLang === 'ta'
                        ? previewBanner.secondaryCtaText_ta || previewBanner.secondaryCtaText
                        : previewBanner.secondaryCtaText_en || previewBanner.secondaryCtaText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Banner"
        message="Are you sure you want to delete this homepage hero banner?"
        confirmLabel="Delete Banner"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
