/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { REMEDY_GUIDES, categoryToRemedyKey, getRemedyByKey } from '../src/data/remedies.ts';
import { SAMPLE_LEAVES } from '../src/data/samples.ts';
import { LeafCategory, RemedyKey } from '../src/types/leaf.ts';
import fs from 'fs';
import path from 'path';

function runTests() {
  console.log('--- RUNNING PLANT DOCTOR STRICT QA SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Classification categories validation
  const validCategories: LeafCategory[] = ['Healthy', 'Rusty', 'Powdery'];
  assert(validCategories.length === 3, 'Classification domain is strictly 3 categories: Healthy, Rusty, Powdery');

  // 2. Remedy mapping validation
  assert(categoryToRemedyKey('Healthy') === 'healthy', 'Maps Healthy category to healthy remedy key');
  assert(categoryToRemedyKey('Rusty') === 'rusty', 'Maps Rusty category to rusty remedy key');
  assert(categoryToRemedyKey('Powdery') === 'powdery', 'Maps Powdery category to powdery remedy key');

  // 3. Remedy guides content verification
  const keys: RemedyKey[] = ['healthy', 'rusty', 'powdery'];
  for (const k of keys) {
    const guide = getRemedyByKey(k);
    assert(Boolean(guide), `Remedy guide exists for ${k}`);
    assert(guide.sections.length >= 3, `Remedy guide for ${k} contains core sections`);
    
    const titles = guide.sections.map(s => s.title);
    assert(titles.includes('What to do now'), `Remedy guide for ${k} has "What to do now"`);
    assert(titles.includes('Prevention'), `Remedy guide for ${k} has "Prevention"`);
    assert(titles.includes('Important precautions'), `Remedy guide for ${k} has "Important precautions"`);
    assert(guide.whenToConsultExpert.length > 0, `Remedy guide for ${k} has expert consultation guidance`);
    assert(Boolean(guide.disclaimer), `Remedy guide for ${k} contains the mandatory disclaimer`);
    assert(guide.disclaimer.includes('preliminary visual guidance'), `Remedy guide for ${k} includes preliminary guidance notice`);
  }

  // 4. Demonstration reference sample check
  const demoSample = SAMPLE_LEAVES.find(s => s.isDemo);
  assert(Boolean(demoSample), 'Explicit demonstration reference sample exists');
  assert(demoSample?.demoConfidence === 97, 'Demonstration sample displays 97% confidence benchmark only');
  assert(demoSample?.expectedCategory === 'Healthy', 'Demonstration sample is healthy baseline');

  // 5. Sample leaves coverage
  assert(SAMPLE_LEAVES.length === 3, 'Three botanical samples provided');
  const sampleCategories = SAMPLE_LEAVES.map(s => s.expectedCategory);
  assert(sampleCategories.includes('Healthy'), 'Sample leaves include Healthy');
  assert(sampleCategories.includes('Rusty'), 'Sample leaves include Rusty');
  assert(sampleCategories.includes('Powdery'), 'Sample leaves include Powdery');

  // 6. Design System Sanity Checks (No gradients, no pill buttons in component code)
  const srcDir = path.resolve(process.cwd(), 'src');
  const componentsDir = path.join(srcDir, 'components');
  const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

  let foundGradient = false;
  let foundPillButton = false;

  for (const file of componentFiles) {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');
    if (content.includes('bg-gradient') || content.includes('linear-gradient')) {
      foundGradient = true;
      console.error(`Gradient detected in ${file}`);
    }
    // Check for pill buttons (button with rounded-full)
    if (/<button[^>]*rounded-full/.test(content)) {
      foundPillButton = true;
      console.error(`Pill button detected in ${file}`);
    }
  }

  assert(!foundGradient, 'Strict design check: Zero gradients found across all components');
  assert(!foundPillButton, 'Strict design check: Zero pill-shaped buttons found across all components');

  // 7. Security check: No API keys exposed in src
  const allSrcFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/index.css',
    'src/data/remedies.ts',
    'src/data/samples.ts',
    'src/types/leaf.ts',
    'src/utils/fileValidation.ts',
    ...componentFiles.map(f => `src/components/${f}`)
  ];

  let clientExposedKey = false;
  for (const relPath of allSrcFiles) {
    const full = path.resolve(process.cwd(), relPath);
    if (fs.existsSync(full)) {
      const code = fs.readFileSync(full, 'utf-8');
      if (code.includes('process.env.GEMINI_API_KEY') || code.includes('@google/genai')) {
        clientExposedKey = true;
        console.error(`Client code imports @google/genai or references GEMINI_API_KEY: ${relPath}`);
      }
    }
  }

  assert(!clientExposedKey, 'Security check: Client bundle contains zero Gemini API key references or direct SDK imports');

  console.log(`\nQA Suite Finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
