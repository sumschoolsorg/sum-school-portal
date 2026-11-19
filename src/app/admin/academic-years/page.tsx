'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ACADEMIC_YEARS_TABLE,
  CURRENT_ACADEMIC_YEAR,
} from '@/lib/academicYears';
import {
  Calendar,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Copy,
  GraduationCap,
  Award,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AcademicYearsAdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'past' | 'current' | 'upcoming'>('all');
  const [copiedYear, setCopiedYear] = useState<string | null>(null);

  const handleCopyYear = (year: string) => {
    navigator.clipboard.writeText(year);
    setCopiedYear(year);
    toast.success(`Copied "${year}" to clipboard!`);
    setTimeout(() => {
      setCopiedYear((prev) => (prev === year ? null : prev));
    }, 2000);
  };

  const filteredYears = useMemo(() => {
    return ACADEMIC_YEARS_TABLE.filter((item) => {
      // Classification filter
      if (activeFilter === 'past' && !item.isPast) return false;
      if (activeFilter === 'current' && !item.isCurrent) return false;
      if (activeFilter === 'upcoming' && !item.isUpcoming) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesYear = item.year.toLowerCase().includes(q);
        const matchesSNo = String(item.sNo) === q;
        const matchesMilestone = item.milestone?.toLowerCase().includes(q);
        const matchesStart = String(item.startYear).includes(q);
        const matchesEnd = String(item.endYear).includes(q);
        return matchesYear || matchesSNo || matchesMilestone || matchesStart || matchesEnd;
      }

      return true;
    });
  }, [searchQuery, activeFilter]);

  const handleExportCSV = () => {
    const headers = ['S.No', 'Academic Year', 'Start Year', 'End Year', 'Status', 'Milestone'];
    const rows = ACADEMIC_YEARS_TABLE.map((item) => [
      item.sNo,
      item.year,
      item.startYear,
      item.endYear,
      item.isCurrent ? 'Current Session' : item.isPast ? 'Past' : 'Upcoming',
      item.milestone ? `"${item.milestone}"` : '""',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sum_school_academic_years_2000_2041.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Academic Year Master Table exported to CSV.');
  };

  const totalCount = ACADEMIC_YEARS_TABLE.length;
  const pastCount = ACADEMIC_YEARS_TABLE.filter((y) => y.isPast).length;
  const currentCount = ACADEMIC_YEARS_TABLE.filter((y) => y.isCurrent).length;
  const upcomingCount = ACADEMIC_YEARS_TABLE.filter((y) => y.isUpcoming).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                School Academic Year Master Table
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative 41-year span (2000–2001 to 2040–2041) for S.U.M. Higher Secondary & Primary Schools
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Span</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalCount} Years</div>
          <div className="text-xs text-slate-500 mt-0.5">2000–2001 to 2040–2041</div>
        </Card>

        <Card className="p-4 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Current Session
          </div>
          <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1">
            {CURRENT_ACADEMIC_YEAR}
          </div>
          <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Active Academic Calendar</div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Past Sessions</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{pastCount} Years</div>
          <div className="text-xs text-slate-500 mt-0.5">2000–2001 to 2024–2025</div>
        </Card>

        <Card className="p-4 border-slate-200 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Future Sessions</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{upcomingCount} Years</div>
          <div className="text-xs text-slate-500 mt-0.5">2026–2027 to 2040–2041</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All Years (${totalCount})` },
              { id: 'current', label: `Current (${currentCount})` },
              { id: 'past', label: `Past Sessions (${pastCount})` },
              { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search year, e.g. 2025, Jubilee..."
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              className="text-xs"
            />
          </div>
        </div>
      </Card>

      {/* Authoritative 41-Year Table */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">S.No</th>
                <th className="py-3.5 px-4">Academic Year</th>
                <th className="py-3.5 px-4">Calendar Range</th>
                <th className="py-3.5 px-4">Session Status</th>
                <th className="py-3.5 px-4">Milestone / Special Notes</th>
                <th className="py-3.5 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredYears.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No academic years match your search query.
                  </td>
                </tr>
              ) : (
                filteredYears.map((item) => {
                  const isCurrent = item.isCurrent;
                  const isCopied = copiedYear === item.year;

                  return (
                    <tr
                      key={item.sNo}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* S.No */}
                      <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-slate-400">
                        {item.sNo}
                      </td>

                      {/* Academic Year */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-black tracking-tight ${
                              isCurrent
                                ? 'text-blue-700 dark:text-blue-400 text-base'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {item.year}
                          </span>
                          <button
                            onClick={() => handleCopyYear(item.year)}
                            title="Copy academic year string"
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Calendar Range */}
                      <td className="py-3.5 px-4 text-xs text-slate-500 font-mono">
                        June {item.startYear} – April {item.endYear}
                      </td>

                      {/* Session Status */}
                      <td className="py-3.5 px-4">
                        {isCurrent ? (
                          <Badge variant="accent" className="flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>Current Active Session</span>
                          </Badge>
                        ) : item.isPast ? (
                          <Badge variant="outline" className="text-slate-500 border-slate-300 dark:border-slate-700 w-fit">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            Past Session
                          </Badge>
                        ) : (
                          <Badge variant="info" className="w-fit">
                            <Sparkles className="w-3 h-3 mr-1 text-blue-400" />
                            Upcoming Session
                          </Badge>
                        )}
                      </td>

                      {/* Milestone / Notes */}
                      <td className="py-3.5 px-4 text-xs">
                        {item.milestone ? (
                          <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            🏆 {item.milestone}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Regular Academic Session</span>
                        )}
                      </td>

                      {/* Quick Links */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/gallery`}
                            title={`View Gallery for ${item.year}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/events`}
                            title={`View Events for ${item.year}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/achievements`}
                            title={`View Toppers for ${item.year}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition"
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/results`}
                            title={`View Exam Results for ${item.year}`}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs transition"
                          >
                            <Award className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
