'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Facility } from '@/types';
import { facilityRepository } from '@/lib/repositories';
import { Plus, Edit2, Trash2, Building2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FacilitiesAdminPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Facility>>({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    icon: 'MonitorPlay',
    status: 'published',
  });

  const loadFacilities = async () => {
    try {
      setIsLoading(true);
      const data = await facilityRepository.getAll();
      setFacilities(data || []);
    } catch (error) {
      console.error('Failed to load facilities:', error);
      toast.error('Failed to load facilities.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    facilityRepository.getAll().then((data) => {
      if (isMounted) {
        setFacilities(data || []);
        setIsLoading(false);
      }
    }).catch((error) => {
      if (isMounted) {
        console.error('Failed to load facilities:', error);
        toast.error('Failed to load facilities.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingFacility(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
      icon: 'MonitorPlay',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac: Facility) => {
    setEditingFacility(fac);
    setFormData(fac);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter facility title.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingFacility) {
        await facilityRepository.update(editingFacility.id!, formData);
        toast.success('Facility updated successfully!');
      } else {
        const newEntry = {
          title: formData.title || 'Untitled Facility',
          description: formData.description || '',
          imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
          icon: formData.icon || 'MonitorPlay',
          status: (formData.status as 'published' | 'draft') || 'published',
          order: facilities.length + 1,
        };
        await facilityRepository.create(newEntry as Omit<Facility, 'id'>);
        toast.success('New facility added successfully!');
      }
      await loadFacilities();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save facility.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await facilityRepository.delete(deleteTargetId);
      toast.success('Facility deleted.');
      await loadFacilities();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete facility.');
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

  const columns: Column<Facility>[] = [
    {
      header: 'Facility',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-12 h-10 rounded-xl object-cover border border-slate-200"
          />
          <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (item) => (
        <span className="text-xs text-slate-500 line-clamp-1 max-w-xs">{item.description}</span>
      ),
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
            <Building2 className="w-6 h-6 text-blue-600" />
            Campus Facilities Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage smart classrooms, computer centers, science laboratories, and athletic infrastructure.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Facility
        </Button>
      </div>

      <DataTable
        data={facilities}
        columns={columns}
        searchKey="title"
        searchPlaceholder="Search facilities..."
        onAddClick={handleOpenAdd}
        addLabel="Add Facility"
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFacility ? 'Edit Campus Facility' : 'Add New Campus Facility'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Facility Name / Title"
            required
            placeholder="e.g. Modern Biology &amp; Botany Lab"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Select
            label="Facility Icon Type"
            options={[
              { value: 'MonitorPlay', label: 'Smart Classroom / Projector' },
              { value: 'FlaskConical', label: 'Science Laboratory' },
              { value: 'Laptop', label: 'Computer Center' },
              { value: 'BookOpen', label: 'Central Library' },
              { value: 'Trophy', label: 'Sports &amp; Athletics Ground' },
              { value: 'Bus', label: 'Safe Transport Fleet' },
            ]}
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />

          <ImageUpload
            label="Facility Campus Photograph"
            folder="facilities"
            currentImageUrl={formData.imageUrl}
            onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          <Textarea
            label="Facility Description"
            rows={4}
            required
            placeholder="Describe equipment, student capacity, safety measures, and features"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              {editingFacility ? 'Update Facility' : 'Save Facility'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Remove Facility Record?"
        description="Are you sure you want to delete this facility record from the website?"
      />
    </div>
  );
}
