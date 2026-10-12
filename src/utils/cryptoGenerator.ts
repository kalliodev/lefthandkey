import { GeneratorSettings, PasswordItem } from '../types';
import {
  ALL_CONSONANTS,
  ALL_LOWER,
  ALL_NUMBERS,
  ALL_SYMBOLS,
  ALL_UPPER,
  ALL_VOWELS,
  getCharInfo,
  LEFT_HAND_CONSONANTS,
  LEFT_HAND_LOWER,
  LEFT_HAND_NUMBERS,
  LEFT_HAND_SYMBOLS,
  LEFT_HAND_UPPER,
  LEFT_HAND_VOWELS,
  RIGHT_HAND_CONSONANTS,
  RIGHT_HAND_LOWER,
  RIGHT_HAND_NUMBERS,
  RIGHT_HAND_SYMBOLS,
  RIGHT_HAND_UPPER,
  RIGHT_HAND_VOWELS,
} from './keyboardData';

/**
 * Cryptographically secure random integer in range [0, max - 1]
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (max === 1) return 0;

  const array = new Uint32Array(1);
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);

  let rand: number;
  do {
    window.crypto.getRandomValues(array);
    rand = array[0];
  } while (rand >= limit);

  return rand % max;
}

export function secureChoice<T>(array: T[]): T {
  if (array.length === 0) throw new Error('Cannot pick from empty array');
  const index = getSecureRandomInt(array.length);
  return array[index];
}

export function secureShuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

/**
 * Calculate bits of entropy based on difficulty tier or mode
 */
export function calculateEntropy(length: number, poolSize: number, mode: string = 'progressive-ladder', tierLevel?: number): number {
  if (poolSize <= 1 || length <= 0) return 0;

  // Progressive tier specific entropy
  if (tierLevel !== undefined) {
    // Tier 1 is ~14 bits, scaling smoothly to full uniform entropy at Tier 12 (~52 bits for 12 chars)
    const minEntropy = 14;
    const maxEntropy = length * Math.log2(poolSize);
    const factor = (tierLevel - 1) / 11; // 0.0 at tier 1, 1.0 at tier 12
    const est = minEntropy + factor * (maxEntropy - minEntropy);
    return Number(est.toFixed(1));
  }

  if (mode === 'memorable-rhythm') {
    const consonantChoices = Math.max(2, Math.floor(poolSize * 0.65));
    const vowelChoices = Math.max(2, Math.floor(poolSize * 0.15));
    const numberChoices = Math.max(2, Math.floor(poolSize * 0.2));
    const syllableBits = Math.log2(consonantChoices * vowelChoices);
    const numPairBits = Math.log2(numberChoices * numberChoices);
    const cycles = length / 6;
    return Number(Math.max(16, cycles * (syllableBits + numPairBits)).toFixed(1));
  }

  if (mode === 'alternating-cv') {
    const consonantChoices = Math.max(2, Math.floor(poolSize * 0.65));
    const vowelChoices = Math.max(2, Math.floor(poolSize * 0.15));
    const numberChoices = Math.max(2, Math.floor(poolSize * 0.2));
    const bitsPerCV = Math.log2(consonantChoices) + Math.log2(vowelChoices);
    const bitsPerNum = Math.log2(numberChoices);
    const cycles = length / 6;
    return Number(Math.max(22, cycles * (bitsPerCV * 2 + bitsPerNum * 2)).toFixed(1));
  }

  return Number((length * Math.log2(poolSize)).toFixed(1));
}

export function formatCrackTime(entropyBits: number): string {
  if (entropyBits <= 0) return 'Instant';
  const log10Combinations = entropyBits * Math.LOG10E * Math.log(2);
  const log10GuessesPerSec = 11; // 100 billion guesses/sec
  const log10Seconds = log10Combinations - log10GuessesPerSec;

  if (log10Seconds < -1) return 'Under 1 millisecond';
  if (log10Seconds < 0) return 'Under 1 second';
  
  const seconds = Math.pow(10, log10Seconds);
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  const years = days / 365.25;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)}k years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)}M years`;
  return `${(years / 1_000_000_000).toFixed(1)}B years`;
}

const AMBIGUOUS_CHARS = new Set(['l', '1', 'I', 'o', '0', 'O', '`', '|']);

export interface SubPools {
  consonants: string[];
  vowels: string[];
  numbers: string[];
  symbols: string[];
  allAllowed: string[];
}

export function buildSubPools(settings: GeneratorSettings): SubPools {
  let consonants: string[] = [];
  let vowels: string[] = [];
  let numbers: string[] = [];
  let symbols: string[] = [];

  switch (settings.handMode) {
    case 'left-only':
      if (settings.includeLowercase) {
        consonants = [...LEFT_HAND_CONSONANTS];
        vowels = [...LEFT_HAND_VOWELS];
      }
      if (settings.includeNumbers) numbers = [...LEFT_HAND_NUMBERS];
      if (settings.includeSymbols) symbols = [...LEFT_HAND_SYMBOLS];
      break;

    case 'right-only':
      if (settings.includeLowercase) {
        consonants = [...RIGHT_HAND_CONSONANTS];
        vowels = [...RIGHT_HAND_VOWELS];
      }
      if (settings.includeNumbers) numbers = [...RIGHT_HAND_NUMBERS];
      if (settings.includeSymbols) symbols = [...RIGHT_HAND_SYMBOLS];
      break;

    case 'alternating':
    case 'both-hands':
    default:
      if (settings.includeLowercase) {
        consonants = [...ALL_CONSONANTS];
        vowels = [...ALL_VOWELS];
      }
      if (settings.includeNumbers) numbers = [...ALL_NUMBERS];
      if (settings.includeSymbols) symbols = [...ALL_SYMBOLS];
      break;
  }

  if (settings.avoidAmbiguous) {
    consonants = consonants.filter(c => !AMBIGUOUS_CHARS.has(c));
    vowels = vowels.filter(c => !AMBIGUOUS_CHARS.has(c));
    numbers = numbers.filter(c => !AMBIGUOUS_CHARS.has(c));
    symbols = symbols.filter(c => !AMBIGUOUS_CHARS.has(c));
  }

  if (settings.customExcludedKeys.length > 0) {
    const excluded = new Set(settings.customExcludedKeys);
    consonants = consonants.filter(c => !excluded.has(c));
    vowels = vowels.filter(c => !excluded.has(c));
    numbers = numbers.filter(c => !excluded.has(c));
    symbols = symbols.filter(c => !excluded.has(c));
  }

  if (consonants.length === 0) consonants = ['w', 'r', 't', 's', 'd', 'b'];
  if (vowels.length === 0) vowels = ['e', 'a'];
  if (settings.includeNumbers && numbers.length === 0) numbers = ['2', '3', '4', '5'];

  const allAllowed = [...consonants, ...vowels, ...numbers, ...symbols];

  return { consonants, vowels, numbers, symbols, allAllowed };
}

export function buildPools(settings: GeneratorSettings): {
  lowerPool: string[];
  numberPool: string[];
  upperPool: string[];
  symbolPool: string[];
  fullPool: string[];
} {
  const { consonants, vowels, numbers, symbols, allAllowed } = buildSubPools(settings);
  const lower = [...consonants, ...vowels];
  const upper = settings.includeUppercase ? lower.map(c => c.toUpperCase()) : [];
  return {
    lowerPool: lower,
    numberPool: numbers,
    upperPool: upper,
    symbolPool: symbols,
    fullPool: [...allAllowed, ...upper],
  };
}

// Left-hand friendly natural consonant blends
const LEFT_BLENDS = ['st', 'tr', 'dr', 'cr', 'br', 'fr', 'gr', 'sc', 'sw'];

/**
 * Helper to pick distinct number pairs
 */
function pickNumberPair(numbers: string[]): [string, string] {
  if (numbers.length === 0) return ['2', '3'];
  const n1 = secureChoice(numbers);
  if (numbers.length === 1) return [n1, n1];
  let n2 = secureChoice(numbers);
  if (n2 === n1) {
    n2 = numbers[(numbers.indexOf(n1) + 1) % numbers.length];
  }
  return [n1, n2];
}

// =========================================================================
// 12 PROGRESSIVE DIFFICULTY TIERS (From Simplest/Easiest to Most Random)
// =========================================================================

export interface TierConfig {
  level: number;
  label: string;
  badge: string;
  description: string;
  generator: (targetLen: number, settings: GeneratorSettings, pools: SubPools) => string[];
}

export const LADDER_TIERS: TierConfig[] = [
  // Tier 1: Ultra-Easy Echo (Repeated single syllable + simple number bridge)
  // e.g. wewe22wewe, baba11baba
  {
    level: 1,
    label: 'Ultra-Easy Echo',
    badge: 'Level 01 · Ultra-Easy',
    description: 'Single syllable repeated four times with identical/adjacent numbers. Minimal finger movement.',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const c = secureChoice(consonants);
      const v = secureChoice(vowels);
      const [n1, n2] = pickNumberPair(numbers);
      const syl = [c, v];
      const repeat4 = [...syl, ...syl]; // 4
      const result = [...repeat4, n1, n2, ...repeat4, n1, n2];
      return result.slice(0, targetLen);
    },
  },

  // Tier 2: Dual Rhyme Echo (User's primary pattern: wewe32wawa41, dada23tete45)
  {
    level: 2,
    label: 'Dual Rhyme Echo',
    badge: 'Level 02 · Dual Echo',
    description: 'Two distinct repeated syllables with rhythm numbers in between (e.g. wewe32wawa41).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const c1 = secureChoice(consonants);
      const v1 = secureChoice(vowels);
      // 60% chance to share consonant for catchy rhyme like wewe...wawa
      const c2 = getSecureRandomInt(100) < 60 ? c1 : secureChoice(consonants);
      const v2 = v1 === 'e' ? 'a' : secureChoice(vowels);
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      const word1 = [c1, v1, c1, v1];
      const word2 = [c2, v2, c2, v2];
      const result = [...word1, n1, n2, ...word2, n3, n4];
      return result.slice(0, targetLen);
    },
  },

  // Tier 3: Inverted Prefix Echo (Numbers leading: 32wewe41wawa)
  {
    level: 3,
    label: 'Prefix-Shifted Echo',
    badge: 'Level 03 · Prefix Rhythm',
    description: 'Numbers shift to the front and middle before repeated syllables (e.g. 32wewe41wawa).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const c1 = secureChoice(consonants);
      const v1 = secureChoice(vowels);
      const c2 = secureChoice(consonants);
      const v2 = secureChoice(vowels);
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      const result = [n1, n2, c1, v1, c1, v1, n3, n4, c2, v2, c2, v2];
      return result.slice(0, targetLen);
    },
  },

  // Tier 4: Half-Echo & Free Syllable (wewe23tade41, baba34cave12)
  {
    level: 4,
    label: 'Half-Echo Cadence',
    badge: 'Level 04 · Half-Echo',
    description: 'One repeated syllable combined with a non-repeating fluid syllable (e.g. wewe23tade41).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const c1 = secureChoice(consonants);
      const v1 = secureChoice(vowels);
      const c2 = secureChoice(consonants);
      const v2 = secureChoice(vowels);
      const c3 = secureChoice(consonants);
      const v3 = secureChoice(vowels);
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      const echo = [c1, v1, c1, v1];
      const fluid = [c2, v2, c3, v3];
      const result = [...echo, n1, n2, ...fluid, n3, n4];
      return result.slice(0, targetLen);
    },
  },

  // Tier 5: Fluid Consonant-Vowel Alternation (weda32cave41, feta15bade24)
  {
    level: 5,
    label: 'Fluid C-V Alternation',
    badge: 'Level 05 · Varied Syllables',
    description: 'All syllables are unique, alternating consonants and vowels cleanly (e.g. weda32cave41).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const result: string[] = [];
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      // C1 V1 C2 V2
      result.push(secureChoice(consonants), secureChoice(vowels), secureChoice(consonants), secureChoice(vowels));
      result.push(n1, n2);
      // C3 V3 C4 V4
      result.push(secureChoice(consonants), secureChoice(vowels), secureChoice(consonants), secureChoice(vowels));
      result.push(n3, n4);
      return result.slice(0, targetLen);
    },
  },

  // Tier 6: Syncopated Number Beats (we23da41cave, 32cave41weda)
  {
    level: 6,
    label: 'Syncopated Beats',
    badge: 'Level 06 · Syncopated',
    description: 'Numbers are interspersed in shorter, punchy 2-character syllable intervals (e.g. we23da41cave).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const result: string[] = [];
      while (result.length < targetLen) {
        result.push(secureChoice(consonants));
        if (result.length < targetLen) result.push(secureChoice(vowels));
        if (result.length < targetLen && numbers.length > 0) result.push(secureChoice(numbers));
        if (result.length < targetLen && numbers.length > 0) result.push(secureChoice(numbers));
      }
      return result.slice(0, targetLen);
    },
  },

  // Tier 7: Left-Hand Consonant Blends (star23tree41, brad12frew34)
  {
    level: 7,
    label: 'Consonant Blends',
    badge: 'Level 07 · Phonetic Blends',
    description: 'Incorporates natural phonetic blends like st, tr, dr, cr, br, fr (e.g. star23tree41).',
    generator: (targetLen, settings, pools) => {
      const { vowels, numbers, consonants } = pools;
      const blend1 = secureChoice(LEFT_BLENDS);
      const blend2 = secureChoice(LEFT_BLENDS);
      const v1 = secureChoice(vowels);
      const v2 = secureChoice(vowels);
      const cEnd1 = secureChoice(consonants);
      const cEnd2 = secureChoice(consonants);
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      const word1 = `${blend1}${v1}${cEnd1}`.split('');
      const word2 = `${blend2}${v2}${cEnd2}`.split('');
      const result = [...word1, n1, n2, ...word2, n3, n4];
      return result.slice(0, targetLen);
    },
  },

  // Tier 8: Extended Key Reach (Outer keys z, x, q, v: zaza32vaze41)
  {
    level: 8,
    label: 'Extended Key Reach',
    badge: 'Level 08 · Outer Reach',
    description: 'Integrates outer edge keys (z, x, q, v) with rhythmic cadence (e.g. zaza32vaze41).',
    generator: (targetLen, settings, pools) => {
      const { vowels, numbers, consonants } = pools;
      const outerKeys = ['z', 'x', 'q', 'v'].filter(k => !settings.customExcludedKeys.includes(k));
      const poolWithOuter = outerKeys.length > 0 ? outerKeys : consonants;

      const c1 = secureChoice(poolWithOuter);
      const v1 = secureChoice(vowels);
      const c2 = secureChoice(consonants);
      const v2 = secureChoice(vowels);
      const [n1, n2] = pickNumberPair(numbers);
      const [n3, n4] = pickNumberPair(numbers);

      const word1 = [c1, v1, c1, v1];
      const word2 = [c2, v2, secureChoice(poolWithOuter), v1];
      const result = [...word1, n1, n2, ...word2, n3, n4];
      return result.slice(0, targetLen);
    },
  },

  // Tier 9: Asymmetric Cadence (wewa321tred45, bade123vaza5)
  {
    level: 9,
    label: 'Asymmetric Flow',
    badge: 'Level 09 · Asymmetric',
    description: 'Uneven chunk sizes with 3-digit number runs breaking simple symmetry (e.g. wewa321tred45).',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const result: string[] = [];
      // 4 letters
      result.push(secureChoice(consonants), secureChoice(vowels), secureChoice(consonants), secureChoice(vowels));
      // 3 numbers
      if (numbers.length > 0) {
        result.push(secureChoice(numbers), secureChoice(numbers), secureChoice(numbers));
      }
      // 4 letters
      result.push(secureChoice(consonants), secureChoice(consonants), secureChoice(vowels), secureChoice(consonants));
      // Remaining numbers
      if (numbers.length > 0) {
        result.push(secureChoice(numbers), secureChoice(numbers));
      }
      return result.slice(0, targetLen);
    },
  },

  // Tier 10: Fragmented Interleaving (w3e2va4xte1d, ve23xwa41tade)
  {
    level: 10,
    label: 'Fragmented Scatter',
    badge: 'Level 10 · High Scatter',
    description: 'Frequent number interruptions breaking syllable flow while retaining subtle hand rolls.',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers } = pools;
      const result: string[] = [];
      let isNumNext = false;
      while (result.length < targetLen) {
        if (isNumNext && numbers.length > 0) {
          result.push(secureChoice(numbers));
          isNumNext = false;
        } else {
          result.push(secureChoice(consonants));
          if (result.length < targetLen && getSecureRandomInt(100) < 60) {
            result.push(secureChoice(vowels));
          }
          isNumNext = true;
        }
      }
      return result.slice(0, targetLen);
    },
  },

  // Tier 11: Semi-Random CSPRNG (2xwer41tqza53)
  {
    level: 11,
    label: 'Semi-Random CSPRNG',
    badge: 'Level 11 · Semi-Random',
    description: 'High-entropy distribution with only 1 or 2 vowels providing faint anchor points.',
    generator: (targetLen, settings, pools) => {
      const { consonants, vowels, numbers, symbols } = pools;
      const all = [...consonants, ...numbers, ...symbols];
      const result: string[] = [];
      // Plant 2 vowels
      const v1Idx = 2;
      const v2Idx = Math.min(targetLen - 2, 7);

      for (let i = 0; i < targetLen; i++) {
        if (i === v1Idx || i === v2Idx) {
          result.push(secureChoice(vowels));
        } else {
          result.push(secureChoice(all));
        }
      }
      return result.slice(0, targetLen);
    },
  },

  // Tier 12: Pure Cryptographic Entropy (4t1w9e2vq5za)
  {
    level: 12,
    label: 'Pure Cryptographic Entropy',
    badge: 'Level 12 · Max Randomness',
    description: 'Completely unconstrained uniform CSPRNG random across all active keys. Maximum security.',
    generator: (targetLen, settings, pools) => {
      const { lowerPool, numberPool, upperPool, symbolPool, fullPool } = buildPools(settings);
      const result: string[] = [];
      for (let i = 0; i < targetLen; i++) {
        result.push(secureChoice(fullPool));
      }
      // Ensure basic character presence if enabled
      if (settings.includeLowercase && lowerPool.length > 0 && !result.some(c => lowerPool.includes(c))) {
        result[getSecureRandomInt(targetLen)] = secureChoice(lowerPool);
      }
      if (settings.includeNumbers && numberPool.length > 0 && !result.some(c => numberPool.includes(c))) {
        result[getSecureRandomInt(targetLen)] = secureChoice(numberPool);
      }
      return result.slice(0, targetLen);
    },
  },
];

/**
 * Varied Memorable Rhythm generator with diverse pattern variations
 */
function generateVariedMemorableRhythmChars(targetLen: number, settings: GeneratorSettings, pools: SubPools): string[] {
  // Randomly select one of the top memorable tiers (Tier 1, 2, 3, or 4) for rich organic variation
  const patternType = getSecureRandomInt(4);
  const selectedTier = LADDER_TIERS[patternType];
  return selectedTier.generator(targetLen, settings, pools);
}

/**
 * Generate a single password item
 */
export function generatePassword(
  settings: GeneratorSettings,
  forcedTierLevel?: number
): PasswordItem {
  const targetLen = Math.max(4, Math.min(64, settings.length));
  const subPools = buildSubPools(settings);
  const { fullPool } = buildPools(settings);

  let passwordChars: string[];
  let tierInfo: TierConfig | undefined;

  if (settings.generationMode === 'progressive-ladder') {
    // If a tier is forced (e.g. from batch index 0..11), use that tier!
    const tierIdx = forcedTierLevel !== undefined ? Math.max(0, Math.min(11, forcedTierLevel - 1)) : 0;
    tierInfo = LADDER_TIERS[tierIdx];
    passwordChars = tierInfo.generator(targetLen, settings, subPools);
  } else if (settings.generationMode === 'memorable-rhythm') {
    passwordChars = generateVariedMemorableRhythmChars(targetLen, settings, subPools);
  } else if (settings.generationMode === 'alternating-cv') {
    passwordChars = LADDER_TIERS[4].generator(targetLen, settings, subPools); // Tier 5 generator
  } else {
    passwordChars = LADDER_TIERS[11].generator(targetLen, settings, subPools); // Tier 12 pure random
  }

  // Handle uppercase toggle
  if (settings.includeUppercase && settings.generationMode !== 'csprng-random') {
    let capitalizeNext = true;
    for (let i = 0; i < passwordChars.length; i++) {
      if (/^[a-z]$/.test(passwordChars[i]) && capitalizeNext) {
        passwordChars[i] = passwordChars[i].toUpperCase();
        capitalizeNext = false;
      } else if (/^[0-9!@#$%~]$/.test(passwordChars[i])) {
        capitalizeNext = true;
      }
    }
  }

  // Handle separator / chunking
  let formattedPassword = passwordChars.join('');
  if (settings.separator !== 'none' && settings.chunkSize >= 2) {
    const sepChar = settings.separator === 'hyphen' ? '-' : settings.separator === 'dot' ? '.' : '_';
    const chunks: string[] = [];
    for (let i = 0; i < passwordChars.length; i += settings.chunkSize) {
      chunks.push(passwordChars.slice(i, i + settings.chunkSize).join(''));
    }
    formattedPassword = chunks.join(sepChar);
  }

  // Finger distribution statistics
  const fingerStats = {
    pinky: 0,
    ring: 0,
    middle: 0,
    index: 0,
    thumb: 0,
  };

  for (const char of passwordChars) {
    const info = getCharInfo(char);
    if (info) {
      fingerStats[info.finger]++;
    }
  }

  const entropyBits = calculateEntropy(
    passwordChars.length,
    fullPool.length,
    settings.generationMode,
    tierInfo?.level
  );
  const crackTimeStr = formatCrackTime(entropyBits);

  return {
    id: `pw_${Date.now()}_${getSecureRandomInt(1000000)}`,
    value: formattedPassword,
    createdAt: Date.now(),
    entropyBits,
    crackTimeStr,
    handMode: settings.handMode,
    difficultyLevel: tierInfo?.level,
    difficultyLabel: tierInfo?.label,
    fingerStats,
  };
}

/**
 * Generate a batch of passwords.
 * In 'progressive-ladder' mode (default), creates 12 passwords spanning from simplest to most random!
 */
export function generatePasswordBatch(settings: GeneratorSettings): PasswordItem[] {
  const count = Math.max(1, Math.min(24, settings.batchCount));
  const batch: PasswordItem[] = [];

  if (settings.generationMode === 'progressive-ladder') {
    // Generate each password along the 12-tier progression ladder!
    for (let i = 0; i < count; i++) {
      // Map index i to a tier (1 to 12)
      const tier = (i % 12) + 1;
      batch.push(generatePassword(settings, tier));
    }
  } else {
    for (let i = 0; i < count; i++) {
      batch.push(generatePassword(settings));
    }
  }

  return batch;
}
