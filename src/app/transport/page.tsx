'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { transportRepository, isFirebaseConfigured } from '@/lib/repositories';
import { defaultTransportRoutes } from '@/lib/defaultData';
import { TransportRoute } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Users,
  AlertCircle,
  CheckCircle2,
  Navigation,
  ChevronRight,
} from 'lucide-react';

export default function TransportPage() {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');

  useEffect(() => {
    const useFirebase = isFirebaseConfigured();
    const loadRoutes = async () => {
      try {
        const data = await transportRepository.getPublished();
        if (data && data.length > 0) {
          const published = data.filter((r) => r.status === 'published');
          setRoutes(published);
          if (published.length > 0) {
            setSelectedRouteId(published[0].id || 'route-1');
          }
        } else if (!useFirebase) {
          setRoutes(defaultTransportRoutes);
        }
      } catch (err) {
        console.warn('Error loading transport routes:', err);
        if (!useFirebase) setRoutes(defaultTransportRoutes);
      }
    };
    loadRoutes();
  }, []);

  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />

      <main id="main-content" className="flex-1">
        {/* Page Hero */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
          <div className="container-main relative z-10 text-center">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mb-4 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
              <Bus className="w-4 h-4" />
              {isTa ? 'பாதுகாப்பான பள்ளி வாகன வசதி' : 'Safe Student Fleet Logistics'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight">
              {isTa ? 'பள்ளிப் பேருந்து & வழித்தட விவரங்கள்' : 'School Bus & Transport Routes'}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
              {isTa
                ? 'கம்பம், உத்தமபாளையம், சின்னமனூர், கொம்பை மற்றும் சுற்றுவட்டாரக் கிராமங்களை ராயப்பன்பட்டி எஸ்.யு.எம். பள்ளியுடன் இணைக்கும் பாதுகாப்பான வாகன வசதி.'
                : 'Providing safe, punctual, and highly dependable daily transport connecting Royappanpatti with Cumbum Valley towns and surrounding rural hamlets.'}
            </p>

            {/* Live Tracking CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/transport/tracking"
                className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm transition flex items-center gap-2.5 shadow-xl shadow-amber-500/25 ring-4 ring-amber-500/20"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping inline-block" />
                <Navigation className="w-4 h-4" />
                <span>{isTa ? 'நேரலை ஜிபிஎஸ் பேருந்து இருப்பிடம் காண்க' : 'Live GPS Bus Tracking Radar'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Safety Badges Strip */}
        <section className="bg-white dark:bg-slate-900 py-6 border-b border-slate-200 dark:border-slate-800">
          <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                  {isTa ? 'அரசு பாதுகாப்பு தரம்' : 'State Safety Compliant'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isTa ? 'வேகக்கட்டுப்பாடு & ஜிபிஎஸ்' : 'Speed Governors & GPS'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                  {isTa ? 'அனுபவமிக்க ஓட்டுநர்கள்' : 'Licensed Drivers'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isTa ? '15+ ஆண்டுகள் அனுபவம்' : 'Police verified & trained'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                  {isTa ? 'துல்லியமான நேரம்' : 'Punctual Timetable'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isTa ? 'காலை 8:35 மணிக்கு வருகை' : 'Timely morning arrival'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase">
                  {isTa ? 'நேரடி உதவி எண்' : 'Emergency Hotline'}
                </h4>
                <p className="text-[11px] text-slate-500">04554-253224 / 253200</p>
              </div>
            </div>
          </div>
        </section>

        {/* Route Selector & Schedule View */}
        <section className="py-16 lg:py-20">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                <Navigation className="w-3.5 h-3.5 inline mr-1" />
                {isTa ? 'வழித்தட அட்டவணை' : 'Route Timetable'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-3">
                {isTa ? 'உங்கள் பகுதிக்கான பேருந்தை தேர்வு செய்க' : 'Select Your Neighborhood Route'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                {isTa
                  ? 'ஒவ்வொரு வழித்தடத்தின் பேருந்து எண், ஓட்டுநர் தொலைபேசி எண் மற்றும் நிறுத்தும் நேரங்களைக் காண்க.'
                  : 'Check morning pickup times, evening drop points, driver contact details, and route stops.'}
              </p>
            </div>

            {/* Route Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
              {routes.map((route) => {
                const isSelected = route.id === selectedRouteId;
                return (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id || '')}
                    className={`px-5 py-3 rounded-2xl font-bold text-sm transition flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-600/30'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
                    }`}
                  >
                    <Bus className={`w-4 h-4 ${isSelected ? 'text-amber-300' : 'text-blue-500'}`} />
                    <span>{route.routeNumber}:</span>
                    <span className="font-medium text-xs">
                      {isTa && route.routeName_ta ? route.routeName_ta : route.routeName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Route Details Card */}
            {activeRoute && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                {/* Header Banner of Selected Route */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                          {activeRoute.routeNumber}
                        </span>
                        <span className="text-xs font-semibold text-blue-200">
                          {isTa ? 'வாகன எண்:' : 'Bus Reg:'} {activeRoute.busRegistrationNumber}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-white mt-2">
                        {isTa && activeRoute.routeName_ta ? activeRoute.routeName_ta : activeRoute.routeName}
                      </h3>
                      <p className="text-xs text-blue-200 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>
                          {activeRoute.startPoint} &rarr; {activeRoute.endPoint}
                        </span>
                      </p>
                    </div>

                    {/* Driver & In-Charge Contact Badge */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                      <div>
                        <div className="text-[11px] uppercase font-bold text-amber-300">
                          {isTa ? 'பேருந்து ஓட்டுநர்' : 'Bus Driver'}
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {activeRoute.driverName}
                        </div>
                        <div className="text-xs text-blue-200">{activeRoute.driverPhone}</div>
                      </div>
                      <a
                        href={`tel:${activeRoute.driverPhone.replace(/\s+/g, '')}`}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{isTa ? 'அழைக்க' : 'Call Driver'}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Stops Timeline */}
                <div className="p-6 sm:p-8 lg:p-10">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h4 className="text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span>{isTa ? 'நிறுத்தங்கள் & நேர அட்டவணை' : 'Stops & Timetable Schedule'}</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeRoute.stops.length} {isTa ? 'நிறுத்தங்கள்' : 'Boarding Points'}
                    </span>
                  </div>

                  <div className="relative">
                    {/* Continuous vertical timeline line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-blue-200 dark:bg-blue-900 hidden sm:block" />

                    <div className="space-y-6">
                      {activeRoute.stops.map((stop, idx) => {
                        const isFinal = idx === activeRoute.stops.length - 1;
                        return (
                          <div
                            key={stop.id}
                            className="relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-slate-50/80 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 transition"
                          >
                            {/* Step Indicator */}
                            <div className="flex items-center gap-3 sm:block">
                              <div
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 z-10 shadow-sm ${
                                  isFinal
                                    ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20'
                                    : 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                                }`}
                              >
                                {isFinal ? 'SUM' : stop.order}
                              </div>
                              <span className="sm:hidden font-bold text-sm text-slate-900 dark:text-white">
                                {isTa && stop.name_ta ? stop.name_ta : stop.name}
                              </span>
                            </div>

                            {/* Stop Info */}
                            <div className="flex-1">
                              <h5 className="hidden sm:block text-base font-bold font-heading text-slate-900 dark:text-white">
                                {isTa && stop.name_ta ? stop.name_ta : stop.name}
                              </h5>
                              {stop.landmark && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{stop.landmark}</span>
                                </p>
                              )}
                            </div>

                            {/* Timings */}
                            <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                              <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
                                  {isTa ? 'காலை ஏறும் நேரம்' : 'Morning Pickup'}
                                </div>
                                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                                  {stop.morningPickupTime}
                                </div>
                              </div>

                              <div className="bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                                <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                                  {isTa ? 'மாலை திரும்பும் நேரம்' : 'Evening Drop'}
                                </div>
                                <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                                  {stop.eveningDropTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="bg-slate-100 dark:bg-slate-800/80 px-6 sm:px-8 py-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>
                    {isTa
                      ? 'குறிப்பு: மாணவர்கள் பேருந்து வரும் நேரத்திற்கு 5 நிமிடங்களுக்கு முன்பாக நிறுத்துமிடத்திற்கு வந்துவிடுமாறு கேட்டுக்கொள்ளப்படுகிறார்கள்.'
                      : 'Parents are requested to ensure students reach their designated boarding point 5 minutes prior to the scheduled departure time.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Transport Guidelines & Rules */}
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="container-main max-w-4xl">
            <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white text-center mb-8">
              {isTa ? 'வாகன விதிமுறைகள் & பாதுகாப்பு வழிமுறைகள்' : 'Transport Safety & Bus Pass Guidelines'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  <span>{isTa ? 'மாணவர் நடத்தை விதிகள்' : 'Student Conduct'}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>&bull; {isTa ? 'பேருந்து முழுமையாக நின்ற பின்னரே ஏறவும் இறங்கவும் வேண்டும்.' : 'Board and alight only when the bus comes to a complete halt.'}</li>
                  <li>&bull; {isTa ? 'அமைதியையும் கண்ணியத்தையும் சக மாணவர்களுடன் பேண வேண்டும்.' : 'Maintain discipline and respect the driver and co-passengers.'}</li>
                  <li>&bull; {isTa ? 'பயணத்தின் போது ஜன்னல் வழியே கைகளையோ தலையையோ வெளியே நீட்டக்கூடாது.' : 'Do not lean out of windows or stand while the vehicle is in motion.'}</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                  <span>{isTa ? 'பேருந்து அனுமதி அட்டை (Bus Pass)' : 'Bus Pass & Inquiries'}</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li>&bull; {isTa ? 'ஒவ்வொரு கல்வியாண்டு தொடக்கத்திலும் பள்ளி அலுவலகத்தில் பாஸ் பெறலாம்.' : 'Collect your semester transport pass from the administrative office.'}</li>
                  <li>&bull; {isTa ? 'வழித்தட மாற்றம் தேவைப்பட்டால் தலைமை ஆசிரியரின் அனுமதி பெறவேண்டும்.' : 'Route changes require prior written intimation from parents.'}</li>
                  <li>&bull; {isTa ? 'அவசர உதவிக்கு பள்ளி அலுவலகத்தை நேரடியாகத் தொடர்பு கொள்ளலாம்.' : 'For urgent assistance, contact school office: 04554-253224.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
