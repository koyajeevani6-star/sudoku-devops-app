const boardElement = document.getElementById("sudoku-board");
const numberPadButtons = document.querySelectorAll(".number-pad button");
const newGameBtn = document.getElementById("new-game-btn");
const eraseBtn = document.getElementById("erase-btn");
const solveBtn = document.getElementById("solve-btn");

let selectedCell = null;
let seconds = 0;

function createBoard(board) {
  boardElement.innerHTML = "";

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if ((col + 1) % 3 === 0 && col !== 8) {
        cell.classList.add("border-right");
      }

      if ((row + 1) % 3 === 0 && row !== 8) {
        cell.classList.add("border-bottom");
      }

      if (board[row][col] !== 0) {
        cell.textContent = board[row][col];
        cell.classList.add("prefilled");
      }

      cell.dataset.row = row;
      cell.dataset.col = col;

      cell.addEventListener("click", () => {
        document.querySelectorAll(".cell").forEach(c => c.classList.remove("selected"));
        cell.classList.add("selected");
        selectedCell = cell;
      });

      boardElement.appendChild(cell);
    }
  }
}

numberPadButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (selectedCell && !selectedCell.classList.contains("prefilled")) {
      selectedCell.textContent = button.textContent;
    }
  });
});

eraseBtn.addEventListener("click", () => {
  if (selectedCell && !selectedCell.classList.contains("prefilled")) {
    selectedCell.textContent = "";
  }
});

solveBtn.addEventListener("click", async () => {
  let board = [];

  document.querySelectorAll(".cell").forEach((cell, index) => {
    const row = Math.floor(index / 9);
    if (!board[row]) board[row] = [];

    const value = cell.textContent.trim();
    board[row].push(value === "" ? 0 : parseInt(value));
  });

  try {
    const response = await fetch("/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ board: board })
    });

    const result = await response.json();

    if (result.status === "solved") {
      document.querySelectorAll(".cell").forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        cell.textContent = result.board[row][col];
      });
    } else {
      alert("No solution exists!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong while solving.");
  }
});

newGameBtn.addEventListener("click", () => {
  location.reload();
});

function startTimer() {
  setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${mins}:${secs}`;
  }, 1000);
}

createBoard(initialBoard);
startTimer();