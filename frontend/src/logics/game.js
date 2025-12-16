function winner(gameArr,setFinishedState) {
    // indexes of winning combinations
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameArr[a] && gameArr[a] === gameArr[b] && gameArr[a] === gameArr[c]) {
            setFinishedState([...winningCombinations[i]])
            return {winner:gameArr[a] , state:"Win"};
        }
    }
    for (let i = 0; i < gameArr.length; i++) {
        if (gameArr[i] === 0) {
            return null; // Game is still ongoing
        }
    }
    return {state:'Draw',winner:null}; // It's a draw
}



export default winner;