const boardEl = document.getElementById("board");
const popup = document.getElementById("popup");
const winnerMessage = document.getElementById("winnerMessage");

let board = Array(9).fill("");
let currentPlayer = "X";
let isGameActive = false;
let gameMode = "2";
let scores = { X: 0, O: 0 };

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

function startGame(mode) {
  gameMode = mode;
  board = Array(9).fill("");
  currentPlayer = "X";
  isGameActive = true;

  document.getElementById("nameX").innerText =
    document.getElementById("playerX").value || "Player X";

  document.getElementById("nameO").innerText =
    mode === "1"
      ? "Computer 💻"
      : document.getElementById("playerO").value || "Player O";

  drawBoard();
}

function handleClick(index) {
  if (!isGameActive || board[index]) return;

  board[index] = currentPlayer;
  drawBoard();

  if (checkWin(currentPlayer)) return endGame(currentPlayer);
  if (board.every(v => v)) return endGame("Draw");

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "1" && currentPlayer === "O")
    setTimeout(computerMove, 400);
}

function computerMove() {
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move = empty[Math.floor(Math.random()*empty.length)];

  board[move] = "O";
  drawBoard();

  if (checkWin("O")) return endGame("O");
  if (board.every(v=>v)) return endGame("Draw");

  currentPlayer = "X";
}

function checkWin(p) {
  const win = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return win.some(pattern =>
    pattern.every(i => board[i] === p)
  );
}

function endGame(winner) {
  isGameActive = false;

  if (winner !== "Draw") {
    scores[winner]++;
    winnerMessage.innerText = `${winner} Wins! 🎉`;
  } else {
    winnerMessage.innerText = "Draw!";
  }

  popup.style.display = "block";
}

function resetGame() {
  popup.style.display = "none";
  startGame(gameMode);
}

function exitGame() {
  location.reload();
}
