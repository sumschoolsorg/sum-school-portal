import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-lg animate-pulse-soft">
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 font-heading">
        Loading S.U.M. School Portal...
      </div>
    </div>
  );
}
