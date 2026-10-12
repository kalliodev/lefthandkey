import React, { useState } from 'react';
import { Copy, Check, Heart, Play, Gauge } from 'lucide-react';
import { PasswordItem } from '../types';
import { getCharInfo } from '../utils/keyboardData';
import { playCopyChime } from '../utils/audio';

interface PasswordCardProps {
  item: PasswordItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (item: PasswordItem) => void;
  onTestTyping: (password: string) => void;
  onHoverChars?: (chars: string[] | null) => void;
}

export const PasswordCard: React.FC<PasswordCardProps> = ({
  item,
  index,
  isFavorite,
  onToggleFavorite,
  onTestTyping,
  onHoverChars,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopied(true);
      playCopyChime();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const textArea = document.createElement('textarea');
      textArea.value = item.value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const characters = item.value.split('');
  const totalChars = characters.filter((c) => c !== '-' && c !== '.' && c !== '_').length;

  // Render individual character with semantic styling
  const renderCharacter = (char: string, i: number) => {
    if (char === '-' || char === '.' || char === '_') {
      return (
        <span key={i} className="text-zinc-500 font-bold px-0.5 select-none">
          {char}
        </span>
      );
    }
    const info = getCharInfo(char);
    const isNum = info?.isNumber;
    const isSym = info?.isSymbol;
    const isUpper = info?.isUppercase;

    return (
      <span
        key={i}
        className={`inline-block font-mono font-medium transition-colors ${
          isNum
            ? 'text-amber-400 font-bold'
            : isSym
            ? 'text-emerald-400 font-bold'
            : isUpper
            ? 'text-sky-300 font-semibold'
            : 'text-zinc-100'
        }`}
      >
        {char}
      </span>
    );
  };

  return (
    <div
      onMouseEnter={() => onHoverChars?.(characters)}
      onMouseLeave={() => onHoverChars?.(null)}
      className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 sm:p-5 transition-all duration-150 flex flex-col justify-between gap-3 shadow-xs"
    >
      {/* Top row: Number index, Difficulty tier & Actions */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 font-medium">#{String(index + 1).padStart(2, '0')}</span>
          {item.difficultyLabel && (
            <>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span
                className={`text-[11px] font-medium ${
                  (item.difficultyLevel || 1) <= 3
                    ? 'text-emerald-400'
                    : (item.difficultyLevel || 1) <= 6
                    ? 'text-amber-400'
                    : (item.difficultyLevel || 1) <= 9
                    ? 'text-orange-400'
                    : 'text-sky-400'
                }`}
              >
                Lvl {item.difficultyLevel || index + 1}: {item.difficultyLabel}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Test Typing Button */}
          <button
            onClick={() => onTestTyping(item.value)}
            title="Test left-hand typing flow in simulator"
            className="px-2 py-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-colors flex items-center gap-1.5 cursor-pointer text-[11px]"
          >
            <Play className="w-3 h-3" />
            <span className="hidden sm:inline">Test Flow</span>
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(item)}
            title={isFavorite ? 'Remove from saved' : 'Save password'}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isFavorite
                ? 'text-rose-400 hover:text-rose-300 bg-rose-500/10'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Password Box */}
      <div className="flex items-center justify-between gap-3 bg-zinc-950/70 border border-zinc-850 rounded-md px-3.5 py-3">
        <div className="font-mono text-base sm:text-lg tracking-wider overflow-x-auto whitespace-nowrap select-all scrollbar-none py-0.5">
          {characters.map((char, i) => renderCharacter(char, i))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          title="Copy password to clipboard"
          className={`shrink-0 px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Clean Zero-Pill Metadata & Finger Distribution */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-zinc-400 pt-1">
        <div className="flex items-center gap-2 text-[11px] tabular-nums">
          <span>{item.entropyBits} bits entropy</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span>~{item.crackTimeStr} to crack</span>
          <span aria-hidden="true" className="text-zinc-600">·</span>
          <span className="text-amber-400/90 font-medium">Left Hand</span>
        </div>

        {/* Finger Distribution Mini-Strip */}
        <div
          className="flex items-center gap-1 text-[10px] text-zinc-500"
          title={`Keystrokes by finger: Pinky: ${item.fingerStats.pinky}, Ring: ${item.fingerStats.ring}, Middle: ${item.fingerStats.middle}, Index: ${item.fingerStats.index}`}
        >
          <span className="hidden md:inline">Fingers:</span>
          <span className="text-rose-400">{item.fingerStats.pinky}P</span>
          <span className="text-zinc-600">/</span>
          <span className="text-orange-400">{item.fingerStats.ring}R</span>
          <span className="text-zinc-600">/</span>
          <span className="text-amber-400">{item.fingerStats.middle}M</span>
          <span className="text-zinc-600">/</span>
          <span className="text-emerald-400">{item.fingerStats.index}I</span>
        </div>
      </div>
    </div>
  );
};
