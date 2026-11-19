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
import { Avatar } from '@/components/ui/Avatar';
import { facultyRepository } from '@/lib/repositories';
import { Faculty } from '@/types';
import { Plus, Edit2, Trash2, Users, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function FacultyAdminPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Faculty>>({
    name: '',
    photoUrl: '',
    designation: '',
    qualification: '',
    subject: '',
    department: '',
    staffType: 'teaching',
    section: 'secondary',
    experience: '',
    biography: '',
    isFeatured: false,
    isActive: true,
    status: 'published',
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      photoUrl: '',
      designation: '',
      qualification: '',
      subject: '',
      department: '',
      staffType: 'teaching',
      section: 'secondary',
      experience: '',
      biography: '',
      isFeatured: false,
      isActive: true,
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
      setFacultyList((data as Faculty[]) || []);
    } catch (err) {
      console.error('Failed to load faculty:', err);
      setFacultyList([]);
      toast.error('Failed to load faculty from cloud.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    facultyRepository.getAll().then((data) => {
      if (isMounted) {
        setFacultyList((data as Faculty[]) || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Failed to load faculty:', err);
        setFacultyList([]);
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
      const payload = {
        name: formData.name?.trim() || 'Faculty Member',
        designation: formData.designation?.trim() || 'Teacher',
        qualification: formData.qualification?.trim() || '',
        subject: formData.subject?.trim() || '',
        department: formData.department?.trim() || '',
        staffType: formData.staffType || 'teaching',
        section: (formData.section as Faculty['section']) || 'secondary',
        experience: formData.experience?.trim() || '',
        photoUrl: formData.photoUrl || '',
        biography: formData.biography?.trim() || '',
        isFeatured: Boolean(formData.isFeatured),
        isActive: formData.isActive !== false,
        status: formData.status || 'published',
      };

      if (editingFaculty && editingFaculty.id) {
        await facultyRepository.update(editingFaculty.id, payload);
        toast.success('Faculty profile updated successfully!');
      } else {
        const newEntry = {
          ...payload,
          order: facultyList.length + 1,
        };
        await facultyRepository.create(newEntry);
        toast.success('New faculty member added successfully!');
      }
      setIsModalOpen(false);
      await fetchFaculty();
    } catch (err) {
      console.error('Failed to save faculty:', err);
      toast.error((err as Error)?.message || 'Failed to save faculty to Firebase.');
    }
  };

  const handleToggleFeatured = async (fac: Faculty) => {
    if (!fac.id) return;
    const nextState = !fac.isFeatured;
    try {
      setFacultyList((prev) =>
        prev.map((f) => (f.id === fac.id ? { ...f, isFeatured: nextState } : f))
      );
      await facultyRepository.update(fac.id, { isFeatured: nextState });
      toast.success(
        nextState
          ? `${fac.name} is now featured on the homepage!`
          : `${fac.name} removed from homepage featured list.`
      );
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      toast.error('Failed to update featured status.');
      await fetchFaculty();
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    try {
      setFacultyList((prev) => prev.filter((f) => f.id !== targetId));
      setDeleteTargetId(null);
      await facultyRepository.delete(targetId);
      toast.success('Faculty member removed permanently.');
    } catch (err) {
      console.error('Failed to delete faculty:', err);
      toast.error('Failed to delete faculty member. Rolling back.');
      await fetchFaculty();
    }
  };

  const columns: Column<Faculty>[] = [
    {
      header: 'Educator',
      cell: (item) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={item.photoUrl}
            alt={item.name}
            name={item.name}
            size="sm"
            className="w-10 h-10 rounded-full shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 text-xs"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{item.name}</span>
              {item.isFeatured && (
                <span title="Featured Teacher on Homepage">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </span>
              )}
            </div>
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
      header: 'Homepage',
      cell: (item) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(item)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            item.isFeatured
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 border border-transparent'
          }`}
          title={item.isFeatured ? 'Click to unfeature from Homepage' : 'Click to feature on Homepage'}
        >
          <Award className="w-3 h-3" />
          <span>{item.isFeatured ? 'Featured' : 'Make Featured'}</span>
        </button>
      ),
    },
    {
      header: 'Status',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
            {item.status.toUpperCase()}
          </Badge>
          {item.isActive === false && (
            <Badge variant="warning">INACTIVE</Badge>
          )}
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
            <Users className="w-6 h-6 text-blue-600" />
            Faculty &amp; Staff Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add teachers, assign subjects, upload staff photos, and configure public display order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={handleOpenAdd}
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Faculty Member
          </Button>
        </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Department"
              placeholder="e.g. Science / Mathematics / Tamil"
              value={formData.department || ''}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Select
              label="Staff Category"
              options={[
                { value: 'teaching', label: 'Teaching Faculty' },
                { value: 'administrative', label: 'Administrative Staff' },
                { value: 'support', label: 'Support Staff' },
                { value: 'non-teaching', label: 'Non-Teaching Staff' },
              ]}
              value={formData.staffType || 'teaching'}
              onChange={(e) => setFormData({ ...formData, staffType: e.target.value as Faculty['staffType'] })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Teaching Subject"
              placeholder="e.g. Mathematics"
              value={formData.subject || ''}
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
              value={formData.section || 'secondary'}
              onChange={(e) => setFormData({ ...formData, section: e.target.value as Faculty['section'] })}
            />

            <Input
              label="Experience"
              placeholder="e.g. 12+ Years"
              value={formData.experience || ''}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <ImageUpload
            label="Teacher Photograph"
            folder="faculty"
            currentImageUrl={formData.photoUrl || ''}
            onImageUploaded={(url) => setFormData({ ...formData, photoUrl: url })}
          />

          <Textarea
            label="Short Biography / Philosophy"
            rows={3}
            placeholder="Brief teaching background or message"
            value={formData.biography || ''}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          />

          {/* Featured on Homepage Highlight */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.isFeatured)}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Feature on Homepage (&ldquo;Meet Our Dedicated Teachers&rdquo; Section)
              </span>
            </label>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 pl-6.5">
              When checked, this educator is highlighted directly on the public homepage with a distinctive badge and profile summary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Publishing Status"
              options={[
                { value: 'published', label: 'Published (Visible on Website)' },
                { value: 'draft', label: 'Draft (Internal Only)' },
              ]}
              value={formData.status || 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Faculty['status'] })}
            />

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active Faculty Member
                </span>
              </label>
            </div>
          </div>

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
