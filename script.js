const words = ["HTML", "CSS", "JAVASCRIPT", "WEB", "CODIGO"];
const gridSize = 10;
let board = [];
let selectedCells = [];
let foundWords = new Set();

// Inicializa el tablero con espacios vacíos
function initializeBoard() {
  board = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));
}

// Coloca las palabras en el tablero en posiciones aleatorias (horizontal, vertical, diagonal)
function placeWords() {
  words.forEach(word => {
    let placed = false;

    while (!placed) {
      const direction = Math.floor(Math.random() * 3); // 0 = horizontal, 1 = vertical, 2 = diagonal
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (canPlaceWord(word, row, col, direction)) {
        placeWord(word, row, col, direction);
        placed = true;
      }
    }
  });
}

// Verifica si una palabra puede ser colocada en una dirección específica
function canPlaceWord(word, row, col, direction) {
  if (direction === 0 && col + word.length > gridSize) return false; // Horizontal
  if (direction === 1 && row + word.length > gridSize) return false; // Vertical
  if (direction === 2 && (row + word.length > gridSize || col + word.length > gridSize)) return false; // Diagonal

  for (let i = 0; i < word.length; i++) {
    const newRow = direction === 1 || direction === 2 ? row + i : row;
    const newCol = direction === 0 || direction === 2 ? col + i : col;

    if (board[newRow][newCol] !== "" && board[newRow][newCol] !== word[i]) {
      return false; // Ya hay una letra diferente en la posición
    }
  }

  return true;
}

// Coloca la palabra en el tablero
function placeWord(word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    const newRow = direction === 1 || direction === 2 ? row + i : row;
    const newCol = direction === 0 || direction === 2 ? col + i : col;

    board[newRow][newCol] = word[i];
  }
}

// Rellena el tablero con letras aleatorias en las celdas vacías
function fillEmptySpaces() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (board[row][col] === "") {
        board[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// Dibuja el tablero en la página
function drawBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = ""; // Limpia el tablero anterior

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.textContent = board[row][col];
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.classList.add("cell");

      // Añadir eventos de mouse y touch para la selección
      cell.addEventListener("mousedown", startSelection);
      cell.addEventListener("mouseenter", continueSelection);
      cell.addEventListener("mouseup", endSelection);

      // Añadir eventos táctiles para dispositivos móviles
      cell.addEventListener("touchstart", startSelectionTouch);
      cell.addEventListener("touchmove", continueSelectionTouch);
      cell.addEventListener("touchend", endSelectionTouch);

      gameBoard.appendChild(cell);
    }
  }
}

// Maneja el inicio de la selección con mouse
function startSelection(e) {
  selectedCells = [];
  e.target.classList.add("selected");
  selectedCells.push(e.target);
}

// Maneja la continuación de la selección con mouse
function continueSelection(e) {
  if (e.buttons === 1) { // Solo continúa si se está presionando el botón del mouse
    if (!selectedCells.includes(e.target)) {
      e.target.classList.add("selected");
      selectedCells.push(e.target);
    }
  }
}

// Maneja el fin de la selección con mouse
function endSelection() {
  processSelection();
}

// Maneja el inicio de la selección táctil
function startSelectionTouch(e) {
  selectedCells = [];
  const targetCell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  targetCell.classList.add("selected");
  selectedCells.push(targetCell);
}

// Maneja la continuación de la selección táctil
function continueSelectionTouch(e) {
  const targetCell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if (!selectedCells.includes(targetCell)) {
    targetCell.classList.add("selected");
    selectedCells.push(targetCell);
  }
}

// Maneja el fin de la selección táctil
function endSelectionTouch() {
  processSelection();
}

// Procesa la selección y verifica si una palabra ha sido encontrada
function processSelection() {
  const selectedWord = selectedCells.map(cell => cell.textContent).join("");
  const reversedWord = selectedCells.map(cell => cell.textContent).reverse().join("");

  if (words.includes(selectedWord) || words.includes(reversedWord)) {
    selectedCells.forEach(cell => {
      cell.classList.add("found");
    });
    foundWords.add(selectedWord);
  }

  selectedCells.forEach(cell => cell.classList.remove("selected"));
  selectedCells = [];
  checkFoundWords();
}

// Actualiza la lista de palabras encontradas
function checkFoundWords() {
  const wordListItems = document.querySelectorAll("#word-list li");
  wordListItems.forEach(item => {
    if (foundWords.has(item.textContent)) {
      item.classList.add("found-word");
    }
  });
}

// Inicia el juego
document.addEventListener("DOMContentLoaded", () => {
  initializeBoard();
  placeWords();
  fillEmptySpaces();
  drawBoard();
  addWordsToList();
});

function addWordsToList() {
  const wordList = document.getElementById("word-list");
  words.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    wordList.appendChild(li);
  });
}

