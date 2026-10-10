'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { galleryRepository, announcementRepository } from '@/lib/repositories';
import { GalleryImage, Announcement } from '@/types';
import { Plus, Edit2, Trash2, Image as ImageIcon, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Filters
  const [filterYear, setFilterYear] = useState('all');
  const [broadcastAnnouncement, setBroadcastAnnouncement] = useState(true);

  // Form State
  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    title: '',
    title_ta: '',
    albumName: 'Campus Life',
    albumId: 'campus',
    description: '',
    description_ta: '',
    imageUrl: '/images/hero-campus.jpg',
    academicYear: '2024–2025',
    calendarYear: 2024,
    month: 'June',
    eventCategory: 'Campus Life',
    eventDate: new Date().toISOString().split('T')[0],
    status: 'published',
    isFeatured: true,
  });

  const loadGallery = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await galleryRepository.getAll();
      setImages(data || []);
    } catch (err) {
      console.error('Error loading gallery images:', err);
      toast.error('Failed to load gallery images from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    galleryRepository.getAll().then((data) => {
      if (isMounted) {
        setImages(data || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading gallery images:', err);
        toast.error('Failed to load gallery images from database.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingImage(null);
    setBroadcastAnnouncement(true);
    setFormData({
      title: '',
      title_ta: '',
      albumName: 'Campus Life',
      albumId: 'campus',
      description: '',
      description_ta: '',
      imageUrl: '/images/hero-campus.jpg',
      academicYear: '2024–2025',
      calendarYear: 2024,
      month: 'June',
      eventCategory: 'Campus Life',
      eventDate: new Date().toISOString().split('T')[0],
      status: 'published',
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setBroadcastAnnouncement(false);
    setFormData(img);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      toast.error('Please provide a photo title and image.');
      return;
    }

    try {
      if (editingImage && editingImage.id) {
        await galleryRepository.update(editingImage.id, formData);
        toast.success('Gallery photo updated successfully!');
      } else {
        await galleryRepository.create({
          ...formData,
          createdAt: new Date(),
        });

        // Broadcast announcement if selected
        if (broadcastAnnouncement && formData.status === 'published') {
          try {
            await announcementRepository.create({
              title: `New Gallery Photos Added: ${formData.albumName || formData.title}`,
              title_en: `New Gallery Photos Added: ${formData.albumName || formData.title}`,
              title_ta: `புதிய புகைப்படங்கள் பதிவேற்றம்: ${formData.title_ta || formData.title} (${formData.academicYear || ''})`,
              description: `View latest school photographs from ${formData.month || ''} ${formData.calendarYear || ''} in the school gallery.`,
              description_en: `View latest school photographs from ${formData.month || ''} ${formData.calendarYear || ''} in the school gallery.`,
              description_ta: `பள்ளியின் புதிய புகைப்படத் தொகுப்பை எங்கள் புகைப்படக் கூடத்தில் பாருங்கள்.`,
              category: 'general',
              status: 'published',
              featured: true,
              date: new Date(),
              imageUrl: formData.imageUrl,
            } as Omit<Announcement, 'id'>);
            toast.info('Live notification ticker updated!');
          } catch (annErr) {
            console.warn('Could not broadcast announcement:', annErr);
          }
        }

        toast.success('New photo published to gallery!');
      }
      setIsModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error('Gallery save error:', err);
      toast.error('Failed to save gallery photo.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await galleryRepository.delete(deleteTargetId);
      toast.success('Photo removed from gallery.');
      setDeleteTargetId(null);
      loadGallery();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete photo.');
    }
  };

  const filteredImages = filterYear === 'all'
    ? images
    : images.filter((img) => img.academicYear === filterYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            Year-Wise & Month-Wise Gallery Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload school photos, organize by academic year and month, and broadcast live event albums.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Upload Photo / Album
        </Button>
      </div>

      {/* Year Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Filter Year:
        </span>
        {['all', '2025–2026', '2024–2025', '2023–2024', '2022–2023'].map((yr) => (
          <button
            key={yr}
            onClick={() => setFilterYear(yr)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              filterYear === yr
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {yr === 'all' ? 'All Years' : yr}
          </button>
        ))}
      </div>

      {/* Grid of Images */}
      {isLoading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-medium">Loading gallery...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((img) => (
            <Card key={img.id} className="p-3 overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    {img.academicYear && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white font-bold text-[10px] backdrop-blur-md">
                        {img.academicYear}
                      </span>
                    )}
                    {img.month && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px]">
                        {img.month}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {img.title}
                    </h3>
                    <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      {img.albumName || img.eventCategory}
                    </div>
                  </div>
                  <Badge variant={img.status === 'published' ? 'success' : 'neutral'} className="text-[10px] shrink-0">
                    {img.status === 'published' ? 'LIVE' : 'DRAFT'}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{img.eventDate || 'Uploaded'}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(img)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
                    title="Edit Photo"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetId(img.id || '')}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingImage ? 'Edit Gallery Photo' : 'Upload School Photo / Album Entry'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Photo Title (English)"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Science Exhibition 2024"
            />
            <Input
              label="Photo Title (Tamil)"
              value={formData.title_ta || ''}
              onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              placeholder="எ.கா: அறிவியல் கண்காட்சி 2024"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Academic Year"
              value={formData.academicYear || '2024–2025'}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              options={[
                { value: '2025–2026', label: '2025–2026' },
                { value: '2024–2025', label: '2024–2025' },
                { value: '2023–2024', label: '2023–2024' },
                { value: '2022–2023', label: '2022–2023 (Diamond Jubilee)' },
                { value: '2021–2022', label: '2021–2022' },
              ]}
            />

            <Select
              label="Calendar Month"
              value={formData.month || 'June'}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              options={[
                { value: 'January', label: 'January' },
                { value: 'February', label: 'February' },
                { value: 'March', label: 'March' },
                { value: 'April', label: 'April' },
                { value: 'May', label: 'May' },
                { value: 'June', label: 'June' },
                { value: 'July', label: 'July' },
                { value: 'August', label: 'August' },
                { value: 'September', label: 'September' },
                { value: 'October', label: 'October' },
                { value: 'November', label: 'November' },
                { value: 'December', label: 'December' },
              ]}
            />

            <Select
              label="Event Category"
              value={formData.eventCategory || 'Campus Life'}
              onChange={(e) => setFormData({ ...formData, eventCategory: e.target.value })}
              options={[
                { value: 'Campus Life', label: 'Campus Life' },
                { value: 'Sports Meet', label: 'Sports Meet & Athletics' },
                { value: 'Annual Day', label: 'Annual Day & Cultural' },
                { value: 'Science Expo', label: 'Science Expo & Labs' },
                { value: 'Celebrations', label: 'Celebrations & Festivals' },
                { value: 'Academics', label: 'Academics & Classrooms' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Album Name"
              value={formData.albumName || ''}
              onChange={(e) => setFormData({ ...formData, albumName: e.target.value })}
              placeholder="e.g. Sports Day 2024"
            />
            <Input
              label="Event Date"
              type="date"
              value={formData.eventDate || ''}
              onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            />
          </div>

          <ImageUpload
            label="Photo URL"
            value={formData.imageUrl || ''}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Textarea
            label="Description (English)"
            rows={2}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the moment or event captured in the photo..."
          />

          <Textarea
            label="Description (Tamil)"
            rows={2}
            value={formData.description_ta || ''}
            onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
            placeholder="புகைப்பட விவரம் (தமிழ்)..."
          />

          {/* Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Publish Status:
              </label>
              <Select
                value={formData.status || 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                options={[
                  { value: 'published', label: 'Publicly Published' },
                  { value: 'draft', label: 'Draft' },
                ]}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="galleryFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="galleryFeatured" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Set as Featured Album Photo
              </label>
            </div>

            {!editingImage && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="broadcastGalleryNotice"
                  checked={broadcastAnnouncement}
                  onChange={(e) => setBroadcastAnnouncement(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="broadcastGalleryNotice" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" />
                  Automatically announce &quot;New Photos Uploaded&quot; on website header ticker
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingImage ? 'Save Changes' : 'Publish to Gallery'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Photo?"
        message="Are you sure you want to delete this photograph from the school gallery?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
