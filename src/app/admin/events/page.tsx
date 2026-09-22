'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { eventRepository, announcementRepository } from '@/lib/repositories';
import { defaultEvents } from '@/lib/defaultData';
import { SchoolEvent, Announcement } from '@/types';
import { Plus, Edit2, Trash2, Calendar, Star, Bell, MapPin, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function EventsAdminPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SchoolEvent | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<SchoolEvent>>({
    title: '',
    title_ta: '',
    description: '',
    description_ta: '',
    content: '',
    time: '9:30 AM – 3:30 PM',
    venue: 'S.U.M. Main Stage, Royappanpatti',
    venue_ta: 'எஸ்.யு.எம். பள்ளி பிரதான அரங்கம், ராயப்பன்பட்டி',
    category: 'cultural',
    academicYear: '2024–2025',
    calendarYear: 2025,
    month: 'March',
    chiefGuest: '',
    status: 'published',
    isFeatured: true,
    imageUrl: '/images/event-annual-day.jpg',
  });

  const [eventDateStr, setEventDateStr] = useState<string>(() =>
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [broadcastAnnouncement, setBroadcastAnnouncement] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await eventRepository.getAll();
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(defaultEvents);
      }
    } catch (err) {
      console.error('Error loading events:', err);
      toast.error('Failed to load events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    eventRepository.getAll().then((data) => {
      if (!isMounted) return;
      if (data && data.length > 0) {
        setEvents(data);
      } else {
        setEvents(defaultEvents);
      }
    }).catch((err) => {
      console.error('Error loading events:', err);
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setBroadcastAnnouncement(true);
    const nextDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setEventDateStr(nextDate);
    setFormData({
      title: '',
      title_ta: '',
      description: '',
      description_ta: '',
      content: '',
      time: '9:30 AM – 3:30 PM',
      venue: 'S.U.M. Main Stage, Royappanpatti',
      venue_ta: 'எஸ்.யு.எம். பள்ளி பிரதான அரங்கம், ராயப்பன்பட்டி',
      category: 'cultural',
      academicYear: '2024–2025',
      calendarYear: 2025,
      month: 'March',
      chiefGuest: '',
      status: 'published',
      isFeatured: true,
      imageUrl: '/images/event-annual-day.jpg',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: SchoolEvent) => {
    setEditingEvent(ev);
    setBroadcastAnnouncement(false);
    const raw = ev.date as { toDate?: () => Date } | Date | string | number | undefined;
    const d = raw && typeof raw === 'object' && 'toDate' in raw && typeof raw.toDate === 'function'
      ? raw.toDate()
      : raw instanceof Date
      ? raw
      : new Date((raw as string | number) || Date.now());
    setEventDateStr(d.toISOString().split('T')[0]);
    setFormData(ev);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast.error('Please enter event title.');
      return;
    }

    const finalDate = new Date(eventDateStr);

    try {
      if (editingEvent && editingEvent.id) {
        await eventRepository.update(editingEvent.id, {
          ...formData,
          date: finalDate,
        });
        toast.success('Event updated successfully!');
      } else {
        await eventRepository.create({
          ...formData,
          date: finalDate,
          endDate: null,
          createdAt: new Date(),
        });

        // Broadcast announcement if toggled
        if (broadcastAnnouncement && formData.status === 'published') {
          try {
            await announcementRepository.create({
              title: `Upcoming Event: ${formData.title} (${eventDateStr})`,
              title_en: `Upcoming Event: ${formData.title} (${eventDateStr})`,
              title_ta: `வரவிருக்கும் நிகழ்வு: ${formData.title_ta || formData.title}`,
              description: `${formData.description || ''} Venue: ${formData.venue || 'School Campus'}.`,
              description_en: `${formData.description || ''} Venue: ${formData.venue || 'School Campus'}.`,
              description_ta: `${formData.description_ta || formData.description || ''} இடம்: ${formData.venue_ta || formData.venue || 'பள்ளி வளாகம்'}.`,
              category: 'general',
              status: 'published',
              featured: true,
              date: new Date(),
              imageUrl: formData.imageUrl || '/images/event-annual-day.jpg',
            } as Omit<Announcement, 'id'>);
            toast.info('Broadcast announcement created on live header ticker!');
          } catch (annErr) {
            console.warn('Could not broadcast announcement:', annErr);
          }
        }

        toast.success('New event added to calendar!');
      }
      setIsModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error('Error saving event:', err);
      toast.error('Failed to save event.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await eventRepository.delete(deleteTargetId);
      toast.success('Event deleted.');
      setDeleteTargetId(null);
      loadEvents();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete event.');
    }
  };

  const columns: Column<SchoolEvent>[] = [
    {
      header: 'Event Title & Details',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
          />
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{item.title}</span>
              {item.isFeatured && (
                <span title="Featured Event">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                </span>
              )}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.venue}</div>
            {item.chiefGuest && (
              <div className="text-[11px] text-slate-400">Chief Guest: {item.chiefGuest}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      cell: (item) => (
        <div>
          <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
            {item.academicYear || '2024–2025'}
          </span>
          <div className="text-[11px] text-slate-400">{item.month || 'Scheduled'}</div>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (item) => <Badge variant="primary">{item.category.toUpperCase()}</Badge>,
    },
    {
      header: 'Timings',
      accessorKey: 'time',
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
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition cursor-pointer"
            title="Edit Event"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Event"
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
          <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Events Calendar & Archive Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule school celebrations, academic expos, sports days, and curate historical event archives.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add School Event
        </Button>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={events}
          searchKey="title"
          searchPlaceholder="Search events, venue, or chief guest..."
          isLoading={isLoading}
        />
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event Details' : 'Create School Event'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Title (English)"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual School Day & Cultural Extravaganza"
            />
            <Input
              label="Event Title (Tamil)"
              value={formData.title_ta || ''}
              onChange={(e) => setFormData({ ...formData, title_ta: e.target.value })}
              placeholder="எ.கா: பள்ளி ஆண்டு விழா மற்றும் கலைநிகழ்ச்சிகள்"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Event Date"
              type="date"
              required
              value={eventDateStr}
              onChange={(e) => setEventDateStr(e.target.value)}
            />
            <Input
              label="Time / Duration"
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 9:30 AM – 3:30 PM"
            />
            <Select
              label="Academic Year"
              value={formData.academicYear || '2024–2025'}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              options={[
                { value: '2025–2026', label: '2025–2026' },
                { value: '2024–2025', label: '2024–2025' },
                { value: '2023–2024', label: '2023–2024' },
                { value: '2022–2023', label: '2022–2023 (Diamond Jubilee)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Event Category"
              value={formData.category || 'cultural'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as SchoolEvent['category'] })}
              options={[
                { value: 'cultural', label: 'Cultural & Annual Day' },
                { value: 'academic', label: 'Academic & Science Expo' },
                { value: 'sports', label: 'Sports Meet & Athletics' },
                { value: 'celebration', label: 'National Festival & Celebration' },
                { value: 'general', label: 'General School Gathering' },
              ]}
            />
            <Select
              label="Calendar Month"
              value={formData.month || 'March'}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              options={[
                { value: 'January', label: 'January' },
                { value: 'February', label: 'February' },
                { value: 'March', label: 'March' },
                { value: 'April', label: 'April' },
                { value: 'May', label: 'May' },
                { value: 'June', label: 'June' },
                { value: 'July', label: 'July' },
                { value: 'August', label: 'August' },
                { value: 'September', label: 'September' },
                { value: 'October', label: 'October' },
                { value: 'November', label: 'November' },
                { value: 'December', label: 'December' },
              ]}
            />
          </div>

          {/* Time & Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Timings"
              value={formData.time || ''}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 9:00 AM – 3:30 PM"
              leftIcon={<Clock className="w-4 h-4" />}
            />
            <Input
              label="Venue (English)"
              value={formData.venue || ''}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. School Auditorium"
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Venue (Tamil)"
              value={formData.venue_ta || ''}
              onChange={(e) => setFormData({ ...formData, venue_ta: e.target.value })}
              placeholder="e.g. பள்ளி அரங்கம்"
            />
            <Input
              label="Chief Guest / Dignitary"
              value={formData.chiefGuest || ''}
              onChange={(e) => setFormData({ ...formData, chiefGuest: e.target.value })}
              placeholder="e.g. District Collector, Theni"
              leftIcon={<UserCheck className="w-4 h-4" />}
            />
          </div>

          {/* Image */}
          <ImageUpload
            label="Event Banner Image"
            folder="events"
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
          />

          {/* Full Content / Schedule */}
          <Textarea
            label="Detailed Event Agenda / Circular Notes"
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
            placeholder="Detailed program rundown, special guests, or student requirements..."
          />

          {/* Controls */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Publish Status:
              </label>
              <Select
                value={formData.status || 'published'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                options={[
                  { value: 'published', label: 'Published & Visible on Website' },
                  { value: 'draft', label: 'Draft / Unpublished' },
                ]}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="eventFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="eventFeatured" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Feature as Highlight Event on Homepage
              </label>
            </div>

            {!editingEvent && (
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="broadcastEventTicker"
                  checked={broadcastAnnouncement}
                  onChange={(e) => setBroadcastAnnouncement(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="broadcastEventTicker" className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" />
                  Automatically announce &quot;Upcoming Event&quot; on website header ticker
                </label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingEvent ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Event?"
        message="Are you sure you want to remove this event from the school calendar?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
