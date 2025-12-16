

function Square({
  handleLocalMove,
  index,
  winner,
  finishedState,
  turn,
  value
}) {
  const handleClick = () => {
    // Only allow clicks on empty squares when no winner and it's player's turn
    if (!winner && value === 0 && turn) {
      handleLocalMove(index);
    }
  };

  // Check if this square is part of winning combination
  const isWinningSquare = finishedState?.includes(index);

  // Determine display value
  const displayValue = value === "X" || value === "O" ? value : "";

  // Determine if the square is clickable
  const isClickable = !winner && value === 0 && turn;

  return (
    <button
      className={`
        w-24 h-24
        text-8xl font-semibold
        flex items-center justify-center
        rounded-lg
        transition-all duration-200
        ${isClickable ? "hover:bg-blue-100 cursor-pointer" : ""}
        ${isWinningSquare ? "bg-green-200 border-green-500" : "bg-blue-700"}
        ${value === "X" ? "text-white" : ""}
        ${value === "O" ? "text-white" : ""}

      `}
      onClick={handleClick}
      disabled={!turn || value !== 0 || winner}
    >
      {displayValue}
    </button>
  );
}

export default Square;
