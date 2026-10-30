/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';

interface PrivacyDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyDialog: React.FC<PrivacyDialogProps> = ({ isOpen, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

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
      setTimeout(() => closeBtnRef.current?.focus(), 50);
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
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#242923]/60 backdrop-blur-none"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px] p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-[#DFE3DA]">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#72866A] block">
              Application Security & Transparency
            </span>
            <h2 id="privacy-modal-title" className="text-lg font-bold text-[#242923]">
              Privacy & Image Handling Notice
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="p-1 text-[#696F68] hover:text-[#242923] rounded-[4px]"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs text-[#242923] leading-relaxed">
          <div>
            <h3 className="font-semibold text-[#242923] mb-1">How Leaf Analysis Works</h3>
            <p className="text-[#696F68]">
              When you click "Analyze Leaf", your photograph is sent securely over an encrypted connection to our dedicated backend server endpoint. The server formats the image for inspection by Google's Gemini Vision model.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#242923] mb-1">Data Storage & Retention</h3>
            <p className="text-[#696F68]">
              Your images are processed purely in-memory during analysis. We do not store your uploaded photographs in a persistent database, disk storage, or cloud bucket, nor do we build facial, biometric, or location profiles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#242923] mb-1">API Key & Credential Isolation</h3>
            <p className="text-[#696F68]">
              All model API keys and secrets remain isolated on the backend server. No API credentials or private keys are ever transmitted to or exposed in your web browser.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#242923] mb-1">No Tracking or Unnecessary Telemetry</h3>
            <p className="text-[#696F68]">
              Plant Doctor does not install commercial ad trackers, behavioral marketing beacons, or unnecessary third-party cookies.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#DFE3DA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] rounded-[5px] transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
