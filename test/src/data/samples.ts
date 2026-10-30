/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SampleLeaf } from '../types/leaf';

// Vector SVG representation for Healthy Monstera leaf
const healthyLeafSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#E8F0E6"/>
  <!-- Leaf Stem -->
  <path d="M 200 370 Q 200 280 200 200" stroke="#224029" stroke-width="8" stroke-linecap="round" fill="none"/>
  <!-- Leaf Blade -->
  <path d="M 200 40 C 290 80 340 180 320 270 C 300 340 240 360 200 360 C 160 360 100 340 80 270 C 60 180 110 80 200 40 Z" fill="#315B3B"/>
  <!-- Monstera side fenestration cutouts -->
  <path d="M 200 50 C 270 90 320 180 300 260 C 280 320 230 350 200 350 C 170 350 120 320 100 260 C 80 180 130 90 200 50 Z" fill="#3D6E49"/>
  <!-- Central Vein -->
  <path d="M 200 350 Q 200 200 200 50" stroke="#72866A" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Secondary Lateral Veins -->
  <path d="M 200 100 Q 240 90 280 80" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 100 Q 160 90 120 80" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 150 Q 250 140 295 130" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 150 Q 150 140 105 130" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 200 Q 255 195 295 190" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 200 Q 145 195 105 190" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 250 Q 245 250 280 255" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <path d="M 200 250 Q 155 250 120 255" stroke="#72866A" stroke-width="2.5" fill="none"/>
  <!-- Subtle natural texture -->
  <circle cx="230" cy="120" r="2" fill="#55805E" opacity="0.6"/>
  <circle cx="170" cy="180" r="2" fill="#55805E" opacity="0.6"/>
  <circle cx="215" cy="270" r="2.5" fill="#55805E" opacity="0.6"/>
</svg>`;

// Vector SVG representation for Rust Leaf
const rustLeafSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#F6EEDB"/>
  <!-- Stem -->
  <path d="M 200 375 Q 195 290 200 210" stroke="#423521" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Leaf Blade with Chlorotic Patches -->
  <path d="M 200 45 C 290 85 335 185 315 275 C 295 340 240 365 200 365 C 160 365 105 340 85 275 C 65 185 110 85 200 45 Z" fill="#5F6B43"/>
  <!-- Chlorotic yellow-orange halos around rust infection areas -->
  <ellipse cx="160" cy="140" rx="35" ry="25" fill="#A89438" opacity="0.75"/>
  <ellipse cx="235" cy="180" rx="40" ry="30" fill="#B09938" opacity="0.75"/>
  <ellipse cx="175" cy="245" rx="30" ry="22" fill="#998632" opacity="0.7"/>
  <ellipse cx="220" cy="105" rx="24" ry="18" fill="#AA9437" opacity="0.7"/>
  <!-- Main Vein -->
  <path d="M 200 365 Q 198 210 200 45" stroke="#7A784F" stroke-width="3.5" fill="none"/>
  <!-- Raised Rust Pustules (uredinia) in orange/red-brown -->
  <circle cx="155" cy="135" r="4.5" fill="#B84814"/>
  <circle cx="165" cy="142" r="5" fill="#A03B0E"/>
  <circle cx="150" cy="148" r="4" fill="#C25418"/>
  <circle cx="172" cy="132" r="3.5" fill="#B84814"/>
  <circle cx="142" cy="138" r="3" fill="#8C300B"/>
  <!-- Rust cluster 2 -->
  <circle cx="230" cy="175" r="5" fill="#B84814"/>
  <circle cx="242" cy="182" r="5.5" fill="#A03B0E"/>
  <circle cx="225" cy="190" r="4" fill="#C25418"/>
  <circle cx="250" cy="172" r="4.5" fill="#8C300B"/>
  <circle cx="218" cy="178" r="3.5" fill="#B84814"/>
  <circle cx="248" cy="192" r="3.5" fill="#9F3C0F"/>
  <!-- Rust cluster 3 -->
  <circle cx="170" cy="240" r="4" fill="#B84814"/>
  <circle cx="180" cy="248" r="4.5" fill="#A03B0E"/>
  <circle cx="164" cy="252" r="3.5" fill="#C25418"/>
  <circle cx="185" cy="238" r="3" fill="#8C300B"/>
  <!-- Scattered pustules -->
  <circle cx="215" cy="102" r="3.5" fill="#B84814"/>
  <circle cx="226" cy="108" r="4" fill="#9F3C0F"/>
  <circle cx="130" cy="205" r="3" fill="#B84814"/>
  <circle cx="260" cy="235" r="3.5" fill="#A03B0E"/>
  <circle cx="185" cy="175" r="4" fill="#C25418"/>
  <circle cx="190" cy="295" r="3" fill="#B84814"/>
</svg>`;

// Vector SVG representation for Powdery Mildew Leaf
const powderyLeafSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#EAEAE5"/>
  <!-- Stem -->
  <path d="M 200 375 Q 198 290 200 210" stroke="#374834" stroke-width="7" stroke-linecap="round" fill="none"/>
  <!-- Leaf Blade -->
  <path d="M 200 45 C 300 85 340 185 320 275 C 300 345 240 365 200 365 C 160 365 100 345 80 275 C 60 185 100 85 200 45 Z" fill="#4B6349"/>
  <!-- Main Vein -->
  <path d="M 200 365 Q 200 210 200 45" stroke="#688065" stroke-width="3.5" fill="none"/>
  <!-- Lateral Veins -->
  <path d="M 200 110 Q 250 100 290 90" stroke="#688065" stroke-width="2" fill="none"/>
  <path d="M 200 110 Q 150 100 110 90" stroke="#688065" stroke-width="2" fill="none"/>
  <path d="M 200 180 Q 260 170 305 160" stroke="#688065" stroke-width="2" fill="none"/>
  <path d="M 200 180 Q 140 170 95 160" stroke="#688065" stroke-width="2" fill="none"/>
  <path d="M 200 260 Q 255 255 295 260" stroke="#688065" stroke-width="2" fill="none"/>
  <path d="M 200 260 Q 145 255 105 260" stroke="#688065" stroke-width="2" fill="none"/>
  <!-- Powdery Mildew White/Gray Mycelial Patches (fluffy chalky talcum patches) -->
  <ellipse cx="160" cy="135" rx="38" ry="28" fill="#F0F2ED" opacity="0.88"/>
  <circle cx="150" cy="130" r="16" fill="#FFFFFF" opacity="0.95"/>
  <circle cx="172" cy="142" r="14" fill="#FFFFFF" opacity="0.9"/>
  
  <ellipse cx="240" cy="190" rx="48" ry="36" fill="#F0F2ED" opacity="0.9"/>
  <circle cx="230" cy="180" r="20" fill="#FFFFFF" opacity="0.95"/>
  <circle cx="255" cy="200" r="18" fill="#FFFFFF" opacity="0.9"/>
  <circle cx="225" cy="205" r="14" fill="#FFFFFF" opacity="0.85"/>

  <ellipse cx="170" cy="255" rx="34" ry="24" fill="#F0F2ED" opacity="0.85"/>
  <circle cx="165" cy="250" r="14" fill="#FFFFFF" opacity="0.92"/>
  <circle cx="180" cy="260" r="12" fill="#FFFFFF" opacity="0.85"/>

  <!-- Smaller spreading powdery spots -->
  <circle cx="220" cy="100" r="9" fill="#FFFFFF" opacity="0.85"/>
  <circle cx="130" cy="200" r="11" fill="#FFFFFF" opacity="0.88"/>
  <circle cx="270" cy="250" r="10" fill="#FFFFFF" opacity="0.82"/>
  <circle cx="190" cy="305" r="8" fill="#FFFFFF" opacity="0.8"/>
  <circle cx="205" cy="150" r="7" fill="#FFFFFF" opacity="0.75"/>
</svg>`;

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-healthy',
    name: 'Monstera Leaf',
    species: 'Monstera deliciosa',
    expectedCategory: 'Healthy',
    isDemo: true,
    demoConfidence: 97,
    description: 'Uniform deep green lamina, intact leaf margins, clear venation, no fungal pustules or powder.',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(healthyLeafSvg)}`
  },
  {
    id: 'sample-rust',
    name: 'Bean Leaf',
    species: 'Phaseolus vulgaris',
    expectedCategory: 'Rusty',
    isDemo: false,
    description: 'Conspicuous orange-brown uredinial pustules with surrounding chlorotic yellow haloes.',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(rustLeafSvg)}`
  },
  {
    id: 'sample-powdery',
    name: 'Squash Leaf',
    species: 'Cucurbita pepo',
    expectedCategory: 'Powdery',
    isDemo: false,
    description: 'Chalky white, talcum-like superficial fungal mycelium patches across adaxial leaf surface.',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(powderyLeafSvg)}`
  }
];

/**
 * Converts a sample leaf into a standard raster PNG File via Canvas in browser,
 * ensuring 100% standard binary image format compatibility across all vision models.
 */
export function sampleToFile(sample: SampleLeaf): Promise<File> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 400;
          canvas.height = 400;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            fallbackSvgToFile(sample).then(resolve).catch(reject);
            return;
          }
          ctx.drawImage(img, 0, 0, 400, 400);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], `${sample.id}.png`, { type: 'image/png' }));
            } else {
              fallbackSvgToFile(sample).then(resolve).catch(reject);
            }
          }, 'image/png');
        } catch (e) {
          fallbackSvgToFile(sample).then(resolve).catch(reject);
        }
      };
      img.onerror = () => {
        fallbackSvgToFile(sample).then(resolve).catch(reject);
      };
      img.src = sample.svgDataUri;
    } else {
      fallbackSvgToFile(sample).then(resolve).catch(reject);
    }
  });
}

async function fallbackSvgToFile(sample: SampleLeaf): Promise<File> {
  const res = await fetch(sample.svgDataUri);
  const blob = await res.blob();
  return new File([blob], `${sample.id}.svg`, { type: 'image/svg+xml' });
}
