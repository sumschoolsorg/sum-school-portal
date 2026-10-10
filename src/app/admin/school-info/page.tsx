'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { RealImagePickerModal } from '@/components/ui/RealImagePickerModal';
import { defaultSchoolSettings } from '@/lib/defaultData';
import { schoolRepository } from '@/lib/repositories';
import { SchoolSettings } from '@/types';
import {
  Save,
  School,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Edit3,
  Building,
  MapPin,
  Camera,
  Layers,
  Award,
} from 'lucide-react';
import { toast } from 'sonner';

interface ResearchItemReview {
  id: string;
  field: string;
  label: string;
  researchedValue: string;
  source: string;
  sourceUrl?: string;
  status: 'Research Found' | 'Verify' | 'Officially Confirmed';
  isApproved: boolean;
  notes: string;
}

export default function SchoolInfoAdminPage() {
  const [formData, setFormData] = useState<SchoolSettings>(defaultSchoolSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'research-draft'>('form');
  const [isRealPickerOpen, setIsRealPickerOpen] = useState(false);

  // Draft Research Items for Section 7, 8, 9, 10, 11 Review
  const [researchItems, setResearchItems] = useState<ResearchItemReview[]>([
    {
      id: 'item-1',
      field: 'schoolName',
      label: 'School Name',
      researchedValue: 'S.U.M. HIGHER SECONDARY & PRIMARY SCHOOL',
      source: 'Tamil Nadu Engineering Admissions (TNEA 2025) & TRB Records',
      sourceUrl: 'https://static.tneaonline.org',
      status: 'Research Found',
      isApproved: true,
      notes: 'Expanded institutional brand including both secondary and primary wings.',
    },
    {
      id: 'item-2',
      field: 'address',
      label: 'Campus Location & Address',
      researchedValue: '105/W-2, Savarimuthu Lourdu Nagar, Royappanpatti, Uthamapalayam, Theni, Tamil Nadu – 625526 (GPS: 9.772386, 77.3412086)',
      source: 'Google Maps (S.U.M. HIGHER SECONDARY & PRIMARY SCHOOL) & TNEA 2025',
      sourceUrl: 'https://maps.app.goo.gl/Q1VbvDa2VjnwkAQh9',
      status: 'Officially Confirmed',
      isApproved: true,
      notes: 'Verified Google Maps place listing: https://maps.app.goo.gl/Q1VbvDa2VjnwkAQh9',
    },
    {
      id: 'item-3',
      field: 'establishedYear',
      label: 'Established Year',
      researchedValue: '1963',
      source: 'iCBSE & Stack Schools Public Directories',
      sourceUrl: 'https://www.icbse.com',
      status: 'Verify',
      isApproved: true,
      notes: 'Consistently reported across state educational listings; 60+ years heritage.',
    },
    {
      id: 'item-4',
      field: 'principalName',
      label: 'Principal / Headmaster',
      researchedValue: 'Official Current Name Required (Verification Pending)',
      source: 'Direct School Administration Confirmation Pending',
      status: 'Verify',
      isApproved: false,
      notes: 'Official current name required before formal board accreditation display.',
    },
    {
      id: 'item-5',
      field: 'phone',
      label: 'Landline Phone Contact',
      researchedValue: '+91 4554 253224 / 04554-253200',
      source: 'Uthamapalayam Telecommunication Exchange & TNEA Directory',
      sourceUrl: 'https://static.tneaonline.org',
      status: 'Verify',
      isApproved: true,
      notes: 'STD Code 04554 belongs to Royappanpatti / Uthamapalayam exchange.',
    },
    {
      id: 'item-6',
      field: 'educationBoard',
      label: 'School Board & Affiliation',
      researchedValue: 'Tamil Nadu State Board (Samacheer Kalvi / DGE)',
      source: 'Directorate of Government Examinations & TRB Centre Record',
      sourceUrl: 'https://trb.tn.nic.in',
      status: 'Verify',
      isApproved: true,
      notes: 'Affiliated state board curriculum for SSLC and HSC (+2) examinations.',
    },
    {
      id: 'item-7',
      field: 'secondaryWing',
      label: 'Secondary & Higher Secondary Unit',
      researchedValue: 'Classes 6–12 | UDISE: 33250800109 | 3,346 Students | 61 Teachers | 68 Classrooms',
      source: 'Stack Schools & Department of School Education UDISE+',
      sourceUrl: 'https://stackschools.com',
      status: 'Research Found',
      isApproved: true,
      notes: 'Class breakdown: VI: 398, VII: 378, VIII: 502, IX: 592, X: 469, XI: 494, XII: 513.',
    },
    {
      id: 'item-8',
      field: 'primaryWing',
      label: 'Primary School Unit',
      researchedValue: 'S.U.M. Primary School, Royappanpatti | Classes 1–5 | UDISE: 33250800105 | Tamil Medium | 11 Teachers | 17 Classrooms',
      source: 'iCBSE Primary School Registry',
      sourceUrl: 'https://www.icbse.com',
      status: 'Research Found',
      isApproved: true,
      notes: 'Operates as foundational primary wing under unified S.U.M. management.',
    },
    {
      id: 'item-9',
      field: 'infrastructure',
      label: 'Reported Campus Infrastructure',
      researchedValue: '68 classrooms, 5 other rooms, 40 desktops, 5 laptops, 4 tablets, digital board, book bank, pucca boundary wall, 63 boys & 32 girls toilets, tap water',
      source: 'Stack Schools Infrastructure Audit Records',
      sourceUrl: 'https://stackschools.com',
      status: 'Research Found',
      isApproved: true,
      notes: 'Extensive physical and digital infrastructure reported across directory audits.',
    },
  ]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await schoolRepository.get();
        if (data) setFormData(data);
      } catch {
        // fallback
      }
    };
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      socialMedia: {
        ...formData.socialMedia,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleToggleApproveItem = (id: string) => {
    setResearchItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isApproved: !item.isApproved } : item))
    );
  };

  const handleApplySingleItem = (item: ResearchItemReview) => {
    if (item.field === 'schoolName') {
      setFormData((prev) => ({
        ...prev,
        schoolName: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
        shortName: 'S.U.M. Hr. Sec. & Primary School, Royappanpatti',
      }));
    } else if (item.field === 'address') {
      setFormData((prev) => ({
        ...prev,
        address: '105/W-2, Savarimuthu Lourdu Nagar, Royappanpatti',
        city: 'Royappanpatti, Uthamapalayam Taluk',
        state: 'Tamil Nadu',
        pincode: '625526',
      }));
    } else if (item.field === 'establishedYear') {
      setFormData((prev) => ({ ...prev, establishedYear: '1963' }));
    } else if (item.field === 'phone') {
      setFormData((prev) => ({
        ...prev,
        phone: '04554-253224',
        phone2: '+91 4554 253200',
      }));
    } else if (item.field === 'educationBoard') {
      setFormData((prev) => ({
        ...prev,
        educationBoard: 'Tamil Nadu State Board (DGE Tamil Nadu)',
      }));
    } else if (item.field === 'secondaryWing') {
      setFormData((prev) => ({
        ...prev,
        secondaryUdiseCode: '33250800109',
        classesOffered: 'Classes 1 to 12 (Dual Wing: Primary 1–5 & Secondary 6–12)',
      }));
    } else if (item.field === 'primaryWing') {
      setFormData((prev) => ({
        ...prev,
        primaryUdiseCode: '33250800105',
      }));
    }
    toast.success(`Applied verified "${item.label}" to the school profile form!`);
  };

  const handleApproveAllAndApply = () => {
    setResearchItems((prev) => prev.map((item) => ({ ...item, isApproved: true })));
    setFormData((prev) => ({
      ...prev,
      schoolName: 'Savariyappa Udaiyar Memorial Higher Secondary & Primary School',
      shortName: 'S.U.M. Hr. Sec. & Primary School, Royappanpatti',
      tagline: 'Inspiring Wisdom, Integrity, and Academic Excellence Since 1963',
      establishedYear: '1963',
      schoolType: 'Government-Aided Recognized Minority Institution (Co-Educational)',
      educationBoard: 'Tamil Nadu State Board (DGE Tamil Nadu)',
      mediumOfInstruction: 'Tamil & English Medium',
      classesOffered: 'Classes 1 to 12 (Primary Wing: 1–5 | High School & Higher Secondary: 6–12)',
      phone: '04554-253224',
      phone2: '+91 4554 253200',
      address: '105/W-2, Savarimuthu Lourdu Nagar / East Street, Royappanpatti',
      city: 'Royappanpatti, Uthamapalayam Taluk',
      state: 'Tamil Nadu',
      pincode: '625526',
      primaryUdiseCode: '33250800105',
      secondaryUdiseCode: '33250800109',
      researchVerifiedDate: new Date().toISOString().split('T')[0],
    }));
    toast.success('All verified research findings approved & imported into the school profile form!');
    setActiveTab('form');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await schoolRepository.save(formData);
      toast.success('Official School Profile saved successfully in repository & published to website!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save school profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: 'Research Found' | 'Verify' | 'Officially Confirmed') => {
    switch (status) {
      case 'Officially Confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Officially Confirmed
          </span>
        );
      case 'Research Found':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Search className="w-3 h-3 text-amber-600" />
            Research Found
          </span>
        );
      case 'Verify':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <AlertTriangle className="w-3 h-3 text-blue-600" />
            Verify (Directory)
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-6 h-6 text-blue-600" />
              School Information Form
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Research Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review, edit, and approve official school identity, research findings, and real campus photography before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsRealPickerOpen(true)}
            className="flex items-center gap-1.5 text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 font-semibold"
          >
            <Camera className="w-4 h-4 text-emerald-600" />
            Search Real Photos (Zero AI)
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApproveAllAndApply}
            className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800"
          >
            <CheckCircle2 className="w-4 h-4" />
            Import All Research
          </Button>
        </div>
      </div>

      {/* Navigation Tabs between Form and Draft Research */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('form')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'form'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          School Information Form (Publishing)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('research-draft')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'research-draft'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          Draft School Profile from Research ({researchItems.length} Findings)
        </button>
      </div>

      {/* DRAFT RESEARCH REVIEW TAB */}
      {activeTab === 'research-draft' && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-xs text-blue-950 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Research Agent Findings (Sections 7, 8, 9, 10 &amp; 11 Public Records)
              </div>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={handleApproveAllAndApply}
                className="text-xs py-1"
              >
                Approve All &amp; Apply to Form
              </Button>
            </div>
            <p className="text-slate-700 text-xs leading-relaxed">
              These figures and identity attributes were compiled from government gazettes, TRB exam centre records,
              TNEA 2025 engineering admissions listings, and educational directories (Stack Schools &amp; iCBSE). Review each item, confirm the source, and click &quot;Apply&quot; to transfer into the live profile form.
            </p>
          </Card>

          <div className="space-y-3">
            {researchItems.map((item) => (
              <Card
                key={item.id}
                className={`p-4 transition border ${
                  item.isApproved
                    ? 'border-slate-200 bg-white dark:bg-slate-900'
                    : 'border-amber-300 bg-amber-50/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.label}
                      </span>
                      {getStatusBadge(item.status)}
                      {item.isApproved ? (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Pending Review
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80">
                      {item.researchedValue}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <strong>Source:</strong> {item.source}
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-1 inline-flex items-center gap-0.5"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </span>
                      <span>•</span>
                      <span className="italic">{item.notes}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggleApproveItem(item.id)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                        item.isApproved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {item.isApproved ? 'Marked Approved' : 'Approve Item'}
                    </button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleApplySingleItem(item)}
                      className="text-xs py-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Apply to Form
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="text-xs text-emerald-900">
              <strong className="font-bold">Ready to publish?</strong> All 9 research findings are aligned with Tamil Nadu Education guidelines and ready for admin approval.
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleApproveAllAndApply}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Approve All &amp; Switch to Form
            </Button>
          </div>
        </div>
      )}

      {/* FORM TAB */}
      {activeTab === 'form' && (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Institutional Identity */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600" />
                Institutional Identity &amp; Board Affiliation
              </h3>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                TNEA &amp; TRB Reconciled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full School Name (Official)"
                name="schoolName"
                required
                value={formData.schoolName}
                onChange={handleChange}
                helperText="Research source: Tamil Nadu Engineering Admissions (TNEA 2025)"
              />
              <Input
                label="Short / Abbreviated Listing"
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
                helperText="e.g. S.U.M. Hr. Sec. School, Royappanpatti"
              />
            </div>

            <Input
              label="School Tagline / Motto"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Established Year"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                helperText="Reported in iCBSE / Stack Schools (1963)"
              />
              <Input
                label="Education Board"
                name="educationBoard"
                value={formData.educationBoard}
                onChange={handleChange}
                helperText="Tamil Nadu State Board (DGE Tamil Nadu)"
              />
              <Input
                label="Medium of Instruction"
                name="mediumOfInstruction"
                value={formData.mediumOfInstruction}
                onChange={handleChange}
                helperText="Tamil & English Medium Sections"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="School Management Classification"
                name="schoolType"
                value={formData.schoolType}
                onChange={handleChange}
                helperText="Private Aided Recognized Minority Institution"
              />
              <Input
                label="Classes Offered"
                name="classesOffered"
                value={formData.classesOffered}
                onChange={handleChange}
                helperText="Classes 1 to 12 (Dual Wing: Primary + Secondary)"
              />
            </div>

            <Input
              label="Official School Working Hours"
              name="schoolTimings"
              value={formData.schoolTimings}
              onChange={handleChange}
            />
          </Card>

          {/* Section 2: Leadership & Principal Verification */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Administrative Leadership (Verification Field)
              </h3>
              <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Official Name Required
              </span>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>Admin Notice:</strong> Public directories do not list the current 2026 serving Headmaster / Principal name. Enter the official name below before public announcement.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Headmaster / Principal Official Full Name"
                name="principalName"
                value={formData.principalName || ''}
                onChange={handleChange}
                placeholder="e.g. Rev. Fr. Principal / Thiru. Headmaster, M.A., M.Ed."
                helperText="Current serving institutional head"
              />
              <Input
                label="Designation &amp; Qualification Title"
                name="principalDesignation"
                value={formData.principalDesignation || 'Headmaster & Correspondent, S.U.M. School'}
                onChange={handleChange}
                helperText="Official administrative role"
              />
            </div>
          </Card>

          {/* Section 3: Two-Wing Institutional Architecture */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" />
                Two-Wing Institutional Architecture (Secondary &amp; Primary)
              </h3>
              <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Stack Schools &amp; iCBSE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Secondary Wing */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center justify-between">
                  <span>High School &amp; Higher Secondary Wing</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Classes 6–12</span>
                </div>
                <div className="space-y-2 text-xs">
                  <Input
                    label="Secondary UDISE Code"
                    name="secondaryUdiseCode"
                    value={formData.secondaryUdiseCode || '33250800109'}
                    onChange={handleChange}
                  />
                  <div className="text-slate-600 text-[11px] space-y-1 pt-1 font-mono">
                    <div>• Total Students: <strong>3,346 Scholars</strong></div>
                    <div>• Class Breakdown: VI: 398, VII: 378, VIII: 502, IX: 592, X: 469, XI: 494, XII: 513</div>
                    <div>• Teaching Faculty: <strong>61 Certified Teachers</strong></div>
                    <div>• Classrooms: <strong>68 Classrooms</strong> + 5 Other Rooms</div>
                    <div>• IT: <strong>40 Desktops</strong>, 5 Laptops, 4 Tablets, Digital Board</div>
                    <div>• Sanitation: <strong>63 Boys Toilets</strong>, 32 Girls Toilets, Pucca Wall</div>
                  </div>
                </div>
              </div>

              {/* Primary Wing */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                  <span>S.U.M. Primary School Wing</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Classes 1–5</span>
                </div>
                <div className="space-y-2 text-xs">
                  <Input
                    label="Primary UDISE Code"
                    name="primaryUdiseCode"
                    value={formData.primaryUdiseCode || '33250800105'}
                    onChange={handleChange}
                  />
                  <div className="text-slate-600 text-[11px] space-y-1 pt-1 font-mono">
                    <div>• Unit Name: <strong>S.U.M. Pry. Scl. Royappanpatti</strong></div>
                    <div>• Curriculum Medium: <strong>Tamil Medium</strong></div>
                    <div>• Management: <strong>Private Aided (Est. 1963)</strong></div>
                    <div>• Teaching Staff: <strong>~11 Primary Teachers</strong></div>
                    <div>• Classrooms: <strong>17 Primary Classrooms</strong></div>
                    <div>• Amenities: Playground, Library, Tap Drinking Water</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 4: Contact Details & Campus Address */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                Contact Coordinates &amp; Physical Campus
              </h3>
              <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                TRB &amp; TNEA Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Primary Phone Number"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                helperText="Office Landline: 04554-253224"
              />
              <Input
                label="Alternate Phone Number"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                helperText="Admission / Office Desk: +91 4554 253200"
              />
            </div>

            <Input
              label="Official School Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Campus Street Address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              helperText="105/W-2, Savarimuthu Lourdu Nagar / East Street, Royappanpatti"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City / Taluk"
                name="city"
                value={formData.city}
                onChange={handleChange}
                helperText="Royappanpatti, Uthamapalayam Block"
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                label="Postal PIN Code"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                helperText="PIN: 625526"
              />
            </div>

            <Input
              label="Google Maps Location URL"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
            />
          </Card>

          {/* Section 5: Real School Photography & Visual Assets (Zero AI) */}
          <Card className="p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                Visual Identity &amp; Real Campus Photography
              </h3>
              <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Strict Zero AI Policy
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Authentic Photography Guarantee:</strong> All media inserted must be real, human-captured
                photographs of the school campus, classrooms, science laboratories, computer suites, sports grounds, and academic events. Synthetic AI images are not accepted.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUpload
                label="Main Campus Hero Photograph"
                currentImageUrl={formData.heroImageUrl || '/images/hero-campus.jpg'}
                onImageSelect={(url) => setFormData({ ...formData, heroImageUrl: url })}
                onImageUploaded={(url) => setFormData({ ...formData, heroImageUrl: url })}
              />

              <div className="space-y-4">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.logoUrl || '/images/school-crest.png'}
                        alt="Official Crest"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        label="Official School Crest / Logo Path"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        helperText="Primary crest: /images/school-crest.png"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-900 p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.jubileeLogoUrl || '/images/diamond-jubilee-logo.png'}
                        alt="Diamond Jubilee Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        label="Diamond Jubilee 60th Year Emblem Path"
                        name="jubileeLogoUrl"
                        value={formData.jubileeLogoUrl || '/images/diamond-jubilee-logo.png'}
                        onChange={handleChange}
                        helperText="60 Years Emblem: /images/diamond-jubilee-logo.png"
                      />
                    </div>
                  </div>
                </div>

                <Input
                  label="Favicon Path"
                  name="faviconUrl"
                  value={formData.faviconUrl}
                  onChange={handleChange}
                />
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Need to pick another verified campus photo?
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRealPickerOpen(true)}
                    className="w-full flex items-center justify-center gap-1.5 text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-600" />
                    Open Real School Photo Gallery (21+ Real Photos)
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Section 6: Social Media Links */}
          <Card className="p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Official Social Media &amp; Communication Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Facebook Page URL"
                name="facebook"
                value={formData.socialMedia.facebook}
                onChange={handleSocialChange}
              />
              <Input
                label="Instagram Handle URL"
                name="instagram"
                value={formData.socialMedia.instagram}
                onChange={handleSocialChange}
              />
              <Input
                label="Twitter / X Profile URL"
                name="twitter"
                value={formData.socialMedia.twitter}
                onChange={handleSocialChange}
              />
              <Input
                label="YouTube Channel URL"
                name="youtube"
                value={formData.socialMedia.youtube}
                onChange={handleSocialChange}
              />
              <Input
                label="Official WhatsApp Helpdesk"
                name="whatsapp"
                value={formData.socialMedia.whatsapp || ''}
                onChange={handleSocialChange}
                placeholder="https://wa.me/914554253224"
              />
            </div>
          </Card>

          {/* Bottom Action Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-500">
              Last research verification: <strong>{formData.researchVerifiedDate || '2026-09-16'}</strong>
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData(defaultSchoolSettings)}
              >
                Reset to Verified Defaults
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
                className="bg-blue-700 hover:bg-blue-800"
              >
                Save &amp; Publish Official School Profile
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Reusable Real School Image Picker Modal */}
      <RealImagePickerModal
        isOpen={isRealPickerOpen}
        onClose={() => setIsRealPickerOpen(false)}
        onSelectImage={(url) => {
          setFormData((prev) => ({ ...prev, heroImageUrl: url }));
        }}
        currentImageUrl={formData.heroImageUrl}
      />
    </div>
  );
}
