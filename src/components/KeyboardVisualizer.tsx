import React from 'react';
import { KEYBOARD_ROWS } from '../utils/keyboardData';
import { FingerName, HandMode, KeyDefinition } from '../types';
import { playKeyClick } from '../utils/audio';

interface KeyboardVisualizerProps {
  handMode: HandMode;
  highlightChars?: string[];
  excludedKeys: string[];
  onToggleKeyExcluded: (key: string) => void;
  hoveredChar?: string | null;
}

const FINGER_LABELS: Record<FingerName, string> = {
  pinky: 'Pinky',
  ring: 'Ring',
  middle: 'Middle',
  index: 'Index',
  thumb: 'Thumb',
};

const FINGER_COLORS: Record<FingerName, { dot: string; border: string }> = {
  pinky: { dot: 'bg-rose-400', border: 'border-rose-500/30' },
  ring: { dot: 'bg-orange-400', border: 'border-orange-500/30' },
  middle: { dot: 'bg-amber-400', border: 'border-amber-500/30' },
  index: { dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  thumb: { dot: 'bg-blue-400', border: 'border-blue-500/30' },
};

export const KeyboardVisualizer: React.FC<KeyboardVisualizerProps> = ({
  handMode,
  highlightChars = [],
  excludedKeys,
  onToggleKeyExcluded,
  hoveredChar,
}) => {
  const highlightSet = React.useMemo(() => new Set(highlightChars), [highlightChars]);
  const excludedSet = React.useMemo(() => new Set(excludedKeys), [excludedKeys]);

  const isKeyActiveForHandMode = (keyDef: KeyDefinition): boolean => {
    if (handMode === 'left-only') return keyDef.hand === 'left';
    if (handMode === 'right-only') return keyDef.hand === 'right';
    return true; // alternating or both-hands
  };

  return (
    <div className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 sm:p-5">
      {/* Header & Hand Split Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-zinc-200 font-semibold tracking-wider uppercase">
            Tactile Keyboard Map
          </span>
          <span className="text-zinc-500">·</span>
          <span className="text-amber-400 font-medium">
            {handMode === 'left-only' && 'LEFT HAND ACTIVE (1-5, Q-T, A-G, Z-B)'}
            {handMode === 'right-only' && 'RIGHT HAND ACTIVE (6-0, Y-P, H-L, N-M)'}
            {handMode === 'alternating' && 'ALTERNATING HANDS (LEFT ↔ RIGHT)'}
            {handMode === 'both-hands' && 'FULL KEYBOARD (BOTH HANDS)'}
          </span>
        </div>

        {/* Finger Legend */}
        <div className="flex items-center gap-3 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Index</span>
          </div>
        </div>
      </div>

      {/* Keyboard Matrix Container */}
      <div className="relative overflow-x-auto pb-1">
        <div className="min-w-[660px] flex flex-col gap-1.5">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1.5 justify-center">
              {row.map((k) => {
                const isActiveInHandMode = isKeyActiveForHandMode(k);
                const isExcluded = excludedSet.has(k.key);
                const isHighlighted =
                  highlightSet.has(k.key) ||
                  (k.shiftedDisplay && highlightSet.has(k.shiftedDisplay));
                const isHovered =
                  hoveredChar === k.key || (k.shiftedDisplay && hoveredChar === k.shiftedDisplay);

                // Split border visual cue for Left vs Right hand
                const isLeftEdgeOfRightHand = k.hand === 'right' && (
                  (rowIndex === 0 && k.key === '6') ||
                  (rowIndex === 1 && k.key === 'y') ||
                  (rowIndex === 2 && k.key === 'h') ||
                  (rowIndex === 3 && k.key === 'n')
                );

                return (
                  <React.Fragment key={k.key}>
                    {/* Visual Vertical Split Indicator */}
                    {isLeftEdgeOfRightHand && (
                      <div
                        className="w-[2px] h-9 sm:h-11 bg-zinc-700/80 mx-1 flex items-center justify-center shrink-0"
                        title="Left Hand / Right Hand Split"
                      />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        playKeyClick();
                        onToggleKeyExcluded(k.key);
                      }}
                      title={`${k.hand.toUpperCase()} HAND - ${FINGER_LABELS[k.finger]} finger (${k.display.toUpperCase()})${
                        isExcluded ? ' [Excluded]' : ''
                      } - Click to toggle exclusion`}
                      className={`relative flex flex-col items-center justify-center h-9 sm:h-11 rounded font-mono text-xs select-none transition-all duration-150 cursor-pointer ${
                        k.width && k.width > 1 ? `w-${Math.round(k.width * 12)}` : 'w-8 sm:w-10'
                      } ${
                        isHighlighted || isHovered
                          ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-500/30 scale-105 z-10'
                          : isActiveInHandMode && !isExcluded
                          ? 'bg-zinc-800 hover:bg-zinc-750 text-zinc-100 border border-zinc-750 hover:border-zinc-600 shadow-sm'
                          : isExcluded
                          ? 'bg-zinc-950/60 text-zinc-600 border border-zinc-900 line-through opacity-40'
                          : 'bg-zinc-950/70 text-zinc-600 border border-zinc-900/80 opacity-45 hover:opacity-75'
                      }`}
                    >
                      {/* Shifted symbol if available */}
                      {k.shiftedDisplay && (
                        <span
                          className={`text-[9px] leading-tight ${
                            isHighlighted || isHovered
                              ? 'text-zinc-900 font-semibold'
                              : 'text-zinc-500'
                          }`}
                        >
                          {k.shiftedDisplay}
                        </span>
                      )}

                      {/* Main key label */}
                      <span className="font-semibold text-xs leading-none">
                        {k.display.toUpperCase()}
                      </span>

                      {/* Tiny finger dot indicator at bottom */}
                      {isActiveInHandMode && !isExcluded && (
                        <span
                          className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                            isHighlighted || isHovered ? 'bg-zinc-950' : FINGER_COLORS[k.finger].dot
                          }`}
                        />
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sub-bar with Quick explanation */}
      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div>
          <span>Tip: Left-hand keys allow you to keep your right hand on mouse, trackpad, or stylus.</span>
        </div>
        <div className="text-zinc-500">
          <span>Click any keycap above to toggle inclusion</span>
        </div>
      </div>
    </div>
  );
};
