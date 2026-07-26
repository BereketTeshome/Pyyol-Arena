import React, { useState } from 'react';
import { Agent, GameType, Tournament, DomainEvent } from './types/arena';
import { INITIAL_AGENTS, INITIAL_TOURNAMENTS, INITIAL_DOMAIN_EVENTS } from './data/mockInitialData';
import { globalLedger } from './services/ledgerService';

import { LandingPage } from './components/landing/LandingPage';
import { Header } from './components/Header';
import { LeftRail } from './components/LeftRail';
import { DashboardView } from './components/DashboardView';
import { SandboxCertificationView } from './components/SandboxCertificationView';
import { SpectatorArenaView } from './components/SpectatorArenaView';
import { TournamentsView } from './components/TournamentsView';
import { LeaderboardView } from './components/LeaderboardView';
import { WalletLedgerView } from './components/WalletLedgerView';
import { AntifraudEventsView } from './components/AntifraudEventsView';

import { AgentRegisterModal } from './components/AgentRegisterModal';
import { ManifestModal } from './components/ManifestModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';

export default function App() {
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard'>('landing');
  const [userHandle, setUserHandle] = useState<string>('@dev_quantum_01');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>(INITIAL_AGENTS[0].id);
  const [coinsBalance, setCoinsBalance] = useState<number>(globalLedger.getBalance());
  const [tournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [domainEvents] = useState<DomainEvent[]>(INITIAL_DOMAIN_EVENTS);

  // Modals
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showManifestModal, setShowManifestModal] = useState<boolean>(false);
  const [showProvablyFairModal, setShowProvablyFairModal] = useState<boolean>(false);
  const [sandboxTargetGame, setSandboxTargetGame] = useState<GameType>('chess');
  const [pfSeed, setPfSeed] = useState<string>('seed_arena_9821');

  const activeAgent = agents.find(a => a.id === activeAgentId) || agents[0];

  const handleRegisterSuccess = (newAgent: Agent) => {
    setAgents(prev => [newAgent, ...prev]);
    setActiveAgentId(newAgent.id);
  };

  const handleCertificationSuccess = (agentId: string, certifiedGame: GameType) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId && !a.certifiedGames.includes(certifiedGame)) {
        return {
          ...a,
          certifiedGames: [...a.certifiedGames, certifiedGame],
          status: 'active',
        };
      }
      return a;
    }));
  };

  const refreshCoins = () => {
    setCoinsBalance(globalLedger.getBalance());
  };

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={() => setViewMode('dashboard')}
        onUserAuthenticated={(handle) => {
          setUserHandle(handle);
          setViewMode('dashboard');
        }}
      />
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0A0A0C] text-[#E0E0E6] font-sans flex flex-col overflow-hidden select-none">
      {/* Top Bar: Navigation & Global Stats */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coinsBalance={coinsBalance}
        userHandle={userHandle || activeAgent.ownerHandle}
        onOpenBuyCoins={() => setActiveTab('wallet')}
        onGoToLanding={() => setViewMode('landing')}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden bg-[#0A0A0C]">
        {/* Left Rail: Agent Selector & Financial Controls */}
        <LeftRail
          agents={agents}
          activeAgentId={activeAgentId}
          onSelectAgent={setActiveAgentId}
          onOpenRegisterModal={() => setShowRegisterModal(true)}
          walletLimits={globalLedger.getLimits()}
          onOpenWalletModal={() => setActiveTab('wallet')}
        />

        {/* Tab Routing */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {activeTab === 'dashboard' && (
            <DashboardView
              activeAgent={activeAgent}
              tournaments={tournaments}
              domainEvents={domainEvents}
              onOpenSandbox={(g) => {
                setSandboxTargetGame(g);
                setActiveTab('sandbox');
              }}
              onOpenArena={() => setActiveTab('arena')}
              onOpenManifest={() => setShowManifestModal(true)}
              onOpenTournaments={() => setActiveTab('tournaments')}
            />
          )}

          {activeTab === 'sandbox' && (
            <SandboxCertificationView
              agent={activeAgent}
              initialGame={sandboxTargetGame}
              onCertificationSuccess={handleCertificationSuccess}
            />
          )}

          {activeTab === 'arena' && (
            <SpectatorArenaView
              agents={agents}
              activeAgent={activeAgent}
              onOpenProvablyFairModal={(s) => {
                setPfSeed(s);
                setShowProvablyFairModal(true);
              }}
            />
          )}

          {activeTab === 'tournaments' && (
            <TournamentsView
              tournaments={tournaments}
              agents={agents}
              activeAgent={activeAgent}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView />
          )}

          {activeTab === 'wallet' && (
            <WalletLedgerView onBalanceUpdated={refreshCoins} />
          )}

          {activeTab === 'events' && (
            <AntifraudEventsView />
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-8 bg-[#0F0F12] border-t border-[#222226] flex items-center justify-between px-6 shrink-0 text-[8px] font-mono select-none">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-bold text-slate-400 uppercase tracking-widest">
              Mainnet Status: Optimal
            </span>
          </div>
          <div className="text-[#555]">
            Lat: 42ms | Block: 1288921 | Engine: V8.2
          </div>
        </div>
        <div className="text-[#555] uppercase">
          &copy; 2026 AGENT ARENA PROTOCOL // NO CODE HOSTED
        </div>
      </footer>

      {/* Global Modals */}
      <AgentRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      <ManifestModal
        isOpen={showManifestModal}
        onClose={() => setShowManifestModal(false)}
        agent={activeAgent}
      />

      <ProvablyFairModal
        isOpen={showProvablyFairModal}
        onClose={() => setShowProvablyFairModal(false)}
        seed={pfSeed}
      />
    </div>
  );
}
