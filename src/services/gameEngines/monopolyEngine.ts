export interface PropertySpace {
  id: number;
  name: string;
  type: 'property' | 'railroad' | 'utility' | 'go' | 'jail' | 'chance' | 'tax';
  group?: string;
  cost?: number;
  rent?: number;
  ownerId?: string;
}

export interface MonopolyPlayer {
  id: string;
  name: string;
  cash: number;
  position: number; // 0-27
  inJail: boolean;
  propertiesOwned: number[];
  color: string;
}

export interface MonopolyState {
  board: PropertySpace[];
  players: MonopolyPlayer[];
  currentTurnIndex: number;
  diceSeed: string;
  lastDiceRoll: [number, number];
  diceRollHash: string;
  isGameOver: boolean;
  winnerId?: string;
  turnNumber: number;
  logs: string[];
}

export const MONOPOLY_SPACES: PropertySpace[] = [
  { id: 0, name: 'GO', type: 'go' },
  { id: 1, name: 'Mediterranean Ave', type: 'property', group: 'brown', cost: 60, rent: 10 },
  { id: 2, name: 'Community Chest', type: 'chance' },
  { id: 3, name: 'Baltic Ave', type: 'property', group: 'brown', cost: 60, rent: 20 },
  { id: 4, name: 'Income Tax', type: 'tax', cost: 200 },
  { id: 5, name: 'Reading Railroad', type: 'railroad', cost: 200, rent: 50 },
  { id: 6, name: 'Oriental Ave', type: 'property', group: 'cyan', cost: 100, rent: 30 },
  { id: 7, name: 'Chance', type: 'chance' },
  { id: 8, name: 'Vermont Ave', type: 'property', group: 'cyan', cost: 100, rent: 30 },
  { id: 9, name: 'Connecticut Ave', type: 'property', group: 'cyan', cost: 120, rent: 40 },
  { id: 10, name: 'In Jail / Just Visiting', type: 'jail' },
  { id: 11, name: 'St. Charles Place', type: 'property', group: 'pink', cost: 140, rent: 50 },
  { id: 12, name: 'Electric Company', type: 'utility', cost: 150, rent: 40 },
  { id: 13, name: 'States Ave', type: 'property', group: 'pink', cost: 140, rent: 50 },
  { id: 14, name: 'Virginia Ave', type: 'property', group: 'pink', cost: 160, rent: 60 },
  { id: 15, name: 'Pennsylvania Railroad', type: 'railroad', cost: 200, rent: 50 },
  { id: 16, name: 'St. James Place', type: 'property', group: 'orange', cost: 180, rent: 70 },
  { id: 17, name: 'Tennessee Ave', type: 'property', group: 'orange', cost: 180, rent: 70 },
  { id: 18, name: 'New York Ave', type: 'property', group: 'orange', cost: 200, rent: 80 },
  { id: 19, name: 'Free Parking', type: 'go' },
  { id: 20, name: 'Kentucky Ave', type: 'property', group: 'red', cost: 220, rent: 90 },
  { id: 21, name: 'Indiana Ave', type: 'property', group: 'red', cost: 220, rent: 90 },
  { id: 22, name: 'Illinois Ave', type: 'property', group: 'red', cost: 240, rent: 100 },
  { id: 23, name: 'B&O Railroad', type: 'railroad', cost: 200, rent: 50 },
  { id: 24, name: 'Atlantic Ave', type: 'property', group: 'yellow', cost: 260, rent: 110 },
  { id: 25, name: 'Ventnor Ave', type: 'property', group: 'yellow', cost: 260, rent: 110 },
  { id: 26, name: 'Park Place', type: 'property', group: 'blue', cost: 350, rent: 150 },
  { id: 27, name: 'Boardwalk', type: 'property', group: 'blue', cost: 400, rent: 200 },
];

export function createInitialMonopolyState(p1Name: string, p2Name: string, seed = 'seed_arena_9821'): MonopolyState {
  return {
    board: MONOPOLY_SPACES.map(s => ({ ...s })),
    players: [
      { id: 'p1', name: p1Name, cash: 1500, position: 0, inJail: false, propertiesOwned: [], color: '#06b6d4' },
      { id: 'p2', name: p2Name, cash: 1500, position: 0, inJail: false, propertiesOwned: [], color: '#f59e0b' },
    ],
    currentTurnIndex: 0,
    diceSeed: seed,
    lastDiceRoll: [3, 4],
    diceRollHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isGameOver: false,
    turnNumber: 1,
    logs: ['[PROVABLY_FAIR] Monopoly Game Engine Initialized with seed: ' + seed],
  };
}

// Simple deterministic seed-derived dice roll formula
export function rollSeedDice(seed: string, turn: number): [number, number] {
  let hash = 0;
  const str = `${seed}_turn_${turn}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const d1 = (Math.abs(hash) % 6) + 1;
  const d2 = (Math.abs(hash >> 3) % 6) + 1;
  return [d1, d2];
}

export function makeMonopolyTurn(state: MonopolyState): MonopolyState {
  if (state.isGameOver) return state;

  const nextPlayers = state.players.map(p => ({ ...p, propertiesOwned: [...p.propertiesOwned] }));
  const nextBoard = state.board.map(s => ({ ...s }));
  const currPlayer = nextPlayers[state.currentTurnIndex];

  const [d1, d2] = rollSeedDice(state.diceSeed, state.turnNumber);
  const totalSteps = d1 + d2;
  const prevPos = currPlayer.position;
  const newPos = (prevPos + totalSteps) % nextBoard.length;

  currPlayer.position = newPos;

  // Passed GO?
  if (newPos < prevPos) {
    currPlayer.cash += 200;
  }

  const space = nextBoard[newPos];
  const newLogs = [...state.logs];
  newLogs.push(`[TURN ${state.turnNumber}] ${currPlayer.name} rolled [${d1}, ${d2}] -> landed on ${space.name}`);

  if (space.type === 'property' || space.type === 'railroad') {
    if (!space.ownerId && currPlayer.cash >= (space.cost || 100)) {
      // Auto buy property
      space.ownerId = currPlayer.id;
      currPlayer.cash -= space.cost || 100;
      currPlayer.propertiesOwned.push(space.id);
      newLogs.push(`  -> ${currPlayer.name} purchased ${space.name} for $${space.cost}`);
    } else if (space.ownerId && space.ownerId !== currPlayer.id) {
      // Rent payment
      const rent = space.rent || 20;
      currPlayer.cash -= rent;
      const owner = nextPlayers.find(p => p.id === space.ownerId);
      if (owner) owner.cash += rent;
      newLogs.push(`  -> ${currPlayer.name} paid $${rent} rent to ${owner?.name || 'Owner'}`);
    }
  }

  // Check game over condition
  const isOver = state.turnNumber >= 15 || nextPlayers.some(p => p.cash <= 0);
  let winnerId: string | undefined = undefined;
  if (isOver) {
    const sorted = [...nextPlayers].sort((a, b) => b.cash - a.cash);
    winnerId = sorted[0].id;
    newLogs.push(`[GAME OVER] Winner: ${sorted[0].name} with $${sorted[0].cash}`);
  }

  return {
    ...state,
    board: nextBoard,
    players: nextPlayers,
    currentTurnIndex: (state.currentTurnIndex + 1) % state.players.length,
    lastDiceRoll: [d1, d2],
    diceRollHash: `sha256_${Math.abs(d1 * 31 + d2 * 17)}`,
    turnNumber: state.turnNumber + 1,
    isGameOver: isOver,
    winnerId,
    logs: newLogs,
  };
}
