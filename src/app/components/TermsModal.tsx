'use client';

import React, { useEffect, useRef } from 'react';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  html: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ open, onClose, html }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[86dvh] flex flex-col overflow-hidden rounded-[16px] border border-brand-gold/20 bg-surface-default shadow-[0_24px_80px_rgba(0,0,0,0.45),0_0_40px_rgba(255,192,0,0.12)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 shrink-0">
          <h2 className="font-hero text-base sm:text-lg font-bold text-brand-offwhite">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex shrink-0 items-center justify-center rounded-[4px] border border-white/10 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable HTML content */}
        <div
          className="terms-content overflow-y-auto px-4 py-5 sm:px-6 text-sm leading-relaxed text-brand-offwhite/75"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-4 sm:px-6 shrink-0">
          <button
            onClick={onClose}
            className="w-full rounded-[4px] bg-brand-gold py-2.5 font-bold text-sm text-black transition-all hover:brightness-110"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
