'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { announcementRepository } from '@/lib/repositories';
import { defaultAnnouncements } from '@/lib/defaultData';
import { Announcement } from '@/types';
import { Plus, Edit2, Trash2, Bell, Languages } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formTab, setFormTab] = useState<'en' | 'ta' | 'meta'>('en');

  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    title_en: '',
    title_ta: '',
    description: '',
    description_en: '',
    description_ta: '',
    content: '',
    content_en: '',
    content_ta: '',
    category: 'general',
    status: 'published',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    attachmentUrl: '',
    featured: false,
  });

  const handleOpenAdd = () => {
    setEditingAnnouncement(null);
    setFormTab('en');
    setFormData({
      title: '',
      title_en: '',
      title_ta: '',
      description: '',
      description_en: '',
      description_ta: '',
      content: '',
      content_en: '',
      content_ta: '',
      category: 'general',
      status: 'published',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      attachmentUrl: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnnouncement(ann);
    setFormTab('en');
    setFormData({
      ...ann,
      title: ann.title_en || ann.title || '',
      title_en: ann.title_en || ann.title || '',
      title_ta: ann.title_ta || '',
      description: ann.description_en || ann.description || '',
      description_en: ann.description_en || ann.description || '',
      description_ta: ann.description_ta || '',
      content: ann.content_en || ann.content || '',
      content_en: ann.content_en || ann.content || '',
      content_ta: ann.content_ta || '',
    });
    setIsModalOpen(true);
  };

  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await announcementRepository.getAll();
      setAnnouncements(data || []);
    } catch (err) {
      console.warn('Error loading announcements:', err);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    announcementRepository.getAll().then((data) => {
      if (isMounted) {
        setAnnouncements(data || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.warn('Error loading announcements:', err);
        toast.error('Failed to load announcements');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const primaryTitle = formData.title_en || formData.title || '';
    if (!primaryTitle) {
      toast.error('Please enter announcement title.');
      return;
    }

    const payload: Announcement = {
      ...(editingAnnouncement || {}),
      id: editingAnnouncement ? editingAnnouncement.id : `ann-${Date.now()}`,
      title: primaryTitle,
      title_en: primaryTitle,
      title_ta: formData.title_ta || '',
      description: formData.description_en || formData.description || '',
      description_en: formData.description_en || formData.description || '',
      description_ta: formData.description_ta || '',
      content: formData.content_en || formData.content || '',
      content_en: formData.content_en || formData.content || '',
      content_ta: formData.content_ta || '',
      category: formData.category || 'general',
      status: formData.status || 'published',
      imageUrl: formData.imageUrl || '',
      attachmentUrl: formData.attachmentUrl || '',
      attachmentName: formData.attachmentName || '',
      featured: Boolean(formData.featured),
      date: editingAnnouncement ? editingAnnouncement.date : new Date(),
    };

    try {
      if (editingAnnouncement && editingAnnouncement.id) {
        await announcementRepository.update(editingAnnouncement.id, payload);
        toast.success('Bilingual announcement updated successfully!');
      } else {
        await announcementRepository.create(payload as Omit<Announcement, 'id'>);
        toast.success('New bilingual announcement published!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving announcement:', err);
      toast.error('Failed to save announcement to database. Changes saved locally only.');
      // Local fallback
      if (editingAnnouncement) {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === editingAnnouncement.id ? payload : a))
        );
      } else {
        setAnnouncements((prev) => [payload, ...prev]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await announcementRepository.delete(deleteTargetId);
      toast.success('Announcement removed.');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete announcement from database. Removed locally only.');
      setAnnouncements((prev) => prev.filter((a) => a.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const columns: Column<Announcement>[] = [
    {
      header: 'Title & Notice',
      cell: (item) => {
        const hasTamil = Boolean(item.title_ta || item.content_ta);
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white line-clamp-1">
                {item.title_en || item.title}
              </span>
              {hasTamil ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                  தமிழ் + EN
                </span>
              ) : (
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded shrink-0">
                  EN
                </span>
              )}
            </div>
            {item.title_ta && (
              <div className="text-xs text-amber-800 dark:text-amber-400 line-clamp-1">
                தமிழ்: {item.title_ta}
              </div>
            )}
            <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {item.description_en || item.description}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category',
      cell: (item) => <Badge variant="primary">{item.category.toUpperCase()}</Badge>,
    },
    {
      header: 'Date',
      cell: (item) => {
        try {
          const rawDate = item.date as { toDate?: () => Date } | Date | string | number | undefined;
          const d = rawDate && typeof rawDate === 'object' && 'toDate' in rawDate && typeof rawDate.toDate === 'function'
            ? rawDate.toDate()
            : rawDate instanceof Date
            ? rawDate
            : new Date((rawDate as string | number) || Date.now());
          return <span className="text-xs text-slate-500">{format(d, 'dd MMM yyyy')}</span>;
        } catch {
          return <span className="text-xs text-slate-500">Recent</span>;
        }
      },
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
          {item.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || null)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-600 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Notices &amp; School Circulars
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create, manage, and publish school circulars with bilingual English and Tamil text.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Publish Notice
        </Button>
      </div>

      <DataTable
        data={announcements}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search notices..."
        onAddClick={handleOpenAdd}
        addLabel="New Notice"
        isLoading={isLoading}
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnnouncement ? 'Edit Bilingual Announcement' : 'Publish Bilingual School Circular'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {/* Form Tabs */}
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
              English Notice (EN) *
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
              தமிழ் அறிவிப்பு (TA)
            </button>
            <button
              type="button"
              onClick={() => setFormTab('meta')}
              className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
                formTab === 'meta'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Category &amp; Media
            </button>
          </div>

          {/* Tab 1: English Content */}
          {formTab === 'en' && (
            <div className="space-y-4">
              <Input
                label="Notice Title (English) *"
                required
                placeholder="e.g. Schedule of Annual Board Examinations"
                value={formData.title_en || formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title_en: e.target.value, title: e.target.value })
                }
              />

              <Input
                label="Short Summary / Excerpt (English)"
                placeholder="Brief excerpt for card preview"
                value={formData.description_en || formData.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description_en: e.target.value,
                    description: e.target.value,
                  })
                }
              />

              <Textarea
                label="Detailed Circular Text (English) *"
                rows={5}
                required
                placeholder="Complete announcement information, dates, instructions, or rules"
                value={formData.content_en || formData.content || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content_en: e.target.value,
                    content: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* Tab 2: Tamil Content */}
          {formTab === 'ta' && (
            <div className="space-y-4 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-200 dark:border-amber-900/30">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                தமிழ் மொழிபெயர்ப்பு (பயனர் தளத்தில் &quot;தமிழ்&quot; தேர்வு செய்யும்போது காண்பிக்கப்படும்)
              </div>

              <Input
                label="அறிவிப்பு முதன்மைத் தலைப்பு (தமிழ்)"
                placeholder="எ.கா. அரசு பொதுத்தேர்வு கால அட்டவணை வெளியீடு"
                value={formData.title_ta || ''}
                onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              />

              <Input
                label="சுருக்கமான குறிப்பு (தமிழ்)"
                placeholder="அறிவிப்பு அட்டையின் சுருக்கமான விபரம்..."
                value={formData.description_ta || ''}
                onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
              />

              <Textarea
                label="முழுமையான சுற்றறிக்கை விபரம் (தமிழ்)"
                rows={5}
                placeholder="அனைத்து விபரங்கள், தேதிகள், நடைமுறைகள் மற்றும் அறிவுரைகள்..."
                value={formData.content_ta || ''}
                onChange={(e) => setFormData({ ...formData, content_ta: e.target.value })}
              />
            </div>
          )}

          {/* Tab 3: Category & Media */}
          {formTab === 'meta' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Announcement Category"
                  options={[
                    { value: 'general', label: 'General Announcement' },
                    { value: 'admission', label: 'Admission Notification' },
                    { value: 'exam', label: 'Examination Schedule' },
                    { value: 'holiday', label: 'Holiday Circular' },
                    { value: 'circular', label: 'Official Management Circular' },
                  ]}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Announcement['category'] })}
                />

                <Select
                  label="Publish Status"
                  options={[
                    { value: 'published', label: 'Published (Visible Publicly)' },
                    { value: 'draft', label: 'Draft (Admin Only)' },
                  ]}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Announcement['status'] })}
                />
              </div>

              <ImageUpload
                label="Featured Image (Optional)"
                folder="announcements"
                currentImageUrl={formData.imageUrl}
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              {formData.title_ta ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Tamil translation provided
                </span>
              ) : (
                <span className="text-amber-600 font-semibold">
                  Tamil translation optional (will fallback to English)
                </span>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingAnnouncement ? 'Save Changes' : 'Publish Notice'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Announcement?"
        description="Are you sure you want to delete this notice? It will no longer appear on the public website."
      />
    </div>
  );
}
