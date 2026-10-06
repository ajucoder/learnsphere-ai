import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 text-center text-xs sm:text-sm text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <span>
        <strong>Educational Disclaimer:</strong> LearnSphere AI is an independent educational tool aligned with Classes 6, 7 & 8 curriculum. It is not officially owned, operated, or endorsed by NCERT.
      </span>
    </div>
  );
};
