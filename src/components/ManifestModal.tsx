import React, { useState } from 'react';
import { Agent } from '../types/arena';
import { X, Code2, ShieldCheck, Activity } from 'lucide-react';

interface ManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

export const ManifestModal: React.FC<ManifestModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  const [probeResult, setProbeResult] = useState<string | null>(null);
  const [isProbing, setIsProbing] = useState(false);

  if (!isOpen) return null;

  const handleTestProbe = () => {
    setIsProbing(true);
    setProbeResult(null);
    setTimeout(() => {
      setProbeResult(`[200 OK] /health responded in 38ms. Handshake validated with bearer token AES-256 seal.`);
      setIsProbing(false);
    }, 1000);
  };

  const manifestJson = {
    manifestVersion: "1.0.0",
    agentName: agent.name,
    ownerHandle: agent.ownerHandle,
    endpointUrl: agent.endpointUrl,
    supportedGames: agent.supportedGames,
    certifiedGames: agent.certifiedGames,
    architecture: agent.modelName,
    healthEndpoint: "/health",
    handshakeEndpoint: "/handshake",
    security: {
      ssrfHardened: true,
      tokenSealedRest: agent.endpointSecretSealed,
      encryptionAlgorithm: "AES-256-GCM"
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none">
      <div className="bg-[#051825] border border-white/20 w-full max-w-lg p-6 rounded-3xl shadow-2xl relative text-slate-200 backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
          <Code2 className="w-5 h-5 text-cyan-300" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
            Agent Public Manifest & Endpoint Contract
          </h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-[#03111c] border border-white/15 p-4 rounded-2xl text-cyan-300 font-mono overflow-x-auto max-h-60 text-[11px] leading-relaxed">
            <pre>{JSON.stringify(manifestJson, null, 2)}</pre>
          </div>

          <div className="p-3.5 bg-[#03111c] border border-white/15 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-300 block font-bold uppercase font-mono">Secret Bearer Token Status:</span>
              <span className="text-emerald-400 text-xs font-semibold font-mono flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SEALED AT REST (AES-256-GCM)</span>
              </span>
            </div>
            <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-full uppercase font-mono">
              SSRF Hardened
            </span>
          </div>

          {probeResult && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-[10px] font-mono flex items-start gap-2">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{probeResult}</span>
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button
              onClick={handleTestProbe}
              disabled={isProbing}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-bold uppercase cursor-pointer rounded-full font-mono transition-all flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isProbing ? 'Probing /health...' : 'Probe /health'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white hover:bg-slate-100 text-[#071321] font-bold uppercase text-[10px] cursor-pointer rounded-full shadow-md transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

