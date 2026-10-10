'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StudentResult } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Award,
  Search,
  Printer,
  CheckCircle,
  XCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ResultsPage() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [rollNumber, setRollNumber] = useState('');
  const [dob, setDob] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<StudentResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [isLocalPreview, setIsLocalPreview] = useState(false);
  const [cloudGuidance, setCloudGuidance] = useState<{ message: string } | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanRoll = rollNumber.trim().toUpperCase();
    if (!cleanRoll) {
      toast.error(isTa ? 'பதிவு எண் அல்லது ரோல் எண்ணை உள்ளிடவும்.' : 'Please enter your Roll Number or Register Number.');
      return;
    }
    if (!dob) {
      toast.error(isTa ? 'சரிபார்ப்பிற்கு பிறந்த தேதியை உள்ளிடவும்.' : 'Please enter your Date of Birth for verification.');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setCloudGuidance(null);

    try {
      const res = await fetch('/api/results/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: cleanRoll, dob }),
      });

      const data = await res.json();

      if (res.status === 429) {
        toast.error(data.message || 'Rate limit exceeded. Please wait a moment.');
        setResult(null);
        return;
      }

      if (data.requiresAdminVerification || res.status === 503) {
        setCloudGuidance({
          message: data.message || 'Online result lookup requires examination office verification.',
        });
        setResult(null);
        toast.info(isTa ? 'பாதுகாக்கப்பட்ட தேர்வுத் துறை சரிபார்ப்பு தேவை.' : 'Official examination verification notice.');
        return;
      }

      if (data.success && data.result) {
        setResult(data.result);
        setIsLocalPreview(Boolean(data.isLocalPreview));
        toast.success(isTa ? 'தேர்வு முடிவுகள் கண்டறியப்பட்டன!' : 'Mark sheet retrieved successfully!');
      } else {
        setResult(null);
        toast.error(data.message || (isTa ? 'தேர்வு முடிவுகள் கிடைக்கவில்லை.' : 'No matching record found.'));
      }
    } catch (err) {
      console.error('Lookup request error:', err);
      toast.error(isTa ? 'பிழை ஏற்பட்டது. பின்னர் முயற்சிக்கவும்.' : 'Network error. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setRollNumber('');
    setDob('');
    setResult(null);
    setHasSearched(false);
    setCloudGuidance(null);
    setIsLocalPreview(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="print:hidden">
        <Header />
      </div>

      <main className="flex-1">
        {/* Page Hero */}
        <section className="print:hidden relative py-20 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Award className="w-4 h-4" />
              {isTa ? 'அரசுத் தேர்வு & மாதிரி தேர்வு முடிவுகள்' : 'Official Academic Marksheet Portal'}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? 'மாணவர் தேர்வு முடிவுகள் போர்டல்' : 'Student Examination Results'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {isTa
                ? 'உங்கள் ரோல் எண் அல்லது தேர்வு பதிவு எண் மற்றும் பிறந்த தேதியை உள்ளிட்டு டிஜிட்டல் மதிப்பெண் சான்றிதழைப் பெறலாம்.'
                : 'Enter your Examination Roll Number and Date of Birth to view, verify, and print your official digital mark sheet.'}
            </p>
          </div>
        </section>

        {/* Search Box */}
        <section className="print:hidden py-10 border-b border-slate-200 dark:border-slate-800">
          <div className="container-main max-w-3xl">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
              {cloudGuidance && (
                <div role="status" className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 dark:bg-blue-950/40 p-5 text-sm text-blue-950 dark:text-blue-100 space-y-2">
                  <div className="font-bold text-base flex items-center gap-2 text-blue-900 dark:text-blue-200">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    {isTa ? 'அதிகாரப்பூர்வ தேர்வுத் துறை அறிவிப்பு' : 'Official Examination Office Notice'}
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">{cloudGuidance.message}</p>
                </div>
              )}

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                      {isTa ? 'ரோல் எண் / பதிவு எண் *' : 'Roll No. / Register No. *'}
                    </label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. SUM2026-1001"
                        className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white uppercase focus:ring-2 focus:ring-blue-500 tracking-wider"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wide">
                      {isTa ? 'பிறந்த தேதி *' : 'Date of Birth (YYYY-MM-DD) *'}
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Search className="w-4 h-4" />
                    <span>{isSearching ? (isTa ? 'சரிபார்க்கிறது...' : 'Verifying...') : isTa ? 'மதிப்பெண்களைக் காண்க' : 'Verify & View Mark Sheet'}</span>
                  </button>

                  {(result || hasSearched) && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isTa ? 'மீண்டும் தேடு' : 'Reset'}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Results Marksheet Section */}
        <section className="py-12">
          <div className="container-main max-w-4xl">
            {hasSearched && !result && !cloudGuidance && (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {isTa ? 'மதிப்பெண் சான்றிதழ் கிடைக்கவில்லை' : 'Mark Sheet Not Found'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  {isTa
                    ? 'உள்ளிட்ட ரோல் எண் மற்றும் பிறந்த தேதியை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
                    : 'Please verify your Roll Number and Date of Birth and try again.'}
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {isLocalPreview && (
                  <div className="print:hidden rounded-2xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 p-4 text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      <span>{isTa ? 'கவனிக்க: இது மாதிரி முன்னோட்ட மதிப்பெண் சான்றிதழ் (டெமோ தரவு).' : 'Notice: This is a verified local demonstration/preview mark sheet.'}</span>
                    </div>
                    <span className="uppercase text-[10px] tracking-wider font-extrabold px-2 py-0.5 rounded bg-amber-200/80 text-amber-950">Preview Mode</span>
                  </div>
                )}

                {/* Print & Action Bar */}
                <div className="print:hidden flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{isTa ? 'அதிகாரப்பூர்வ பதிவு சரிபார்க்கப்பட்டது' : 'Official Record Verified'}</span>
                  </div>

                  <button
                    onClick={handlePrint}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>{isTa ? 'சான்றிதழை அச்சிடுக / PDF' : 'Print / Download Marksheet PDF'}</span>
                  </button>
                </div>

                {/* THE OFFICIAL MARKSHEET DOCUMENT */}
                <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-2 border-slate-300 shadow-2xl relative overflow-hidden print:p-0 print:border-none print:shadow-none">
                  {/* Decorative Border Ribbon for Certificate Authenticity */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900" />

                  {/* Marksheet Header */}
                  <div className="text-center pb-6 border-b-2 border-slate-900">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <div className="w-16 h-16 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/school-crest.png"
                          alt="S.U.M. School Crest"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-center">
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                          Savariyappa Udaiyar Memorial Hr. Sec. & Primary School
                        </h2>
                        <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mt-0.5">
                          Royappanpatti, Theni District, Tamil Nadu – 625526
                        </p>
                        <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          Recognized by Tamil Nadu School Education Board &bull; UDISE: 33250800109 &bull; Estd. 1963
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200">
                      <span className="inline-block px-4 py-1 rounded-full bg-blue-950 text-white font-black text-xs uppercase tracking-widest">
                        {result.examName} &bull; {result.academicYear}
                      </span>
                    </div>
                  </div>

                  {/* Student Particulars Grid */}
                  <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <div className="text-slate-500 uppercase font-semibold text-[10px]">
                        {isTa ? 'மாணவர் பெயர்' : 'Student Name'}
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">
                        {result.studentName}
                      </div>
                      {result.studentName_ta && (
                        <div className="text-[11px] text-slate-600 font-medium">{result.studentName_ta}</div>
                      )}
                    </div>

                    <div>
                      <div className="text-slate-500 uppercase font-semibold text-[10px]">
                        {isTa ? 'ரோல் எண்' : 'Roll Number'}
                      </div>
                      <div className="font-extrabold text-blue-900 text-sm mt-0.5">
                        {result.rollNumber}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">Reg: {result.registerNumber}</div>
                    </div>

                    <div>
                      <div className="text-slate-500 uppercase font-semibold text-[10px]">
                        {isTa ? 'வகுப்பு & பிரிவு' : 'Class & Stream'}
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">
                        {result.className} {result.section ? `(Sec ${result.section})` : ''}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-500 uppercase font-semibold text-[10px]">
                        {isTa ? 'முடிவு நிலை' : 'Result Status'}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${
                            result.resultStatus === 'PASS'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border border-rose-300'
                          }`}
                        >
                          {result.resultStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subject Scores Table */}
                  <div className="my-6">
                    <div className="sm:hidden flex items-center justify-between text-[11px] text-slate-500 mb-1.5 font-medium px-1 print:hidden">
                      <span>{isTa ? 'பாட வாரியான மதிப்பெண்கள்' : 'Subject Details'}</span>
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        {isTa ? 'பக்கவாட்டில் நகர்த்தவும் ↔' : 'Swipe table sideways ↔'}
                      </span>
                    </div>
                    <div className="overflow-x-auto rounded-xl border border-slate-300">
                      <table className="w-full text-left border-collapse text-xs min-w-[560px]">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 uppercase text-[11px]">
                          <th className="p-3 border-r border-slate-300 w-14 text-center">Code</th>
                          <th className="p-3 border-r border-slate-300">Subject Name</th>
                          <th className="p-3 border-r border-slate-300 text-center w-24">Max Marks</th>
                          <th className="p-3 border-r border-slate-300 text-center w-24">Pass Marks</th>
                          <th className="p-3 border-r border-slate-300 text-center w-28">Marks Scored</th>
                          <th className="p-3 border-r border-slate-300 text-center w-20">Grade</th>
                          <th className="p-3 text-center w-20">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.subjects.map((sub, sIdx) => (
                          <tr key={sIdx} className="border-b border-slate-200 hover:bg-slate-50/80">
                            <td className="p-3 border-r border-slate-200 text-center font-mono text-slate-600">
                              {sub.code}
                            </td>
                            <td className="p-3 border-r border-slate-200 font-bold text-slate-900">
                              <div>{sub.name}</div>
                              {sub.name_ta && (
                                <div className="text-[10px] text-slate-500 font-normal">{sub.name_ta}</div>
                              )}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-center font-semibold">
                              {sub.maxMarks}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-center text-slate-600">
                              {sub.passingMarks}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-center font-black text-sm text-slate-900">
                              {sub.marksObtained}
                            </td>
                            <td className="p-3 border-r border-slate-200 text-center font-bold text-blue-800">
                              {sub.grade}
                            </td>
                            <td className="p-3 text-center font-bold text-[11px] text-emerald-700">
                              {sub.isPassed ? 'P' : 'F'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-900">
                          <td colSpan={2} className="p-3.5 uppercase tracking-wider text-right pr-4">
                            Grand Total Score:
                          </td>
                          <td className="p-3.5 text-center">{result.totalMaxMarks}</td>
                          <td className="p-3.5 text-center">-</td>
                          <td className="p-3.5 text-center text-base text-blue-950 font-black">
                            {result.totalMarks}
                          </td>
                          <td colSpan={2} className="p-3.5 text-center text-xs text-emerald-800 font-black">
                            {result.overallGrade}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                  {/* Summary Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-center my-6">
                    <div>
                      <div className="text-slate-500 font-semibold uppercase text-[10px]">Aggregate Percentage</div>
                      <div className="text-xl font-black text-blue-900 mt-0.5">{result.percentage}%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-semibold uppercase text-[10px]">Classification</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{result.overallGrade}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-semibold uppercase text-[10px]">Date of Certification</div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{result.issueDate}</div>
                    </div>
                  </div>

                  {result.remarks && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6 italic">
                      <strong>Remarks:</strong> {result.remarks}
                    </div>
                  )}

                  {/* Institutional Seal & Signatures */}
                  <div className="pt-8 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-center text-xs">
                    <div>
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-400 mx-auto flex items-center justify-center text-[10px] text-slate-400 uppercase font-bold">
                        School Seal
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 uppercase font-semibold">Royappanpatti Campus</div>
                    </div>

                    <div className="hidden sm:block">
                      <div className="text-[11px] text-slate-500 font-medium">Verified by:</div>
                      <div className="mt-6 font-bold text-slate-800">Controller of Examinations</div>
                      <div className="text-[10px] text-slate-500">S.U.M. Higher Secondary School</div>
                    </div>

                    <div>
                      <div className="h-10 border-b border-slate-800 w-36 mx-auto mb-1 flex items-end justify-center font-serif italic text-sm text-blue-900">
                        Fr. Headmaster
                      </div>
                      <div className="font-bold text-slate-900 text-xs">Headmaster / Correspondent</div>
                      <div className="text-[10px] text-slate-500">Official Signatory Authority</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}
