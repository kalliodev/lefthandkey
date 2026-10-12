import React from 'react';
import { RotateCw, Volume2, VolumeX, ShieldCheck, Heart, Keyboard, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRegenerate: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAudit: () => void;
  onOpenVault: () => void;
  favoritesCount: number;
  activeView: 'generator' | 'typing-sandbox';
  onSelectView: (view: 'generator' | 'typing-sandbox') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRegenerate,
  soundEnabled,
  onToggleSound,
  onOpenAudit,
  onOpenVault,
  favoritesCount,
  activeView,
  onSelectView,
}) => {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectView('generator');
            }}
            className="flex items-center gap-2.5 text-zinc-100 hover:text-white transition-colors"
          >
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
              LH
            </div>
            <span className="text-base font-bold tracking-tight font-sans whitespace-nowrap">
              SinisterKey
            </span>
          </a>
          <span className="hidden sm:inline-block text-xs font-mono text-zinc-500 tracking-wide">
            // Ergonomic Offline Engine
          </span>
        </div>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => onSelectView('generator')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-zinc-100 ${
              activeView === 'generator' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Password Generator
          </button>
          <button
            onClick={() => onSelectView('typing-sandbox')}
            className={`transition-colors whitespace-nowrap cursor-pointer hover:text-zinc-100 ${
              activeView === 'typing-sandbox' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Typing Speed Lab
          </button>
          <button
            onClick={onOpenAudit}
            className="transition-colors whitespace-nowrap cursor-pointer hover:text-zinc-100 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero-Network Audit</span>
          </button>
          <button
            onClick={onOpenVault}
            className="transition-colors whitespace-nowrap cursor-pointer hover:text-zinc-100 flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Saved ({favoritesCount})</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Disable mechanical key sound' : 'Enable mechanical key sound'}
            className="p-2 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 rounded-md transition-colors"
            aria-label="Toggle mechanical switch audio"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-500" />
            )}
          </button>

          <button
            onClick={onRegenerate}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-md transition-all shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
            <kbd className="hidden lg:inline-block px-1 py-0.5 text-[10px] bg-amber-500/30 text-zinc-900 rounded font-mono">
              Space
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
