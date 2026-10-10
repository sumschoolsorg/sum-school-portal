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
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { achievementRepository, announcementRepository } from '@/lib/repositories';
import { Achievement, Announcement } from '@/types';
import { Plus, Edit2, Trash2, Trophy, Star, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Achievement | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: '',
    title_ta: '',
    description: '',
    description_ta: '',
    category: 'topper',
    studentName: '',
    studentName_ta: '',
    className: '12th HSC (Science)',
    academicYear: '2024–2025',
    examinationName: 'Tamil Nadu Higher Secondary Public Examination',
    totalMarks: 580,
    totalMaxMarks: 600,
    percentage: 96.67,
    rank: '1st Rank (School Topper)',
    hometown: 'Royappanpatti',
    imageUrl: '/images/faculty-1.jpg',
    certificateUrl: '',
    status: 'published',
    isFeatured: true,
  });

  const [broadcastAnnouncement, setBroadcastAnnouncement] = useState(true);

  const loadAchievements = useCallback(async () => {
    try {
      const data = await achievementRepository.getAll();
      setAchievements(data || []);
    } catch (err) {
      console.error('Error loading achievements:', err);
      toast.error('Failed to load achievements from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    achievementRepository.getAll().then((data) => {
      if (isMounted) {
        setAchievements(data || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading achievements:', err);
        toast.error('Failed to load achievements from database.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarksChange = (obtained: number, max: number) => {
    const pct = max > 0 ? parseFloat(((obtained / max) * 100).toFixed(2)) : 0;
    setFormData((prev) => ({
      ...prev,
      totalMarks: obtained,
      totalMaxMarks: max,
      percentage: pct,
    }));
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setBroadcastAnnouncement(true);
    setFormData({
      title: 'Class 12 (HSC) School Topper',
      title_ta: '12-ஆம் வகுப்பு பள்ளி முதலிடம்',
      description: 'Scored top marks in Tamil Nadu Higher Secondary Public Examination.',
      description_ta: 'தமிழ்நாடு மேல்நிலைப் பொதுத்தேர்வில் அதிக மதிப்பெண்கள் பெற்று சாதனை.',
      category: 'topper',
      studentName: '',
      studentName_ta: '',
      className: '12th HSC (Science)',
      academicYear: '2024–2025',
      examinationName: 'Tamil Nadu Higher Secondary Public Examination',
      totalMarks: 580,
      totalMaxMarks: 600,
      percentage: 96.67,
      rank: '1st Rank (School Topper)',
      hometown: 'Royappanpatti',
      imageUrl: '/images/faculty-1.jpg',
      certificateUrl: '',
      status: 'published',
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingItem(ach);
    setBroadcastAnnouncement(false);
    setFormData(ach);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.studentName) {
      toast.error('Please enter achievement title and student name.');
      return;
    }

    try {
      if (editingItem && editingItem.id) {
        await achievementRepository.update(editingItem.id, formData);
        toast.success('Achievement updated successfully!');
      } else {
        await achievementRepository.create({
          ...formData,
          date: new Date(),
        });

        // Optionally broadcast notification as live announcement (Feature 7)
        if (broadcastAnnouncement && formData.status === 'published') {
          try {
            await announcementRepository.create({
              title: `Student Achievement: ${formData.studentName} secured ${formData.rank || 'Honors'} (${formData.academicYear})`,
              title_en: `Student Achievement: ${formData.studentName} secured ${formData.rank || 'Honors'} (${formData.academicYear})`,
              title_ta: `மாணவர் சாதனை: ${formData.studentName_ta || formData.studentName} — ${formData.rank || 'முதலிடம்'} (${formData.academicYear})`,
              description: `${formData.studentName} from ${formData.hometown || 'Royappanpatti'} scored ${formData.totalMarks || ''}/${formData.totalMaxMarks || ''} (${formData.percentage}%) in ${formData.className || 'Board Exam'}.`,
              description_en: `${formData.studentName} from ${formData.hometown || 'Royappanpatti'} scored ${formData.totalMarks || ''}/${formData.totalMaxMarks || ''} (${formData.percentage}%) in ${formData.className || 'Board Exam'}.`,
              description_ta: `${formData.studentName_ta || formData.studentName} பொதுத்தேர்வில் ${formData.totalMarks || ''}/${formData.totalMaxMarks || ''} பெற்று பள்ளிக்கு பெருமை சேர்த்துள்ளார்.`,
              category: 'general',
              status: 'published',
              featured: true,
              date: new Date(),
              imageUrl: formData.imageUrl || '/images/hero-campus.jpg',
            } as Omit<Announcement, 'id'>);
            toast.info('Broadcast announcement created automatically on live header ticker!');
          } catch (annErr) {
            console.warn('Could not broadcast announcement:', annErr);
          }
        }

        toast.success('Verified achievement published successfully!');
      }
      setIsModalOpen(false);
      loadAchievements();
    } catch (err) {
      console.error('Save achievement error:', err);
      toast.error('Failed to save achievement record.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await achievementRepository.delete(deleteTargetId);
      toast.success('Achievement removed.');
      setDeleteTargetId(null);
      loadAchievements();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete achievement.');
    }
  };

  const columns: Column<Achievement>[] = [
    {
      header: 'Student & Achievement',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{item.studentName || item.teamName || item.title}</span>
              {item.isFeatured && (
                <span title="Featured Spotlight">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </span>
              )}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.title}</div>
            <div className="text-[11px] text-slate-400">{item.className} • {item.academicYear}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Marks & Percentage',
      cell: (item) => (
        <div>
          {item.percentage ? (
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 dark:text-white">{item.percentage}%</span>
              {item.totalMarks && (
                <span className="text-xs text-slate-400">({item.totalMarks}/{item.totalMaxMarks || 600})</span>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
          {item.hometown && (
            <div className="text-[11px] text-slate-500">📍 {item.hometown}</div>
          )}
        </div>
      ),
    },
    {
      header: 'Rank / Category',
      cell: (item) => (
        <div className="space-y-1">
          <Badge variant="accent">{item.rank || item.category.toUpperCase()}</Badge>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">{item.category}</div>
        </div>
      ),
    },
    {
      header: 'Approval Status',
      cell: (item) => (
        <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
          {item.status === 'published' ? 'VERIFIED & LIVE' : 'DRAFT'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Edit Achievement"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Student Achievements & Toppers Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish verified top rankers, marks, percentages, hometowns, and academic laurels with admin approval.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Student Achievement
        </Button>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={achievements}
          searchKey="studentName"
          searchPlaceholder="Search by student name or class..."
          isLoading={isLoading}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Verified Student Achievement' : 'Publish Verified Student Achievement'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Name (English)"
              required
              value={formData.studentName || ''}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. M. Anitha Mary"
            />
            <Input
              label="Student Name (Tamil)"
              value={formData.studentName_ta || ''}
              onChange={(e) => setFormData({ ...formData, studentName_ta: e.target.value })}
              placeholder="எ.கா: எம். அனிதா மேரி"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Achievement Title (English)"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Class 12 Science Stream — School 1st Rank"
            />
            <Input
              label="Achievement Title (Tamil)"
              value={formData.title_ta || ''}
              onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              placeholder="எ.கா: 12-ஆம் வகுப்பு அறிவியல் பிரிவு — பள்ளி முதலிடம்"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Class / Standard"
              value={formData.className || '12th HSC (Science)'}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              options={[
                { value: '12th HSC (Science)', label: '12th HSC (Science Group)' },
                { value: '12th HSC (Commerce)', label: '12th HSC (Commerce Group)' },
                { value: '11th Standard', label: '11th Standard' },
                { value: '10th SSLC', label: '10th Standard (SSLC)' },
                { value: 'Primary School (1st-5th)', label: 'Primary School (1st–5th)' },
                { value: 'Middle School (6th-8th)', label: 'Middle School (6th–8th)' },
                { value: 'Sports Squad', label: 'Sports & Athletics Squad' },
              ]}
            />

            <Select
              label="Academic Year"
              value={formData.academicYear || '2024–2025'}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              options={[
                { value: '2025–2026', label: '2025–2026 (Current)' },
                { value: '2024–2025', label: '2024–2025' },
                { value: '2023–2024', label: '2023–2024' },
                { value: '2022–2023', label: '2022–2023 (Diamond Jubilee)' },
                { value: '2021–2022', label: '2021–2022' },
              ]}
            />

            <Select
              label="Achievement Category"
              value={formData.category || 'topper'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Achievement['category'] })}
              options={[
                { value: 'topper', label: 'Board Exam Topper' },
                { value: 'academic', label: 'Academic & Subject Centum' },
                { value: 'sports', label: 'Sports & Athletics Champion' },
                { value: 'cultural', label: 'Cultural & Tamil Mandram' },
                { value: 'competition', label: 'Olympiad & Science Expo' },
                { value: 'award', label: 'Special Institutional Award' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Marks Obtained"
              type="number"
              value={formData.totalMarks || 0}
              onChange={(e) => handleMarksChange(Number(e.target.value), formData.totalMaxMarks || 600)}
            />
            <Input
              label="Maximum Marks"
              type="number"
              value={formData.totalMaxMarks || 600}
              onChange={(e) => handleMarksChange(formData.totalMarks || 0, Number(e.target.value))}
            />
            <Input
              label="Percentage (%)"
              type="number"
              step="0.01"
              value={formData.percentage || 0}
              onChange={(e) => setFormData({ ...formData, percentage: parseFloat(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Rank / Position"
              value={formData.rank || ''}
              onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
              placeholder="e.g. 1st Rank (School Topper), District 2nd"
            />
            <Input
              label="Student's Hometown"
              value={formData.hometown || ''}
              onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
              placeholder="e.g. Royappanpatti, Cumbum, Theni"
            />
          </div>

          <Input
            label="Examination Name"
            value={formData.examinationName || ''}
            onChange={(e) => setFormData({ ...formData, examinationName: e.target.value })}
            placeholder="e.g. Tamil Nadu Higher Secondary Public Examination"
          />

          <ImageUpload
            label="Student Photograph URL"
            value={formData.imageUrl || ''}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Textarea
            label="Achievement Description (English)"
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter achievements details, centum subjects, certificates earned..."
          />

          <Textarea
            label="Achievement Description (Tamil)"
            rows={2}
            value={formData.description_ta || ''}
            onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
            placeholder="சாதனை விவரங்கள் (தமிழ்)..."
          />

          {/* Verification & Spotlight Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Verification & Approval Status:
              </label>
              <Select
                value={formData.status || 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Achievement['status'] })}
                options={[
                  { value: 'published', label: 'Approved & Publicly Published' },
                  { value: 'draft', label: 'Draft / Pending Admin Verification' },
                ]}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Feature in Homepage &quot;Student &amp; Achievement Spotlight&quot; Carousel
              </label>
            </div>

            {!editingItem && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="broadcastAnnouncement"
                  checked={broadcastAnnouncement}
                  onChange={(e) => setBroadcastAnnouncement(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="broadcastAnnouncement" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" />
                  Automatically broadcast as live scrolling announcement on website header
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Save Updates' : 'Publish Verified Achievement'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Remove Achievement Record?"
        message="Are you sure you want to remove this achievement? This record will no longer appear on the public achievements directory."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
