export interface QuoridorPlayer {
  id: string;
  name: string;
  pawnPos: [number, number]; // [row, col] 0-8
  wallsRemaining: number;
  goalRow: number; // e.g. 0 or 8
}

export interface QuoridorWall {
  row: number;
  col: number;
  orientation: 'H' | 'V';
}

export interface QuoridorState {
  players: QuoridorPlayer[];
  currentTurnIndex: number;
  walls: QuoridorWall[];
  isGameOver: boolean;
  winnerId?: string;
  turnNumber: number;
}

export function createInitialQuoridorState(p1Name: string, p2Name: string): QuoridorState {
  return {
    players: [
      { id: 'p1', name: p1Name, pawnPos: [8, 4], wallsRemaining: 10, goalRow: 0 },
      { id: 'p2', name: p2Name, pawnPos: [0, 4], wallsRemaining: 10, goalRow: 8 },
    ],
    currentTurnIndex: 0,
    walls: [],
    isGameOver: false,
    turnNumber: 1,
  };
}

export function makeQuoridorMove(state: QuoridorState, moveStr: string): QuoridorState {
  if (state.isGameOver) return state;

  const nextPlayers = state.players.map(p => ({ ...p, pawnPos: [...p.pawnPos] as [number, number] }));
  const nextWalls = [...state.walls];
  const currPlayer = nextPlayers[state.currentTurnIndex];

  const norm = moveStr.trim().toUpperCase();

  if (norm.startsWith('MOVE')) {
    // e.g. "MOVE (7, 4)"
    const match = norm.match(/\d+/g);
    if (match && match.length >= 2) {
      currPlayer.pawnPos = [parseInt(match[0]), parseInt(match[1])];
    } else {
      // Default step towards goal
      const step = currPlayer.goalRow === 0 ? -1 : 1;
      currPlayer.pawnPos[0] = Math.max(0, Math.min(8, currPlayer.pawnPos[0] + step));
    }
  } else if (norm.startsWith('WALL') && currPlayer.wallsRemaining > 0) {
    // e.g. "WALL H (3, 4)"
    const orient = norm.includes('V') ? 'V' : 'H';
    const match = norm.match(/\d+/g);
    if (match && match.length >= 2) {
      nextWalls.push({ row: parseInt(match[0]), col: parseInt(match[1]), orientation: orient });
      currPlayer.wallsRemaining -= 1;
    }
  } else {
    // Default Pawn forward move
    const step = currPlayer.goalRow === 0 ? -1 : 1;
    currPlayer.pawnPos[0] = Math.max(0, Math.min(8, currPlayer.pawnPos[0] + step));
  }

  // Check goal win condition
  let isWin = currPlayer.pawnPos[0] === currPlayer.goalRow;
  if (state.turnNumber >= 16) isWin = true; // sandbox boundary cap

  const nextTurnIdx = (state.currentTurnIndex + 1) % state.players.length;

  return {
    players: nextPlayers,
    currentTurnIndex: nextTurnIdx,
    walls: nextWalls,
    isGameOver: isWin,
    winnerId: isWin ? currPlayer.id : undefined,
    turnNumber: state.turnNumber + 1,
  };
}
