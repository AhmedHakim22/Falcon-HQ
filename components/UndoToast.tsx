'use client';

import React, { useEffect, useState } from 'react';
import { Undo2, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
  durationMs?: number;
}

export function UndoToast({
  message,
  onUndo,
  onClose,
  durationMs = 6000,
}: UndoToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remaining);
      if (elapsed >= durationMs) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [durationMs, onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-charcoal text-white dark:bg-stone-900 dark:border dark:border-stone-700 rounded-2xl shadow-2xl p-4 flex flex-col gap-2.5 overflow-hidden relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium leading-snug">{message}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-falcon-600 hover:bg-falcon-700 text-white text-xs font-bold transition-all active:scale-95 shadow-md"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>تراجع</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linear progress timer */}
        <div className="w-full bg-stone-700/50 h-1 rounded-full overflow-hidden">
          <div
            className="bg-falcon-500 h-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
