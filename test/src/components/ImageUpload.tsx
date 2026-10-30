/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { validateLeafImage, ValidationResult } from '../utils/fileValidation';

interface ImageUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  validationError: string | null;
  setValidationError: (err: string | null) => void;
  isAnalyzing: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onFileSelect,
  onFileRemove,
  validationError,
  setValidationError,
  isAnalyzing
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Manage object URL lifecycle carefully with guaranteed cleanup
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      setImageMeta(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  // Handle incoming file
  const processSelectedFile = async (file: File) => {
    setValidationError(null);
    const result: ValidationResult = await validateLeafImage(file);

    if (!result.valid) {
      setValidationError(result.error || 'The selected file could not be validated.');
      return;
    }

    if (result.dimensions) {
      setImageMeta(result.dimensions);
    }

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
    // Reset input value to allow selecting same file again if replaced
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAnalyzing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isAnalyzing) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Hidden native inputs for Desktop/Mobile file browser & Camera capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        onChange={handleInputChange}
        className="hidden"
        disabled={isAnalyzing}
        id="leaf-file-upload"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleInputChange}
        className="hidden"
        disabled={isAnalyzing}
        id="leaf-camera-upload"
      />

      {/* Main Upload Box */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-[8px] p-8 sm:p-10 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-[#315B3B] bg-[#E8F0E6]'
              : 'border-[#DFE3DA] bg-[#FFFFFF] hover:border-[#72866A] hover:bg-[#F7F7F2]'
          }`}
          aria-label="Upload leaf photo area"
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            {/* Minimal SVG upload icon */}
            <div className="w-12 h-12 rounded-[6px] bg-[#E8F0E6] text-[#315B3B] flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h3 className="text-base font-semibold text-[#242923] mb-1">
              Select or drop a leaf image
            </h3>
            <p className="text-sm text-[#696F68] mb-5">
              Drag and drop your file here, or use the buttons below
            </p>

            {/* Functional Upload Actions (No Pills, 4-6px max rounded buttons) */}
            <div
              className="flex flex-wrap items-center justify-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] active:bg-[#1E3A24] rounded-[5px] transition-colors shadow-none flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Browse Files</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isAnalyzing}
                className="px-4 py-2 text-sm font-medium text-[#242923] bg-[#FFFFFF] hover:bg-[#F7F7F2] border border-[#DFE3DA] rounded-[5px] transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-[#696F68]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                <span>Take Photo</span>
              </button>
            </div>

            <p className="mt-4 text-xs text-[#696F68]">
              Supports JPEG, PNG, and WebP up to 10 MB
            </p>
          </div>
        </div>
      ) : (
        /* Selected Image Preview State */
        <div className="bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px] p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Visual Image Preview */}
            <div className="relative w-full sm:w-48 h-48 bg-[#F7F7F2] border border-[#DFE3DA] rounded-[6px] overflow-hidden flex items-center justify-center shrink-0">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected plant leaf preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Image Details and Controls */}
            <div className="flex-1 w-full flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#72866A] block mb-1">
                  Selected Leaf
                </span>
                <h4 className="text-base font-semibold text-[#242923] break-all mb-1">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#696F68] mb-3">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>·</span>
                  <span>{selectedFile.type || 'image/jpeg'}</span>
                  {imageMeta && (
                    <>
                      <span>·</span>
                      <span>{imageMeta.width} × {imageMeta.height} px</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#696F68]">
                  Image validated and ready for leaf disease inspection. Click "Analyze Leaf" below to proceed.
                </p>
              </div>

              {/* Replace / Remove Controls */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#DFE3DA]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 text-xs font-medium text-[#242923] hover:text-[#315B3B] bg-[#F7F7F2] hover:bg-[#E8F0E6] border border-[#DFE3DA] rounded-[5px] transition-colors disabled:opacity-50"
                >
                  Replace Photo
                </button>
                <button
                  type="button"
                  onClick={onFileRemove}
                  disabled={isAnalyzing}
                  className="px-3 py-1.5 text-xs font-medium text-[#242923] hover:text-[#B84814] bg-[#FFFFFF] hover:bg-[#F8E7E5] border border-[#DFE3DA] rounded-[5px] transition-colors disabled:opacity-50"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div
          role="alert"
          className="mt-3 p-3 bg-[#F8E7E5] border border-[#DFE3DA] rounded-[6px] flex items-start gap-3 text-xs text-[#242923]"
        >
          <svg
            className="w-4 h-4 text-[#8C300B] shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="flex-1">
            <p className="font-semibold text-[#8C300B] mb-0.5">Validation issue</p>
            <p>{validationError}</p>
          </div>
          <button
            type="button"
            onClick={() => setValidationError(null)}
            className="text-[#696F68] hover:text-[#242923] p-1 text-xs"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
