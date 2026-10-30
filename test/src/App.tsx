/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { SamplePicker } from './components/SamplePicker';
import { AnalysisResultView } from './components/AnalysisResultView';
import { RemedyModal } from './components/RemedyModal';
import { PrivacyDialog } from './components/PrivacyDialog';
import { AnalysisResult, RemedyKey, SampleLeaf } from './types/leaf';
import { fileToBase64 } from './utils/fileValidation';
import { categoryToRemedyKey } from './data/remedies';

export default function App() {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeSample, setActiveSample] = useState<SampleLeaf | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Dialog states
  const [isRemedyOpen, setIsRemedyOpen] = useState(false);
  const [activeRemedyKey, setActiveRemedyKey] = useState<RemedyKey>('healthy');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Reset all state for analyzing another leaf
  const handleReset = () => {
    setSelectedFile(null);
    setActiveSample(null);
    setValidationError(null);
    setAnalysisError(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  // Select a user file
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setActiveSample(null);
    setAnalysisError(null);
    setResult(null);
  };

  // Select a preset sample leaf
  const handleSampleSelect = (file: File, sample: SampleLeaf) => {
    setSelectedFile(file);
    setActiveSample(sample);
    setValidationError(null);
    setAnalysisError(null);
    setResult(null);
  };

  // Trigger server-side leaf analysis
  const handleAnalyze = async () => {
    if (!selectedFile || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const base64 = await fileToBase64(selectedFile);

      const payload = {
        imageBase64: base64,
        mimeType: selectedFile.type || 'image/jpeg',
        filename: selectedFile.name,
        isDemoExample: Boolean(activeSample?.isDemo)
      };

      const response = await fetch('/api/analyze-leaf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error while analyzing leaf photo.');
      }

      setResult(data as AnalysisResult);
      setActiveRemedyKey(data.remedyKey || categoryToRemedyKey(data.category));
    } catch (err: any) {
      console.error('Analysis request error:', err);
      setAnalysisError(
        err.message ||
          'Unable to complete leaf analysis. Please verify your internet connection or try another photo.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Open remedy guide for the current result
  const handleOpenRemedy = () => {
    if (result) {
      setActiveRemedyKey(result.remedyKey || categoryToRemedyKey(result.category));
    }
    setIsRemedyOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#242923] flex flex-col antialiased">
      {/* A. Header */}
      <Header
        onOpenRemedyLibrary={() => {
          setActiveRemedyKey('healthy');
          setIsRemedyOpen(true);
        }}
        onOpenPrivacyNotice={() => setIsPrivacyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* B. Introduction */}
        <section className="mb-8 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#242923] tracking-tight mb-2">
            How is your plant doing?
          </h1>
          <p className="text-sm sm:text-base text-[#696F68] max-w-2xl leading-relaxed">
            Upload a clear leaf photo to check for common signs of disease. Plant Doctor visually inspects for healthy foliage, rust disease pustules, and powdery mildew patches.
          </p>
        </section>

        {/* C. Image Input & D. Analysis Section */}
        {!result && (
          <section className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px] p-6 sm:p-8">
              <div className="mb-5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#72866A] block mb-1">
                  Step 1: Leaf Photography
                </span>
                <h2 className="text-lg font-semibold text-[#242923]">
                  Provide a close-up leaf photograph
                </h2>
                <p className="text-xs text-[#696F68] mt-0.5">
                  For the most accurate visual inspection, photograph the leaf in natural diffused light against a neutral background.
                </p>
              </div>

              {/* Upload Dropzone & Controls */}
              <ImageUpload
                selectedFile={selectedFile}
                onFileSelect={handleFileSelect}
                onFileRemove={() => {
                  setSelectedFile(null);
                  setActiveSample(null);
                  setValidationError(null);
                  setAnalysisError(null);
                }}
                validationError={validationError}
                setValidationError={setValidationError}
                isAnalyzing={isAnalyzing}
              />

              {/* Botanical Samples for Immediate Verification */}
              <SamplePicker
                onSelectSample={handleSampleSelect}
                disabled={isAnalyzing}
              />

              {/* Analysis Trigger Bar */}
              <div className="mt-8 pt-6 border-t border-[#DFE3DA] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#696F68] text-center sm:text-left">
                  {selectedFile ? (
                    <span className="text-[#315B3B] font-medium flex items-center gap-1.5 justify-center sm:justify-start">
                      <span className="w-2 h-2 rounded-[2px] bg-[#315B3B]" />
                      Leaf photo ready for inspection
                    </span>
                  ) : (
                    <span>Select a photo or sample above to enable analysis</span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {selectedFile && !isAnalyzing && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setActiveSample(null);
                      }}
                      className="px-4 py-2.5 text-sm font-medium text-[#696F68] hover:text-[#242923] bg-[#F7F7F2] hover:bg-[#FFFFFF] border border-[#DFE3DA] rounded-[5px] transition-colors w-full sm:w-auto"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    className="px-6 py-2.5 text-sm font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] active:bg-[#1E3A24] disabled:bg-[#DFE3DA] disabled:text-[#696F68] disabled:cursor-not-allowed rounded-[5px] transition-colors shadow-none flex items-center justify-center gap-2.5 w-full sm:w-auto shrink-0"
                  >
                    {isAnalyzing ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-[#FFFFFF]"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>Examining your leaf...</span>
                      </>
                    ) : (
                      <>
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
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <span>Analyze Leaf</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Error Recovery Notification */}
            {analysisError && (
              <div
                role="alert"
                className="p-4 bg-[#F8E7E5] border border-[#DFE3DA] rounded-[8px] flex items-start gap-3"
              >
                <svg
                  className="w-5 h-5 text-[#8C300B] shrink-0 mt-0.5"
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

                <div className="flex-1 text-xs text-[#242923]">
                  <p className="font-semibold text-[#8C300B] mb-1">
                    Inspection Request Failed
                  </p>
                  <p className="mb-3">{analysisError}</p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      className="px-3 py-1.5 font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] rounded-[4px] transition-colors"
                    >
                      Retry Analysis
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnalysisError(null)}
                      className="px-3 py-1.5 font-medium text-[#696F68] hover:text-[#242923] bg-[#FFFFFF] border border-[#DFE3DA] rounded-[4px] transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* E. Result Section */}
        {result && (
          <section className="space-y-6">
            <AnalysisResultView
              result={result}
              onViewRemedy={handleOpenRemedy}
              onAnalyzeAnother={handleReset}
            />
          </section>
        )}

        {/* Diagnostic Guidelines Card */}
        <section className="mt-10 p-5 bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px]">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#72866A] mb-2">
            Classification Reference Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#696F68]">
            <div className="p-3 bg-[#F7F7F2] rounded-[6px] border border-[#DFE3DA]">
              <span className="font-semibold text-[#315B3B] block mb-1">
                1. Healthy
              </span>
              <p>
                Uniform green or natural foliage pigmentation without pustules, powdery coating, or active pathogenic sporulation.
              </p>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-[6px] border border-[#DFE3DA]">
              <span className="font-semibold text-[#242923] block mb-1">
                2. Rusty
              </span>
              <p>
                Raised orange, yellow, or reddish-brown uredinial pustules and flecks consistent with Pucciniales fungal infections.
              </p>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-[6px] border border-[#DFE3DA]">
              <span className="font-semibold text-[#242923] block mb-1">
                3. Powdery
              </span>
              <p>
                White to grayish talcum-powder-like superficial mycelial patches and coating consistent with Erysiphales fungal infections.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* F. Remedy View (Modal/Dialog) */}
      <RemedyModal
        isOpen={isRemedyOpen}
        onClose={() => setIsRemedyOpen(false)}
        activeRemedyKey={activeRemedyKey}
        onSelectKey={(key) => setActiveRemedyKey(key)}
      />

      {/* Privacy Notice Modal */}
      <PrivacyDialog
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#DFE3DA] bg-[#FFFFFF] py-6 text-xs text-[#696F68]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} Plant Doctor · Understand your leaf. Care for your plant.
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveRemedyKey('healthy');
                setIsRemedyOpen(true);
              }}
              className="hover:text-[#242923] underline"
            >
              Remedy Reference
            </button>
            <button
              type="button"
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-[#242923] underline"
            >
              Privacy Notice
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
