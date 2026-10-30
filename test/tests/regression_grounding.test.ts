/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import jpeg from 'jpeg-js';
import { AnalysisResult } from '../src/types/leaf.ts';

/**
 * Creates a raw 200x200 JPEG image with programmatic pixel patterns
 */
function createSyntheticJpeg(generator: (x: number, y: number) => [number, number, number]): Buffer {
  const width = 200;
  const height = 200;
  const rawData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b] = generator(x, y);
      rawData[idx] = r;
      rawData[idx + 1] = g;
      rawData[idx + 2] = b;
      rawData[idx + 3] = 255;
    }
  }

  const encoded = jpeg.encode({ data: rawData, width, height }, 85);
  return encoded.data;
}

// Case 1: Leaf with visible brown/black lesions and discoloration (e.g. leaf spot / anthracnose)
const leafWithBrownLesions1 = createSyntheticJpeg((x, y) => {
  // Necrotic brown lesions with dark margins
  const isLesion1 = Math.hypot(x - 70, y - 80) < 16;
  const isLesion2 = Math.hypot(x - 130, y - 110) < 18;
  const isLesion3 = Math.hypot(x - 100, y - 150) < 12;

  if (isLesion1 || isLesion2 || isLesion3) {
    // Dull brown necrotic tissue with charcoal/black centers
    const dist = Math.min(
      Math.hypot(x - 70, y - 80),
      Math.hypot(x - 130, y - 110),
      Math.hypot(x - 100, y - 150)
    );
    if (dist < 6) return [35, 30, 25]; // Dark necrotic core
    return [85, 60, 35]; // Dull brown dead tissue
  }
  // Otherwise green leaf
  return [48, 128, 52];
});

// Case 2: Second leaf with black lesions and discoloration (e.g. bacterial blight / scab)
const leafWithBlackLesions2 = createSyntheticJpeg((x, y) => {
  // Dark black/charcoal irregular lesions
  const isBlackSpot = (
    Math.hypot(x - 50, y - 60) < 14 ||
    Math.hypot(x - 140, y - 80) < 15 ||
    Math.hypot(x - 80, y - 130) < 20 ||
    Math.hypot(x - 150, y - 150) < 12
  );

  if (isBlackSpot) {
    return [40, 38, 35]; // Dark black necrotic lesion
  }
  return [55, 130, 50];
});

// Case 3: Leaf with widespread white powder-like coating (Powdery Mildew)
const powderyMildewJpeg = createSyntheticJpeg((x, y) => {
  const isPowderPatch = (
    Math.hypot(x - 80, y - 80) < 45 ||
    Math.hypot(x - 130, y - 130) < 40 ||
    Math.hypot(x - 100, y - 150) < 30
  );

  if (isPowderPatch) {
    return [200, 202, 198]; // Matte white/gray powdery mycelial mat
  }
  return [45, 125, 48];
});

// Case 4: Leaf with obvious orange-brown rust pustules (Rusty)
const rustPustuleJpeg = createSyntheticJpeg((x, y) => {
  const isPustule = (
    Math.hypot(x - 70, y - 70) < 12 ||
    Math.hypot(x - 120, y - 90) < 14 ||
    Math.hypot(x - 150, y - 140) < 11 ||
    Math.hypot(x - 80, y - 130) < 10
  );
  const isHalo = (
    Math.hypot(x - 70, y - 70) < 18 ||
    Math.hypot(x - 120, y - 90) < 20 ||
    Math.hypot(x - 150, y - 140) < 16
  );

  if (isPustule) {
    return [195, 70, 15]; // Vivid orange to reddish-brown rust pustule
  }
  if (isHalo) {
    return [170, 155, 40]; // Chlorotic yellow halo
  }
  return [55, 120, 50];
});

// Case 5: Clearly healthy green leaf (with minor texture / moisture)
const pristineHealthyJpeg = createSyntheticJpeg((x, y) => {
  const isVein = Math.abs(x - 100) < 2;
  const isDroplet = Math.hypot(x - 60, y - 70) < 5;
  if (isDroplet) return [235, 235, 230];
  if (isVein) return [65, 145, 60];
  return [40, 135, 48];
});

// Case 6: Dark, underexposed, or blurry non-informative image
const darkBlurryJpeg = createSyntheticJpeg(() => {
  return [15, 18, 15];
});

// Case 7: Non-leaf image (e.g. blue sky or artificial object)
const nonLeafJpeg = createSyntheticJpeg(() => {
  return [40, 120, 220]; // Blue sky
});

async function runRegressionSuite() {
  console.log('--- EXECUTING PLANT DOCTOR STRICT REGRESSION SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail: string = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${detail}`);
      failed++;
    }
  }

  async function postAnalyze(buffer: Buffer, filename: string): Promise<AnalysisResult> {
    const res = await fetch('http://localhost:3000/api/analyze-leaf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: buffer.toString('base64'),
        mimeType: 'image/jpeg',
        filename: filename
      })
    });
    return res.json();
  }

  // 1. First uploaded leaf with brown/black lesions: MUST NOT be labeled Healthy!
  const res1 = await postAnalyze(leafWithBrownLesions1, 'brown_lesions_leaf.jpg');
  assert(res1.category !== 'Healthy', 'Regression 1: Leaf with brown lesions is NOT labeled Healthy', `Got: ${res1.category}`);
  assert(res1.uncertain === true, 'Regression 1: Flags uncertainty for condition outside supported categories');
  assert(res1.uncertaintyType === 'outside_supported_categories', 'Regression 1: uncertaintyType is outside_supported_categories');
  assert(res1.remedyKey === null, 'Regression 1: Does NOT prescribe unsupported remedy');
  assert(res1.visibleSymptoms.some(s => /lesion|necrotic|discoloration/i.test(s)), 'Regression 1: Identifies visible lesions/discoloration');

  // 2. Second uploaded leaf with black lesions: MUST NOT be labeled Healthy!
  const res2 = await postAnalyze(leafWithBlackLesions2, 'black_lesions_leaf.jpg');
  assert(res2.category !== 'Healthy', 'Regression 2: Leaf with black lesions is NOT labeled Healthy', `Got: ${res2.category}`);
  assert(res2.uncertain === true, 'Regression 2: Flags uncertainty for condition outside supported categories');
  assert(res2.uncertaintyType === 'outside_supported_categories', 'Regression 2: uncertaintyType is outside_supported_categories');
  assert(res2.remedyKey === null, 'Regression 2: Does NOT prescribe unsupported remedy');

  // 3. Leaf with widespread white powder-like coating: expected Powdery
  const res3 = await postAnalyze(powderyMildewJpeg, 'powdery_leaf.jpg');
  assert(res3.category === 'Powdery', 'Regression 3: Leaf with widespread white powder classified as Powdery', `Got: ${res3.category}`);
  assert(res3.remedyKey === 'powdery', 'Regression 3: Maps strictly to powdery remedy');
  assert(!res3.visibleSymptoms.some(s => /rust|pustule|uredinia|orange/i.test(s)), 'Regression 3: Does NOT hallucinate rust pustules or orange spots');
  assert(res3.visibleSymptoms.some(s => /white|powdery|mycelial/i.test(s)), 'Regression 3: Identifies visible white powdery features');

  // 4. Clearly healthy green leaf: expected Healthy
  const res4 = await postAnalyze(pristineHealthyJpeg, 'healthy_leaf.jpg');
  assert(res4.category === 'Healthy', 'Regression 4: Clearly healthy green leaf classified as Healthy', `Got: ${res4.category}`);
  assert(res4.remedyKey === 'healthy', 'Regression 4: Maps strictly to healthy remedy');
  assert(res4.uncertain === false, 'Regression 4: Healthy leaf is not uncertain');

  // 5. Leaf with obvious orange-brown rust pustules: expected Rusty
  const res5 = await postAnalyze(rustPustuleJpeg, 'rust_leaf.jpg');
  assert(res5.category === 'Rusty', 'Regression 5: Leaf with orange-brown pustules classified as Rusty', `Got: ${res5.category}`);
  assert(res5.remedyKey === 'rusty', 'Regression 5: Maps strictly to rusty remedy');
  assert(res5.visibleSymptoms.some(s => /orange|pustule|uredinia/i.test(s)), 'Regression 5: Identifies visible orange-brown pustules');

  // 6. Blurry or dark non-leaf image: must trigger appropriate validation or uncertainty handling
  const res6 = await postAnalyze(darkBlurryJpeg, 'dark_blurry.jpg');
  assert(res6.uncertain === true, 'Regression 6A: Dark/blurry image flags uncertain: true');
  assert(res6.uncertaintyType === 'unclear_image', 'Regression 6A: uncertaintyType is unclear_image');
  assert(Boolean(res6.uncertaintyReason), 'Regression 6A: Provides clear guidance on taking a clearer photo');

  const res7 = await postAnalyze(nonLeafJpeg, 'sky_non_leaf.jpg');
  assert(res7.uncertain === true, 'Regression 6B: Non-leaf blue image flags uncertain: true');

  // 7. Confidence Integrity
  assert(res1.confidence === null, 'Confidence Integrity: Uncertain brown lesion has null confidence');
  assert(res2.confidence === null, 'Confidence Integrity: Uncertain black lesion has null confidence');
  assert(res3.confidence !== 97, 'Confidence Integrity: Real powdery leaf does not claim arbitrary 97%');
  assert(res4.confidence !== 97, 'Confidence Integrity: Real healthy leaf does not claim arbitrary 97%');
  assert(res5.confidence !== 97, 'Confidence Integrity: Real rust leaf does not claim arbitrary 97%');

  console.log(`\nStrict Regression Suite Complete: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error('Regression suite runtime error:', err);
  process.exit(1);
});
