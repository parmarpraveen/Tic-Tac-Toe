function findBestMove(board, player) {
  const opponent = player === "X" ? "O" : "X";

  function checkWinner(b) {
    const wins = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    for (const [a,b,c] of wins)
      if (b[a] && b[a] === b[b] && b[a] === b[c]) return b[a];
    return b.includes(0) ? null : "Draw";
  }

  function minimax(b, isMax) {
    const result = checkWinner(b);
    if (result === player) return 1;
    if (result === opponent) return -1;
    if (result === "Draw") return 0;

    if (isMax) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === 0) {
          b[i] = player;
          best = Math.max(best, minimax(b, false));
          b[i] = 0;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === 0) {
          b[i] = opponent;
          best = Math.min(best, minimax(b, true));
          b[i] = 0;
        }
      }
      return best;
    }
  }

  let bestMove = -1, bestVal = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      board[i] = player;
      const moveVal = minimax(board, false);
      board[i] = 0;
      if (moveVal > bestVal) {
        bestMove = i;
        bestVal = moveVal;
      }
    }
  }
  return bestMove;
}
export default findBestMove;