export type HandMode = 'left-only' | 'right-only' | 'alternating' | 'both-hands';

export type GenerationMode = 'progressive-ladder' | 'memorable-rhythm' | 'alternating-cv' | 'csprng-random';

export type SeparatorStyle = 'none' | 'hyphen' | 'dot' | 'underscore';

export interface GeneratorSettings {
  handMode: HandMode;
  includeLowercase: boolean;
  includeUppercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  avoidAmbiguous: boolean;
  generationMode: GenerationMode;
  length: number;
  batchCount: number;
  separator: SeparatorStyle;
  chunkSize: number;
  customExcludedKeys: string[];
}

export interface PasswordItem {
  id: string;
  value: string;
  createdAt: number;
  entropyBits: number;
  crackTimeStr: string;
  handMode: HandMode;
  difficultyLevel?: number; // 1 to 12
  difficultyLabel?: string; // Short label describing the tier
  fingerStats: {
    pinky: number;
    ring: number;
    middle: number;
    index: number;
    thumb: number;
  };
}

export type FingerName = 'pinky' | 'ring' | 'middle' | 'index' | 'thumb';
export type HandSide = 'left' | 'right' | 'thumb';

export interface KeyDefinition {
  key: string;
  display: string;
  shiftedDisplay?: string;
  hand: HandSide;
  finger: FingerName;
  row: number; // 0: numbers, 1: QWERTY, 2: ASDF, 3: ZXCV, 4: space
  width?: number; // relative key width (1 = 1u)
}
