/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LeafCategory = 'Healthy' | 'Rusty' | 'Powdery';

export type RemedyKey = 'healthy' | 'rusty' | 'powdery';

export type UncertaintyType = 'unclear_image' | 'outside_supported_categories';

export interface AnalysisResult {
  category: LeafCategory | null; // Null when uncertain or outside supported categories
  confidence: number | null; // Nullable numeric estimate
  confidenceNote: string;
  visibleSymptoms: string[]; // List of observable features
  evidenceForPrediction: string; // Concise explanation grounded in observable features
  summary: string;
  remedyKey: RemedyKey | null; // Validated category-to-remedy mapping, or null if uncertain
  uncertain: boolean;
  uncertaintyType?: UncertaintyType | null;
  uncertaintyReason?: string;
  limitations: string[];
  analyzedAt: string;
  isDemoExample?: boolean;
}

export interface RemedySection {
  title: string;
  items: string[];
}

export interface RemedyGuide {
  category: LeafCategory;
  title: string;
  conditionDescription: string;
  whyItOccurs: string;
  sections: RemedySection[];
  whenToConsultExpert: string[];
  disclaimer: string;
}

export interface SampleLeaf {
  id: string;
  name: string;
  species: string;
  expectedCategory: LeafCategory;
  isDemo?: boolean;
  demoConfidence?: number;
  description: string;
  svgDataUri: string;
}
