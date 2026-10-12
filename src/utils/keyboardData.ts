import { FingerName, HandSide, KeyDefinition } from '../types';

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 0: Numbers & Symbols
  [
    { key: '`', display: '`', shiftedDisplay: '~', hand: 'left', finger: 'pinky', row: 0, width: 1 },
    { key: '1', display: '1', shiftedDisplay: '!', hand: 'left', finger: 'pinky', row: 0, width: 1 },
    { key: '2', display: '2', shiftedDisplay: '@', hand: 'left', finger: 'ring', row: 0, width: 1 },
    { key: '3', display: '3', shiftedDisplay: '#', hand: 'left', finger: 'middle', row: 0, width: 1 },
    { key: '4', display: '4', shiftedDisplay: '$', hand: 'left', finger: 'index', row: 0, width: 1 },
    { key: '5', display: '5', shiftedDisplay: '%', hand: 'left', finger: 'index', row: 0, width: 1 },
    // Right hand starts here
    { key: '6', display: '6', shiftedDisplay: '^', hand: 'right', finger: 'index', row: 0, width: 1 },
    { key: '7', display: '7', shiftedDisplay: '&', hand: 'right', finger: 'index', row: 0, width: 1 },
    { key: '8', display: '8', shiftedDisplay: '*', hand: 'right', finger: 'middle', row: 0, width: 1 },
    { key: '9', display: '9', shiftedDisplay: '(', hand: 'right', finger: 'ring', row: 0, width: 1 },
    { key: '0', display: '0', shiftedDisplay: ')', hand: 'right', finger: 'pinky', row: 0, width: 1 },
    { key: '-', display: '-', shiftedDisplay: '_', hand: 'right', finger: 'pinky', row: 0, width: 1 },
    { key: '=', display: '=', shiftedDisplay: '+', hand: 'right', finger: 'pinky', row: 0, width: 1 },
  ],
  // Row 1: QWERTY
  [
    { key: 'q', display: 'q', shiftedDisplay: 'Q', hand: 'left', finger: 'pinky', row: 1, width: 1 },
    { key: 'w', display: 'w', shiftedDisplay: 'W', hand: 'left', finger: 'ring', row: 1, width: 1 },
    { key: 'e', display: 'e', shiftedDisplay: 'E', hand: 'left', finger: 'middle', row: 1, width: 1 },
    { key: 'r', display: 'r', shiftedDisplay: 'R', hand: 'left', finger: 'index', row: 1, width: 1 },
    { key: 't', display: 't', shiftedDisplay: 'T', hand: 'left', finger: 'index', row: 1, width: 1 },
    // Right hand
    { key: 'y', display: 'y', shiftedDisplay: 'Y', hand: 'right', finger: 'index', row: 1, width: 1 },
    { key: 'u', display: 'u', shiftedDisplay: 'U', hand: 'right', finger: 'index', row: 1, width: 1 },
    { key: 'i', display: 'i', shiftedDisplay: 'I', hand: 'right', finger: 'middle', row: 1, width: 1 },
    { key: 'o', display: 'o', shiftedDisplay: 'O', hand: 'right', finger: 'ring', row: 1, width: 1 },
    { key: 'p', display: 'p', shiftedDisplay: 'P', hand: 'right', finger: 'pinky', row: 1, width: 1 },
    { key: '[', display: '[', shiftedDisplay: '{', hand: 'right', finger: 'pinky', row: 1, width: 1 },
    { key: ']', display: ']', shiftedDisplay: '}', hand: 'right', finger: 'pinky', row: 1, width: 1 },
  ],
  // Row 2: ASDF (Home row)
  [
    { key: 'a', display: 'a', shiftedDisplay: 'A', hand: 'left', finger: 'pinky', row: 2, width: 1 },
    { key: 's', display: 's', shiftedDisplay: 'S', hand: 'left', finger: 'ring', row: 2, width: 1 },
    { key: 'd', display: 'd', shiftedDisplay: 'D', hand: 'left', finger: 'middle', row: 2, width: 1 },
    { key: 'f', display: 'f', shiftedDisplay: 'F', hand: 'left', finger: 'index', row: 2, width: 1 },
    { key: 'g', display: 'g', shiftedDisplay: 'G', hand: 'left', finger: 'index', row: 2, width: 1 },
    // Right hand
    { key: 'h', display: 'h', shiftedDisplay: 'H', hand: 'right', finger: 'index', row: 2, width: 1 },
    { key: 'j', display: 'j', shiftedDisplay: 'J', hand: 'right', finger: 'index', row: 2, width: 1 },
    { key: 'k', display: 'k', shiftedDisplay: 'K', hand: 'right', finger: 'middle', row: 2, width: 1 },
    { key: 'l', display: 'l', shiftedDisplay: 'L', hand: 'right', finger: 'ring', row: 2, width: 1 },
    { key: ';', display: ';', shiftedDisplay: ':', hand: 'right', finger: 'pinky', row: 2, width: 1 },
    { key: "'", display: "'", shiftedDisplay: '"', hand: 'right', finger: 'pinky', row: 2, width: 1 },
  ],
  // Row 3: ZXCV
  [
    { key: 'z', display: 'z', shiftedDisplay: 'Z', hand: 'left', finger: 'pinky', row: 3, width: 1 },
    { key: 'x', display: 'x', shiftedDisplay: 'X', hand: 'left', finger: 'ring', row: 3, width: 1 },
    { key: 'c', display: 'c', shiftedDisplay: 'C', hand: 'left', finger: 'middle', row: 3, width: 1 },
    { key: 'v', display: 'v', shiftedDisplay: 'V', hand: 'left', finger: 'index', row: 3, width: 1 },
    { key: 'b', display: 'b', shiftedDisplay: 'B', hand: 'left', finger: 'index', row: 3, width: 1 },
    // Right hand
    { key: 'n', display: 'n', shiftedDisplay: 'N', hand: 'right', finger: 'index', row: 3, width: 1 },
    { key: 'm', display: 'm', shiftedDisplay: 'M', hand: 'right', finger: 'index', row: 3, width: 1 },
    { key: ',', display: ',', shiftedDisplay: '<', hand: 'right', finger: 'middle', row: 3, width: 1 },
    { key: '.', display: '.', shiftedDisplay: '>', hand: 'right', finger: 'ring', row: 3, width: 1 },
    { key: '/', display: '/', shiftedDisplay: '?', hand: 'right', finger: 'pinky', row: 3, width: 1 },
  ],
];

// Precomputed character lookup map
export interface CharInfo {
  char: string;
  hand: HandSide;
  finger: FingerName;
  row: number;
  isSymbol: boolean;
  isNumber: boolean;
  isUppercase: boolean;
  isLowercase: boolean;
}

const CHAR_MAP: Map<string, CharInfo> = new Map();

for (const row of KEYBOARD_ROWS) {
  for (const item of row) {
    const isNum = /^[0-9]$/.test(item.key);
    const isLower = /^[a-z]$/.test(item.key);
    
    // Lowercase or primary
    CHAR_MAP.set(item.key, {
      char: item.key,
      hand: item.hand,
      finger: item.finger,
      row: item.row,
      isSymbol: !isNum && !isLower,
      isNumber: isNum,
      isUppercase: false,
      isLowercase: isLower,
    });

    // Shifted version (uppercase letter or symbol)
    if (item.shiftedDisplay) {
      const isShiftedUpper = /^[A-Z]$/.test(item.shiftedDisplay);
      CHAR_MAP.set(item.shiftedDisplay, {
        char: item.shiftedDisplay,
        hand: item.hand,
        finger: item.finger,
        row: item.row,
        isSymbol: !isShiftedUpper,
        isNumber: false,
        isUppercase: isShiftedUpper,
        isLowercase: false,
      });
    }
  }
}

export function getCharInfo(char: string): CharInfo | undefined {
  return CHAR_MAP.get(char);
}

// Left hand characters sets
export const LEFT_HAND_VOWELS = ['a', 'e'];
export const LEFT_HAND_CONSONANTS = ['w', 'r', 't', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b', 'q'];
export const LEFT_HAND_LOWER = ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'];
export const LEFT_HAND_NUMBERS = ['1', '2', '3', '4', '5'];
export const LEFT_HAND_UPPER = ['Q', 'W', 'E', 'R', 'T', 'A', 'S', 'D', 'F', 'G', 'Z', 'X', 'C', 'V', 'B'];
export const LEFT_HAND_SYMBOLS = ['!', '@', '#', '$', '%', '~'];

// Right hand character sets
export const RIGHT_HAND_VOWELS = ['i', 'o', 'u'];
export const RIGHT_HAND_CONSONANTS = ['h', 'j', 'k', 'l', 'm', 'n', 'p', 'y'];
export const RIGHT_HAND_LOWER = ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'];
export const RIGHT_HAND_NUMBERS = ['6', '7', '8', '9', '0'];
export const RIGHT_HAND_UPPER = ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', 'N', 'M'];
export const RIGHT_HAND_SYMBOLS = ['^', '&', '*', '(', ')', '_', '+', '-', '=', '{', '}', '[', ']', ';', ':', ',', '.', '<', '>', '/', '?'];

// Both hands combined
export const ALL_VOWELS = ['a', 'e', 'i', 'o', 'u'];
export const ALL_CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
export const ALL_LOWER = [...LEFT_HAND_LOWER, ...RIGHT_HAND_LOWER];
export const ALL_NUMBERS = [...LEFT_HAND_NUMBERS, ...RIGHT_HAND_NUMBERS];
export const ALL_UPPER = [...LEFT_HAND_UPPER, ...RIGHT_HAND_UPPER];
export const ALL_SYMBOLS = [...LEFT_HAND_SYMBOLS, ...RIGHT_HAND_SYMBOLS];

