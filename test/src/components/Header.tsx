/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HeaderProps {
  onOpenRemedyLibrary: () => void;
  onOpenPrivacyNotice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRemedyLibrary,
  onOpenPrivacyNotice
}) => {
  return (
    <header className="border-b border-[#DFE3DA] bg-[#FFFFFF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity: leaf mark + Plant Doctor wordmark */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 bg-[#315B3B] text-[#FFFFFF] rounded-[5px] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            {/* Simple, restrained leaf SVG mark */}
            <svg
              className="w-5 h-5 text-[#FFFFFF]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-lg text-[#242923] tracking-tight">
                Plant Doctor
              </span>
              <span className="hidden sm:inline text-xs text-[#696F68]">
                Diagnostic leaf care
              </span>
            </div>
            <p className="text-[11px] text-[#696F68] leading-tight">
              Understand your leaf. Care for your plant.
            </p>
          </div>
        </div>

        {/* Minimal, functional navigation */}
        <nav aria-label="Main Navigation" className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenRemedyLibrary}
            className="px-3 py-1.5 text-xs font-medium text-[#242923] hover:text-[#315B3B] hover:bg-[#F7F7F2] border border-[#DFE3DA] rounded-[5px] transition-colors"
          >
            Remedy Reference
          </button>
          <button
            type="button"
            onClick={onOpenPrivacyNotice}
            className="px-3 py-1.5 text-xs font-medium text-[#696F68] hover:text-[#242923] hover:bg-[#F7F7F2] border border-transparent hover:border-[#DFE3DA] rounded-[5px] transition-colors"
          >
            Privacy
          </button>
        </nav>
      </div>
    </header>
  );
};
