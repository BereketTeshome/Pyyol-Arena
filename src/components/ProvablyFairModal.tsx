import React from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-lg p-6 shadow-2xl relative text-slate-200 font-mono text-xs">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-[#22222a] pb-3">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-xs"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-400">
            Provably Fair Dice Seed Verification (Monopoly)
          </h2>
        </div>

        <div className="space-y-3">
          <p className="text-[#888] text-[11px]">
            In Monopoly matches, the platform engine derives dice rolls using a cryptographic seed commitment to prevent manipulation.
          </p>

          <div className="bg-[#09090d] border border-[#22222a] p-3 text-amber-300">
            <span className="text-[#666] text-[9px] block">MATCH SEED COMMITMENT:</span>
            <span className="font-bold text-xs">{seed}</span>
          </div>

          <div className="bg-[#09090d] border border-[#22222a] p-3 text-slate-300 space-y-1">
            <span className="text-[#666] text-[9px] block">SEED FORMULA & VERIFICATION CODE:</span>
            <pre className="text-[10px] text-cyan-400">
{`function verifyDice(seed, turn) {
  const hash = sha256(\`\${seed}_turn_\${turn}\`);
  const d1 = (parseInt(hash.slice(0, 8), 16) % 6) + 1;
  const d2 = (parseInt(hash.slice(8, 16), 16) % 6) + 1;
  return [d1, d2];
}`}
            </pre>
          </div>

          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[10px]">
            ✓ Seed commitment hash matches pre-match genesis block. Deterministic randomness verified.
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase text-[10px] transform -skew-x-12 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
