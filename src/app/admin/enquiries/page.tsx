'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/ui/DataTable';
import {
  Inbox,
  Phone,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { enquiryRepository } from '@/lib/repositories';
import { Enquiry } from '@/types';

export default function EnquiriesAdminPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editNotes, setEditNotes] = useState('');

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const data = await enquiryRepository.getAll();
      setEnquiries(data);
    } catch (err) {
      console.error('Failed to load enquiries:', err);
      toast.error('Failed to load admission applications');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    enquiryRepository.getAll().then((data) => {
      if (isMounted) {
        setEnquiries(data);
        setLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Failed to load enquiries:', err);
        toast.error('Failed to load admission applications');
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Enquiry['status'], defaultNote?: string) => {
    try {
      const target = enquiries.find((e) => e.id === id);
      const updatedNotes = defaultNote || (selectedEnquiry && selectedEnquiry.id === id ? editNotes : target?.notes || '');

      await enquiryRepository.update(id, {
        status: newStatus,
        notes: updatedNotes,
      });

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: newStatus, notes: updatedNotes } : e
        )
      );

      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus, notes: updatedNotes });
      }

      toast.success(`Application marked as ${newStatus.toUpperCase()}`);
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Could not update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry?.id) return;
    try {
      await enquiryRepository.update(selectedEnquiry.id, {
        notes: editNotes,
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === selectedEnquiry.id ? { ...e, notes: editNotes } : e))
      );
      setSelectedEnquiry({ ...selectedEnquiry, notes: editNotes });
      toast.success('Admin notes saved.');
    } catch (err) {
      console.error('Failed to save notes:', err);
      toast.error('Failed to save notes');
    }
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      toast.error('No admission records to export');
      return;
    }

    const headers = [
      'Application Number',
      'Student Name',
      'DOB',
      'Gender',
      'Class Applying For',
      'Parent Name',
      'Phone',
      'Email',
      'Residential Address',
      'Previous School',
      'Status',
      'Application Date',
      'Message / Remarks',
      'Admin Notes',
    ];

    const sanitizeCSV = (val: unknown): string => {
      const s = String(val ?? '').replace(/"/g, '""');
      if (/^[=+\-@\t\r]/.test(s)) {
        return `"'${s}"`;
      }
      return `"${s}"`;
    };

    const rows = enquiries.map((e) => [
      sanitizeCSV(e.applicationNumber),
      sanitizeCSV(e.studentName),
      sanitizeCSV(e.dob),
      sanitizeCSV(e.gender),
      sanitizeCSV(e.classApplyingFor),
      sanitizeCSV(e.parentName),
      sanitizeCSV(e.phone),
      sanitizeCSV(e.email),
      sanitizeCSV(e.address),
      sanitizeCSV(e.previousSchool),
      sanitizeCSV(e.status),
      sanitizeCSV(e.applicationDate),
      sanitizeCSV(e.message),
      sanitizeCSV(e.notes),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SUM_School_Admission_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported applications to CSV file.');
  };

  const filteredEnquiries =
    filterStatus === 'all'
      ? enquiries
      : enquiries.filter((e) => e.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">APPROVED</Badge>;
      case 'new':
        return <Badge variant="accent">NEW</Badge>;
      case 'contacted':
        return <Badge variant="info">CONTACTED</Badge>;
      case 'follow-up':
        return <Badge variant="warning">FOLLOW-UP</Badge>;
      case 'rejected':
        return <Badge variant="danger">REJECTED</Badge>;
      case 'resolved':
        return <Badge variant="neutral">RESOLVED</Badge>;
      default:
        return <Badge variant="neutral">{status.toUpperCase()}</Badge>;
    }
  };

  const columns: Column<Enquiry>[] = [
    {
      header: 'App No',
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
          {item.applicationNumber || 'NEW'}
        </span>
      ),
    },
    {
      header: 'Student & Parent',
      cell: (item) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>{item.studentName}</span>
            {item.gender && (
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                ({item.gender})
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Parent: {item.parentName}
          </div>
        </div>
      ),
    },
    {
      header: 'Class',
      cell: (item) => (
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          {item.classApplyingFor}
        </span>
      ),
    },
    {
      header: 'Phone / Contact',
      cell: (item) => (
        <div>
          <a
            href={`tel:${item.phone}`}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
          >
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{item.phone}</span>
          </a>
          {item.email && (
            <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
              {item.email}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Date',
      cell: (item) => (
        <span className="text-xs text-slate-500 whitespace-nowrap">
          {item.applicationDate || 'Recent'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (item) => getStatusBadge(item.status),
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Button
            onClick={() => {
              setSelectedEnquiry(item);
              setEditNotes(item.notes || '');
            }}
            variant="secondary"
            size="sm"
          >
            Review
          </Button>
          {item.status !== 'approved' && (
            <button
              onClick={() =>
                handleUpdateStatus(item.id!, 'approved', 'Direct admission verified and approved by School Headmaster.')
              }
              title="Quick Approve"
              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
          {item.status !== 'rejected' && (
            <button
              onClick={() => handleUpdateStatus(item.id!, 'rejected', 'Application declined due to seat limits.')}
              title="Quick Decline"
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 transition cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-blue-600" />
            Admission Applications &amp; Enquiries
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review online student registrations, verify certificates, update admission statuses, and export data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadEnquiries}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {['all', 'new', 'approved', 'contacted', 'follow-up', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition cursor-pointer ${
              filterStatus === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {st} ({st === 'all' ? enquiries.length : enquiries.filter((e) => e.status === st).length})
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        data={filteredEnquiries}
        columns={columns}
        searchKey="studentName"
        searchPlaceholder="Search by student name..."
        isLoading={loading}
      />

      {/* Detail Review Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Application: ${selectedEnquiry.studentName}`}
          description={`Application No: ${selectedEnquiry.applicationNumber || 'N/A'} • Submitted on ${selectedEnquiry.applicationDate || 'Recent'}`}
          size="lg"
        >
          <div className="space-y-6">
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Student Name
                </span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedEnquiry.studentName}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Class Applying For
                </span>
                <div className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedEnquiry.classApplyingFor}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Date of Birth / Gender
                </span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEnquiry.dob || 'Not provided'}{' '}
                  {selectedEnquiry.gender && `(${selectedEnquiry.gender})`}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Parent / Guardian
                </span>
                <div className="font-bold text-slate-900 dark:text-white">
                  {selectedEnquiry.parentName}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Contact Mobile
                </span>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedEnquiry.phone}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Email
                </span>
                <div className="text-slate-700 dark:text-slate-300">
                  {selectedEnquiry.email || 'None'}
                </div>
              </div>

              {selectedEnquiry.previousSchool && (
                <div className="sm:col-span-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Previous School &amp; Board
                  </span>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedEnquiry.previousSchool}
                  </div>
                </div>
              )}

              {selectedEnquiry.address && (
                <div className="sm:col-span-3">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Residential Address
                  </span>
                  <div className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedEnquiry.address}
                  </div>
                </div>
              )}
            </div>

            {/* Parent Message */}
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold">
                Parent Enquiries / Remarks
              </span>
              <div className="mt-1 p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {selectedEnquiry.message || 'No additional remarks provided.'}
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 uppercase font-bold">
                  Internal Admissions Notes &amp; Verification Remarks
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Save Note
                </button>
              </div>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={3}
                placeholder="Add verification notes, document checklist status, interview schedule..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Control & Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Update Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedEnquiry.id!, e.target.value as Enquiry['status'])
                  }
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="new">NEW (Under Scrutiny)</option>
                  <option value="approved">APPROVED (Seat Allotted)</option>
                  <option value="contacted">CONTACTED (Follow-up)</option>
                  <option value="follow-up">FOLLOW-UP (Need Docs)</option>
                  <option value="rejected">REJECTED (Declined)</option>
                  <option value="resolved">RESOLVED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Parent</span>
                </a>
                <Button
                  onClick={() => setSelectedEnquiry(null)}
                  variant="secondary"
                  size="sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
