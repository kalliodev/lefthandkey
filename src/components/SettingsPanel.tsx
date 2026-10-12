import React from 'react';
import { GeneratorSettings, HandMode, GenerationMode, SeparatorStyle } from '../types';
import { Sliders, RotateCcw, Hand, Hash, Type, HelpCircle } from 'lucide-react';

interface SettingsPanelProps {
  settings: GeneratorSettings;
  onChange: (newSettings: GeneratorSettings) => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onChange, onReset }) => {
  const handleHandModeChange = (handMode: HandMode) => {
    onChange({ ...settings, handMode });
  };

  const handleGenModeChange = (generationMode: GenerationMode) => {
    onChange({ ...settings, generationMode });
  };

  const handleSeparatorChange = (separator: SeparatorStyle) => {
    onChange({ ...settings, separator });
  };

  const handleLengthChange = (length: number) => {
    onChange({ ...settings, length });
  };

  const handleBatchCountChange = (batchCount: number) => {
    onChange({ ...settings, batchCount });
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-amber-400" />
          <span>Generator Configuration</span>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reset to default left-hand configuration"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Hand Typing Constraint (Key requirement!) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-zinc-300 font-medium flex items-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-amber-400" />
            <span>Hand Typing Constraint</span>
          </label>
          <span className="text-zinc-500 font-mono text-[11px]">
            {settings.handMode === 'left-only' && 'Default · One-Handed Ergonomics'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-zinc-950 rounded-md border border-zinc-850">
          <button
            type="button"
            onClick={() => handleHandModeChange('left-only')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              settings.handMode === 'left-only'
                ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            Left Hand Only
          </button>
          <button
            type="button"
            onClick={() => handleHandModeChange('alternating')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              settings.handMode === 'alternating'
                ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            Alternating Rhythm
          </button>
          <button
            type="button"
            onClick={() => handleHandModeChange('right-only')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              settings.handMode === 'right-only'
                ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            Right Hand Only
          </button>
          <button
            type="button"
            onClick={() => handleHandModeChange('both-hands')}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              settings.handMode === 'both-hands'
                ? 'bg-amber-400 text-zinc-950 font-semibold shadow-xs'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
            }`}
          >
            Both Hands
          </button>
        </div>
      </div>

      {/* Generation Flow & Randomness Style (Updated with 12-Tier Ladder) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-zinc-300 font-medium">Generation Strategy & Randomness Scale</label>
          <span className="text-zinc-500 font-mono text-[11px]">
            {settings.generationMode === 'progressive-ladder' && '12-Tier Progressive Ladder (Default)'}
            {settings.generationMode === 'memorable-rhythm' && 'All Easy & Memorable'}
            {settings.generationMode === 'alternating-cv' && 'All Varied Consonant-Vowel'}
            {settings.generationMode === 'csprng-random' && 'All High Randomness (CSPRNG)'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* 1. Progressive Difficulty Ladder (Default) */}
          <button
            type="button"
            onClick={() => handleGenModeChange('progressive-ladder')}
            className={`p-3 rounded-md border text-left transition-colors cursor-pointer flex flex-col gap-1.5 ${
              settings.generationMode === 'progressive-ladder'
                ? 'bg-zinc-800/90 border-amber-500/50 text-zinc-100 ring-1 ring-amber-400/30'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={settings.generationMode === 'progressive-ladder' ? 'text-amber-400' : ''}>
                12-Tier Ladder
              </span>
              <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-500/10 px-1 rounded">
                Default
              </span>
            </div>
            <div className="font-mono text-[10px] text-zinc-300 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-850 truncate">
              #01 Easy → #12 Random
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Proposes 12 passwords each progressively more random and difficult to type and remember, starting from simple echoes.
            </p>
          </button>

          {/* 2. Fixed Easy & Memorable */}
          <button
            type="button"
            onClick={() => handleGenModeChange('memorable-rhythm')}
            className={`p-3 rounded-md border text-left transition-colors cursor-pointer flex flex-col gap-1.5 ${
              settings.generationMode === 'memorable-rhythm'
                ? 'bg-zinc-800/90 border-amber-500/50 text-zinc-100 ring-1 ring-amber-400/30'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={settings.generationMode === 'memorable-rhythm' ? 'text-amber-400' : ''}>
                Easy & Memorable
              </span>
            </div>
            <div className="font-mono text-[10px] text-zinc-300 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-850 truncate">
              e.g. wewe32wawa41
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              All passwords use alternating consonants, vowels, and syllable echoes with rich rhythmic variations.
            </p>
          </button>

          {/* 3. Varied Syllables */}
          <button
            type="button"
            onClick={() => handleGenModeChange('alternating-cv')}
            className={`p-3 rounded-md border text-left transition-colors cursor-pointer flex flex-col gap-1.5 ${
              settings.generationMode === 'alternating-cv'
                ? 'bg-zinc-800/90 border-amber-500/50 text-zinc-100 ring-1 ring-amber-400/30'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={settings.generationMode === 'alternating-cv' ? 'text-amber-400' : ''}>
                Varied Syllable Flow
              </span>
            </div>
            <div className="font-mono text-[10px] text-zinc-300 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-850 truncate">
              e.g. weda32cave41
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Consonants and vowels alternate with numbers in between, without repeating syllables.
            </p>
          </button>

          {/* 4. More Random / Max Security */}
          <button
            type="button"
            onClick={() => handleGenModeChange('csprng-random')}
            className={`p-3 rounded-md border text-left transition-colors cursor-pointer flex flex-col gap-1.5 ${
              settings.generationMode === 'csprng-random'
                ? 'bg-zinc-800/90 border-amber-500/50 text-zinc-100 ring-1 ring-amber-400/30'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className={settings.generationMode === 'csprng-random' ? 'text-amber-400' : ''}>
                High Randomness
              </span>
              <span className="text-[10px] text-zinc-500 font-mono uppercase">
                Max Security
              </span>
            </div>
            <div className="font-mono text-[10px] text-zinc-300 bg-zinc-950/80 px-1.5 py-0.5 rounded border border-zinc-850 truncate">
              e.g. 4t1w9e2vq5za
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Pure unconstrained uniform CSPRNG random across all active keys for maximum mathematical entropy.
            </p>
          </button>
        </div>
      </div>

      {/* Length Slider & Presets */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <label className="text-zinc-300 font-medium">Password Length</label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-zinc-400">
              {[8, 12, 16, 20].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleLengthChange(preset)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors cursor-pointer ${
                    settings.length === preset
                      ? 'bg-zinc-700 text-white font-bold'
                      : 'hover:bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <span className="font-mono text-amber-400 font-bold tabular-nums text-sm">
              {settings.length} chars
            </span>
          </div>
        </div>

        <input
          type="range"
          min={6}
          max={32}
          value={settings.length}
          onChange={(e) => handleLengthChange(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
        />
      </div>

      {/* Character Type Toggles */}
      <div className="flex flex-col gap-2">
        <label className="text-zinc-300 text-xs font-medium">Included Characters</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Lowercase (Default: ON) */}
          <label className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={settings.includeLowercase}
              onChange={(e) => onChange({ ...settings, includeLowercase: e.target.checked })}
              className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-zinc-200 font-medium">Lowercase (a-z)</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {settings.handMode === 'left-only' ? 'q w e r t a s d f g z x c v b' : 'a-z'}
              </span>
            </div>
          </label>

          {/* Numbers (Default: ON) */}
          <label className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={settings.includeNumbers}
              onChange={(e) => onChange({ ...settings, includeNumbers: e.target.checked })}
              className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-zinc-200 font-medium">Numbers (0-9)</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {settings.handMode === 'left-only' ? '1 2 3 4 5' : '0-9'}
              </span>
            </div>
          </label>

          {/* Uppercase (Default: OFF) */}
          <label className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={settings.includeUppercase}
              onChange={(e) => onChange({ ...settings, includeUppercase: e.target.checked })}
              className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-zinc-200 font-medium">Uppercase (A-Z)</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {settings.handMode === 'left-only' ? 'Q W E R T A S D...' : 'A-Z'}
              </span>
            </div>
          </label>

          {/* Symbols (Default: OFF) */}
          <label className="flex items-center gap-2 p-2.5 rounded-md bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={settings.includeSymbols}
              onChange={(e) => onChange({ ...settings, includeSymbols: e.target.checked })}
              className="accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-zinc-200 font-medium">Symbols</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {settings.handMode === 'left-only' ? '! @ # $ % ~' : '! @ # $ % ...'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Formatting & Chunking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Separator */}
        <div className="flex flex-col gap-1.5">
          <label className="text-zinc-300 text-xs font-medium">Separator / Chunking</label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-md border border-zinc-850">
            {(['none', 'hyphen', 'dot', 'underscore'] as SeparatorStyle[]).map((sep) => (
              <button
                key={sep}
                type="button"
                onClick={() => handleSeparatorChange(sep)}
                className={`py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  settings.separator === sep
                    ? 'bg-zinc-700 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {sep === 'none' && 'Continuous'}
                {sep === 'hyphen' && 'Hyphen (-)'}
                {sep === 'dot' && 'Dot (.)'}
                {sep === 'underscore' && 'Under (_)'}
              </button>
            ))}
          </div>
        </div>

        {/* Passwords Count */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-zinc-300 font-medium">Batch Output Quantity</label>
            <span className="text-zinc-500 text-[11px]">12 passwords for full ladder</span>
          </div>
          <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-950 rounded-md border border-zinc-850">
            {[6, 12, 18, 24].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => handleBatchCountChange(cnt)}
                className={`py-1.5 text-xs font-mono font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  settings.batchCount === cnt
                    ? 'bg-amber-400 text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {cnt} passwords
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
