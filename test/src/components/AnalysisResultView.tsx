/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnalysisResult } from '../types/leaf';

interface AnalysisResultViewProps {
  result: AnalysisResult;
  onViewRemedy: () => void;
  onAnalyzeAnother: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  result,
  onViewRemedy,
  onAnalyzeAnother
}) => {
  // Determine surface tone based on classification and uncertainty
  const getCategoryStyles = (category: string | null, isUncertain: boolean, uncertaintyType?: string | null) => {
    if (isUncertain || category === null) {
      if (uncertaintyType === 'outside_supported_categories') {
        return {
          bannerBg: 'bg-[#F6EEDB]',
          bannerBorder: 'border-[#DFE3DA]',
          textColor: 'text-[#8C300B]',
          categoryTitle: 'Unable to classify reliably',
          statusLabel: 'Possible disease outside supported categories'
        };
      }
      return {
        bannerBg: 'bg-[#F6EEDB]',
        bannerBorder: 'border-[#DFE3DA]',
        textColor: 'text-[#242923]',
        categoryTitle: category || 'Unable to classify reliably',
        statusLabel: 'Image Unclear or Ambiguous'
      };
    }

    switch (category) {
      case 'Healthy':
        return {
          bannerBg: 'bg-[#E8F0E6]',
          bannerBorder: 'border-[#DFE3DA]',
          textColor: 'text-[#315B3B]',
          categoryTitle: 'Healthy',
          statusLabel: 'Foliage Appears Healthy'
        };
      case 'Rusty':
        return {
          bannerBg: 'bg-[#F6EEDB]',
          bannerBorder: 'border-[#DFE3DA]',
          textColor: 'text-[#242923]',
          categoryTitle: 'Rusty',
          statusLabel: 'Rust Symptoms Detected'
        };
      case 'Powdery':
        return {
          bannerBg: 'bg-[#FFFFFF]',
          bannerBorder: 'border-[#DFE3DA]',
          textColor: 'text-[#242923]',
          categoryTitle: 'Powdery',
          statusLabel: 'Powdery Mildew Symptoms Detected'
        };
      default:
        return {
          bannerBg: 'bg-[#FFFFFF]',
          bannerBorder: 'border-[#DFE3DA]',
          textColor: 'text-[#242923]',
          categoryTitle: 'Unable to classify reliably',
          statusLabel: 'Leaf Analysis Complete'
        };
    }
  };

  const style = getCategoryStyles(result.category, result.uncertain, result.uncertaintyType);

  return (
    <div className="w-full bg-[#FFFFFF] border border-[#DFE3DA] rounded-[8px] overflow-hidden">
      {/* Top Classification Header */}
      <div className={`p-6 border-b ${style.bannerBorder} ${style.bannerBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#696F68]">
                Diagnostic Status
              </span>
              {result.isDemoExample && (
                <span className="text-[11px] font-medium text-[#315B3B] bg-[#FFFFFF] border border-[#DFE3DA] px-2 py-0.5 rounded-[4px]">
                  Demonstration Reference Example
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${style.textColor}`}>
                {style.categoryTitle}
              </h2>
              <span className="text-sm font-medium text-[#696F68]">
                ({style.statusLabel})
              </span>
            </div>
          </div>

          {/* Model Confidence Metric */}
          <div className="bg-[#FFFFFF] border border-[#DFE3DA] p-3 rounded-[6px] shrink-0 sm:text-right">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#696F68] block">
              Prediction Confidence
            </span>
            <div className="text-xl font-bold text-[#242923] mt-0.5">
              {result.confidence !== null ? `${result.confidence}%` : 'Uncalibrated'}
            </div>
            <span className="text-[10px] text-[#696F68] block mt-0.5 max-w-[200px]">
              {result.isDemoExample
                ? 'Calibrated benchmark reference figure'
                : result.confidence !== null
                ? 'Vision model symptom clarity estimate'
                : 'Insufficient evidence to calibrate'}
            </span>
          </div>
        </div>

        {/* Reliability / Uncertainty Notice */}
        {result.uncertain ? (
          <div className="mt-4 p-3.5 bg-[#F8E7E5] border border-[#DFE3DA] rounded-[6px]">
            <div className="flex items-start gap-2.5">
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
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div className="text-xs text-[#242923]">
                <p className="font-semibold text-[#8C300B] mb-0.5">
                  {result.uncertaintyType === 'outside_supported_categories'
                    ? 'Possible disease outside supported categories'
                    : 'Result may not be sufficiently reliable'}
                </p>
                <p className="text-[#242923] leading-relaxed">
                  {result.uncertaintyReason ||
                    'Visual evidence does not clearly match healthy foliage, rust disease, or powdery mildew. Please upload a clearer image or consult an agricultural expert.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs text-[#696F68] flex items-center gap-1.5">
            <svg
              className="w-4 h-4 text-[#315B3B]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Visual evidence matches expected diagnostic patterns for this category.</span>
          </div>
        )}
      </div>

      {/* Findings Body */}
      <div className="p-6 space-y-6">
        {/* Step 3: Diagnostic Evidence Grounding */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#72866A] mb-1.5">
            Diagnostic Evidence Grounding
          </h3>
          <p className="text-sm text-[#242923] leading-relaxed bg-[#F7F7F2] p-3 rounded-[5px] border border-[#DFE3DA]">
            {result.evidenceForPrediction}
          </p>
        </div>

        {/* Observed visual features */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#72866A] mb-2">
            Observed Leaf Characteristics
          </h3>
          <ul className="space-y-1.5">
            {result.visibleSymptoms.map((symptom, idx) => (
              <li
                key={idx}
                className="text-xs text-[#242923] flex items-start gap-2 bg-[#F7F7F2] p-2.5 rounded-[5px] border border-[#DFE3DA]"
              >
                <span className="w-1.5 h-1.5 rounded-[1px] bg-[#315B3B] shrink-0 mt-1.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Visual findings summary */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#72866A] mb-1.5">
            Visual Findings Summary
          </h3>
          <p className="text-sm text-[#242923] leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Confidence Note & Practical Limitations */}
        <div className="p-4 bg-[#F7F7F2] border border-[#DFE3DA] rounded-[6px] text-xs text-[#696F68] space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-[#242923] shrink-0">Confidence note:</span>
            <span>{result.confidenceNote}</span>
          </div>

          <div className="border-t border-[#DFE3DA] pt-2">
            <span className="font-semibold text-[#242923] block mb-1">
              Inspection scope & limitations:
            </span>
            <ul className="list-disc pl-4 space-y-0.5">
              {result.limitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {result.category ? (
            <button
              type="button"
              onClick={onViewRemedy}
              className="px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] active:bg-[#1E3A24] rounded-[5px] transition-colors flex items-center justify-center gap-2"
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
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>View Remedy Guide</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onViewRemedy}
              className="px-5 py-2.5 text-sm font-semibold text-[#FFFFFF] bg-[#315B3B] hover:bg-[#27492F] active:bg-[#1E3A24] rounded-[5px] transition-colors flex items-center justify-center gap-2"
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
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>Browse Remedy Reference</span>
            </button>
          )}

          <button
            type="button"
            onClick={onAnalyzeAnother}
            className="px-5 py-2.5 text-sm font-medium text-[#242923] bg-[#FFFFFF] hover:bg-[#F7F7F2] border border-[#DFE3DA] rounded-[5px] transition-colors flex items-center justify-center gap-2"
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
              <polyline points="1 4 1 10 7 10" />
              <polyline points="23 20 23 14 17 14" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            <span>Analyze Another Leaf</span>
          </button>
        </div>
      </div>
    </div>
  );
};
