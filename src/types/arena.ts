export type GameType = 'monopoly' | 'chess' | 'go' | 'quoridor';

export interface GameInfo {
  id: GameType;
  name: string;
  playersCount: string;
  luckFactor: string;
  status: string;
  description: string;
  icon: string;
}

export interface Agent {
  id: string;
  name: string;
  apiKey: string;
  ownerHandle: string;
  ownerEmail: string;
  endpointUrl: string;
  endpointSecretSealed: boolean;
  supportedGames: GameType[];
  certifiedGames: GameType[];
  modelName: string;
  version: string;
  elo: Record<GameType, number>;
  totalMatches: number;
  wins: number;
  losses: number;
  draws: number;
  status: 'active' | 'certifying' | 'unverified' | 'flagged';
  createdAt: string;
}

export interface AgentManifest {
  version: string;
  endpointUrl: string;
  games: GameType[];
  modelSdk: string;
  healthPath: string;
  handshakePath: string;
  verifiedAt?: string;
}

export type SandboxCheckKey = 
  | 'endpoint_reachable'
  | 'legal_moves_only'
  | 'engages'
  | 'plays_both_sides'
  | 'full_completion'
  | 'responsive';

export interface SandboxCheckDetail {
  key: SandboxCheckKey;
  label: string;
  passed: boolean;
  description: string;
  value?: string;
}

export interface SandboxCertificationRun {
  id: string;
  agentId: string;
  game: GameType;
  mode: 'endpoint' | 'engine';
  status: 'passed' | 'failed' | 'running' | 'idle';
  checks: Record<SandboxCheckKey, boolean>;
  logs: string[];
  avgLatencyMs: number;
  totalMoves: number;
  timestamp: string;
}

export interface MatchPlayer {
  agentId: string;
  agentName: string;
  colorOrSlot: string;
  elo: number;
  isBot?: boolean;
}

export interface MatchMove {
  turn: number;
  player: string;
  moveStr: string;
  boardStateSummary?: string;
  latencyMs?: number;
  timestamp: string;
}

export interface Match {
  id: string;
  game: GameType;
  players: MatchPlayer[];
  potCoins: number;
  status: 'live' | 'completed' | 'cancelled';
  winnerAgentId?: string;
  currentTurn: number;
  seed: string;
  moves: MatchMove[];
  createdAt: string;
}

export interface LedgerTransaction {
  id: string;
  hash: string;
  timestamp: string;
  debitAccount: string;
  creditAccount: string;
  amountCoins: number;
  description: string;
  type: 'MATCH_STAKE' | 'MATCH_PAYOUT' | 'COIN_PURCHASE' | 'CASHOUT' | 'TOURNAMENT_PRIZE' | 'SUBSCRIPTION' | 'INITIAL_BONUS';
  status: 'SETTLED' | 'PENDING' | 'REFUNDED';
}

export interface WalletLimits {
  sessionLossLimit: number;
  currentSessionLoss: number;
  maxBidPerMatch: number;
  minBalanceRequired: number;
  dailyCap: number;
}

export interface PayoutRequest {
  id: string;
  coinsAmount: number;
  usdAmount: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'CLEARED' | 'REJECTED';
  requestedAt: string;
  clearsAt: string;
  antifraudPassed: boolean;
  recipientHandle: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: GameType;
  prizePoolCoins: number;
  sponsorName: string;
  startTime: string;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  minElo: number;
  registeredAgentIds: string[];
  maxParticipants: number;
  winnerAgentId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  agentId: string;
  agentName: string;
  ownerHandle: string;
  game: GameType;
  elo: number;
  winRate: number;
  wins: number;
  losses: number;
  draws: number;
  certified: boolean;
}

export interface DomainEvent {
  id: string;
  type: 'agent.registered' | 'agent.certified' | 'match.finished' | 'season.rolled' | 'ledger.tx' | 'dispute.opened' | 'payout.requested';
  timestamp: string;
  payload: Record<string, any>;
}

export interface Dispute {
  id: string;
  matchId: string;
  complainantHandle: string;
  reason: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_REFUND' | 'DISMISSED';
  createdAt: string;
}
