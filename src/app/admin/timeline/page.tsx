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
import { timelineRepository } from '@/lib/repositories';
import { defaultTimelineEntries } from '@/lib/defaultData';
import { TimelineEntry } from '@/types';
import { Plus, Edit2, Trash2, Milestone, Calendar, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';

export default function TimelineAdminPage() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineEntry | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TimelineEntry>>({
    year: '2026',
    title: '',
    title_ta: '',
    description: '',
    description_ta: '',
    category: 'milestone',
    imageUrl: '/images/hero-campus.jpg',
    order: 1,
    status: 'published',
  });

  const loadEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await timelineRepository.getAll();
      if (data && data.length > 0) {
        setEntries(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setEntries(defaultTimelineEntries);
      }
    } catch (err) {
      console.error('Error loading timeline:', err);
      toast.error('Failed to load timeline entries.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    timelineRepository.getAll().then((data) => {
      if (!isMounted) return;
      if (data && data.length > 0) {
        setEntries(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } else {
        setEntries(defaultTimelineEntries);
      }
    }).catch((err) => {
      console.error('Error loading timeline:', err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      year: '2026',
      title: '',
      title_ta: '',
      description: '',
      description_ta: '',
      category: 'milestone',
      imageUrl: '/images/hero-campus.jpg',
      order: entries.length + 1,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (entry: TimelineEntry) => {
    setEditingItem(entry);
    setFormData(entry);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.year || !formData.title) {
      toast.error('Please enter milestone year and title.');
      return;
    }

    try {
      if (editingItem && editingItem.id) {
        await timelineRepository.update(editingItem.id, formData);
        toast.success('Timeline milestone updated!');
      } else {
        await timelineRepository.create({
          ...formData,
          createdAt: new Date(),
        });
        toast.success('New milestone added to school journey!');
      }
      setIsModalOpen(false);
      loadEntries();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save timeline milestone.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await timelineRepository.delete(deleteTargetId);
      toast.success('Timeline milestone removed.');
      setDeleteTargetId(null);
      loadEntries();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete milestone.');
    }
  };

  const columns: Column<TimelineEntry>[] = [
    {
      header: 'Year & Milestone',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-xs shrink-0">
            {item.year}
          </span>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
            {item.title_ta && (
              <div className="text-xs text-slate-400">{item.title_ta}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => <Badge variant="accent">{(item.category || 'Milestone').toUpperCase()}</Badge>,
    },
    {
      header: 'Display Order',
      accessorKey: 'order',
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
          {item.status?.toUpperCase() || 'PUBLISHED'}
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
            title="Edit Milestone"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Milestone"
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
            <Milestone className="w-6 h-6 text-indigo-600" />
            School Journey Timeline Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curate chronological milestones from 1963 founding to modern digital campus expansions.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Timeline Milestone
        </Button>
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={entries}
          searchKey="title"
          searchPlaceholder="Search milestone title or year..."
          isLoading={isLoading}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Timeline Milestone' : 'Add School Journey Milestone'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Year / Period"
              required
              value={formData.year || ''}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="e.g. 1963 or 2025–2026"
            />
            <Select
              label="Milestone Category"
              value={formData.category || 'milestone'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TimelineEntry['category'] })}
              options={[
                { value: 'founding', label: 'Foundation & Heritage' },
                { value: 'milestone', label: 'Key Milestone' },
                { value: 'infrastructure', label: 'Campus Infrastructure' },
                { value: 'academics', label: 'Academic Accreditation' },
                { value: 'jubilee', label: 'Diamond Jubilee Celebration' },
              ]}
            />
            <Input
              label="Order Index"
              type="number"
              value={formData.order || 1}
              onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Milestone Title (English)"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Upgrade to Higher Secondary (+2)"
            />
            <Input
              label="Milestone Title (Tamil)"
              value={formData.title_ta || ''}
              onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              placeholder="எ.கா: மேல்நிலைப் பள்ளியாக தரம் உயர்த்துதல் (+2)"
            />
          </div>

          <ImageUpload
            label="Historic / Commemorative Photo URL"
            value={formData.imageUrl || ''}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Textarea
            label="Description (English)"
            rows={3}
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed narrative about this historical milestone..."
          />

          <Textarea
            label="Description (Tamil)"
            rows={2}
            value={formData.description_ta || ''}
            onChange={(e) => setFormData({ ...formData, description_ta: e.target.value })}
            placeholder="மைல்கல் விளக்கம் (தமிழ்)..."
          />

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Publish Status:
            </label>
            <Select
              value={formData.status || 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TimelineEntry['status'] })}
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Save Changes' : 'Add Milestone'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Milestone?"
        message="Are you sure you want to remove this historical milestone from the school journey?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
