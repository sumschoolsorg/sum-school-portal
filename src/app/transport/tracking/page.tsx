'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { transportRepository } from '@/lib/repositories';
import { defaultTransportRoutes } from '@/lib/defaultData';
import { TransportRoute, TransportStop } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Bus,
  Navigation,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Bell,
  Check,
  X,
  Info,
} from 'lucide-react';

export default function BusTrackingPage() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [routes, setRoutes] = useState<TransportRoute[]>(defaultTransportRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');
  const [tripDirection, setTripDirection] = useState<'morning' | 'evening'>('morning');

  // Authentic Route & Transit Status State
  const [transitState, setTransitState] = useState<{
    isInTransitWindow: boolean;
    period: 'morning' | 'evening' | 'standby';
    statusText: string;
    statusText_ta: string;
  }>({
    isInTransitWindow: false,
    period: 'standby',
    statusText: 'Standby / Parked at S.U.M. Campus Depot',
    statusText_ta: 'நிறுத்தத்தில் உள்ளது / எஸ்.யு.எம். பள்ளி வளாகம்',
  });
  const [selectedStopDetails, setSelectedStopDetails] = useState<TransportStop | null>(null);

  // Notification Modal State
  const [notificationModalOpen, setNotificationModalOpen] = useState<boolean>(false);
  const [notifStopId, setNotifStopId] = useState<string>('');
  const [notifPhone, setNotifPhone] = useState<string>('');
  const [notifSuccessMessage, setNotifSuccessMessage] = useState<string | null>(null);

  // Load routes from repository with fallback to default data
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const data = await transportRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((r) => r.status === 'published');
          if (published.length > 0) {
            setRoutes(published);
            setSelectedRouteId(published[0].id || 'route-1');
          }
        }
      } catch (err) {
        console.warn('Error loading transport routes for tracking:', err);
      }
    };
    loadRoutes();
  }, []);

  // Compute authentic transit window using IST (Indian Standard Time)
  useEffect(() => {
    const computeTransitState = () => {
      try {
        const now = new Date();
        const istFormatter = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: 'numeric',
          minute: 'numeric',
          hour12: false,
        });
        const parts = istFormatter.formatToParts(now);
        const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
        const minute = parseInt(parts.find((p) => p.type === 'minute')?.value || '0', 10);
        const timeInMinutes = hour * 60 + minute;

        // Morning transit window: 07:15 AM (435m) to 08:45 AM (525m)
        const isMorning = timeInMinutes >= 435 && timeInMinutes <= 525;
        // Evening transit window: 04:15 PM (975m) to 05:45 PM (1065m)
        const isEvening = timeInMinutes >= 975 && timeInMinutes <= 1065;

        if (isMorning) {
          setTripDirection('morning');
          setTransitState({
            isInTransitWindow: true,
            period: 'morning',
            statusText: 'Active Morning Transit (Scheduled Window)',
            statusText_ta: 'காலை நேரப் பயணம் செயல்பாட்டில் உள்ளது',
          });
        } else if (isEvening) {
          setTripDirection('evening');
          setTransitState({
            isInTransitWindow: true,
            period: 'evening',
            statusText: 'Active Evening Transit (Scheduled Window)',
            statusText_ta: 'மாலை நேரப் பயணம் செயல்பாட்டில் உள்ளது',
          });
        } else {
          setTransitState({
            isInTransitWindow: false,
            period: 'standby',
            statusText: 'Standby / Parked at S.U.M. Campus Depot',
            statusText_ta: 'நிறுத்தத்தில் உள்ளது / எஸ்.யு.எம். பள்ளி வளாகம்',
          });
        }
      } catch {
        setTransitState({
          isInTransitWindow: false,
          period: 'standby',
          statusText: 'Standby / Campus Depot',
          statusText_ta: 'நிறுத்தத்தில் உள்ளது / பள்ளி வளாகம்',
        });
      }
    };

    computeTransitState();
    const interval = setInterval(computeTransitState, 60000);
    return () => clearInterval(interval);
  }, []);

  const activeRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0] || defaultTransportRoutes[0];
  }, [routes, selectedRouteId]);

  const totalStops = activeRoute?.stops?.length || 0;

  // Handle Stop Alert Submission
  const handleSetNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifPhone || notifPhone.trim().length < 10) {
      alert(isTa ? 'தயவுசெய்து சரியான 10 இலக்க செல்போன் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    const targetStop = activeRoute.stops.find((s) => s.id === notifStopId) || activeRoute.stops[0];
    const stopName = isTa && targetStop?.name_ta ? targetStop.name_ta : targetStop?.name || 'Selected Stop';
    setNotifSuccessMessage(
      isTa
        ? `பேருந்து விவரக் குறிப்பு: ${activeRoute.busRegistrationNumber} பேருந்து "${stopName}" நிறுத்தத்திற்கான போக்குவரத்துத் தகவல்களுக்கு உங்கள் எண் (${notifPhone}) பள்ளி அலுவலகப் பதிவேட்டில் இணைக்க பள்ளி அலுவலகத்தை (04554-293450) தொடர்பு கொள்ளவும்.`
        : `Transport Notice: To link mobile number ${notifPhone} for verified route alerts on bus ${activeRoute.busRegistrationNumber} at "${stopName}", please confirm registration with the school transport desk at 04554-293450.`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Header />

      <main id="main-content" className="flex-1 pb-20">
        {/* Hero Banner with Authentic Status */}
        <section className="relative py-12 lg:py-16 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          
          <div className="container-main relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2.5 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Bus className="w-3.5 h-3.5 text-blue-400" />
                    {isTa ? 'வாகன வழித்தட கண்காணிப்பு' : 'FLEET ROUTE STATUS'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {isTa ? 'தமிழ்நாடு அரசு விதிமுறைப்படி இயக்கப்படுகிறது' : 'TN RTO Approved Routes'}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight">
                  {isTa ? 'பள்ளிப் பேருந்து வழித்தடம் & நேரக் கண்காணிப்பு' : 'School Bus Routes & Schedule Tracking'}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-2xl">
                  {isTa
                    ? 'எஸ்.யு.எம். பள்ளி வாகனங்களின் அங்கீகரிக்கப்பட்ட வழித்தடங்கள், நிறுத்த வருகை நேரம் மற்றும் ஓட்டுநர் நேரடித் தொடர்பு விவரங்கள்.'
                    : 'Verified school bus routes, morning & evening stop timetables, and direct crew contact for S.U.M. Higher Secondary & Primary School.'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/transport"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-2 border border-white/15"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isTa ? 'முழு கால அட்டவணை' : 'View Timetable'}</span>
                </Link>

                <button
                  onClick={() => {
                    if (activeRoute?.stops?.[0]?.id) {
                      setNotifStopId(activeRoute.stops[0].id);
                    }
                    setNotifSuccessMessage(null);
                    setNotificationModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isTa ? 'நிறுத்த அறிவிப்பு பெற' : 'Set Stop Arrival Alert'}</span>
                </button>
              </div>
            </div>

            {/* Route Tabs */}
            <div className="mt-8 flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/10">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <button
                    key={route.id}
                    onClick={() => {
                      setSelectedRouteId(route.id || '');
                      setSelectedStopDetails(null);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40'
                        : 'bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    <Bus className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-blue-300'}`} />
                    <span className="font-extrabold">{route.routeNumber}:</span>
                    <span className="font-medium text-xs">
                      {isTa && route.routeName_ta ? route.routeName_ta : route.routeName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Route Command & Schedule Bar */}
        <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs backdrop-blur-md bg-white/95 dark:bg-slate-900/95">
          <div className="container-main py-3.5 flex flex-wrap items-center justify-between gap-4">
            {/* Bus ID & Status */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm border border-blue-200 dark:border-blue-900">
                <Bus className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {activeRoute.busRegistrationNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                      transitState.isInTransitWindow
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    ● {isTa ? transitState.statusText_ta : transitState.statusText}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isTa ? 'இயக்க நேரம்:' : 'Operating Hours:'}{' '}
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    07:15 AM – 08:45 AM & 04:15 PM – 05:45 PM (IST)
                  </span>
                </div>
              </div>
            </div>

            {/* Commute Direction Switcher */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setTripDirection('morning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  tripDirection === 'morning'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🌅 {isTa ? 'காலை வருகை (பள்ளிக்கு)' : 'Morning Pickup'}
              </button>
              <button
                onClick={() => setTripDirection('evening')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  tripDirection === 'evening'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🌇 {isTa ? 'மாலை திரும்பல் (வீட்டிற்கு)' : 'Evening Drop'}
              </button>
            </div>
          </div>
        </section>

        {/* Notice of GPS Hardware Integration */}
        <section className="bg-amber-500/10 border-b border-amber-500/20 py-3">
          <div className="container-main flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-2 text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>{isTa ? 'நேரடித் தொடர்பு தகவல்:' : 'Direct Fleet Coordination:'}</strong>{' '}
                {isTa
                  ? `வாகனம் ${activeRoute.busRegistrationNumber}-க்கான உடனடி வழித்தட விவரங்களுக்கு ஓட்டுநர் திரு. ${activeRoute.driverName} அவர்களை ${activeRoute.driverPhone} எண்ணில் தொடர்புகொள்ளலாம்.`
                  : `For real-time stop updates or student coordination during transit hours, please contact driver ${activeRoute.driverName} directly at ${activeRoute.driverPhone}.`}
              </span>
            </div>
            <a
              href={`tel:${activeRoute.driverPhone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 transition shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isTa ? 'ஓட்டுநரை அழைக்க' : 'Call Driver'}</span>
            </a>
          </div>
        </section>

        {/* Main Route Metrics & Overview Grid */}
        <section className="py-8">
          <div className="container-main space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Departure Point Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isTa ? 'தொடக்க இடம்' : 'Starting Hub'}
                  </span>
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {tripDirection === 'morning' ? activeRoute.startPoint : 'S.U.M. School Campus'}
                </div>
                <div className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                  {tripDirection === 'morning' ? activeRoute.morningDepartureTime : activeRoute.eveningDepartureTime} ({isTa ? 'புறப்படும் நேரம்' : 'Departure'})
                </div>
              </div>

              {/* Total Stops Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isTa ? 'நிறுத்தங்கள்' : 'Total Stops'}
                  </span>
                  <Navigation className="w-4 h-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {totalStops}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{isTa ? 'இடங்கள்' : 'Boarding Points'}</span>
                </div>
                <div className="mt-2 text-[11px] font-bold text-slate-500">
                  {isTa ? 'அனைத்து கிராமங்கள் இணைக்கப்பட்டுள்ளன' : 'Covering all route villages'}
                </div>
              </div>

              {/* Capacity Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isTa ? 'வாகன கொள்ளளவு' : 'Seat Capacity'}
                  </span>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                    {activeRoute.capacity}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {isTa ? 'இருக்கைகள்' : 'Seats'}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isTa ? 'அரசு வழிகாட்டுதல் பின்பற்றுதல்' : 'RTO Regulated'}</span>
                </div>
              </div>

              {/* Destination Hub */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isTa ? 'இறுதி இலக்கு' : 'Final Destination'}
                  </span>
                  <MapPin className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {tripDirection === 'morning'
                    ? isTa
                      ? 'எஸ்.யு.எம். பள்ளி வளாகம்'
                      : 'S.U.M. School Campus'
                    : activeRoute.endPoint}
                </div>
                <div className="mt-2 text-[11px] font-bold text-slate-500">
                  {tripDirection === 'morning' ? '08:35 AM' : '05:40 PM'} ({isTa ? 'வருகை நேரம்' : 'Arrival'})
                </div>
              </div>
            </div>

            {/* Visual Route Corridor */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    {activeRoute.routeNumber}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white mt-0.5">
                    {isTa && activeRoute.routeName_ta ? activeRoute.routeName_ta : activeRoute.routeName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeRoute.startPoint} &rarr; {activeRoute.endPoint}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500">
                    {isTa ? 'நிறுத்தத்தைக் கிளிக் செய்து விவரம் காண்க' : 'Click any stop node to inspect'}
                  </span>
                </div>
              </div>

              {/* Visual Track Line & Stops */}
              <div className="relative py-8 px-2 sm:px-6 overflow-x-auto">
                <div className="relative min-w-[650px] flex items-center justify-between">
                  {/* Track Line */}
                  <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 bg-slate-200 dark:bg-slate-800 rounded-full z-0" />

                  {/* Stop Nodes */}
                  {activeRoute.stops.map((stop, idx) => {
                    const isFinal = idx === totalStops - 1;
                    const isSelected = selectedStopDetails?.id === stop.id;

                    return (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedStopDetails(stop)}
                        className="relative z-10 flex flex-col items-center group cursor-pointer"
                      >
                        {/* Circle Indicator */}
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all shadow-md ${
                            isSelected
                              ? 'bg-blue-600 text-white ring-4 ring-blue-500/30 scale-110'
                              : isFinal
                              ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-700 group-hover:border-blue-500'
                          }`}
                        >
                          {isFinal ? 'SUM' : stop.order}
                        </div>

                        {/* Stop Label Below */}
                        <div className="mt-3 text-center max-w-[130px]">
                          <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600">
                            {isTa && stop.name_ta ? stop.name_ta : stop.name}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            {tripDirection === 'morning' ? stop.morningPickupTime : stop.eveningDropTime}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stop Inspector Popover (if clicked) */}
              {selectedStopDetails && (
                <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black uppercase">
                        Stop #{selectedStopDetails.order}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {isTa && selectedStopDetails.name_ta
                          ? selectedStopDetails.name_ta
                          : selectedStopDetails.name}
                      </h4>
                    </div>
                    {selectedStopDetails.landmark && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{selectedStopDetails.landmark}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-slate-400">
                        {tripDirection === 'morning'
                          ? isTa
                            ? 'காலை நேரம்'
                            : 'Pickup Time'
                          : isTa
                          ? 'மாலை நேரம்'
                            : 'Drop Time'}
                      </div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {tripDirection === 'morning'
                          ? selectedStopDetails.morningPickupTime
                          : selectedStopDetails.eveningDropTime}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setNotifStopId(selectedStopDetails.id);
                        setNotificationModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isTa ? 'அலர்ட் வைக்க' : 'Set Alert'}</span>
                    </button>

                    <button
                      onClick={() => setSelectedStopDetails(null)}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Two Column Layout: Detailed Stops Table & Driver/Safety Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Step-by-Step Schedule */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span>{isTa ? 'வழித்தட நிறுத்தங்களின் நேரங்கள்' : 'Route Stops & Timings'}</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold">
                    {totalStops} {isTa ? 'நிறுத்தங்கள்' : 'Boarding Points'}
                  </span>
                </div>

                <div className="space-y-4">
                  {activeRoute.stops.map((stop, idx) => {
                    const isFinal = idx === totalStops - 1;
                    const isSelected = selectedStopDetails?.id === stop.id;

                    return (
                      <div
                        key={stop.id}
                        className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 dark:border-blue-700 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isFinal
                                ? 'bg-amber-500 text-slate-950'
                                : isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {isFinal ? 'SUM' : stop.order}
                          </div>

                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <span>{isTa && stop.name_ta ? stop.name_ta : stop.name}</span>
                            </div>
                            {stop.landmark && (
                              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{stop.landmark}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Timings */}
                        <div className="flex items-center gap-4 shrink-0 pl-12 sm:pl-0">
                          <div className="text-right">
                            <div className="text-[10px] uppercase font-bold text-slate-400">
                              {tripDirection === 'morning' ? (isTa ? 'காலை' : 'Pickup') : (isTa ? 'மாலை' : 'Drop')}
                            </div>
                            <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                              {tripDirection === 'morning' ? stop.morningPickupTime : stop.eveningDropTime}
                            </div>
                          </div>

                          <button
                            onClick={() => setSelectedStopDetails(stop)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition"
                          >
                            {isTa ? 'விவரம்' : 'Details'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 1 Col: Driver Contact, Safety, & SOS Emergency */}
              <div className="space-y-6">
                {/* Driver Contact Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                    {isTa ? 'வாகனப் பொறுப்பாளர்கள்' : 'Crew & Direct Contact'}
                  </h4>

                  <div className="space-y-4">
                    {/* Driver */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">
                          {isTa ? 'பேருந்து ஓட்டுநர்' : 'Bus Driver'}
                        </span>
                        <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                          {activeRoute.driverName}
                        </div>
                        <div className="text-xs text-slate-500">{activeRoute.driverPhone}</div>
                      </div>

                      <a
                        href={`tel:${activeRoute.driverPhone.replace(/\s+/g, '')}`}
                        className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow-sm"
                        title={isTa ? 'ஓட்டுநரை அழைக்க' : 'Call Driver'}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>

                    {/* Conductor */}
                    {activeRoute.conductorName && (
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                            {isTa ? 'நடத்துநர் / உதவியாளர்' : 'Bus Conductor'}
                          </span>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            {activeRoute.conductorName}
                          </div>
                          <div className="text-xs text-slate-500">{activeRoute.conductorPhone}</div>
                        </div>

                        {activeRoute.conductorPhone && (
                          <a
                            href={`tel:${activeRoute.conductorPhone.replace(/\s+/g, '')}`}
                            className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-sm"
                            title={isTa ? 'நடத்துநரை அழைக்க' : 'Call Conductor'}
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Safety Standards Compliance Badge */}
                <div className="bg-gradient-to-br from-blue-950 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-900">
                  <div className="flex items-center gap-2 text-amber-300 mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    <h4 className="text-sm font-black uppercase tracking-wider">
                      {isTa ? 'பாதுகாப்பு வசதிகள்' : 'Safety Features'}
                    </h4>
                  </div>
                  <ul className="space-y-2 text-xs text-blue-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isTa ? 'தமிழ்நாடு அரசு விதிமுறைப்படி வேகக்கட்டுப்பாடு' : 'Tamil Nadu Speed Governor (Max 40 km/h)'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isTa ? 'இருவழி சிசிடிவி கேமரா பதிவு' : 'Dual-angle HD CCTV Camera Recording'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isTa ? 'முதலுதவி பெட்டி & தீயணைப்பு கருவி' : 'Certified First Aid Kit & Fire Extinguisher'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isTa ? 'அவசர அவசரகால வழி (Emergency Exit)' : 'Dedicated Emergency Exit Door'}</span>
                    </li>
                  </ul>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-300 uppercase font-bold">
                        {isTa ? 'அவசர உதவி எண்' : 'Transport SOS Desk'}
                      </div>
                      <div className="text-sm font-extrabold text-amber-300">04554-253224</div>
                    </div>
                    <a
                      href="tel:04554253224"
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
                    >
                      {isTa ? 'உதவி எண்' : 'Call SOS'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Stop Arrival Alert Modal */}
      {notificationModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-amber-500">
                <Bell className="w-5 h-5" />
                <h3 className="text-lg font-black font-heading text-slate-900 dark:text-white">
                  {isTa ? 'பேருந்து வருகை அறிவிப்பு' : 'Set Bus Arrival Alert'}
                </h3>
              </div>
              <button
                onClick={() => setNotificationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {notifSuccessMessage ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {notifSuccessMessage}
                </p>
                <button
                  onClick={() => setNotificationModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  {isTa ? 'சரி' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSetNotification} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isTa
                    ? 'பேருந்து உங்கள் நிறுத்தத்திற்கு வரும் போது SMS அல்லது WhatsApp செய்தி பெற உங்கள் தொலைபேசி எண்ணை பதிவு செய்யவும்.'
                    : 'Register your mobile number to receive stop notifications when the school bus arrives at your designated stop.'}
                </p>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    {isTa ? 'நிறுத்தம் தேர்வு செய்க' : 'Select Stop'}
                  </label>
                  <select
                    value={notifStopId}
                    onChange={(e) => setNotifStopId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {activeRoute.stops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.order}. {isTa && stop.name_ta ? stop.name_ta : stop.name} (
                        {tripDirection === 'morning' ? stop.morningPickupTime : stop.eveningDropTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    {isTa ? 'பெற்றோர் செல்போன் எண் (WhatsApp)' : 'Parent Mobile Number (WhatsApp)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={notifPhone}
                      onChange={(e) => setNotifPhone(e.target.value)}
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setNotificationModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {isTa ? 'ரத்து' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{isTa ? 'அலர்ட் பதிவு செய்' : 'Activate Alert'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
