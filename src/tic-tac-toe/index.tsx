import { useState } from "react";
import type { CellTypes } from "./types";

const ROW_SIZE = 3;
const COL_SIZE = 3;

function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== ""));
}

function checkWinner(board, row, col) {
  const player = board[row][col];
  const size = ROW_SIZE;

  // Check row
  let count = 0;
  for (let c = 0; c < size; c++) {
    if (board[row][c] === player) count++;
  }
  if (count === size) return player;

  // Check column
  count = 0;
  for (let r = 0; r < size; r++) {
    if (board[r][col] === player) count++;
  }
  if (count === size) return player;

  // Check main diagonal (top-left to bottom-right)
  if (row === col) {
    count = 0;
    for (let i = 0; i < size; i++) {
      if (board[i][i] === player) count++;
    }
    if (count === size) return player;
  }

  // Check anti-diagonal (top-right to bottom-left)
  if (row + col === size - 1) {
    count = 0;
    for (let i = 0; i < size; i++) {
      if (board[i][size - 1 - i] === player) count++;
    }
    if (count === size) return player;
  }

  return null;
}

function TicTacToe() {
  const [grid, setGrid] = useState(
    Array.from({ length: ROW_SIZE }, () =>
      Array.from({ length: COL_SIZE }, () => "")
    )
  );
  const [next, setNext] = useState("X");
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  function handleClick(r, c) {
    // Prevent moves if game is over or cell is filled
    if (gameOver || grid[r][c]) {
      return;
    }

    // Create deep copy of grid
    const newGrid = grid.map((row) => [...row]);

    // Place current player's mark
    newGrid[r][c] = next;

    // Update grid state
    setGrid(newGrid);

    // Check for winner after this move
    const gameWinner = checkWinner(newGrid, r, c);
    if (gameWinner) {
      setWinner(gameWinner);
      setGameOver(true);
      return;
    }

    // Check for draw
    if (isBoardFull(newGrid)) {
      setGameOver(true);
      return;
    }

    // Toggle to next player
    setNext((prev) => (prev === "X" ? "O" : "X"));
  }

  return (
    <div>
      <div className="flex">
        Game Done: <h1>{winner} ✅ 🎊</h1>
      </div>
      <div
        className="grid gap-1 w-[600px] h-[500px]"
        style={{ gridTemplateColumns: `repeat(${COL_SIZE}, 1fr)` }}
      >
        {grid.map((row, idx) => {
          return row.map((col, ix) => (
            <button
              onClick={() => handleClick(idx, ix)}
              key={`${idx}-${ix}`}
              className="w-full h-full border border-[#ddd] text-2xl font-bold"
            >
              {col}
            </button>
          ));
        })}
      </div>
    </div>
  );
}

export default TicTacToe;

function Cell({}: CellTypes) {
  return <button></button>;
}
