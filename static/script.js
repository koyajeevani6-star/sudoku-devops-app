const boardElement = document.getElementById("sudoku-board");
const numberPadButtons = document.querySelectorAll(".number-pad button");
const newGameBtn = document.getElementById("new-game-btn");
const eraseBtn = document.getElementById("erase-btn");
const solveBtn = document.getElementById("solve-btn");
const hintBtn = document.getElementById("hint-btn");
const levelButtons = document.querySelectorAll(".level");

let selectedCell = null;
let seconds = 0;
let timerInterval = null;
let currentLevel = "easy";

const solvedBoard = [
  [9, 6, 2, 3, 7, 8, 4, 1, 5],
  [1, 8, 5, 4, 2, 9, 7, 6, 3],
  [3, 7, 4, 5, 6, 1, 9, 2, 8],
  [4, 9, 6, 8, 3, 2, 1, 5, 7],
  [2, 1, 8, 7, 4, 5, 3, 9, 6],
  [7, 5, 3, 1, 9, 6, 2, 8, 4],
  [5, 3, 1, 9, 8, 4, 6, 7, 2],
  [8, 2, 7, 6, 1, 3, 5, 4, 9],
  [6, 4, 9, 2, 5, 7, 8, 3, 1]
];

const blanksByLevel = {
  easy: 25,
  medium: 35,
  hard: 45,
  expert: 52,
  master: 58,
  extreme: 64
};

function deepCopyBoard(board) {
  return board.map(row => [...row]);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePuzzle(level) {
  const puzzle = deepCopyBoard(solvedBoard);
  const blanks = blanksByLevel[level];
  const positions = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }

  shuffle(positions);

  for (let i = 0; i < blanks; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }

  return puzzle;
}

function resetTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById("timer").textContent = "00:00";

  timerInterval = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${mins}:${secs}`;
  }, 1000);
}

function createBoard(board) {
  boardElement.innerHTML = "";
  selectedCell = null;

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

function loadLevel(level) {
  currentLevel = level;
  const puzzle = generatePuzzle(level);
  createBoard(puzzle);
  resetTimer();
}

function getBoardFromUI() {
  let board = [];

  document.querySelectorAll(".cell").forEach((cell, index) => {
    const row = Math.floor(index / 9);
    if (!board[row]) board[row] = [];

    const value = cell.textContent.trim();
    board[row].push(value === "" ? 0 : parseInt(value));
  });

  return board;
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
  const board = getBoardFromUI();

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

hintBtn.addEventListener("click", async () => {
  const board = getBoardFromUI();

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
      const cells = document.querySelectorAll(".cell");

      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains("prefilled") && cells[i].textContent.trim() === "") {
          const row = Math.floor(i / 9);
          const col = i % 9;
          cells[i].textContent = result.board[row][col];
          break;
        }
      }
    } else {
      alert("No hint available!");
    }
  } catch (error) {
    console.error("Hint Error:", error);
  }
});

newGameBtn.addEventListener("click", () => {
  loadLevel(currentLevel);
});

levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    levelButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    loadLevel(button.dataset.level);
  });
});

loadLevel("easy");