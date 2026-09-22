'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { transportRepository } from '@/lib/repositories';
import { defaultTransportRoutes } from '@/lib/defaultData';
import { TransportRoute, TransportStop } from '@/types';
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Clock,
  MapPin,
  Users,
  PlusCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTransportPage() {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TransportRoute>>({
    routeNumber: 'Route 01',
    routeName: '',
    routeName_ta: '',
    busRegistrationNumber: '',
    driverName: '',
    driverPhone: '',
    conductorName: '',
    conductorPhone: '',
    capacity: 45,
    morningDepartureTime: '07:45 AM',
    eveningDepartureTime: '04:40 PM',
    startPoint: '',
    endPoint: 'S.U.M. School Campus, Royappanpatti',
    status: 'published',
    order: 1,
    notes: '',
    stops: [],
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await transportRepository.getAll();
      if (data && data.length > 0) {
        setRoutes(data);
      } else {
        setRoutes(defaultTransportRoutes);
      }
    } catch (err) {
      console.error('Error loading routes:', err);
      toast.error('Failed to load transport routes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    transportRepository.getAll().then((data) => {
      if (!isMounted) return;
      if (data && data.length > 0) {
        setRoutes(data);
      } else {
        setRoutes(defaultTransportRoutes);
      }
    }).catch((err) => {
      console.error('Error loading routes:', err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingRoute(null);
    setFormData({
      routeNumber: `Route 0${routes.length + 1}`,
      routeName: '',
      routeName_ta: '',
      busRegistrationNumber: 'TN 60 E ',
      driverName: '',
      driverPhone: '+91 ',
      conductorName: '',
      conductorPhone: '+91 ',
      capacity: 45,
      morningDepartureTime: '07:45 AM',
      eveningDepartureTime: '04:40 PM',
      startPoint: '',
      endPoint: 'S.U.M. School Campus, Royappanpatti',
      status: 'published',
      order: routes.length + 1,
      notes: '',
      stops: [
        {
          id: 'stop-1',
          name: 'First Town Stop',
          morningPickupTime: '07:45 AM',
          eveningDropTime: '05:30 PM',
          landmark: 'Main Bus Shelter',
          order: 1,
        },
        {
          id: 'stop-2',
          name: 'S.U.M. School Campus',
          morningPickupTime: '08:35 AM',
          eveningDropTime: '04:45 PM',
          landmark: 'School East Gate',
          order: 2,
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (route: TransportRoute) => {
    setEditingRoute(route);
    setFormData({ ...route });
    setIsModalOpen(true);
  };

  const handleAddStop = () => {
    const currentStops = formData.stops || [];
    const newStop: TransportStop = {
      id: `stop-${Date.now()}`,
      name: '',
      morningPickupTime: '08:00 AM',
      eveningDropTime: '05:15 PM',
      landmark: '',
      order: currentStops.length + 1,
    };
    setFormData({ ...formData, stops: [...currentStops, newStop] });
  };

  const handleRemoveStop = (index: number) => {
    const currentStops = [...(formData.stops || [])];
    currentStops.splice(index, 1);
    setFormData({ ...formData, stops: currentStops });
  };

  const handleUpdateStop = (index: number, field: keyof TransportStop, val: TransportStop[keyof TransportStop]) => {
    const currentStops = [...(formData.stops || [])];
    currentStops[index] = { ...currentStops[index], [field]: val };
    setFormData({ ...formData, stops: currentStops });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.routeNumber || !formData.routeName || !formData.driverName) {
      toast.error('Please enter Route Number, Route Name, and Driver Name.');
      return;
    }

    try {
      if (editingRoute && editingRoute.id) {
        await transportRepository.update(editingRoute.id, {
          ...formData,
          capacity: Number(formData.capacity || 45),
        });
        toast.success('Route updated successfully.');
      } else {
        await transportRepository.create({
          ...formData,
          routeNumber: formData.routeNumber || 'Route',
          routeName: formData.routeName || '',
          busRegistrationNumber: formData.busRegistrationNumber || '',
          driverName: formData.driverName || '',
          driverPhone: formData.driverPhone || '',
          capacity: Number(formData.capacity || 45),
          morningDepartureTime: formData.morningDepartureTime || '07:45 AM',
          eveningDepartureTime: formData.eveningDepartureTime || '04:40 PM',
          startPoint: formData.startPoint || 'Origin Point',
          endPoint: formData.endPoint || 'S.U.M. School Campus',
          stops: formData.stops || [],
          status: formData.status || 'published',
          order: Number(formData.order || 1),
        } as Omit<TransportRoute, 'id'>);
        toast.success('New transport route added.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Error saving route:', err);
      toast.error('Failed to save route.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await transportRepository.delete(deleteTargetId);
      toast.success('Route deleted successfully.');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete route.');
    }
  };

  const columns: Column<TransportRoute>[] = [
    {
      key: 'routeNumber',
      label: 'Route',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{item.routeNumber}:</span>
              <span>{item.routeName}</span>
            </div>
            <div className="text-xs text-slate-500">
              Bus Reg: {item.busRegistrationNumber} &bull; Cap: {item.capacity} seats
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'driverName',
      label: 'Driver & Contact',
      render: (item) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200">{item.driverName}</div>
          <div className="text-slate-500 flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3 text-emerald-500" />
            <span>{item.driverPhone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'stops',
      label: 'Schedule & Stops',
      render: (item) => (
        <div className="text-xs">
          <div className="font-medium text-slate-700 dark:text-slate-300">
            {item.stops?.length || 0} Designated Stops
          </div>
          <div className="text-slate-500 text-[11px]">
            {item.morningDepartureTime} &rarr; {item.eveningDepartureTime}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => (
        <Badge variant={item.status === 'published' ? 'success' : 'neutral'}>
          {item.status === 'published' ? 'Active' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Edit Route"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Route"
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
            <Bus className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Bus & Transport Fleet Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure bus routes, stops, morning/evening schedules, and driver emergency contacts.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add Transport Route
        </Button>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={routes}
          searchKey="routeName"
          searchPlaceholder="Search route name, driver, or bus..."
          isLoading={isLoading}
        />
      </Card>

      {/* Modal for Route & Stops */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRoute ? 'Edit Transport Route' : 'Add New Transport Route'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Route Identifier"
              required
              value={formData.routeNumber || ''}
              onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
              placeholder="e.g. Route 01"
            />
            <Input
              label="Bus Registration Number"
              required
              value={formData.busRegistrationNumber || ''}
              onChange={(e) => setFormData({ ...formData, busRegistrationNumber: e.target.value })}
              placeholder="e.g. TN 60 E 4821"
            />
          </div>

          <Input
            label="Route Name (English)"
            required
            value={formData.routeName || ''}
            onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
            placeholder="e.g. Cumbum Town & Uthamapalayam Express Route"
          />

          <Input
            label="Route Name (Tamil)"
            value={formData.routeName_ta || ''}
            onChange={(e) => setFormData({ ...formData, routeName_ta: e.target.value })}
            placeholder="எ.கா: கம்பம் & உத்தமபாளையம் விரைவு வழித்தடம்"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Driver Name"
              required
              value={formData.driverName || ''}
              onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
              placeholder="Thiru. M. Muthiah"
            />
            <Input
              label="Driver Phone"
              required
              value={formData.driverPhone || ''}
              onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
              placeholder="+91 94432 18901"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Morning Departure"
              value={formData.morningDepartureTime || '07:45 AM'}
              onChange={(e) => setFormData({ ...formData, morningDepartureTime: e.target.value })}
              placeholder="07:45 AM"
            />
            <Input
              label="Evening Departure"
              value={formData.eveningDepartureTime || '04:40 PM'}
              onChange={(e) => setFormData({ ...formData, eveningDepartureTime: e.target.value })}
              placeholder="04:40 PM"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Starting Location"
              value={formData.startPoint || ''}
              onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
              placeholder="Cumbum New Bus Stand"
            />
            <Input
              label="Destination / School Gate"
              value={formData.endPoint || ''}
              onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
              placeholder="S.U.M. School Campus"
            />
          </div>

          {/* Dynamic Stops Editor */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>Boarding Stops & Timings ({formData.stops?.length || 0})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddStop}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Stop</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.stops?.map((stop, sIdx) => (
                <div
                  key={stop.id || sIdx}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveStop(sIdx)}
                    className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-rose-500 transition cursor-pointer"
                    title="Remove Stop"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-xs font-bold text-slate-500 mb-2">Stop #{sIdx + 1}</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Stop Name (e.g. Cumbum Clock Tower)"
                      value={stop.name}
                      onChange={(e) => handleUpdateStop(sIdx, 'name', e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Landmark (e.g. Near SBI ATM)"
                      value={stop.landmark || ''}
                      onChange={(e) => handleUpdateStop(sIdx, 'landmark', e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold mb-0.5">Morning Pickup</span>
                      <input
                        type="text"
                        placeholder="07:45 AM"
                        value={stop.morningPickupTime}
                        onChange={(e) => handleUpdateStop(sIdx, 'morningPickupTime', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold mb-0.5">Evening Drop</span>
                      <input
                        type="text"
                        placeholder="05:30 PM"
                        value={stop.eveningDropTime}
                        onChange={(e) => handleUpdateStop(sIdx, 'eveningDropTime', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Select
            label="Publishing Status"
            value={formData.status || 'published'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TransportRoute['status'] })}
            options={[
              { value: 'published', label: 'Published (Active Route)' },
              { value: 'draft', label: 'Draft / Maintenance' },
            ]}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingRoute ? 'Update Route' : 'Save Route'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Transport Route"
        message="Are you sure you want to delete this bus route and its stop schedules?"
      />
    </div>
  );
}
