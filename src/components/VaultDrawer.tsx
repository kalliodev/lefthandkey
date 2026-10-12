import React, { useState } from 'react';
import { PasswordItem } from '../types';
import { X, Copy, Check, Download, Trash2, Heart, History } from 'lucide-react';
import { playCopyChime } from '../utils/audio';

interface VaultDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: PasswordItem[];
  history: PasswordItem[];
  onToggleFavorite: (item: PasswordItem) => void;
  onClearFavorites: () => void;
  onClearHistory: () => void;
  onTestTyping: (password: string) => void;
}

export const VaultDrawer: React.FC<VaultDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  history,
  onToggleFavorite,
  onClearFavorites,
  onClearHistory,
  onTestTyping,
}) => {
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const currentList = tab === 'favorites' ? favorites : history;

  const handleCopySingle = async (item: PasswordItem) => {
    try {
      await navigator.clipboard.writeText(item.value);
      setCopiedId(item.id);
      playCopyChime();
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // ignore
    }
  };

  const handleCopyAll = async () => {
    if (currentList.length === 0) return;
    const text = currentList.map((p) => p.value).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      playCopyChime();
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleExportTxt = () => {
    if (currentList.length === 0) return;
    const text = `# SinisterKey Offline Password Export\n# Generated locally on: ${new Date().toISOString()}\n\n` +
      currentList.map((p, i) => `${i + 1}. ${p.value} (${p.entropyBits} bits entropy)`).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sinisterkey_passwords_${tab}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-zinc-900 border-l border-zinc-800 h-full flex flex-col justify-between shadow-2xl">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100 font-sans">Password Vault</span>
            <span className="text-xs text-zinc-500 font-mono">({currentList.length})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 flex items-center gap-2 border-b border-zinc-800/80 pb-3">
          <button
            onClick={() => setTab('favorites')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              tab === 'favorites'
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Favorites ({favorites.length})</span>
          </button>

          <button
            onClick={() => setTab('history')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer ${
              tab === 'history'
                ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Session History ({history.length})</span>
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-2.5">
          {currentList.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-zinc-500 gap-2">
              <span className="text-xs font-mono">
                {tab === 'favorites' ? 'No saved passwords yet.' : 'No generated history yet.'}
              </span>
              <p className="text-[11px] text-zinc-600 max-w-xs">
                {tab === 'favorites'
                  ? 'Click the heart icon on any generated password to save it here.'
                  : 'Generated passwords will appear in this list.'}
              </p>
            </div>
          ) : (
            currentList.map((item, index) => (
              <div
                key={item.id}
                className="bg-zinc-950/80 border border-zinc-800/90 rounded-md p-3 flex flex-col gap-2 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">
                    #{index + 1} {item.difficultyLabel ? `· ${item.difficultyLabel}` : ''}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <span>{item.entropyBits} bits</span>
                    <span className="text-zinc-600">·</span>
                    <button
                      onClick={() => onToggleFavorite(item)}
                      className="text-rose-400 hover:text-rose-300 p-0.5 cursor-pointer"
                    >
                      <Heart className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>

                <div className="font-mono text-sm font-semibold tracking-wider text-zinc-100 bg-zinc-900/90 px-2.5 py-1.5 rounded border border-zinc-850 flex items-center justify-between">
                  <span className="truncate select-all">{item.value}</span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => handleCopySingle(item)}
                      title="Copy to clipboard"
                      className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>~{item.crackTimeStr} to crack</span>
                  <button
                    onClick={() => {
                      onTestTyping(item.value);
                      onClose();
                    }}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    Test in typing lab →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {currentList.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAll}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAll ? 'Copied All' : 'Copy All'}</span>
              </button>

              <button
                onClick={handleExportTxt}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export (.txt)</span>
              </button>
            </div>

            <button
              onClick={tab === 'favorites' ? onClearFavorites : onClearHistory}
              title="Clear list"
              className="p-1.5 text-zinc-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
