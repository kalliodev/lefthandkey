import React, { useState, useEffect, useRef } from 'react';
import { getCharInfo } from '../utils/keyboardData';
import { playKeyClick, playCopyChime } from '../utils/audio';
import { Play, RotateCcw, CheckCircle2, Zap, ArrowLeft } from 'lucide-react';

interface TypingSandboxProps {
  initialPassword?: string;
  onBackToGenerator: () => void;
  onHoverChar?: (char: string | null) => void;
}

export const TypingSandbox: React.FC<TypingSandboxProps> = ({
  initialPassword = 'wewe32wawa41',
  onBackToGenerator,
  onHoverChar,
}) => {
  const [targetPassword, setTargetPassword] = useState(initialPassword);
  const [typedInput, setTypedInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTargetPassword(initialPassword);
    resetTest();
  }, [initialPassword]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [targetPassword]);

  const resetTest = () => {
    setTypedInput('');
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    playKeyClick();

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    // Check if new character was correct
    if (val.length > typedInput.length) {
      const charIndex = val.length - 1;
      if (charIndex < targetPassword.length && val[charIndex] !== targetPassword[charIndex]) {
        setMistakes((prev) => prev + 1);
      }
    }

    setTypedInput(val);

    // Check completion
    if (val === targetPassword) {
      setEndTime(Date.now());
      playCopyChime();
    }
  };

  const currentIndex = typedInput.length;
  const currentChar = currentIndex < targetPassword.length ? targetPassword[currentIndex] : null;
  const currentCharInfo = currentChar ? getCharInfo(currentChar) : null;

  // Notify parent of active char to illuminate on keyboard deck
  useEffect(() => {
    onHoverChar?.(currentChar);
    return () => onHoverChar?.(null);
  }, [currentChar, onHoverChar]);

  // Compute metrics
  const isFinished = typedInput === targetPassword && targetPassword.length > 0;
  const elapsedSec =
    startTime && (endTime || Date.now()) ? Math.max(0.1, ((endTime || Date.now()) - startTime) / 1000) : 0;
  const charsTyped = typedInput.length;
  const cpm = elapsedSec > 0 ? Math.round((charsTyped / elapsedSec) * 60) : 0;
  const wpm = Math.round(cpm / 5);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGenerator}
            className="p-1.5 -ml-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded transition-colors cursor-pointer"
            title="Back to generator"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Left-Hand Ergonomic Typing Simulator</h2>
            <p className="text-xs text-zinc-400">
              Test how rapidly and smoothly your left hand types this password on your keyboard.
            </p>
          </div>
        </div>

        <button
          onClick={resetTest}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Test</span>
        </button>
      </div>

      {/* Target Display with Interactive Letter Highlights */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-mono text-zinc-500 flex justify-between">
          <span>TARGET SEQUENCE:</span>
          <span className="text-amber-400">100% Left-Hand Keys</span>
        </div>

        <div className="p-4 sm:p-5 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-2xl sm:text-3xl tracking-widest flex items-center flex-wrap gap-1 select-none">
          {targetPassword.split('').map((char, index) => {
            let status = 'pending';
            if (index < typedInput.length) {
              status = typedInput[index] === char ? 'correct' : 'incorrect';
            } else if (index === currentIndex) {
              status = 'current';
            }

            return (
              <span
                key={index}
                className={`px-1 rounded transition-colors relative ${
                  status === 'correct'
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : status === 'incorrect'
                    ? 'text-rose-400 bg-rose-500/20 underline decoration-rose-500'
                    : status === 'current'
                    ? 'text-amber-300 bg-amber-500/20 ring-1 ring-amber-400 font-bold'
                    : 'text-zinc-600'
                }`}
              >
                {char}
                {status === 'current' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 animate-pulse" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Guidance bar for the next finger */}
      <div className="bg-zinc-950/70 border border-zinc-850 p-3 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Next Keystroke Guide:</span>
          {currentChar && currentCharInfo ? (
            <span className="text-amber-400 font-semibold uppercase">
              Left {currentCharInfo.finger} finger → key &quot;{currentChar.toUpperCase()}&quot;
            </span>
          ) : isFinished ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Completed with full left-hand cadence!
            </span>
          ) : (
            <span className="text-zinc-500">Ready</span>
          )}
        </div>

        <div className="text-zinc-400 tabular-nums">
          <span>Keystrokes: {typedInput.length} / {targetPassword.length}</span>
          {mistakes > 0 && <span className="text-rose-400 ml-2">({mistakes} mistakes)</span>}
        </div>
      </div>

      {/* Live typing input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-zinc-400 font-medium">
          Type here using your physical keyboard (Left Hand Only):
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder="Type using your left hand..."
            className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-lg px-4 py-3 font-mono text-lg text-zinc-100 placeholder:text-zinc-700 outline-none transition-all tracking-wider"
          />
        </div>
      </div>

      {/* Results HUD */}
      {isFinished && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-emerald-400 font-bold text-sm">
                Smooth Flow Verified: {elapsedSec.toFixed(2)}s
              </div>
              <div className="text-zinc-400">
                Speed: <span className="text-zinc-200 font-bold">{wpm} WPM</span> ({cpm} CPM) · Accuracy:{' '}
                <span className="text-zinc-200 font-bold">
                  {Math.round(((targetPassword.length - mistakes) / targetPassword.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetTest}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-sans text-xs cursor-pointer transition-colors"
            >
              Test Again
            </button>
            <button
              onClick={onBackToGenerator}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold rounded font-sans text-xs cursor-pointer transition-colors"
            >
              Back to Generator
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
