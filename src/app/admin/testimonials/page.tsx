'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { defaultTestimonials } from '@/lib/defaultData';
import { Testimonial } from '@/types';
import { testimonialRepository } from '@/lib/repositories';
import { Plus, Edit2, Trash2, MessageSquareQuote, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    message: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    status: 'published',
  });

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await testimonialRepository.getAll();
      setTestimonials(data || []);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      toast.error('Failed to load testimonials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    testimonialRepository.getAll().then((data) => {
      if (isMounted) {
        setTestimonials(data || []);
        setIsLoading(false);
      }
    }).catch((error) => {
      if (isMounted) {
        console.error('Failed to load testimonials:', error);
        toast.error('Failed to load testimonials.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: '',
      message: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: 5,
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast.error('Please enter name and message.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingItem) {
        await testimonialRepository.update(editingItem.id!, formData);
        toast.success('Testimonial updated successfully!');
      } else {
        const newEntry = {
          name: formData.name || 'Anonymous',
          role: formData.role || 'Parent',
          message: formData.message || '',
          photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          rating: formData.rating || 5,
          status: (formData.status as 'published' | 'draft') || 'published',
          order: testimonials.length + 1,
        };
        await testimonialRepository.create(newEntry as Omit<Testimonial, 'id'>);
        toast.success('New testimonial added!');
      }
      await loadTestimonials();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save testimonial.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await testimonialRepository.delete(deleteTargetId);
      toast.success('Testimonial removed.');
      await loadTestimonials();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete testimonial.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const columns: Column<Testimonial>[] = [
    {
      header: 'Reviewer',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.photoUrl}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
            <div className="text-xs text-slate-400">{item.role}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Message Excerpt',
      cell: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic max-w-sm">
          &ldquo;{item.message}&rdquo;
        </span>
      ),
    },
    {
      header: 'Rating',
      cell: (item) => (
        <div className="flex items-center text-amber-400">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
          ))}
        </div>
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
            <MessageSquareQuote className="w-6 h-6 text-blue-600" />
            Testimonials &amp; Reviews Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Curate parent reflections, alumni endorsements, and student feedback.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Testimonial
        </Button>
      </div>

      <DataTable
        data={testimonials}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search reviewer name..."
        onAddClick={handleOpenAdd}
        addLabel="Add Testimonial"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Reviewer Full Name"
            required
            placeholder="e.g. Mr. P. Muthukumar"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Role / Designation"
            required
            placeholder="e.g. Parent of 10th Standard Scholar"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />

          <ImageUpload
            label="Reviewer Photo (Optional)"
            folder="testimonials"
            currentImageUrl={formData.photoUrl}
            onImageUploaded={(url) => setFormData({ ...formData, photoUrl: url })}
          />

          <Textarea
            label="Testimonial Quote"
            rows={4}
            required
            placeholder="Share feedback on school culture, teachers, and student development"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {editingItem ? 'Save Changes' : 'Add Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial?"
        description="Are you sure you want to remove this review?"
      />
    </div>
  );
}
