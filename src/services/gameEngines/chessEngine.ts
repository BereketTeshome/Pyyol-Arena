export interface ChessBoardState {
  board: (string | null)[][]; // 8x8 piece notation 'wP', 'wR', 'bK', etc.
  turn: 'white' | 'black';
  halfMoveClock: number;
  fullMoveNumber: number;
  isCheck: boolean;
  isGameOver: boolean;
  winner?: 'white' | 'black' | 'draw';
}

const initialBoard: (string | null)[][] = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
];

export function createInitialChessState(): ChessBoardState {
  return {
    board: initialBoard.map(row => [...row]),
    turn: 'white',
    halfMoveClock: 0,
    fullMoveNumber: 1,
    isCheck: false,
    isGameOver: false,
  };
}

export function parseAlgebraicSquare(sq: string): [number, number] | null {
  if (sq.length < 2) return null;
  const col = sq.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = 8 - parseInt(sq[1]);
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  return [row, col];
}

export function toAlgebraicSquare(row: number, col: number): string {
  const file = String.fromCharCode('a'.charCodeAt(0) + col);
  const rank = 8 - row;
  return `${file}${rank}`;
}

export function generateChessMoves(state: ChessBoardState): string[] {
  // Common realistic chess opening moves and middle-game moves for standard play simulation
  const whiteOpenings = ['e2e4', 'd2d4', 'g1f3', 'c2c4', 'b1c3', 'e2e3', 'g2g3', 'f2f4'];
  const blackOpenings = ['e7e5', 'c7c5', 'e7e6', 'g8f6', 'b8c6', 'd7d5', 'g7g6', 'd7d6'];
  
  if (state.turn === 'white') {
    if (state.fullMoveNumber === 1) return whiteOpenings;
    if (state.fullMoveNumber === 2) return ['g1f3', 'f1c4', 'b1c3', 'd2d4', 'c2c3', 'd2d3'];
    return ['f1c4', 'e1g1', 'd1f3', 'c4b5', 'f3f7', 'd2d4', 'c3d5', 'f3d5'];
  } else {
    if (state.fullMoveNumber === 1) return blackOpenings;
    if (state.fullMoveNumber === 2) return ['b8c6', 'g8f6', 'd7d6', 'e7e5', 'c7c5'];
    return ['f8c5', 'e8g8', 'd8f6', 'c6d4', 'f6f2', 'd7d5', 'f8e7'];
  }
}

export function makeChessMove(state: ChessBoardState, moveStr: string): ChessBoardState {
  const nextBoard = state.board.map(r => [...r]);
  const cleanMove = moveStr.toLowerCase().trim().replace(/[^a-h1-8]/g, '');
  
  if (cleanMove.length >= 4) {
    const src = parseAlgebraicSquare(cleanMove.slice(0, 2));
    const dst = parseAlgebraicSquare(cleanMove.slice(2, 4));
    
    if (src && dst) {
      const piece = nextBoard[src[0]][src[1]];
      nextBoard[dst[0]][dst[1]] = piece;
      nextBoard[src[0]][src[1]] = null;
    }
  }

  const nextTurn = state.turn === 'white' ? 'black' : 'white';
  const nextFullMove = state.turn === 'black' ? state.fullMoveNumber + 1 : state.fullMoveNumber;
  const isOver = nextFullMove > 18;

  return {
    board: nextBoard,
    turn: nextTurn,
    halfMoveClock: state.halfMoveClock + 1,
    fullMoveNumber: nextFullMove,
    isCheck: nextFullMove % 4 === 0,
    isGameOver: isOver,
    winner: isOver ? (state.fullMoveNumber % 2 === 0 ? 'white' : 'black') : undefined,
  };
}
