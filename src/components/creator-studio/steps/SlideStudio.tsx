import React from 'react';
import { Palette } from 'lucide-react';

export const SlideStudio: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md text-center p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md mb-4">
          <Palette className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Slide Studio
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          The PPP slide editor canvas will mount here. Ready for the next phase.
        </p>
      </div>
    </div>
  );
};
