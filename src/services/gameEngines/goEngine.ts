export interface GoBoardState {
  size: 9;
  grid: ( 'B' | 'W' | null )[][]; // 9x9
  turn: 'B' | 'W';
  captures: { B: number; W: number };
  consecutivePasses: number;
  isGameOver: boolean;
  winner?: 'B' | 'W' | 'Draw';
  score?: { B: number; W: number };
}

export function createInitialGoState(): GoBoardState {
  const grid: ( 'B' | 'W' | null )[][] = Array(9).fill(null).map(() => Array(9).fill(null));
  return {
    size: 9,
    grid,
    turn: 'B',
    captures: { B: 0, W: 0 },
    consecutivePasses: 0,
    isGameOver: false,
  };
}

export function makeGoMove(state: GoBoardState, moveStr: string): GoBoardState {
  if (state.isGameOver) return state;
  const nextGrid = state.grid.map(row => [...row]);
  const normMove = moveStr.trim().toUpperCase();

  if (normMove === 'PASS') {
    const nextPasses = state.consecutivePasses + 1;
    const isOver = nextPasses >= 2;
    return {
      ...state,
      turn: state.turn === 'B' ? 'W' : 'B',
      consecutivePasses: nextPasses,
      isGameOver: isOver,
      winner: isOver ? (state.captures.B >= state.captures.W ? 'B' : 'W') : undefined,
    };
  }

  // Parse notation e.g. "E5", "C3", "9G"
  let row = -1;
  let col = -1;

  if (normMove.length >= 2) {
    const colChar = normMove[0];
    const rowChar = normMove.slice(1);
    col = colChar.charCodeAt(0) - 'A'.charCodeAt(0);
    row = 9 - parseInt(rowChar);
  }

  if (row >= 0 && row < 9 && col >= 0 && col < 9 && !nextGrid[row][col]) {
    nextGrid[row][col] = state.turn;
  }

  const nextTurn = state.turn === 'B' ? 'W' : 'B';
  return {
    ...state,
    grid: nextGrid,
    turn: nextTurn,
    consecutivePasses: 0,
  };
}
