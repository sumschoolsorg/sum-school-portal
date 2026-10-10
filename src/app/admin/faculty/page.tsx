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
import { facultyRepository } from '@/lib/repositories';
import { Faculty } from '@/types';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyAdminPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Faculty>>({
    name: '',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    designation: '',
    qualification: '',
    subject: '',
    section: 'secondary',
    experience: '',
    biography: '',
    status: 'published',
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      designation: '',
      qualification: '',
      subject: '',
      section: 'secondary',
      experience: '',
      biography: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac: Faculty) => {
    setEditingFaculty(fac);
    setFormData(fac);
    setIsModalOpen(true);
  };

  const fetchFaculty = async () => {
    setIsLoading(true);
    try {
      const data = await facultyRepository.getAll();
      setFacultyList(data as Faculty[]);
    } catch {
      toast.error('Failed to load faculty');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    facultyRepository.getAll().then((data) => {
      if (isMounted) {
        setFacultyList(data as Faculty[]);
        setIsLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        toast.error('Failed to load faculty');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.designation) {
      toast.error('Please enter teacher name and designation.');
      return;
    }

    try {
      if (editingFaculty && editingFaculty.id) {
        await facultyRepository.update(editingFaculty.id, formData);
        toast.success('Faculty profile updated successfully!');
      } else {
        const newEntry = {
          name: formData.name || 'Faculty Member',
          designation: formData.designation || 'Teacher',
          qualification: formData.qualification || '',
          subject: formData.subject || '',
          section: (formData.section as Faculty['section']) || 'secondary',
          experience: formData.experience || '',
          photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
          biography: formData.biography || '',
          status: formData.status || 'published',
          order: facultyList.length + 1,
        };
        await facultyRepository.create(newEntry);
        toast.success('New faculty member added successfully!');
      }
      setIsModalOpen(false);
      await fetchFaculty();
    } catch {
      toast.error('Failed to save faculty');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await facultyRepository.delete(deleteTargetId);
      toast.success('Faculty member removed.');
      setDeleteTargetId(null);
      await fetchFaculty();
    } catch {
      toast.error('Failed to delete faculty');
    }
  };

  const columns: Column<Faculty>[] = [
    {
      header: 'Educator',
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
            <div className="text-xs text-slate-400">{item.designation}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Subject & Wing',
      cell: (item) => (
        <div>
          <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.subject}</div>
          <div className="text-[11px] text-slate-500 capitalize">{item.section}</div>
        </div>
      ),
    },
    {
      header: 'Qualification',
      accessorKey: 'qualification',
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
            <Users className="w-6 h-6 text-blue-600" />
            Faculty &amp; Staff Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add teachers, assign subjects, upload staff photos, and configure public display order.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Faculty Member
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : facultyList.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No faculty members</h3>
          <p className="text-slate-500 mb-6">Add your first faculty member to display them on the website.</p>
          <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Faculty
          </Button>
        </div>
      ) : (
        <DataTable
          data={facultyList}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search faculty by name..."
          onAddClick={handleOpenAdd}
          addLabel="Add Faculty"
        />
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? 'Edit Faculty Details' : 'Add New Faculty Member'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Teacher Name"
            required
            placeholder="e.g. S. Meenakshi, M.Sc., B.Ed."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Designation / Role"
              required
              placeholder="e.g. Senior Lecturer / Coordinator"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
            <Input
              label="Educational Qualifications"
              placeholder="e.g. M.Sc. (Physics), B.Ed."
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Teaching Subject"
              placeholder="e.g. Mathematics"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <Select
              label="Academic Wing"
              options={[
                { value: 'primary', label: 'Primary Wing' },
                { value: 'secondary', label: 'Secondary Wing' },
                { value: 'higher-secondary', label: 'Higher Secondary' },
                { value: 'administration', label: 'Administration' },
              ]}
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value as Faculty['section'] })}
            />

            <Input
              label="Experience"
              placeholder="e.g. 12+ Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <ImageUpload
            label="Teacher Photograph"
            folder="faculty"
            currentImageUrl={formData.photoUrl}
            onImageUploaded={(url) => setFormData({ ...formData, photoUrl: url })}
          />

          <Textarea
            label="Short Biography / Philosophy"
            rows={3}
            placeholder="Brief teaching background or message"
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingFaculty ? 'Update Educator' : 'Save Educator'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Remove Faculty Member?"
        description="Are you sure you want to remove this faculty record? This action will remove them from the public faculty page."
      />
    </div>
  );
}
