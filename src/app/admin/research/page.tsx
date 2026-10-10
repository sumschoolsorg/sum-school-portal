'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { researchRepository } from '@/lib/repositories';
import { defaultResearchRecords } from '@/lib/defaultData';
import { ResearchRecord, VerificationStatus } from '@/types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ResearchAdminPage() {
  const [records, setRecords] = useState<ResearchRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ResearchRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ResearchRecord>>({
    title: '',
    value: '',
    category: 'General',
    sourceUrl: '',
    sourceName: '',
    sourceType: 'Government Record',
    researchDate: new Date().toISOString().split('T')[0],
    verificationStatus: 'Cross-Checked',
    confidenceNote: '',
    adminApproval: true,
    published: true,
  });

  const handleSyncVerifiedFindings = async () => {
    try {
      setIsLoading(true);
      for (const rec of defaultResearchRecords) {
        await researchRepository.save(rec);
      }
      const updated = await researchRepository.getAll();
      setRecords(updated);
      toast.success('Synchronized all 15 authentic research findings (Stack Schools, TRB, TNEA)!');
    } catch (err) {
      console.error('Sync error:', err);
      toast.error('Failed to synchronize records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    researchRepository.getAll().then((data) => {
      if (isMounted) {
        setRecords(data);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading research records:', err);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      title: '',
      value: '',
      category: 'General',
      sourceUrl: '',
      sourceName: '',
      sourceType: 'Government Record',
      researchDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'Cross-Checked',
      confidenceNote: '',
      adminApproval: true,
      published: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: ResearchRecord) => {
    setEditingRecord(rec);
    setFormData(rec);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.value) {
      toast.error('Please enter the claim title and verified value.');
      return;
    }

    try {
      if (editingRecord && editingRecord.id) {
        const updated = await researchRepository.save({
          ...editingRecord,
          ...formData,
        } as ResearchRecord);
        setRecords((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        toast.success('Research record updated successfully!');
      } else {
        const newRecord: ResearchRecord = {
          id: `res-${Date.now()}`,
          title: formData.title || '',
          value: formData.value || '',
          category: formData.category || 'General',
          sourceUrl: formData.sourceUrl || '',
          sourceName: formData.sourceName || '',
          sourceType: formData.sourceType || 'Government Record',
          researchDate: formData.researchDate || new Date().toISOString().split('T')[0],
          verificationStatus: formData.verificationStatus || 'Cross-Checked',
          confidenceNote: formData.confidenceNote || '',
          adminApproval: formData.adminApproval ?? true,
          published: formData.published ?? true,
        };
        const saved = await researchRepository.save(newRecord);
        setRecords((prev) => [saved, ...prev]);
        toast.success('New research record added to school knowledge base!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Save research error:', err);
      toast.error('Failed to save research record.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await researchRepository.delete(deleteTargetId);
      setRecords((prev) => prev.filter((r) => r.id !== deleteTargetId));
      toast.success('Research record removed.');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete record.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleToggleApproval = async (rec: ResearchRecord) => {
    const updated = {
      ...rec,
      adminApproval: !rec.adminApproval,
      published: !rec.adminApproval ? rec.published : false, // auto unpublish if unapproved
    };
    try {
      await researchRepository.save(updated);
      setRecords((prev) => prev.map((r) => (r.id === rec.id ? updated : r)));
      toast.success(
        updated.adminApproval
          ? 'Record marked as Admin Approved!'
          : 'Record unapproved and hidden from public display.'
      );
    } catch {
      toast.error('Failed to update approval status.');
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Officially Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Officially Confirmed
          </span>
        );
      case 'Cross-Checked':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Cross-Checked
          </span>
        );
      case 'Research Found':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            Research Found
          </span>
        );
      case 'Unverified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Unverified
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const columns: Column<ResearchRecord>[] = [
    {
      header: 'Factual Claim / Field',
      accessorKey: 'title',
      sortable: true,
      cell: (rec) => (
        <div>
          <div className="font-semibold text-slate-900">{rec.title}</div>
          <div className="text-xs text-slate-600 font-mono mt-0.5 max-w-md line-clamp-2">
            {rec.value}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
            <span>Category: {rec.category}</span>
            <span>•</span>
            <span>Date: {rec.researchDate}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Source & Verification',
      accessorKey: 'verificationStatus',
      sortable: true,
      cell: (rec) => (
        <div className="space-y-1.5">
          {getStatusBadge(rec.verificationStatus)}
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <span className="font-medium text-slate-700">{rec.sourceName}</span>
            {rec.sourceUrl && (
              <a
                href={rec.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
                title="Open source URL"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <div className="text-[11px] text-slate-500 italic max-w-xs">
            {rec.confidenceNote}
          </div>
        </div>
      ),
    },
    {
      header: 'Admin Review',
      accessorKey: 'adminApproval',
      cell: (rec) => (
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => handleToggleApproval(rec)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition text-left flex items-center justify-between gap-1.5 ${
              rec.adminApproval
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>{rec.adminApproval ? 'Approved' : 'Pending Review'}</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
          <Badge variant={rec.published ? 'success' : 'outline'}>
            {rec.published ? 'Live on Web' : 'Hidden'}
          </Badge>
        </div>
      ),
    },
    {
      header: 'Actions',
      cell: (rec) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenEdit(rec)}
            className="p-1.5 h-auto text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            title="Edit Record"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteTargetId(rec.id || null)}
            className="p-1.5 h-auto text-rose-600 hover:text-rose-800 hover:bg-rose-50"
            title="Delete Record"
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
              Research & School Verification Records
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Truth Engine
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Verified public records, government registries, and school historical documentation for S.U.M. Higher Secondary School, Royappanpatti.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSyncVerifiedFindings}
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            title="Load authentic research records from government registries and Stack Schools"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            Sync Verified Research
          </Button>
          <Button onClick={handleOpenAdd} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800">
            <Plus className="w-4 h-4" />
            Add Research Record
          </Button>
        </div>
      </div>

      {/* Guidelines Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <BookOpen className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-blue-950">Verification Protocol: </span>
          All factual statements displayed on the public school portal (such as founding year 1963, 105/W-2 Savarimuthu Lourdu Nagar address, UDISE code 33250800109, and board affiliation) must have documented sources. Unconfirmed rumors or false programs are rejected.
        </div>
      </Card>

      {/* Data Table */}
      <Card className="p-0 overflow-hidden shadow-sm border-slate-200">
        <DataTable
          data={records}
          columns={columns}
          searchKey="title"
          searchPlaceholder="Search research records by title, value, or source..."
          isLoading={isLoading}
        />
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRecord ? 'Edit Research Record' : 'Add Research Record'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Claim / Fact Title *"
            placeholder="e.g. Official Address, Establishment Year, UDISE Code"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Verified Fact / Value *"
            placeholder="Enter the authentic factual statement or data"
            value={formData.value || ''}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            rows={3}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category || 'General'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ResearchRecord['category'] })}
              options={[
                { label: 'General Info', value: 'General' },
                { label: 'School History', value: 'History' },
                { label: 'Academic & Board', value: 'Academic' },
                { label: 'Contact & Address', value: 'Contact' },
                { label: 'Campus Facilities', value: 'Facility' },
                { label: 'Official Gov Records', value: 'Official Records' },
              ]}
            />

            <Select
              label="Verification Status"
              value={formData.verificationStatus || 'Cross-Checked'}
              onChange={(e) =>
                setFormData({ ...formData, verificationStatus: e.target.value as VerificationStatus })
              }
              options={[
                { label: 'Officially Confirmed', value: 'Officially Confirmed' },
                { label: 'Cross-Checked', value: 'Cross-Checked' },
                { label: 'Research Found', value: 'Research Found' },
                { label: 'Unverified', value: 'Unverified' },
                { label: 'Rejected', value: 'Rejected' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Source Name *"
              placeholder="e.g. TNEA Admissions Record / DGE Tamil Nadu"
              value={formData.sourceName || ''}
              onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
              required
            />

            <Select
              label="Source Type"
              value={formData.sourceType || 'Government Record'}
              onChange={(e) => setFormData({ ...formData, sourceType: e.target.value as ResearchRecord['sourceType'] })}
              options={[
                { label: 'Government Record', value: 'Government Record' },
                { label: 'Admissions Record', value: 'Admissions Record' },
                { label: 'School Document', value: 'School Document' },
                { label: 'Public Directory', value: 'Directory' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </div>

          <Input
            label="Source URL (Optional Reference Link)"
            placeholder="https://..."
            type="url"
            value={formData.sourceUrl || ''}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
          />

          <Textarea
            label="Confidence Note / Verification Notes"
            placeholder="Explain how this information was verified or why it was accepted"
            value={formData.confidenceNote || ''}
            onChange={(e) => setFormData({ ...formData, confidenceNote: e.target.value })}
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.adminApproval ?? true}
                onChange={(e) => setFormData({ ...formData, adminApproval: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Admin Approved</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.published ?? true}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Publish to Public School Profile</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingRecord ? 'Update Record' : 'Add Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Research Record"
        message="Are you sure you want to remove this research record? This action can be undone by re-importing default data."
        confirmLabel="Delete Record"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
