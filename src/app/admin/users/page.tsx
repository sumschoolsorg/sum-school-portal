'use client';

import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser, refreshRole } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: '',
    email: '',
    uid: '',
    photoUrl: '/images/principal-photo.jpg',
    role: 'admin',
    status: 'active',
  });

  useEffect(() => {
    let isMounted = true;
    adminUserRepository.getAll().then((data) => {
      if (isMounted) {
        setUsers(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading admin users:', err);
        toast.error('Failed to load admin users.');
        setIsLoading(false);
      }
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
      uid: '',
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
    const userUid = (editingUser?.uid || formData.uid || '').trim();
    if (!formData.name || !formData.email || !userUid) {
      toast.error('Please provide the name, official email, and Firebase Auth UID.');
      return;
    }

    if (currentUser?.uid && userUid === currentUser.uid) {
      if (formData.status === 'inactive') {
        toast.error('You cannot deactivate your own administrative account.');
        return;
      }
      if (formData.role && formData.role !== 'super-admin') {
        toast.error('You cannot demote your own Super Administrator role.');
        return;
      }
    }

    try {
      if (editingUser && editingUser.id) {
        const updated = await adminUserRepository.save({
          ...editingUser,
          ...formData,
          id: userUid,
          uid: userUid,
        } as AdminUser);
        if (editingUser.id && editingUser.id !== userUid) {
          await adminUserRepository.delete(editingUser.id);
        }
        setUsers((prev) => [updated, ...prev.filter((u) => u.id !== editingUser.id && u.id !== updated.id)]);
        toast.success('Admin user updated successfully!');
      } else {
        const newUser: AdminUser = {
          id: userUid,
          name: formData.name || '',
          email: formData.email || '',
          photoUrl: formData.photoUrl || '/images/faculty-1.jpg',
          role: formData.role || 'admin',
          status: formData.status || 'active',
          uid: userUid,
          lastLogin: new Date(),
        };
        const saved = await adminUserRepository.save(newUser);
        setUsers((prev) => [saved, ...prev]);
        toast.success('Admin role profile saved. The user must already have a Firebase Authentication account with this UID.');
      }
      if (currentUser?.uid && userUid === currentUser.uid) {
        await refreshRole();
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving admin user:', err);
      toast.error('Failed to save user.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const targetUser = users.find((u) => u.id === deleteTargetId);
    if (!targetUser?.uid) {
      toast.error('This profile has no Firebase UID and cannot be safely deactivated.');
      setDeleteTargetId(null);
      return;
    }
    if (currentUser?.uid && targetUser.uid === currentUser.uid) {
      toast.error('You cannot deactivate your own administrative account.');
      setDeleteTargetId(null);
      return;
    }
    if (targetUser.role === 'super-admin' && targetUser.status === 'active') {
      const superAdmins = users.filter((u) => u.role === 'super-admin' && u.status === 'active');
      if (superAdmins.length <= 1) {
        toast.error('Cannot delete the sole Super Administrator account.');
        setDeleteTargetId(null);
        return;
      }
    }
    try {
      const inactiveProfile = await adminUserRepository.save({
        ...targetUser,
        id: targetUser.uid,
        uid: targetUser.uid,
        status: 'inactive',
      });
      if (deleteTargetId !== targetUser.uid) {
        await adminUserRepository.delete(deleteTargetId);
      }
      setUsers((prev) => [inactiveProfile, ...prev.filter((u) => u.id !== deleteTargetId && u.id !== inactiveProfile.id)]);
      toast.success('Admin access deactivated. Disable the Firebase Authentication account separately if needed.');
    } catch {
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
              Super Admins manage access profiles. Create the Firebase Authentication account first, then register its UID here. Administrators and content editors receive access according to the deployed Firebase rules.
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
        <DataTable
          data={users}
          columns={columns}
          searchKey="name"
          searchPlaceholder="Search admin by name or email..."
          isLoading={isLoading}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Edit Admin Profile' : 'Add Admin Profile'}
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

          <Input
            label="Firebase Authentication UID *"
            placeholder="Create the Auth user first, then paste their Firebase UID"
            value={formData.uid || ''}
            onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
            disabled={Boolean(editingUser)}
            required
            helperText="This must exactly match the UID of an existing Firebase Authentication account."
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
              {editingUser ? 'Update Profile' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Deactivate Admin Access"
        message="This marks the UID-linked role profile inactive. The Firebase Authentication account itself is not deleted."
        confirmLabel="Deactivate Access"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
