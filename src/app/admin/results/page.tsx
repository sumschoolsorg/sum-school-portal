'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { DataTable, Column } from '@/components/ui/DataTable';
import { studentResultRepository, announcementRepository } from '@/lib/repositories';
import { StudentResult, SubjectScore } from '@/types';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  PlusCircle,
  X,
  Download,
  UploadCloud,
  FileSpreadsheet,
  AlertCircle,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface ParsedUploadRow {
  rollNumber: string;
  registerNumber: string;
  studentName: string;
  studentName_ta?: string;
  dob: string;
  className: string;
  section: string;
  examName: string;
  academicYear: string;
  tamil: number;
  english: number;
  mathematics: number;
  science: number;
  socialScience: number;
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  overallGrade: string;
  resultStatus: 'PASS' | 'FAIL';
  remarks: string;
  isValid: boolean;
  isExisting: boolean;
  existingId?: string;
  errors: string[];
}

export default function AdminResultsPage() {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<StudentResult | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Bulk Upload State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkCsvText, setBulkCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedUploadRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [broadcastAnnouncement, setBroadcastAnnouncement] = useState(true);
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<StudentResult>>({
    rollNumber: '',
    registerNumber: '',
    studentName: '',
    studentName_ta: '',
    dob: '2010-05-14',
    className: '10th Standard (SSLC)',
    section: 'A',
    examName: 'Tamil Nadu SSLC Annual Board Examination',
    academicYear: '2025–2026',
    subjects: [],
    totalMarks: 0,
    totalMaxMarks: 500,
    percentage: 0,
    overallGrade: 'Distinction (A1)',
    resultStatus: 'PASS',
    remarks: 'Good academic performance.',
    issueDate: '2026-05-20',
    status: 'published',
  });

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await studentResultRepository.getAll();
      setResults(data || []);
    } catch (err) {
      console.error('Error loading student results:', err);
      toast.error('Failed to load student results.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    studentResultRepository.getAll().then((data) => {
      if (isMounted) {
        setResults(data || []);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (isMounted) {
        console.error('Error loading student results:', err);
        toast.error('Failed to load student results.');
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingResult(null);
    const initialSubjects: SubjectScore[] = [
      { code: '001', name: 'Tamil', maxMarks: 100, passingMarks: 35, marksObtained: 90, grade: 'A1', isPassed: true },
      { code: '002', name: 'English', maxMarks: 100, passingMarks: 35, marksObtained: 88, grade: 'A2', isPassed: true },
      { code: '003', name: 'Mathematics', maxMarks: 100, passingMarks: 35, marksObtained: 95, grade: 'A1', isPassed: true },
      { code: '004', name: 'Science', maxMarks: 100, passingMarks: 35, marksObtained: 92, grade: 'A1', isPassed: true },
      { code: '005', name: 'Social Science', maxMarks: 100, passingMarks: 35, marksObtained: 89, grade: 'A2', isPassed: true },
    ];

    const total = initialSubjects.reduce((acc, s) => acc + s.marksObtained, 0);
    const totalMax = initialSubjects.reduce((acc, s) => acc + s.maxMarks, 0);
    const pct = totalMax > 0 ? parseFloat(((total / totalMax) * 100).toFixed(2)) : 0;

    setFormData({
      rollNumber: `SUM2026-${1000 + results.length + 1}`,
      registerNumber: `TN-SSLC-${332508100 + results.length + 1}`,
      studentName: '',
      studentName_ta: '',
      dob: '2010-06-15',
      className: '10th Standard (SSLC)',
      section: 'A',
      examName: 'Tamil Nadu SSLC Annual Board Examination',
      academicYear: '2025–2026',
      subjects: initialSubjects,
      totalMarks: total,
      totalMaxMarks: totalMax,
      percentage: pct,
      overallGrade: pct >= 90 ? 'Distinction (A1)' : pct >= 75 ? 'First Class (A)' : 'Pass (B)',
      resultStatus: 'PASS',
      remarks: 'Certified under State Board Regulations.',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (res: StudentResult) => {
    setEditingResult(res);
    setFormData({ ...res });
    setIsModalOpen(true);
  };

  const handleAddSubject = () => {
    const current = formData.subjects || [];
    const newSubject: SubjectScore = {
      code: `00${current.length + 1}`,
      name: 'New Subject',
      maxMarks: 100,
      passingMarks: 35,
      marksObtained: 80,
      grade: 'A',
      isPassed: true,
    };
    recalculateScores([...current, newSubject]);
  };

  const handleRemoveSubject = (idx: number) => {
    const current = [...(formData.subjects || [])];
    current.splice(idx, 1);
    recalculateScores(current);
  };

  const handleUpdateSubject = (idx: number, field: keyof SubjectScore, val: SubjectScore[keyof SubjectScore]) => {
    const current = [...(formData.subjects || [])];
    const sub = { ...current[idx], [field]: val };

    if (field === 'marksObtained' || field === 'maxMarks' || field === 'passingMarks') {
      const obtained = Number(field === 'marksObtained' ? val : sub.marksObtained);
      const pass = Number(field === 'passingMarks' ? val : sub.passingMarks);
      sub.isPassed = obtained >= pass;
      sub.grade = obtained >= 90 ? 'A1' : obtained >= 80 ? 'A2' : obtained >= 70 ? 'B1' : obtained >= 60 ? 'B2' : obtained >= 35 ? 'C' : 'F';
    }

    current[idx] = sub;
    recalculateScores(current);
  };

  const recalculateScores = (subs: SubjectScore[]) => {
    const total = subs.reduce((acc, s) => acc + Number(s.marksObtained || 0), 0);
    const totalMax = subs.reduce((acc, s) => acc + Number(s.maxMarks || 0), 0);
    const pct = totalMax > 0 ? parseFloat(((total / totalMax) * 100).toFixed(2)) : 0;
    const allPassed = subs.every((s) => s.isPassed);

    setFormData({
      ...formData,
      subjects: subs,
      totalMarks: total,
      totalMaxMarks: totalMax,
      percentage: pct,
      resultStatus: allPassed ? 'PASS' : 'FAIL',
      overallGrade: !allPassed
        ? 'Fail (Arrears)'
        : pct >= 90
        ? 'Distinction (A1)'
        : pct >= 75
        ? 'First Class (A)'
        : pct >= 60
        ? 'Second Class (B)'
        : 'Third Class (C)',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rollNumber || !formData.studentName) {
      toast.error('Please enter student name and roll number.');
      return;
    }

    try {
      if (editingResult && editingResult.id) {
        await studentResultRepository.update(editingResult.id, {
          ...formData,
          totalMarks: Number(formData.totalMarks),
          totalMaxMarks: Number(formData.totalMaxMarks),
          percentage: Number(formData.percentage),
        });
        toast.success('Student result updated successfully.');
      } else {
        await studentResultRepository.create({
          ...formData,
          rollNumber: formData.rollNumber || '',
          registerNumber: formData.registerNumber || formData.rollNumber || '',
          studentName: formData.studentName || '',
          dob: formData.dob || '2010-01-01',
          className: formData.className || '10th Standard',
          examName: formData.examName || 'Board Examination',
          academicYear: formData.academicYear || '2025–2026',
          subjects: formData.subjects || [],
          totalMarks: Number(formData.totalMarks || 0),
          totalMaxMarks: Number(formData.totalMaxMarks || 500),
          percentage: Number(formData.percentage || 0),
          overallGrade: formData.overallGrade || 'Distinction',
          resultStatus: formData.resultStatus || 'PASS',
          issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
          status: formData.status || 'published',
        } as Omit<StudentResult, 'id'>);
        toast.success('Student mark sheet created.');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Save failed:', err);
      toast.error('Failed to save student mark sheet.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await studentResultRepository.delete(deleteTargetId);
      toast.success('Record deleted successfully.');
      setDeleteTargetId(null);
      loadData();
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete student result.');
    }
  };

  // -------------------------------------------------------------
  // CSV Template Download & Bulk Upload Logic
  // -------------------------------------------------------------
  const handleDownloadTemplate = () => {
    const csvHeader = 'RollNumber,RegisterNumber,StudentName,StudentNameTa,DOB,Class,Section,ExamName,AcademicYear,Tamil,English,Mathematics,Science,SocialScience,Remarks\n';
    const sampleRows = [
      'SUM2026-1004,TN-SSLC-332508104,R. Dhanush Kumar,ரா. தனுஷ் குமார்,2010-04-12,10th Standard (SSLC),A,Tamil Nadu SSLC Annual Board Examination,2025–2026,94,89,98,96,92,Outstanding Academic Performance - School Top 5',
      'SUM2026-1005,TN-SSLC-332508105,M. Harini Priya,மு. ஹரிணி பிரியா,2010-08-23,10th Standard (SSLC),A,Tamil Nadu SSLC Annual Board Examination,2025–2026,91,92,90,95,88,Distinction in Mathematics and Science',
      'SUM2026-1006,TN-SSLC-332508106,S. Vignesh,எஸ். விக்னேஷ்,2010-11-05,10th Standard (SSLC),B,Tamil Nadu SSLC Annual Board Examination,2025–2026,85,84,88,89,82,First Class with Distinction',
    ].join('\n');

    const fullCsv = csvHeader + sampleRows;
    const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'SUM_School_Marksheet_Bulk_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Official Excel/CSV marksheet template downloaded.');
  };

  const parseCsvContent = (text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length < 2) {
      toast.error('CSV must have a header row and at least one student data row.');
      setParsedRows([]);
      return;
    }

    const header = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[\s_-]/g, ''));

    // Map column indices
    const colIdx = {
      rollNumber: header.findIndex((h) => h.includes('roll')),
      registerNumber: header.findIndex((h) => h.includes('reg') || h.includes('register')),
      studentName: header.findIndex((h) => h === 'studentname' || h === 'name'),
      studentName_ta: header.findIndex((h) => h.includes('ta') || h.includes('tamil')),
      dob: header.findIndex((h) => h.includes('dob') || h.includes('birth')),
      className: header.findIndex((h) => h.includes('class') || h.includes('std')),
      section: header.findIndex((h) => h.includes('sec') || h.includes('section')),
      examName: header.findIndex((h) => h.includes('exam')),
      academicYear: header.findIndex((h) => h.includes('year') || h.includes('academic')),
      tamil: header.findIndex((h) => h === 'tamil' || h.includes('lang')),
      english: header.findIndex((h) => h === 'english' || h.includes('eng')),
      mathematics: header.findIndex((h) => h === 'mathematics' || h === 'maths' || h.includes('math')),
      science: header.findIndex((h) => h === 'science' || h.includes('sci')),
      socialScience: header.findIndex((h) => h.includes('social') || h.includes('soc')),
      remarks: header.findIndex((h) => h.includes('remark') || h.includes('note')),
    };

    const seenRollsInFile = new Set<string>();
    const parsed: ParsedUploadRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowStr = lines[i];
      // Basic CSV field parser respecting commas
      const rawCols: string[] = [];
      let inQuotes = false;
      let cur = '';
      for (let c = 0; c < rowStr.length; c++) {
        const ch = rowStr[c];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          rawCols.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      rawCols.push(cur.trim());

      const getVal = (idx: number, fallback = '') => (idx >= 0 && rawCols[idx] ? rawCols[idx].replace(/^"|"$/g, '') : fallback);

      const rollNumber = getVal(colIdx.rollNumber);
      const registerNumber = getVal(colIdx.registerNumber, rollNumber);
      const studentName = getVal(colIdx.studentName);
      const studentName_ta = getVal(colIdx.studentName_ta);
      const dob = getVal(colIdx.dob, '2010-06-15');
      const className = getVal(colIdx.className, '10th Standard (SSLC)');
      const section = getVal(colIdx.section, 'A');
      const examName = getVal(colIdx.examName, 'Tamil Nadu SSLC Annual Board Examination');
      const academicYear = getVal(colIdx.academicYear, '2025–2026');
      const remarks = getVal(colIdx.remarks, 'State Board Certified');

      const parseMark = (idx: number) => {
        const val = getVal(idx);
        const num = parseFloat(val);
        return isNaN(num) ? -1 : num;
      };

      const mTamil = parseMark(colIdx.tamil);
      const mEng = parseMark(colIdx.english);
      const mMath = parseMark(colIdx.mathematics);
      const mSci = parseMark(colIdx.science);
      const mSoc = parseMark(colIdx.socialScience);

      const errors: string[] = [];

      if (!rollNumber) errors.push('Missing Roll Number');
      if (!studentName) errors.push('Missing Student Name');

      if (rollNumber) {
        if (seenRollsInFile.has(rollNumber.toUpperCase())) {
          errors.push(`Duplicate Roll Number in file: ${rollNumber}`);
        }
        seenRollsInFile.add(rollNumber.toUpperCase());
      }

      const checkSubjectMark = (val: number, name: string) => {
        if (val < 0 || val > 100) {
          errors.push(`Invalid mark for ${name} (${val}). Must be 0–100.`);
        }
      };

      checkSubjectMark(mTamil, 'Tamil');
      checkSubjectMark(mEng, 'English');
      checkSubjectMark(mMath, 'Mathematics');
      checkSubjectMark(mSci, 'Science');
      checkSubjectMark(mSoc, 'Social Science');

      // Check existing in DB
      const existing = results.find(
        (r) =>
          r.rollNumber.toUpperCase() === (rollNumber || '').toUpperCase() ||
          (registerNumber && r.registerNumber.toUpperCase() === registerNumber.toUpperCase())
      );

      const total = Math.max(0, mTamil) + Math.max(0, mEng) + Math.max(0, mMath) + Math.max(0, mSci) + Math.max(0, mSoc);
      const totalMax = 500;
      const pct = parseFloat(((total / totalMax) * 100).toFixed(2));
      const allPassed = mTamil >= 35 && mEng >= 35 && mMath >= 35 && mSci >= 35 && mSoc >= 35;
      const resultStatus: 'PASS' | 'FAIL' = allPassed ? 'PASS' : 'FAIL';

      const overallGrade = !allPassed
        ? 'Fail (Arrears)'
        : pct >= 90
        ? 'Distinction (A1)'
        : pct >= 75
        ? 'First Class (A)'
        : pct >= 60
        ? 'Second Class (B)'
        : 'Third Class (C)';

      parsed.push({
        rollNumber,
        registerNumber,
        studentName,
        studentName_ta,
        dob,
        className,
        section,
        examName,
        academicYear,
        tamil: mTamil >= 0 ? mTamil : 0,
        english: mEng >= 0 ? mEng : 0,
        mathematics: mMath >= 0 ? mMath : 0,
        science: mSci >= 0 ? mSci : 0,
        socialScience: mSoc >= 0 ? mSoc : 0,
        totalMarks: total,
        totalMaxMarks: totalMax,
        percentage: pct,
        overallGrade,
        resultStatus,
        remarks,
        isValid: errors.length === 0,
        isExisting: Boolean(existing),
        existingId: existing?.id,
        errors,
      });
    }

    setParsedRows(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setBulkCsvText(text);
      parseCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setBulkCsvText(text);
    parseCsvContent(text);
  };

  const handleExecuteImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error('No valid records to import. Please resolve the errors shown.');
      return;
    }

    try {
      setIsImporting(true);
      let createdCount = 0;
      let updatedCount = 0;

      for (const row of validRows) {
        const subjects: SubjectScore[] = [
          { code: '001', name: 'Tamil', maxMarks: 100, passingMarks: 35, marksObtained: row.tamil, grade: row.tamil >= 90 ? 'A1' : row.tamil >= 75 ? 'A' : row.tamil >= 35 ? 'B' : 'F', isPassed: row.tamil >= 35 },
          { code: '002', name: 'English', maxMarks: 100, passingMarks: 35, marksObtained: row.english, grade: row.english >= 90 ? 'A1' : row.english >= 75 ? 'A' : row.english >= 35 ? 'B' : 'F', isPassed: row.english >= 35 },
          { code: '003', name: 'Mathematics', maxMarks: 100, passingMarks: 35, marksObtained: row.mathematics, grade: row.mathematics >= 90 ? 'A1' : row.mathematics >= 75 ? 'A' : row.mathematics >= 35 ? 'B' : 'F', isPassed: row.mathematics >= 35 },
          { code: '004', name: 'Science', maxMarks: 100, passingMarks: 35, marksObtained: row.science, grade: row.science >= 90 ? 'A1' : row.science >= 75 ? 'A' : row.science >= 35 ? 'B' : 'F', isPassed: row.science >= 35 },
          { code: '005', name: 'Social Science', maxMarks: 100, passingMarks: 35, marksObtained: row.socialScience, grade: row.socialScience >= 90 ? 'A1' : row.socialScience >= 75 ? 'A' : row.socialScience >= 35 ? 'B' : 'F', isPassed: row.socialScience >= 35 },
        ];

        const payload: Omit<StudentResult, 'id'> = {
          rollNumber: row.rollNumber,
          registerNumber: row.registerNumber,
          studentName: row.studentName,
          studentName_ta: row.studentName_ta,
          dob: row.dob,
          className: row.className,
          section: row.section,
          examName: row.examName,
          academicYear: row.academicYear,
          subjects,
          totalMarks: row.totalMarks,
          totalMaxMarks: row.totalMaxMarks,
          percentage: row.percentage,
          overallGrade: row.overallGrade,
          resultStatus: row.resultStatus,
          remarks: row.remarks,
          issueDate: new Date().toISOString().split('T')[0],
          status: 'published',
        };

        if (row.isExisting && row.existingId) {
          await studentResultRepository.update(row.existingId, payload);
          updatedCount++;
        } else {
          await studentResultRepository.create(payload);
          createdCount++;
        }
      }

      // Broadcast announcement if selected
      if (broadcastAnnouncement) {
        try {
          const distinctExam = validRows[0]?.examName || 'Board Examination';
          const distinctYear = validRows[0]?.academicYear || '2025–2026';
          await announcementRepository.create({
            title: `Official Results Published: ${distinctExam} (${distinctYear})`,
            title_ta: `அதிகாரப்பூர்வ தேர்வு முடிவுகள் வெளியிடப்பட்டன: ${distinctExam}`,
            content: `Student marksheets for ${distinctExam} have been verified and published. Students can check and print their marksheet online with their Roll Number.`,
            content_ta: `மாணவர்களின் தேர்வு முடிவுகள் சரிபார்க்கப்பட்டு வெளியிடப்பட்டுள்ளன. ரோல் எண் மூலம் இணையத்தில் சரிபார்க்கலாம்.`,
            category: 'exam',
            priority: 'urgent',
            status: 'published',
            publishDate: new Date().toISOString().split('T')[0],
            link: '/results',
          });
          toast.success('Live announcement ticker updated with result notification.');
        } catch (annErr) {
          console.warn('Failed to post announcement:', annErr);
        }
      }

      toast.success(`Import complete! ${createdCount} created, ${updatedCount} updated.`);
      setIsBulkModalOpen(false);
      setParsedRows([]);
      setBulkCsvText('');
      loadData();
    } catch (err) {
      console.error('Bulk import error:', err);
      toast.error('Bulk import failed. Check database connection.');
    } finally {
      setIsImporting(false);
    }
  };

  const columns: Column<StudentResult>[] = [
    {
      key: 'rollNumber',
      label: 'Student & Roll No.',
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{item.studentName}</span>
              {item.studentName_ta && (
                <span className="text-xs text-slate-500 font-normal">({item.studentName_ta})</span>
              )}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">
              {item.rollNumber} &bull; Reg: {item.registerNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'className',
      label: 'Class & Exam',
      render: (item) => (
        <div className="text-xs">
          <div className="font-semibold text-slate-800 dark:text-slate-200">{item.className}</div>
          <div className="text-slate-500">{item.examName}</div>
        </div>
      ),
    },
    {
      key: 'totalMarks',
      label: 'Score & Percentage',
      render: (item) => (
        <div className="text-xs">
          <div className="font-black text-slate-900 dark:text-white">
            {item.totalMarks} / {item.totalMaxMarks}
            <span className="ml-1.5 font-bold text-blue-600 dark:text-blue-400">
              ({item.percentage}%)
            </span>
          </div>
          <div className="text-slate-500 text-[11px]">{item.overallGrade}</div>
        </div>
      ),
    },
    {
      key: 'resultStatus',
      label: 'Result',
      render: (item) => (
        <Badge variant={item.resultStatus === 'PASS' ? 'success' : 'danger'}>
          {item.resultStatus}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Publishing',
      render: (item) => (
        <Badge variant={item.status === 'published' ? 'info' : 'neutral'}>
          {item.status === 'published' ? 'Published' : 'Draft'}
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
            title="Edit Marksheet"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTargetId(item.id || '')}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition cursor-pointer"
            title="Delete Marksheet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const updateCount = parsedRows.filter((r) => r.isValid && r.isExisting).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Student Exam Results & Marksheets</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage student marks, bulk upload Excel/CSV rosters, generate digital certificates, and publish scores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={handleDownloadTemplate}
            variant="secondary"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download CSV Template
          </Button>

          <Button
            onClick={() => {
              setParsedRows([]);
              setBulkCsvText('');
              setIsBulkModalOpen(true);
            }}
            variant="secondary"
            leftIcon={<UploadCloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          >
            Bulk Upload Marksheets
          </Button>

          <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Add Mark Sheet
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          columns={columns}
          data={results}
          searchKey="studentName"
          searchPlaceholder="Search student name, roll number, or class..."
          isLoading={isLoading}
        />
      </Card>

      {/* Manual Single Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResult ? 'Edit Student Mark Sheet' : 'Create Student Mark Sheet'}
      >
        <form onSubmit={handleSave} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Student Name (English)"
              required
              value={formData.studentName || ''}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              placeholder="e.g. S. Kavin Kumar"
            />
            <Input
              label="Student Name (Tamil)"
              value={formData.studentName_ta || ''}
              onChange={(e) => setFormData({ ...formData, studentName_ta: e.target.value })}
              placeholder="எ.கா: எஸ். கவின் குமார்"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Roll Number"
              required
              value={formData.rollNumber || ''}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
              placeholder="e.g. SUM2026-1001"
            />
            <Input
              label="Board Register Number"
              value={formData.registerNumber || ''}
              onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
              placeholder="e.g. TN-SSLC-332508101"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Date of Birth"
              type="date"
              required
              value={formData.dob || ''}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
            <Input
              label="Class & Stream"
              required
              value={formData.className || ''}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              placeholder="10th Standard (SSLC)"
            />
            <Input
              label="Section"
              value={formData.section || 'A'}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              placeholder="A / B"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Exam Title"
              required
              value={formData.examName || ''}
              onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
              placeholder="Tamil Nadu SSLC Annual Board Examination"
            />
            <Input
              label="Academic Year"
              value={formData.academicYear || '2025–2026'}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="2025–2026"
            />
          </div>

          {/* Dynamic Subject Marks Sub-Editor */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>Subject Scores ({formData.subjects?.length || 0})</span>
              </h4>
              <button
                type="button"
                onClick={handleAddSubject}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Subject</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.subjects?.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap sm:flex-nowrap items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Code"
                    value={sub.code}
                    onChange={(e) => handleUpdateSubject(idx, 'code', e.target.value)}
                    className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={sub.name}
                    onChange={(e) => handleUpdateSubject(idx, 'name', e.target.value)}
                    className="flex-1 min-w-[120px] px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500">Marks:</span>
                    <input
                      type="number"
                      value={sub.marksObtained}
                      onChange={(e) => handleUpdateSubject(idx, 'marksObtained', parseInt(e.target.value, 10))}
                      className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-center"
                    />
                    <span className="text-[10px] text-slate-500">/</span>
                    <input
                      type="number"
                      value={sub.maxMarks}
                      onChange={(e) => handleUpdateSubject(idx, 'maxMarks', parseInt(e.target.value, 10))}
                      className="w-16 px-2 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center"
                    />
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      sub.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {sub.isPassed ? 'PASS' : 'FAIL'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(idx)}
                    className="p-1 rounded text-slate-400 hover:text-rose-500 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Calculated Score Strip */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 grid grid-cols-3 gap-3 text-center text-xs">
            <div>
              <span className="text-slate-500">Total Score</span>
              <div className="font-black text-slate-900 dark:text-white mt-0.5">
                {formData.totalMarks} / {formData.totalMaxMarks}
              </div>
            </div>
            <div>
              <span className="text-slate-500">Percentage</span>
              <div className="font-black text-blue-700 dark:text-blue-300 mt-0.5">
                {formData.percentage}%
              </div>
            </div>
            <div>
              <span className="text-slate-500">Result</span>
              <div
                className={`font-black mt-0.5 ${
                  formData.resultStatus === 'PASS' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'
                }`}
              >
                {formData.resultStatus} ({formData.overallGrade})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Issue Date"
              type="date"
              value={formData.issueDate || ''}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            />
            <Select
              label="Publishing Status"
              value={formData.status || 'published'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentResult['status'] })}
              options={[
                { value: 'published', label: 'Published (Publicly Viewable)' },
                { value: 'draft', label: 'Draft (Internal Only)' },
              ]}
            />
          </div>

          <Input
            label="Remarks"
            value={formData.remarks || ''}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            placeholder="Official remarks or achievements..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingResult ? 'Update Mark Sheet' : 'Save Mark Sheet'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Upload Student Marksheets (Excel / CSV)"
      >
        <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
          {/* Instructions banner */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm mb-1">Spreadsheet Guidelines & Format</div>
              <p className="leading-relaxed">
                Upload your marksheet file or paste CSV rows. The system automatically computes total marks, percentage,
                grades, pass/fail status, and flags duplicate roll numbers before saving.
              </p>
              <div className="mt-2 text-[11px] font-mono opacity-80">
                Columns: RollNumber, RegisterNumber, StudentName, StudentNameTa, DOB, Class, Section, ExamName, AcademicYear, Tamil, English, Mathematics, Science, SocialScience, Remarks
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Upload CSV File
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                uploadMode === 'text'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              Paste CSV Text
            </button>
            <div className="ml-auto">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get Sample CSV</span>
              </button>
            </div>
          </div>

          {/* File Input Box */}
          {uploadMode === 'file' ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-500 transition cursor-pointer bg-slate-50/50 dark:bg-slate-900/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop CSV file
              </div>
              <div className="text-xs text-slate-500 mt-1">Exported from Microsoft Excel, Apple Numbers, or Google Sheets</div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Paste CSV Rows (with header line)
              </label>
              <textarea
                rows={5}
                value={bulkCsvText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="RollNumber,RegisterNumber,StudentName,..."
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Summary Strip if rows are parsed */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Parsed: {parsedRows.length} Rows</span>
                  <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    ✓ {validCount} Valid
                  </span>
                  {updateCount > 0 && (
                    <span className="text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                      ↻ {updateCount} Updates Existing
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full">
                      ✕ {errorCount} Errors
                    </span>
                  )}
                </div>
              </div>

              {/* Pre-Commit Validation Preview Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] font-black border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">Roll No.</th>
                      <th className="p-2.5">Student Name</th>
                      <th className="p-2.5 text-center">Marks (T/E/M/S/SS)</th>
                      <th className="p-2.5 text-center">Total</th>
                      <th className="p-2.5 text-center">Result</th>
                      <th className="p-2.5">Validation Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-sans">
                    {parsedRows.map((r, idx) => (
                      <tr
                        key={idx}
                        className={
                          !r.isValid
                            ? 'bg-rose-50/60 dark:bg-rose-950/20'
                            : r.isExisting
                            ? 'bg-amber-50/40 dark:bg-amber-950/20'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
                        }
                      >
                        <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {r.rollNumber || <span className="text-rose-500 italic">Empty</span>}
                        </td>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                          {r.studentName || <span className="text-rose-500 italic">Empty</span>}
                        </td>
                        <td className="p-2.5 text-center font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          {r.tamil}/{r.english}/{r.mathematics}/{r.science}/{r.socialScience}
                        </td>
                        <td className="p-2.5 text-center font-black text-slate-900 dark:text-white">
                          {r.totalMarks} ({r.percentage}%)
                        </td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              r.resultStatus === 'PASS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {r.resultStatus}
                          </span>
                        </td>
                        <td className="p-2.5">
                          {r.isValid ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Check className="w-3.5 h-3.5" />
                              <span>{r.isExisting ? 'Will Update Existing' : 'Ready to Insert'}</span>
                            </div>
                          ) : (
                            <div className="text-rose-600 dark:text-rose-400 flex items-start gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>{r.errors.join('; ')}</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Broadcast Announcement Option */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="broadcastResults"
                  checked={broadcastAnnouncement}
                  onChange={(e) => setBroadcastAnnouncement(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
                <label htmlFor="broadcastResults" className="text-xs text-blue-900 dark:text-blue-200 cursor-pointer">
                  <span className="font-bold">Broadcast to Live Announcement Ticker</span>
                  <p className="text-[11px] opacity-80">
                    Immediately alert visitors on the homepage header that official board examination results are published.
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => {
                setIsBulkModalOpen(false);
                setParsedRows([]);
                setBulkCsvText('');
              }}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleExecuteImport}
              disabled={validCount === 0 || isImporting}
              isLoading={isImporting}
              leftIcon={<UploadCloud className="w-4 h-4" />}
            >
              {isImporting ? 'Importing Records...' : `Import ${validCount} Valid Marksheets`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Student Mark Sheet"
        message="Are you sure you want to delete this marksheet record? This action cannot be undone."
      />
    </div>
  );
}
