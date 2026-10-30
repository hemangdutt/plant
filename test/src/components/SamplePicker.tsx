/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SAMPLE_LEAVES, sampleToFile } from '../data/samples';
import { SampleLeaf } from '../types/leaf';

interface SamplePickerProps {
  onSelectSample: (file: File, sample: SampleLeaf) => void;
  disabled: boolean;
}

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSelectSample,
  disabled
}) => {
  const handleSampleClick = async (sample: SampleLeaf) => {
    if (disabled) return;
    try {
      const file = await sampleToFile(sample);
      onSelectSample(file, sample);
    } catch (err) {
      console.error('Failed to load sample leaf', err);
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-[#DFE3DA]">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-4">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-[#72866A]">
          Or test with a calibrated botanical sample
        </h4>
        <span className="text-xs text-[#696F68]">
          Click any sample below to load and inspect
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SAMPLE_LEAVES.map((sample) => (
          <button
            key={sample.id}
            type="button"
            onClick={() => handleSampleClick(sample)}
            disabled={disabled}
            className="text-left bg-[#FFFFFF] hover:bg-[#F7F7F2] border border-[#DFE3DA] hover:border-[#72866A] p-3 rounded-[6px] transition-colors disabled:opacity-50 flex items-start gap-3 group"
          >
            {/* Thumbnail */}
            <div className="w-12 h-12 bg-[#F7F7F2] border border-[#DFE3DA] rounded-[4px] overflow-hidden shrink-0">
              <img
                src={sample.svgDataUri}
                alt={sample.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-[#242923] group-hover:text-[#315B3B]">
                  {sample.name}
                </span>
                {sample.isDemo && (
                  <span className="text-[10px] font-medium text-[#315B3B] bg-[#E8F0E6] px-1.5 py-0.2 rounded-[3px]">
                    Demo: 97% baseline
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#72866A] italic truncate">
                {sample.species}
              </p>
              <p className="text-[11px] text-[#696F68] mt-0.5 line-clamp-1">
                {sample.expectedCategory} condition
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
