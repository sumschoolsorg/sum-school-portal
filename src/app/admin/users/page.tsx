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
import { adminUserRepository } from '@/lib/repositories';
import { AdminUser } from '@/types';
import { Plus, Edit2, Trash2, Shield, UserCheck, ShieldAlert, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    photoUrl: '/images/principal-photo.jpg',
    role: 'admin',
    status: 'active',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await adminUserRepository.getAll();
      setUsers(data);
    } catch (err) {
      console.error('Error loading admin users:', err);
      toast.error('Failed to load admin users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    adminUserRepository.getAll().then((data) => {
      if (isMounted) setUsers(data);
    }).catch((err) => {
      console.error('Error loading admin users:', err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      photoUrl: '/images/faculty-1.jpg',
      role: 'admin',
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: AdminUser) => {
    setEditingUser(u);
    setFormData(u);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please provide user name and official email.');
      return;
    }

    try {
      if (editingUser && editingUser.id) {
        const updated = await adminUserRepository.save({
          ...editingUser,
          ...formData,
        } as AdminUser);
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        toast.success('Admin user updated successfully!');
      } else {
        const newUser: AdminUser = {
          id: `admin-${Date.now()}`,
          name: formData.name || '',
          email: formData.email || '',
          photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
          role: formData.role || 'admin',
          status: formData.status || 'active',
          uid: `uid_${Date.now()}`,
          lastLogin: new Date(),
        };
        const saved = await adminUserRepository.save(newUser);
        setUsers((prev) => [saved, ...prev]);
        toast.success('New admin account created!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving admin user:', err);
      toast.error('Failed to save user.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await adminUserRepository.delete(deleteTargetId);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTargetId));
      toast.success('Admin user account removed.');
    } catch (err) {
      toast.error('Failed to delete user.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const getRoleBadge = (role: AdminUser['role']) => {
    switch (role) {
      case 'super-admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <ShieldAlert className="w-3 h-3 text-purple-600" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Shield className="w-3 h-3 text-blue-600" />
            Administrator
          </span>
        );
      case 'content-manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            Content Editor
          </span>
        );
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      header: 'Admin Profile',
      accessorKey: 'name',
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 border border-slate-300 flex-shrink-0">
            <Image
              src={user.photoUrl || '/images/faculty-1.jpg'}
              alt={user.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500 font-mono">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role & Permissions',
      accessorKey: 'role',
      sortable: true,
      cell: (user) => getRoleBadge(user.role),
    },
    {
      header: 'Account Status',
      accessorKey: 'status',
      cell: (user) => (
        <Badge variant={user.status === 'active' ? 'success' : 'outline'}>
          {user.status === 'active' ? 'Active' : 'Suspended'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenEdit(user)}
            className="p-1.5 h-auto text-blue-600 hover:text-blue-800"
            title="Edit User"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteTargetId(user.id || null)}
            className="p-1.5 h-auto text-rose-600 hover:text-rose-800"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-extrabold text-slate-900">
              Admin Users & Access Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              RBAC Security
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Manage administrative personnel, correspondents, headmasters, and content editors for S.U.M. School.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Admin User
        </Button>
      </div>

      {/* Security Info Card */}
      <Card className="p-4 bg-purple-50 border-purple-200 text-xs text-purple-900 flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-purple-950">Role-Based Access Control (RBAC): </span>
          Super Admins have full authority including user provisioning and Firebase synchronization. Administrators manage academics, admissions, and faculty. Content Editors update news, events, and galleries.
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
        <DataTable
          data={users}
          columns={columns}
          searchPlaceholder="Search admin by name or email..."
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Admin User' : 'Create Admin User'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Rev. Fr. Correspondent / Principal"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Official Email Address *"
            type="email"
            placeholder="admin@sumschool.edu.in"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <ImageUpload
            label="Profile Photo"
            currentImageUrl={formData.photoUrl || ''}
            onImageSelect={(url) => setFormData({ ...formData, photoUrl: url })}
            folder="admins"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Assigned Role *"
              value={formData.role || 'admin'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUser['role'] })}
              options={[
                { label: 'Super Admin (Correspondent / Headmaster)', value: 'super-admin' },
                { label: 'Administrator (Office / Academic)', value: 'admin' },
                { label: 'Content Manager (Events / News / Gallery)', value: 'content-manager' },
              ]}
            />

            <Select
              label="Account Status"
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminUser['status'] })}
              options={[
                { label: 'Active (Allowed)', value: 'active' },
                { label: 'Suspended (Blocked)', value: 'inactive' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? 'Update Account' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Remove Admin Account"
        message="Are you sure you want to remove this admin account? They will no longer be able to log into the school administration portal."
        confirmLabel="Remove User"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
