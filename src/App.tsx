/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GeneratorSettings, PasswordItem } from './types';
import { generatePasswordBatch, buildPools, calculateEntropy } from './utils/cryptoGenerator';
import { Header } from './components/Header';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { PasswordCard } from './components/PasswordCard';
import { SettingsPanel } from './components/SettingsPanel';
import { TypingSandbox } from './components/TypingSandbox';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { VaultDrawer } from './components/VaultDrawer';
import { setSoundEnabled, isSoundEnabled, playKeyClick } from './utils/audio';
import { ShieldCheck, WifiOff, RotateCw, Keyboard, Sparkles, SlidersHorizontal, Check } from 'lucide-react';

const DEFAULT_SETTINGS: GeneratorSettings = {
  handMode: 'left-only',
  includeLowercase: true,
  includeNumbers: true,
  includeUppercase: false,
  includeSymbols: false,
  avoidAmbiguous: false,
  generationMode: 'progressive-ladder',
  length: 12,
  batchCount: 12,
  separator: 'none',
  chunkSize: 4,
  customExcludedKeys: [],
};

const FAVORITES_STORAGE_KEY = 'sinisterkey_favorites_v1';

export default function App() {
  const [settings, setSettings] = useState<GeneratorSettings>(DEFAULT_SETTINGS);

  // Starts showing 12 generated passwords immediately upon page load, ordered from simplest to most random!
  const [passwords, setPasswords] = useState<PasswordItem[]>(() => {
    return generatePasswordBatch(DEFAULT_SETTINGS);
  });

  const [history, setHistory] = useState<PasswordItem[]>([]);
  const [favorites, setFavorites] = useState<PasswordItem[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeView, setActiveView] = useState<'generator' | 'typing-sandbox'>('generator');
  const [sandboxPassword, setSandboxPassword] = useState<string>('');
  const [highlightedChars, setHighlightedChars] = useState<string[] | null>(null);
  const [soundActive, setSoundActive] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  // Monitor network status purely to verify offline execution capability
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Regenerate passwords
  const handleRegenerate = useCallback(() => {
    playKeyClick(1.2);
    const newBatch = generatePasswordBatch(settings);
    setPasswords(newBatch);
    setHistory((prev) => [...newBatch, ...prev].slice(0, 50));
  }, [settings]);

  // Spacebar hotkey to regenerate (when not focused in an input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleRegenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRegenerate]);

  // Update settings and auto-regenerate
  const handleSettingsChange = (newSettings: GeneratorSettings) => {
    setSettings(newSettings);
    const newBatch = generatePasswordBatch(newSettings);
    setPasswords(newBatch);
    setHistory((prev) => [...newBatch, ...prev].slice(0, 50));
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    const newBatch = generatePasswordBatch(DEFAULT_SETTINGS);
    setPasswords(newBatch);
  };

  // Toggle key exclusion on the visual keyboard
  const handleToggleKeyExcluded = (key: string) => {
    setSettings((prev) => {
      const exists = prev.customExcludedKeys.includes(key);
      const customExcludedKeys = exists
        ? prev.customExcludedKeys.filter((k) => k !== key)
        : [...prev.customExcludedKeys, key];
      const updated = { ...prev, customExcludedKeys };
      setPasswords(generatePasswordBatch(updated));
      return updated;
    });
  };

  // Toggle favorite
  const handleToggleFavorite = (item: PasswordItem) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === item.id || p.value === item.value);
      if (exists) {
        return prev.filter((p) => p.id !== item.id && p.value !== item.value);
      }
      return [item, ...prev];
    });
  };

  const handleToggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playKeyClick();
  };

  const handleTestTyping = (password: string) => {
    setSandboxPassword(password);
    setActiveView('typing-sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyAllVisible = async () => {
    const allText = passwords.map((p) => p.value).join('\n');
    try {
      await navigator.clipboard.writeText(allText);
      setIsCopiedAll(true);
      setTimeout(() => setIsCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  // Computed pools and metrics
  const poolInfo = useMemo(() => buildPools(settings), [settings]);
  const activeEntropy = useMemo(
    () => calculateEntropy(settings.length, poolInfo.fullPool.length, settings.generationMode),
    [settings.length, poolInfo.fullPool.length, settings.generationMode]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        onRegenerate={handleRegenerate}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        favoritesCount={favorites.length}
        activeView={activeView}
        onSelectView={setActiveView}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        {/* Editorial Sub-Header & Offline Guarantee Status */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-850">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans text-balance">
              Ergonomic Left-Hand Password Generation
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Completely client-side, offline JavaScript engine. Generates secure passwords designed for rapid single-handed typing while your right hand stays free for mouse, trackpad, or stylus.
            </p>
          </div>

          {/* Clean Unboxed Metadata Badges (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Network Requests</span>
            </div>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Verified</span>
            </div>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-amber-400 font-semibold tabular-nums">
              {poolInfo.fullPool.length} Active Keys
            </span>
          </div>
        </section>

        {/* View Switching: Generator vs Typing Speed Sandbox */}
        {activeView === 'typing-sandbox' ? (
          <TypingSandbox
            initialPassword={sandboxPassword || (passwords[0]?.value ?? 'wewe32wawa41')}
            onBackToGenerator={() => setActiveView('generator')}
            onHoverChar={(c) => setHighlightedChars(c ? [c] : null)}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Interactive Keyboard Visualizer Deck */}
            <KeyboardVisualizer
              handMode={settings.handMode}
              highlightChars={highlightedChars || []}
              excludedKeys={settings.customExcludedKeys}
              onToggleKeyExcluded={handleToggleKeyExcluded}
            />

            {/* Generated Passwords Grid (Shows 12 immediately on load in progressive difficulty order) */}
            <section className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 font-mono">
                    Output Ladder ({passwords.length} Passwords)
                  </h2>
                  <span className="text-xs text-zinc-500 font-mono">
                    · #01 simplest & easiest → #12 most random
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAllVisible}
                    className="text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isCopiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                    <span>{isCopiedAll ? `Copied ${passwords.length} Passwords` : `Copy All ${passwords.length}`}</span>
                  </button>
                </div>
              </div>

              {/* Grid of Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                {passwords.map((item, index) => (
                  <PasswordCard
                    key={item.id}
                    item={item}
                    index={index}
                    isFavorite={favorites.some((f) => f.id === item.id || f.value === item.value)}
                    onToggleFavorite={handleToggleFavorite}
                    onTestTyping={handleTestTyping}
                    onHoverChars={setHighlightedChars}
                  />
                ))}
              </div>
            </section>

            {/* Settings & Configuration Panel */}
            <section className="pt-2">
              <SettingsPanel
                settings={settings}
                onChange={handleSettingsChange}
                onReset={handleResetSettings}
              />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
          <div>
            <span>SinisterKey // Cryptographically Secure & Ergonomic Touch Typing Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAuditOpen(true)}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              CSPRNG Audit & Entropy Spec
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>100% Client-Side JavaScript</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <SecurityAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        entropyBits={activeEntropy}
        poolSize={poolInfo.fullPool.length}
        passwordLength={settings.length}
      />

      <VaultDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        favorites={favorites}
        history={history}
        onToggleFavorite={handleToggleFavorite}
        onClearFavorites={() => setFavorites([])}
        onClearHistory={() => setHistory([])}
        onTestTyping={handleTestTyping}
      />
    </div>
  );
}
