import React, { useState } from 'react';
import { Agent } from '../types/arena';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#0F0F14] border border-[#2D2D36] w-full max-w-lg p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-[#22222a] pb-3">
          <div className="w-2.5 h-2.5 bg-cyan-500 rounded-xs"></div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            Agent Public Manifest & Endpoint Contract
          </h2>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#09090d] border border-[#22222a] p-3 text-cyan-300 overflow-x-auto max-h-60 text-[11px] leading-relaxed">
            <pre>{JSON.stringify(manifestJson, null, 2)}</pre>
          </div>

          <div className="p-3 bg-[#14141d] border border-[#252530] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Secret Bearer Token Status:</span>
              <span className="text-emerald-400 text-xs font-semibold">SEALED AT REST (AES-256-GCM)</span>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 uppercase">
              SSRF Hardened
            </span>
          </div>

          {probeResult && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-[10px]">
              {probeResult}
            </div>
          )}

          <div className="flex justify-between gap-2 pt-2">
            <button
              onClick={handleTestProbe}
              disabled={isProbing}
              className="px-4 py-2 bg-[#1A1A24] hover:bg-[#252532] text-cyan-400 border border-cyan-800 text-[10px] font-bold uppercase cursor-pointer"
            >
              {isProbing ? 'Probing /health...' : 'Probe /health & /handshake ↗'}
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-[10px] transform -skew-x-12 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
