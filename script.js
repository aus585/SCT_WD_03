// Get references to elements
const boardEl = document.getElementById("board");
const popup = document.getElementById("popup");
const winnerMessage = document.getElementById("winnerMessage");

// Game state variables
let board = Array(9).fill("");
let currentPlayer = "X";
let isGameActive = false;
let gameMode = "2";
let scores = { X: 0, O: 0 };

// Draw the Tic Tac Toe board
function drawBoard() {
  boardEl.innerHTML = "";
  board.forEach((val, idx) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.innerText = val;
    cell.onclick = () => handleClick(idx);
    boardEl.appendChild(cell);
  });
}

// Start a new game (1 or 2 player)
function startGame(mode) {
  gameMode = mode;
  board = Array(9).fill("");
  currentPlayer = "X";
  isGameActive = true;

  // Set player names
  const playerXName = document.getElementById("playerX").value || "Player X";
  const playerOName =
    mode === "1"
      ? "Computer 💻"
      : document.getElementById("playerO").value || "Player O";

  document.getElementById("nameX").innerText = playerXName;
  document.getElementById("nameO").innerText = playerOName;

  drawBoard();
}

// Handle player move
function handleClick(index) {
  if (!isGameActive || board[index]) return;

  board[index] = currentPlayer;
  drawBoard();

  // Check win or draw
  if (checkWin(currentPlayer)) return endGame(currentPlayer);
  if (board.every((v) => v)) return endGame("Draw");

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  // If 1-player mode and it's computer's turn
  if (gameMode === "1" && currentPlayer === "O") setTimeout(computerMove, 500);
}

// Computer's move logic
function computerMove() {
  let bestMove = -1;

  // Try to win or block player
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = "O";
      if (checkWin("O")) {
        board[i] = "";
        bestMove = i;
        break;
      }
      board[i] = "X";
      if (checkWin("X")) {
        board[i] = "";
        bestMove = i;
        break;
      }
      board[i] = "";
    }
  }

  // Pick random if no strategic move found
  if (bestMove === -1) {
    let empty = board
      .map((v, i) => (v === "" ? i : null))
      .filter((v) => v !== null);
    bestMove = empty[Math.floor(Math.random() * empty.length)];
  }

  board[bestMove] = "O";
  drawBoard();

  if (checkWin("O")) return endGame("O");
  if (board.every((v) => v)) return endGame("Draw");

  currentPlayer = "X";
}

// Check if given player has won
function checkWin(player) {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  return winPatterns.some((pattern) => {
    if (pattern.every((i) => board[i] === player)) {
      drawWinLine(pattern); // Draw win line if matched
      return true;
    }
    return false;
  });
}

// Draw line across winning pattern
function drawWinLine(pattern) {
  const cellEls = document.querySelectorAll(".cell");
  const boardRect = boardEl.getBoundingClientRect();
  const rect1 = cellEls[pattern[0]].getBoundingClientRect();
  const rect3 = cellEls[pattern[2]].getBoundingClientRect();

  // Get center positions of start and end cells
  const x1 = rect1.left + rect1.width / 2 - boardRect.left;
  const y1 = rect1.top + rect1.height / 2 - boardRect.top;
  const x2 = rect3.left + rect3.width / 2 - boardRect.left;
  const y2 = rect3.top + rect3.height / 2 - boardRect.top;

  // Create and position the win line
// Create and position the win line
const line = document.createElement("div");
line.className = "win-line";

const angle = Math.atan2(y2 - y1, x2 - x1);
const shorten = 12; // Increase to 15 or 20 if needed

line.style.left = `${x1 + Math.cos(angle) * shorten}px`;
line.style.top = `${y1 + Math.sin(angle) * shorten}px`;
line.style.width = `${Math.hypot(x2 - x1, y2 - y1) - shorten * 2}px`;
line.style.transform = `rotate(${(angle * 180) / Math.PI}deg)`;

boardEl.appendChild(line);
}

// End game and show popup
function endGame(winner) {
  isGameActive = false;

  if (winner !== "Draw") {
    scores[winner]++; // Update score

    // Update score display
    document.getElementById("scoreX").innerHTML = `💧 <span id="nameX">${
      document.getElementById("nameX").innerText
    }</span>: ${scores.X}`;
    document.getElementById("scoreO").innerHTML = `🔥 <span id="nameO">${
      document.getElementById("nameO").innerText
    }</span>: ${scores.O}`;

    // Show winner message
    winnerMessage.innerHTML = `${winner === "X" ? "💧" : "🔥"} <strong>${
      winner === "X"
        ? document.getElementById("nameX").innerText
        : document.getElementById("nameO").innerText
    }</strong> Wins! 🎉`;
    spawnConfetti(100);
  } else {
    winnerMessage.innerHTML = `🤝 It's a Draw!`;
  }

  popup.style.display = "block"; // Show result popup
}

// Reset game board and state
function resetGame() {
  popup.style.display = "none";
  document.querySelectorAll(".confetti").forEach((el) => el.remove());
  document.querySelectorAll(".win-line").forEach((el) => el.remove());
  startGame(gameMode);
}

// Reload the page to exit the game
function exitGame() {
  location.reload();
}

// Confetti animation on win
function spawnConfetti(count) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `-10px`;
    confetti.style.backgroundColor = ["#ffcc00", "#00bcd4", "#ff4081"][
      Math.floor(Math.random() * 3)
    ];
    confetti.style.zIndex = 20;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000); // Remove after 3 seconds
  }
}
