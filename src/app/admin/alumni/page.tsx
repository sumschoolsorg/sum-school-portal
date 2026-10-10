'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { alumniRepository, alumniPrivateRepository } from '@/lib/repositories';
import { AlumniMember } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAlumniPage() {
  const [alumni, setAlumni] = useState<AlumniMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlumnus, setEditingAlumnus] = useState<AlumniMember | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'pending' | 'distinguished'>('all');

  const [formData, setFormData] = useState<Partial<AlumniMember>>({
    name: '',
    batchYear: 2010,
    qualification: '',
    currentDesignation: '',
    companyOrOrg: '',
    location: '',
    photoUrl: '/images/faculty-1.jpg',
    message: '',
    email: '',
    phone: '',
    isDistinguished: false,
    distinctionSummary: '',
    status: 'published',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await alumniRepository.getAll();
      setAlumni(data || []);
    } catch (err) {
      console.error('Error loading alumni:', err);
      toast.error('Failed to load alumni records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    alumniRepository.getAll().then((data) => {
      if (isMounted) {
        setAlumni(data || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading alumni:', err);
        toast.error('Failed to load alumni records.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingAlumnus(null);
    setFormData({
      name: '',
      batchYear: 2010,
      qualification: '',
      currentDesignation: '',
      companyOrOrg: '',
      location: '',
      photoUrl: '/images/faculty-1.jpg',
      message: '',
      email: '',
      phone: '',
      isDistinguished: false,
      distinctionSummary: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (alumnus: AlumniMember) => {
    setEditingAlumnus(alumnus);
    let email = alumnus.email || '';
    let phone = alumnus.phone || '';
    if (alumnus.id && (!email || !phone)) {
      try {
        const priv = await alumniPrivateRepository.getById(alumnus.id);
        if (priv) {
          email = priv.email || email;
          phone = priv.phone || phone;
        }
      } catch {
        // Ignored if no private contact record exists
      }
    }
    setFormData({ ...alumnus, email, phone });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.batchYear || !formData.currentDesignation) {
      toast.error('Please enter name, batch year, and designation.');
      return;
    }

    try {
      const contactEmail = formData.email?.trim() || '';
      const contactPhone = formData.phone?.trim() || '';

      // Public profile data must never contain email or phone
      const publicProfile = { ...formData };
      delete publicProfile.email;
      delete publicProfile.phone;

      if (editingAlumnus && editingAlumnus.id) {
        await alumniRepository.update(editingAlumnus.id, {
          ...publicProfile,
          batchYear: Number(formData.batchYear),
        });

        if (contactEmail || contactPhone) {
          try {
            const existingPriv = await alumniPrivateRepository.getById(editingAlumnus.id);
            if (existingPriv) {
              await alumniPrivateRepository.update(editingAlumnus.id, {
                email: contactEmail,
                phone: contactPhone,
                name: formData.name?.trim() || '',
              });
            } else {
              await alumniPrivateRepository.create({
                id: editingAlumnus.id,
                alumniId: editingAlumnus.id,
                name: formData.name?.trim() || '',
                email: contactEmail,
                phone: contactPhone,
              });
            }
          } catch (privErr) {
            console.warn('Could not update private contact record:', privErr);
          }
        }
        toast.success('Alumni profile updated successfully.');
      } else {
        const created = await alumniRepository.create({
          ...publicProfile,
          name: formData.name || '',
          batchYear: Number(formData.batchYear),
          qualification: formData.qualification || 'Alumnus',
          currentDesignation: formData.currentDesignation || '',
          companyOrOrg: formData.companyOrOrg || '',
          location: formData.location || 'Tamil Nadu',
          photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
          isDistinguished: Boolean(formData.isDistinguished),
          status: formData.status || 'published',
        } as Omit<AlumniMember, 'id'>);

        if (created?.id && (contactEmail || contactPhone)) {
          try {
            await alumniPrivateRepository.create({
              id: created.id,
              alumniId: created.id,
              name: formData.name?.trim() || '',
              email: contactEmail,
              phone: contactPhone,
            });
          } catch (privErr) {
            console.warn('Could not save private contact record:', privErr);
          }
        }
        toast.success('Alumni profile added successfully.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving alumni:', err);
      toast.error('Failed to save profile.');
    }
  };

  const handleQuickApprove = async (id: string) => {
    try {
      await alumniRepository.update(id, { status: 'published' });
      toast.success('Alumni registration approved and published.');
      loadData();
    } catch (err) {
      console.error('Approve failed:', err);
      toast.error('Failed to approve profile.');
    }
  };

  const handleToggleDistinguished = async (alumnus: AlumniMember) => {
    if (!alumnus.id) return;
    try {
      const nextState = !alumnus.isDistinguished;
      await alumniRepository.update(alumnus.id, { isDistinguished: nextState });
      toast.success(
        nextState
          ? `${alumnus.name} added to Distinguished Alumni Hall of Fame.`
          : `${alumnus.name} removed from Hall of Fame.`
      );
      loadData();
    } catch (err) {
      console.error('Toggle distinguished failed:', err);
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await alumniRepository.delete(deleteTargetId);
      try {
        await alumniPrivateRepository.delete(deleteTargetId);
      } catch {
        // Best effort deletion of private contact record
      }
      toast.success('Alumni record deleted.');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete alumnus.');
    }
  };

  const pendingCount = alumni.filter((a) => a.status === 'pending').length;

  const filteredAlumni = alumni.filter((a) => {
    if (filterStatus === 'published') return a.status === 'published';
    if (filterStatus === 'pending') return a.status === 'pending';
    if (filterStatus === 'distinguished') return a.isDistinguished;
    return true;
  });

  const columns: Column<AlumniMember>[] = [
    {
      key: 'name',
      label: 'Alumnus',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100">
            <Image
              src={item.photoUrl || '/images/faculty-1.jpg'}
              alt={item.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{item.name}</span>
              {item.isDistinguished && (
                <span title="Distinguished Alumni">
                  <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </span>
              )}
            </div>
            <div className="text-xs text-slate-500">
              Batch of {item.batchYear} &bull; {item.qualification}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'currentDesignation',
      label: 'Role & Organization',
      render: (item) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200">{item.currentDesignation}</div>
          <div className="text-slate-500">{item.companyOrOrg} &bull; {item.location}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        if (item.status === 'published') {
          return <Badge variant="success">Published</Badge>;
        }
        if (item.status === 'pending') {
          return <Badge variant="warning">Pending Review</Badge>;
        }
        return <Badge variant="neutral">Draft</Badge>;
      },
    },
    {
      key: 'isDistinguished',
      label: 'Hall of Fame',
      render: (item) => (
        <button
          onClick={() => handleToggleDistinguished(item)}
          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
            item.isDistinguished
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{item.isDistinguished ? 'Featured' : 'Make Featured'}</span>
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          {item.status === 'pending' && (
            <button
              onClick={() => handleQuickApprove(item.id || '')}
              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200 transition cursor-pointer"
              title="Approve Registration"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Edit Profile"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Profile"
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
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Alumni Directory Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage old student registrations, approve public submissions, and spotlight distinguished alumni.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Alumni Record
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterStatus === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All ({alumni.length})
        </button>
        <button
          onClick={() => setFilterStatus('published')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            filterStatus === 'published'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          Published ({alumni.filter((a) => a.status === 'published').length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'pending'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals ({pendingCount})</span>
        </button>
        <button
          onClick={() => setFilterStatus('distinguished')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            filterStatus === 'distinguished'
              ? 'bg-amber-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Hall of Fame ({alumni.filter((a) => a.isDistinguished).length})</span>
        </button>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={filteredAlumni}
          searchKey="name"
          searchPlaceholder="Search by name, role, city..."
          isLoading={isLoading}
        />
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAlumnus ? 'Edit Alumni Profile' : 'Add New Alumni Profile'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Dr. S. Arockiaraj"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Batch Year"
              type="number"
              required
              value={formData.batchYear?.toString() || ''}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setFormData({ ...formData, batchYear: isNaN(val) ? undefined : val });
              }}
            />
            <Input
              label="Qualification"
              value={formData.qualification || ''}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="e.g. M.B.B.S., M.S."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Current Designation"
              required
              value={formData.currentDesignation || ''}
              onChange={(e) => setFormData({ ...formData, currentDesignation: e.target.value })}
              placeholder="e.g. Chief Medical Officer"
            />
            <Input
              label="Company / Institution"
              value={formData.companyOrOrg || ''}
              onChange={(e) => setFormData({ ...formData, companyOrOrg: e.target.value })}
              placeholder="e.g. Govt. Hospital"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location (City, State)"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Madurai, Tamil Nadu"
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alumnus@gmail.com"
            />
          </div>

          <ImageUpload
            label="Profile Photo"
            currentImageUrl={formData.photoUrl || '/images/faculty-1.jpg'}
            onImageUploaded={(url) => setFormData({ ...formData, photoUrl: url })}
            folder="alumni"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Memory / Inspirational Message
            </label>
            <textarea
              rows={3}
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Words of encouragement for current students..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Distinguished Alumni Switch */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.isDistinguished)}
                onChange={(e) => setFormData({ ...formData, isDistinguished: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Feature in Hall of Fame (Distinguished Alumni Spotlight)
              </span>
            </label>

            {formData.isDistinguished && (
              <Input
                label="Distinction Citation / Summary"
                value={formData.distinctionSummary || ''}
                onChange={(e) => setFormData({ ...formData, distinctionSummary: e.target.value })}
                placeholder="e.g. Pioneered rural health camps across Cumbum Valley for 40 years."
              />
            )}
          </div>

          <Select
            label="Publishing Status"
            value={formData.status || 'published'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as AlumniMember['status'] })}
            options={[
              { value: 'published', label: 'Published (Visible on Website)' },
              { value: 'pending', label: 'Pending Review' },
              { value: 'draft', label: 'Draft (Internal Only)' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingAlumnus ? 'Update Profile' : 'Add Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Alumni Record"
        message="Are you sure you want to delete this alumnus record? This action cannot be undone."
      />
    </div>
  );
}
