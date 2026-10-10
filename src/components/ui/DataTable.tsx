'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface Column<T> {
  header?: string;
  label?: string;
  accessorKey?: keyof T;
  key?: string;
  cell?: (item: T) => React.ReactNode;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  pageSize?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading?: boolean;
}

export function DataTable<T extends { id?: string }>({
  data,
  columns,
  searchPlaceholder = 'Search records...',
  searchKey,
  pageSize = 10,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items in this list.',
  onAddClick,
  addLabel = 'Add New',
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter
  const filteredData = useMemo(() => {
    if (!search.trim() || !searchKey) return data;
    const term = search.toLowerCase();
    return data.filter((item) => {
      const val = item[searchKey];
      return val ? String(val).toLowerCase().includes(term) : false;
    });
  }, [data, search, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const comparison = aVal > bVal ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortDirection]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Search & Actions Header */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full pl-9 pr-9 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 dark:text-white placeholder:text-slate-400 min-h-[44px]"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition cursor-pointer"
              aria-label="Clear search query"
            >
              <span className="text-xs font-bold leading-none">✕</span>
            </button>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-block sm:hidden text-[11px] text-blue-600 dark:text-blue-400 font-medium">
            Swipe table ↔
          </span>
          <span>
            Showing {paginatedData.length} of {filteredData.length} items
          </span>
        </div>
      </div>

      {/* Table / Empty state */}
      {isLoading ? (
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading records...</p>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title={search ? 'No matching records' : emptyTitle}
            description={
              search
                ? `No records match your search query "${search}". Try checking your spelling or reset filters.`
                : emptyDescription
            }
            actionLabel={search ? 'Clear Search' : onAddClick ? addLabel : undefined}
            onAction={
              search
                ? () => {
                    setSearch('');
                    setCurrentPage(1);
                  }
                : onAddClick
            }
          />
        </div>
      ) : (
        <div className="admin-table-wrapper overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={`px-6 py-3.5 ${
                      col.sortable ? 'cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-800' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.accessorKey)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header || col.label}</span>
                      {col.sortable && (
                        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.map((item, rowIdx) => (
                <tr
                  key={item.id || rowIdx}
                  className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.cell
                        ? col.cell(item)
                        : col.render
                        ? col.render(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '')
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 sm:p-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="text-slate-500 dark:text-slate-400 text-xs">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
