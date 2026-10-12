import React from 'react';
import { X, ShieldCheck, WifiOff, Cpu, Lock, Terminal } from 'lucide-react';

interface SecurityAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entropyBits: number;
  poolSize: number;
  passwordLength: number;
}

export const SecurityAuditModal: React.FC<SecurityAuditModalProps> = ({
  isOpen,
  onClose,
  entropyBits,
  poolSize,
  passwordLength,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col gap-6 text-zinc-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 font-sans">
                Cryptographic & Offline Verification
              </h2>
              <p className="text-xs text-zinc-400">
                100% Client-Side · CSPRNG Execution · Zero Network Telemetry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 font-mono">
              <WifiOff className="w-4 h-4" />
              <span>Offline Isolation</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Once loaded, this application does not make a single HTTP request or API call. Everything executes in your local browser sandbox.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono">
              <Cpu className="w-4 h-4" />
              <span>WebCrypto CSPRNG</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Uses hardware-level OS entropy via <code className="text-amber-300">window.crypto.getRandomValues</code> with rejection sampling to eliminate modulo bias.
            </p>
          </div>

          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 font-mono">
              <Lock className="w-4 h-4" />
              <span>Left-Hand Ergonomics</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Restricting characters to the left-hand cluster allows one-handed rapid input without moving your right hand from mouse or stylus.
            </p>
          </div>
        </div>

        {/* Entropy Mathematical Formula */}
        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-lg flex flex-col gap-2 font-mono text-xs">
          <div className="text-zinc-400 font-semibold flex items-center justify-between">
            <span>ACTIVE ENTROPY CALCULATION:</span>
            <span className="text-amber-400 font-bold">{entropyBits} BITS</span>
          </div>
          <div className="p-2.5 bg-zinc-900/60 rounded border border-zinc-800 text-zinc-300 text-xs">
            <code>
              Entropy (E) = L × log₂(S) = {passwordLength} × log₂({poolSize}) = {entropyBits} bits
            </code>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Where <strong>L</strong> is length ({passwordLength} characters) and <strong>S</strong> is the active character pool size ({poolSize} allowed keys). A 50+ bit password requires trillions of attempts to brute force.
          </p>
        </div>

        {/* Why Left-Hand Passwords & Generation Modes */}
        <div className="flex flex-col gap-2.5 text-xs">
          <h3 className="font-semibold text-zinc-200">The Power of Left-Hand Rhythm & Memory</h3>
          <p className="text-zinc-400 leading-relaxed">
            In standard QWERTY touch-typing, the left hand commands keys <code>1-5</code>, <code>Q-T</code>, <code>A-G</code>, and <code>Z-B</code>. This includes high-frequency vowels (<strong>A</strong>, <strong>E</strong>), consonants (<strong>W, R, T, S, D, F, G, C, V, B</strong>), and numbers (<strong>1-5</strong>).
          </p>
          <div className="p-3 bg-zinc-950/70 rounded-md border border-zinc-850 flex flex-col gap-1 text-[11px] text-zinc-400">
            <span className="text-amber-400 font-semibold font-mono">Easy & Memorable Mode (Default)</span>
            <p>
              By alternating consonants and vowels with repeating syllables and numbers in between (e.g. <code>wewe32wawa41</code>), passwords achieve rhythmically fluid finger rolls and effortless mental recall. If you need maximum entropy for critical infrastructure, switch to <strong>More Random</strong> in the generator settings.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md text-xs font-medium transition-colors cursor-pointer"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
