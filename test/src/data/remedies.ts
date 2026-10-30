/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LeafCategory, RemedyGuide, RemedyKey } from '../types/leaf';

export const REMEDY_GUIDES: Record<RemedyKey, RemedyGuide> = {
  healthy: {
    category: 'Healthy',
    title: 'Care Guide for Healthy Foliage',
    conditionDescription: 'The leaf exhibits uniform green pigmentation, intact cellular margins, and an absence of pathogenic sporulation or necrotic pustules.',
    whyItOccurs: 'Optimal balance of moisture, aeration, ambient light, and soil nutrition, coupled with robust plant immune defenses that prevent fungal spore germination.',
    sections: [
      {
        title: 'What to do now',
        items: [
          'Maintain appropriate watering and soil drainage to avoid root saturation or anoxic root conditions.',
          'Provide sunlight duration and intensity appropriate for this specific plant species.',
          'Regularly monitor new leaves and inspect both the adaxial (upper) and abaxial (lower) surfaces for early stress indicators.',
          'Avoid unnecessary pesticide or fungicide use, preserving the natural phyllosphere microbiome that protects against opportunistic pathogens.'
        ]
      },
      {
        title: 'Prevention',
        items: [
          'Inspect leaf undersides and stems during routine care to spot early signs before pathogens establish.',
          'Ensure potting media or garden beds maintain steady drainage and aerobic soil structure.',
          'Water at the base or root zone; avoid splashing soil particles onto lower leaves.',
          'Space neighboring plants adequately to ensure ambient air circulates freely.'
        ]
      },
      {
        title: 'Important precautions',
        items: [
          'Do not apply chemical fungicides prophylactically without confirmed disease symptoms; doing so can cause chemical phytotoxicity and build microbial resistance.',
          'Avoid excessive high-nitrogen feeding, which forces rapid succulent growth that is unusually vulnerable to insect piercing and fungal spores.'
        ]
      }
    ],
    whenToConsultExpert: [
      'If sudden unprovoked leaf drop, vascular wilt, or systemic yellowing begins despite appropriate soil moisture and illumination.',
      'If roots inspect brown, soft, or foul-smelling, indicating subterranean root rot requiring lab diagnosis.'
    ],
    disclaimer: 'Plant Doctor provides preliminary visual guidance. Confirm uncertain or severe cases with a qualified agricultural expert.'
  },

  rusty: {
    category: 'Rusty',
    title: 'Remedy Guide for Rust Disease',
    conditionDescription: 'Visual signs indicate rust fungal disease (order Pucciniales), characterized by raised yellow, orange, or reddish-brown pustules (uredinia) that rupture the leaf cuticle.',
    whyItOccurs: 'Rust pathogens disperse microscopic urediniospores via wind, rain splash, or contaminated tools. Spores require extended leaf surface wetness (typically 4–8 hours of uninterrupted moisture) and moderate temperatures to germinate and penetrate leaf stomata.',
    sections: [
      {
        title: 'What to do now',
        items: [
          'Carefully prune and remove heavily infected leaves showing clustered rust pustules. Place them directly into a disposal bag to avoid scattering spores.',
          'Dispose of pruned infected foliage in sealed municipal waste; never add rust-infected foliage to home compost piles where spores can overwinter.',
          'Avoid prolonged leaf wetness: immediately cease overhead irrigation, sprinklers, or misting foliage.',
          'Water plants strictly at the root zone in the early morning so that any accidental splash dries rapidly in daylight.',
          'Improve canopy airflow and increase separation between adjacent plants to reduce humidity in the microclimate.'
        ]
      },
      {
        title: 'Prevention',
        items: [
          'Maintain wide spacing between containers or garden rows to allow cross-breezes to dry foliage quickly.',
          'Clean and disinfect pruning shears with 70% isopropyl alcohol or 10% bleach solution between cuts to prevent mechanical spore transfer.',
          'Rake and discard fallen dead foliage around the base of the plant before winter dormancy.',
          'Select rust-resistant cultivars when replacing or expanding your garden plants.'
        ]
      },
      {
        title: 'Important precautions',
        items: [
          'Recommend plant-specific, locally approved treatments only when appropriate; never prescribe a universal fungicide.',
          'Fungicides act protectively rather than curatively: they prevent newly emerging foliage from infection but cannot reverse existing necrotic pustules.',
          'If applying approved copper-based or sulfur sprays, verify plant tolerance first (e.g., avoid sulfur sprays when temperatures exceed 85°F/29°C or on sulfur-sensitive plants to prevent severe chemical leaf scorch).'
        ]
      }
    ],
    whenToConsultExpert: [
      'If rust pustules cover more than 25–30% of total canopy foliage despite leaf sanitation and moisture control.',
      'If rust affects commercial orchard trees, grain crops, or prized heritage perennials that require licensed fungicide applications or state extension diagnosis.'
    ],
    disclaimer: 'Plant Doctor provides preliminary visual guidance. Confirm uncertain or severe cases with a qualified agricultural expert.'
  },

  powdery: {
    category: 'Powdery',
    title: 'Remedy Guide for Powdery Mildew',
    conditionDescription: 'Visual signs indicate powdery mildew (order Erysiphales), presenting as white to grayish-white powdery talcum-like fungal colonies on leaf blades, petioles, and young stems.',
    whyItOccurs: 'Powdery mildew is caused by obligate biotrophic fungi. Unlike most fungi, powdery mildew conidia spores do not require liquid standing water to germinate—they flourish in high relative humidity (above 70%) combined with warm, dry days, stagnant air, and shaded foliage.',
    sections: [
      {
        title: 'What to do now',
        items: [
          'Prune and discard severely covered, yellowing, or distorted leaves to reduce the volume of active sporulating mycelium.',
          'Seal pruned leaves in a bag and dispose of them with household trash; do not leave clippings under the plant.',
          'Improve spacing and prune overcrowded interior branches to promote direct air circulation through the canopy.',
          'Halt or significantly reduce high-nitrogen fertilizers; excess nitrogen stimulates tender, succulent flushes that powdery mildew quickly colonizes.',
          'Move potted specimens into brighter locations with good air movement and direct sunlight suited to the species.'
        ]
      },
      {
        title: 'Prevention',
        items: [
          'Provide adequate direct sunlight appropriate for the plant; shade and stagnant air are the two greatest contributors to powdery mildew proliferation.',
          'Maintain clean surrounding soil and remove fallen leaf litter where cleistothecia (overwintering structures) harbor.',
          'Clean cutting tools with 70% isopropyl alcohol after working with infected specimens.',
          'Choose certified mildew-resistant varieties for susceptible species like squash, cucumber, phlox, roses, and lilacs.'
        ]
      },
      {
        title: 'Important precautions',
        items: [
          'Recommend suitable, locally approved treatments only when appropriate; treatment efficacy depends strictly on plant species and stage of maturity.',
          'Organic options such as potassium bicarbonate sprays (e.g. 1 tbsp per gallon water with mild horticultural soap) or neem/horticultural oil can manage early outbreaks.',
          'Crucial safety rule: Never apply oils within 14 to 30 days of any sulfur-based fungicide, as this reaction causes severe leaf burn and defoliation.',
          'Apply any spray treatments during cooler dusk hours to avoid sunlight-induced leaf phototoxicity.'
        ]
      }
    ],
    whenToConsultExpert: [
      'If powdery mildew persists across new growth flushes after cultural corrections and organic applications.',
      'If valuable fruiting or flowering plants experience severe distortion, flower bud failure, or widespread premature defoliation.'
    ],
    disclaimer: 'Plant Doctor provides preliminary visual guidance. Confirm uncertain or severe cases with a qualified agricultural expert.'
  }
};

export function getRemedyByKey(key: RemedyKey): RemedyGuide {
  return REMEDY_GUIDES[key] || REMEDY_GUIDES.healthy;
}

export function categoryToRemedyKey(category: LeafCategory | null | undefined): RemedyKey {
  switch (category) {
    case 'Healthy':
      return 'healthy';
    case 'Rusty':
      return 'rusty';
    case 'Powdery':
      return 'powdery';
    default:
      return 'healthy';
  }
}
