/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { RemedyGuide, RemedyKey } from '../types/leaf';
import { getRemedyByKey, REMEDY_GUIDES } from '../data/remedies';

interface RemedyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRemedyKey: RemedyKey;
  onSelectKey?: (key: RemedyKey) => void;
}

export const RemedyModal: React.FC<RemedyModalProps> = ({
  isOpen,
  onClose,
  activeRemedyKey,
  onSelectKey
}) => {
  const guide: RemedyGuide = getRemedyByKey(activeRemedyKey);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard accessibility: ESC key to close and Tab focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        return;
      }

      if (e.key === 'Tab' && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus on close button when opened
      setTimeout(() => closeButtonRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="remedy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#242923]/60 backdrop-blur-none"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px] shadow-none max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-[#DFE3DA] bg-[#F7F7F2] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#72866A]">
                Condition Care & Management Guide
              </span>
              <span className="text-xs text-[#696F68]">·</span>
              <span className="text-xs font-semibold text-[#315B3B]">
                {guide.category} Leaf
              </span>
            </div>
            <h2 id="remedy-modal-title" className="text-xl font-bold text-[#242923]">
              {guide.title}
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#696F68] hover:text-[#242923] hover:bg-[#FFFFFF] border border-transparent hover:border-[#DFE3DA] rounded-[4px] transition-colors"
            aria-label="Close remedy guide"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tab switchers to inspect other conditions if desired */}
        {onSelectKey && (
          <div className="px-5 pt-3 pb-2 border-b border-[#DFE3DA] bg-[#FFFFFF] flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-[#696F68] shrink-0 mr-1">Switch guide:</span>
            {(['healthy', 'rusty', 'powdery'] as RemedyKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onSelectKey(k)}
                className={`px-3 py-1 text-xs font-medium rounded-[4px] border transition-colors shrink-0 ${
                  activeRemedyKey === k
                    ? 'bg-[#315B3B] text-[#FFFFFF] border-[#315B3B]'
                    : 'bg-[#F7F7F2] text-[#242923] border-[#DFE3DA] hover:bg-[#FFFFFF]'
                }`}
              >
                {REMEDY_GUIDES[k].category}
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#242923]">
          {/* Why it occurs */}
          <div className="p-4 bg-[#F7F7F2] border border-[#DFE3DA] rounded-[6px]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#72866A] mb-1">
              Why this condition occurs
            </h3>
            <p className="text-xs text-[#242923] leading-relaxed">
              {guide.whyItOccurs}
            </p>
          </div>

          {/* Core Sections (What to do now, Prevention, Important precautions) */}
          <div className="space-y-5">
            {guide.sections.map((section, sIdx) => (
              <div key={sIdx} className="border border-[#DFE3DA] rounded-[6px] p-4 bg-[#FFFFFF]">
                <h3 className="text-sm font-bold text-[#242923] mb-2.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-[2px] bg-[#315B3B]" />
                  <span>{section.title}</span>
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-xs text-[#242923] flex items-start gap-2">
                      <span className="text-[#72866A] font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* When to consult a local agricultural expert */}
          <div className="p-4 bg-[#F6EEDB] border border-[#DFE3DA] rounded-[6px]">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-[#242923] mb-1.5 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#8C300B]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>When to consult a local agricultural expert</span>
            </h3>
            <ul className="space-y-1.5 mt-2">
              {guide.whenToConsultExpert.map((c, cIdx) => (
                <li key={cIdx} className="text-xs text-[#242923] flex items-start gap-2">
                  <span className="text-[#8C300B] font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mandatory Short Disclaimer */}
          <div className="p-3 bg-[#F7F7F2] border border-[#DFE3DA] rounded-[6px] text-[11px] text-[#696F68] italic">
            {guide.disclaimer}
          </div>
        </div>

        {/* Footer with return button */}
        <div className="p-4 border-t border-[#DFE3DA] bg-[#F7F7F2] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] active:bg-[#1E3A24] rounded-[5px] transition-colors"
          >
            Return to Result
          </button>
        </div>
      </div>
    </div>
  );
};
