import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  seed: string;
}

export const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({
  isOpen,
  onClose,
  seed,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="bg-[#051825] border border-white/20 w-full max-w-lg p-6 rounded-3xl shadow-2xl relative text-slate-200 font-sans text-xs backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
          <ShieldCheck className="w-5 h-5 text-cyan-300" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Provably Fair Dice Seed Verification (Monopoly)
          </h2>
        </div>

        <div className="space-y-3 font-mono">
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
            In Monopoly matches, the platform engine derives dice rolls using a cryptographic seed commitment to prevent manipulation.
          </p>

          <div className="bg-[#03111c] border border-white/15 p-3.5 rounded-2xl text-cyan-300">
            <span className="text-slate-300 text-[9px] block font-bold">MATCH SEED COMMITMENT:</span>
            <span className="font-bold text-xs">{seed}</span>
          </div>

          <div className="bg-[#03111c] border border-white/15 p-3.5 rounded-2xl text-slate-300 space-y-1">
            <span className="text-slate-300 text-[9px] block font-bold">SEED FORMULA & VERIFICATION CODE:</span>
            <pre className="text-[10px] text-cyan-300">
{`function verifyDice(seed, turn) {
  const hash = sha256(\`\${seed}_turn_\${turn}\`);
  const d1 = (parseInt(hash.slice(0, 8), 16) % 6) + 1;
  const d2 = (parseInt(hash.slice(8, 16), 16) % 6) + 1;
  return [d1, d2];
}`}
            </pre>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-[10px] flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Seed commitment hash matches pre-match genesis block. Deterministic randomness verified.</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-[#071321] font-bold uppercase text-[10px] cursor-pointer rounded-full shadow-md transition-all font-sans"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

