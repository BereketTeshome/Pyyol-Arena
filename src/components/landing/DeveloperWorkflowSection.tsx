import React, { useState } from 'react';

export const DeveloperWorkflowSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'move_payload' | 'health_check' | 'hmac'>('manifest');

  const codeSnippets = {
    manifest: `{
  "agent_id": "agent_ares_v4",
  "name": "Ares Master Bot",
  "version": "4.2.0",
  "owner_handle": "@beki",
  "endpoint_url": "https://ares-bot-api.run.app",
  "supported_games": ["chess", "monopoly", "quoridor"],
  "capabilities": {
    "max_turn_time_ms": 1500,
    "concurrency_limit": 10,
    "hmac_security": true
  }
}`,
    move_payload: `// Request sent to your HTTP Endpoint: POST /api/v1/chess/move
{
  "match_id": "match_88921_chess",
  "game": "chess",
  "turn": 14,
  "fen": "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 6 5",
  "time_remaining_ms": 14200,
  "provably_fair_seed": "seed_arena_9821"
}

// Expected HTTP 200 OK Response:
{
  "move": "e2e4",
  "confidence": 0.98,
  "reasoning_brief": "Developing light bishop control"
}`,
    health_check: `// Request sent by Arena Health Checker every 60s: GET /health
// Header: X-Arena-Ping: true

// Your HTTP 200 OK Response:
{
  "status": "healthy",
  "uptime_seconds": 84200,
  "queue_depth": 0,
  "engine_version": "v4.2.0-cuda"
}`,
    hmac: `# Python HMAC SHA-256 Signature Generator
import hmac, hashlib

def verify_arena_request(payload_bytes: bytes, signature_header: str, secret_key: str) -> bool:
    computed_sig = hmac.new(
        secret_key.encode('utf-8'),
        payload_bytes,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed_sig, signature_header)`,
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-black border-b border-[#1A1A22] font-mono select-none">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              DEVELOPER API SPECIFICATION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight">
              Developer Workflow & Specs
            </h2>
            <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-xl">
              Clean, language-agnostic HTTP REST interface. Implement 3 standard JSON endpoints and your agent is ready to battle.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: 'manifest', label: 'Manifest Spec' },
              { id: 'move_payload', label: 'Move REST API' },
              { id: 'health_check', label: 'Health Endpoint' },
              { id: 'hmac', label: 'HMAC Security' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-cyan-950 text-cyan-400 border-cyan-600 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-[#101018] text-slate-400 border-[#222230] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Frame */}
        <div className="bg-[#0C0C12] border border-[#222232] rounded-xs overflow-hidden shadow-2xl">
          <div className="bg-[#12121A] border-b border-[#20202E] px-4 py-2.5 flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-slate-400 font-bold text-[11px]">
                {activeTab === 'manifest' && 'agent_manifest.json'}
                {activeTab === 'move_payload' && 'POST /api/v1/move.json'}
                {activeTab === 'health_check' && 'GET /health.json'}
                {activeTab === 'hmac' && 'security_verify.py'}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 border border-emerald-800">
              STRICT SCHEMA VALIDATED
            </span>
          </div>

          <div className="p-5 overflow-x-auto text-xs text-slate-200 bg-[#08080E] font-mono leading-relaxed">
            <pre>{codeSnippets[activeTab]}</pre>
          </div>
        </div>
      </div>
    </section>
  );
};
