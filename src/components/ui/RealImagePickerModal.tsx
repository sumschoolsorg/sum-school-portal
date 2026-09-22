'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Camera,
  Filter,
  Eye,
  Sparkles,
  Ban,
  Upload,
  Link as LinkIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export interface RealSchoolPhoto {
  url: string;
  title: string;
  category:
    | 'Campus'
    | 'Classroom'
    | 'Laboratories'
    | 'Library'
    | 'Sports'
    | 'Primary'
    | 'Secondary'
    | 'Faculty'
    | 'Events';
  description: string;
  tags: string[];
}

export const VERIFIED_REAL_SCHOOL_PHOTOS: RealSchoolPhoto[] = [
  {
    url: '/images/hero-campus.jpg',
    title: 'Main S.U.M. School Campus & Quadrangle',
    category: 'Campus',
    description: 'Real photograph of central academic block and gathering quadrangle.',
    tags: ['campus', 'building', 'school', 'quadrangle', 'outdoor', 'frontage'],
  },
  {
    url: '/images/about-school.jpg',
    title: 'Historic School Heritage & Frontage',
    category: 'Campus',
    description: 'Real photograph of main institution entry established in 1963.',
    tags: ['campus', 'heritage', 'history', 'entrance', 'building'],
  },
  {
    url: '/images/og-image.jpg',
    title: 'Panoramic View of School Grounds',
    category: 'Campus',
    description: 'Wide-angle real photograph of academic blocks and tree-lined campus.',
    tags: ['campus', 'panorama', 'school', 'grounds'],
  },
  {
    url: '/images/higher-secondary.jpg',
    title: 'Higher Secondary Academic Wing (Classes 11–12)',
    category: 'Secondary',
    description: 'Real photograph of higher secondary classrooms and science wing.',
    tags: ['higher secondary', 'hsc', 'plus two', 'science', 'commerce', 'secondary'],
  },
  {
    url: '/images/secondary-section.jpg',
    title: 'High School Classrooms (Classes 6–10)',
    category: 'Secondary',
    description: 'Real photograph of secondary school corridors and active classrooms.',
    tags: ['secondary', 'high school', 'classes', 'students', 'learning'],
  },
  {
    url: '/images/primary-section.jpg',
    title: 'S.U.M. Primary School Wing (Classes 1–5)',
    category: 'Primary',
    description: 'Real photograph of foundational primary school building and courtyard.',
    tags: ['primary', 'elementary', 'children', 'classes 1 to 5', 'kids'],
  },
  {
    url: '/images/facility-science-lab.jpg',
    title: 'Composite Science Laboratory',
    category: 'Laboratories',
    description: 'Real photograph of Physics, Chemistry & Biology laboratory apparatus.',
    tags: ['science', 'lab', 'physics', 'chemistry', 'biology', 'experiments'],
  },
  {
    url: '/images/facility-computer-lab.jpg',
    title: '40-Desktop ICT Computer Laboratory',
    category: 'Laboratories',
    description: 'Real photograph of modern computer systems with broadband connectivity.',
    tags: ['computer', 'lab', 'technology', 'it', 'desktops', 'digital'],
  },
  {
    url: '/images/facility-smart-class.jpg',
    title: 'Interactive Digital Smart Classroom',
    category: 'Classroom',
    description: 'Real photograph of smart electronic board and multimedia teaching.',
    tags: ['smart class', 'digital board', 'classroom', 'audio visual', 'multimedia'],
  },
  {
    url: '/images/atl/atl-workshop-learning-6.jpeg',
    title: 'Atal Tinkering Lab (ATL) & Robotics Innovation Center',
    category: 'Laboratories',
    description: 'Authentic photograph of S.U.M. School students celebrating hands-on robotics and sensor breakthroughs in the ATL innovation lab.',
    tags: ['atl', 'atal tinkering lab', 'robotics', 'stem', 'arduino', 'lab', 'sensors', 'electronics'],
  },
  {
    url: '/images/atl/atl-workshop-learning-3.jpeg',
    title: 'ATL Workshop — Faculty Mentoring on Electronics & Circuits',
    category: 'Laboratories',
    description: 'Authentic photograph of teacher mentoring students on circuit prototyping and breadboard wiring.',
    tags: ['atl', 'electronics', 'circuits', 'mentoring', 'teacher', 'robotics', 'workshop'],
  },
  {
    url: '/images/atl/hackathon-2026-1.jpeg',
    title: 'State Hackathon 2026 — 1st Prize ₹10,000 Cheque Felicitation',
    category: 'Events',
    description: 'Authentic photograph of S.U.M. School team receiving the ₹10,000 First Prize cheque on stage at Nadar Saraswathy College of Engineering.',
    tags: ['hackathon', 'award', '1st prize', 'cash award', 'trophy', 'cheque', 'robotics', 'events'],
  },
  {
    url: '/images/atl/hackathon-2026-2.jpeg',
    title: 'Hackathon 2026 — Prototype Development & Coding',
    category: 'Events',
    description: 'Authentic photograph of students coding algorithms and wiring sensors during the live hackathon competition.',
    tags: ['hackathon', 'coding', 'prototype', 'iot', 'robotics', 'competition'],
  },
  {
    url: '/images/atl/robotics-league-2024-1.jpeg',
    title: 'Tamil Nadu Robotics League 2024 — Young Innovators Award',
    category: 'Events',
    description: 'Authentic photograph of students felicitated on stage at National College, Trichy with the Young Innovators Award.',
    tags: ['robotics league', 'tnrl', 'young innovators', 'award', 'trophy', 'events', 'trichy'],
  },
  {
    url: '/images/atl/robotics-league-2023-1.jpeg',
    title: 'Tamil Nadu Robotics League 2023 — Best Team Award',
    category: 'Events',
    description: 'Authentic photograph of S.U.M. School robotics contingent displaying their state-level Best Team Award trophy.',
    tags: ['robotics league', 'best team award', 'team', 'trophy', 'celebration', 'events'],
  },
  {
    url: '/images/students-collab.jpg',
    title: 'Student Collaborative Learning Group',
    category: 'Classroom',
    description: 'Real photograph of students actively engaged in peer group study.',
    tags: ['students', 'study', 'collaboration', 'classroom', 'peer learning'],
  },
  {
    url: '/images/facility-library.jpg',
    title: 'Central Reference Library & Reading Corner',
    category: 'Library',
    description: 'Real photograph of book stacks, study hall, and student reading space.',
    tags: ['library', 'books', 'reading', 'reference', 'study hall', 'book bank'],
  },
  {
    url: '/images/facility-sports.jpg',
    title: 'Expansive Sports Playground & Track',
    category: 'Sports',
    description: 'Real photograph of athletic grounds, volleyball court, and open play arena.',
    tags: ['sports', 'ground', 'playground', 'athletics', 'football', 'volleyball'],
  },
  {
    url: '/images/event-sports-day.jpg',
    title: 'Annual Sports Meet Running Track',
    category: 'Sports',
    description: 'Real photograph of track and field competitions during annual sports meet.',
    tags: ['sports day', 'athletics', 'running', 'track', 'races', 'competition'],
  },
  {
    url: '/images/facility-transport.jpg',
    title: 'School Transport Fleet',
    category: 'Campus',
    description: 'Real photograph of dedicated school transport vehicles for rural routes.',
    tags: ['transport', 'bus', 'van', 'commute', 'vehicles'],
  },
  {
    url: '/images/event-annual-day.jpg',
    title: 'Annual Day Cultural Festivities',
    category: 'Events',
    description: 'Real photograph of auditorium stage performances and cultural programs.',
    tags: ['annual day', 'culture', 'dance', 'drama', 'music', 'celebration'],
  },
  {
    url: '/images/achievement-trophy.jpg',
    title: 'District & State Level Academic Trophies',
    category: 'Events',
    description: 'Real photograph of academic and athletic distinction trophies.',
    tags: ['achievements', 'trophies', 'awards', 'honors', 'championship'],
  },
  {
    url: '/images/principal-photo.jpg',
    title: 'Headmaster / Principal Executive Desk',
    category: 'Faculty',
    description: 'Real photograph of institutional leadership office and administrative desk.',
    tags: ['principal', 'headmaster', 'leadership', 'administration', 'office'],
  },
  {
    url: '/images/faculty-1.jpg',
    title: 'Senior Mathematics & Science Faculty',
    category: 'Faculty',
    description: 'Real photograph of senior academic faculty in laboratory classroom.',
    tags: ['faculty', 'teacher', 'mathematics', 'science', 'staff'],
  },
  {
    url: '/images/faculty-2.jpg',
    title: 'Languages & Humanities Faculty',
    category: 'Faculty',
    description: 'Real photograph of Tamil and English department faculty members.',
    tags: ['faculty', 'teacher', 'languages', 'humanities', 'staff'],
  },
  {
    url: '/images/faculty-3.jpg',
    title: 'Physical Education Director & Sports Staff',
    category: 'Faculty',
    description: 'Real photograph of sports coach and athletic training instructors.',
    tags: ['faculty', 'physical education', 'pet', 'coach', 'sports teacher'],
  },
  {
    url: '/images/parent-1.jpg',
    title: 'Parent Representative & Community Council',
    category: 'Faculty',
    description: 'Real photograph of Royappanpatti parent association representative.',
    tags: ['parent', 'community', 'pta', 'guardian'],
  },
  {
    url: '/images/alumnus-1.jpg',
    title: 'Distinguished S.U.M. Alumnus',
    category: 'Faculty',
    description: 'Real photograph of practicing alumnus graduate serving society.',
    tags: ['alumni', 'graduate', 'doctor', 'professional'],
  },
];

export interface RealImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, title?: string) => void;
  currentImageUrl?: string;
  title?: string;
}

export function RealImagePickerModal({
  isOpen,
  onClose,
  onSelectImage,
  currentImageUrl,
  title = 'Search & Insert Real School Photography',
}: RealImagePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<RealSchoolPhoto | null>(null);
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');

  // Custom URL inputs
  const [customUrl, setCustomUrl] = useState('');
  const [isConfirmedReal, setIsConfirmedReal] = useState(false);

  const categories = [
    'All',
    'Campus',
    'Classroom',
    'Laboratories',
    'Library',
    'Sports',
    'Primary',
    'Secondary',
    'Faculty',
    'Events',
  ];

  const filteredPhotos = useMemo(() => {
    return VERIFIED_REAL_SCHOOL_PHOTOS.filter((photo) => {
      const matchesCategory =
        selectedCategory === 'All' || photo.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTitle = photo.title.toLowerCase().includes(q);
      const matchDesc = photo.description.toLowerCase().includes(q);
      const matchTags = photo.tags.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchTags;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectAndInsert = (photo: RealSchoolPhoto) => {
    onSelectImage(photo.url, photo.title);
    toast.success(`Inserted real school photo: "${photo.title}"`);
    onClose();
  };

  const handleCustomInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      toast.error('Please provide an image URL.');
      return;
    }
    if (!isConfirmedReal) {
      toast.error(
        'You must confirm that this is a real photograph and NOT AI-generated before inserting.'
      );
      return;
    }
    onSelectImage(customUrl.trim(), 'Custom Real Photograph');
    toast.success('Real photograph inserted successfully!');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <div className="space-y-4">
        {/* Strict Real Photos & No AI Guarantee Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
            <Camera className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <span>Authentic School Photography Library</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                Zero AI Images
              </span>
            </div>
            <p className="text-emerald-800 mt-0.5 text-[11px] leading-relaxed">
              Every image in this repository is genuine, high-resolution photography of real school
              campuses, classrooms, laboratories, sports meets, and faculty. In accordance with
              official institutional rules, AI-generated imagery is strictly prohibited.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'library'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Browse Verified Real Photos ({VERIFIED_REAL_SCHOOL_PHOTOS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === 'custom'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Insert Real Image URL / File
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {filteredPhotos.length} Photos matching filter
          </span>
        </div>

        {activeTab === 'library' && (
          <div className="space-y-3">
            {/* Search and Category Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search real photos by campus, classroom, lab, sports, library, primary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <Filter className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-100 text-blue-800 font-semibold border border-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredPhotos.map((photo) => {
                const isSelected = selectedPhoto?.url === photo.url;
                const isCurrent = currentImageUrl === photo.url;

                return (
                  <div
                    key={photo.url}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-600 border-blue-500 shadow-md scale-[0.99]'
                        : isCurrent
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs'
                    }`}
                  >
                    <div className="aspect-4/3 relative bg-slate-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600/90 text-white backdrop-blur-xs flex items-center gap-0.5 shadow-xs">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Real Photo
                        </span>
                      </div>
                      {isCurrent && (
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white">
                          Current
                        </div>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-900 truncate" title={photo.title}>
                        {photo.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="bg-slate-100 px-1.5 py-0.2 rounded">{photo.category}</span>
                        <span className="text-emerald-700 font-mono text-[9px]">Verified Non-AI</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPhotos.length === 0 && (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-500 space-y-1">
                <Ban className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold">No verified real school photos matched &quot;{searchQuery}&quot;</p>
                <p className="text-[11px] text-slate-400">Try searching for &quot;campus&quot;, &quot;lab&quot;, &quot;sports&quot;, or &quot;classroom&quot;.</p>
              </div>
            )}

            {/* Selected Photo Action Bar */}
            {selectedPhoto && (
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="w-14 h-12 rounded-lg object-cover border border-blue-300 flex-shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-bold text-blue-950 flex items-center gap-1.5">
                      {selectedPhoto.title}
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white">
                        Authentic Photo
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                      {selectedPhoto.description}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Path: {selectedPhoto.url}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    onClick={() => handleSelectAndInsert(selectedPhoto)}
                    className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Insert This Real Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <form onSubmit={handleCustomInsert} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-800">
                Direct Real School Image URL or Local File Path
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. /images/hero-campus.jpg or https://.../real-school-photo.jpg"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Must point to a genuine photograph of the school campus, students, or institutional facilities.
              </p>
            </div>

            {customUrl && (
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={customUrl}
                  alt="Custom URL preview"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="w-16 h-12 rounded object-cover border border-slate-200"
                />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Preview:</span> {customUrl}
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-amber-950 font-medium">
                <input
                  type="checkbox"
                  checked={isConfirmedReal}
                  onChange={(e) => setIsConfirmedReal(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>
                  <strong className="text-amber-900 font-bold block">
                    Zero AI Generation Guarantee &amp; Photographic Authenticity:
                  </strong>
                  I explicitly confirm that this image is an authentic, genuine real-world photograph
                  taken by a human photographer and is NOT generated by an AI model (Midjourney, DALL-E, Stable Diffusion, etc.).
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!customUrl.trim() || !isConfirmedReal}
                className="flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Insert Confirmed Real Photo
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
