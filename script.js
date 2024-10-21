// Cargar los sonidos
const correctSound = new Audio('sounds/correct.wav'); // Sonido para cuando se encuentra una palabra
const errorSound = new Audio('sounds/error.ogg'); // Sonido para cuando la selección es incorrecta
const startSound = new Audio('sounds/start.mp3'); // Sonido al inicio del juego

const words = ['HTML', 'CSS', 'JAVASCRIPT', 'WEB', 'CODIGO'];
const gridSize = 10;
let isSelecting = false;
let startCell = null;
let selectedCells = [];
let selectionDirection = null;

// Crear la cuadrícula
function createGrid() {
    const gridContainer = document.getElementById('word-search-grid');
    gridContainer.innerHTML = ''; // Limpiar el grid si lo regeneras
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`; // Crear columnas de igual tamaño

    // Crear una cuadrícula vacía
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(null));

    // Colocar las palabras en el tablero
    placeWordsOnGrid(grid);

    // Generar las celdas
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        const row = Math.floor(i / gridSize);
        const col = i % gridSize;
        const letter = grid[row][col] || getRandomLetter();
        cell.innerHTML = letter;
        cell.dataset.index = `${row}-${col}`;  // Asignar fila y columna
        cell.classList.add('cell');  // Asignar clase
        cell.addEventListener('mousedown', handleSelectionStart);
        cell.addEventListener('mouseover', handleSelection);
        cell.addEventListener('mouseup', handleSelectionEnd);

        // Soporte para móviles
        cell.addEventListener('touchstart', handleSelectionStartMobile);
        cell.addEventListener('touchmove', handleSelectionMobile);
        cell.addEventListener('touchend', handleSelectionEndMobile);

        gridContainer.appendChild(cell);
    }
}

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

function displayWords() {
    const wordList = document.getElementById('words-to-find');
    wordList.innerHTML = ''; // Limpiar la lista
    words.forEach(word => {
        const li = document.createElement('li');
        li.id = `word-${word}`;  // Asignar un ID a cada palabra
        li.textContent = word;
        wordList.appendChild(li);
    });
}

// Colocar las palabras en la cuadrícula
function placeWordsOnGrid(grid) {
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            // Elegir una dirección aleatoria: 0-horizontal, 1-vertical, 2-diagonal
            const direction = Math.floor(Math.random() * 3);
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);

            // Intentar colocar la palabra según la dirección
            placed = tryPlaceWord(grid, word, row, col, direction);
        }
    });
}

// Intentar colocar la palabra en una dirección
function tryPlaceWord(grid, word, row, col, direction) {
    const wordLength = word.length;
    let canPlace = true;

    // Verificar si la palabra cabe en la dirección seleccionada
    if (direction === 0) { // Horizontal
        if (col + wordLength > gridSize) return false; // Se sale del tablero
        for (let i = 0; i < wordLength; i++) {
            if (grid[row][col + i] !== null) {
                canPlace = false;
                break;
            }
        }
        if (canPlace) {
            for (let i = 0; i < wordLength; i++) {
                grid[row][col + i] = word[i];
            }
        }
    } else if (direction === 1) { // Vertical
        if (row + wordLength > gridSize) return false; // Se sale del tablero
        for (let i = 0; i < wordLength; i++) {
            if (grid[row + i][col] !== null) {
                canPlace = false;
                break;
            }
        }
        if (canPlace) {
            for (let i = 0; i < wordLength; i++) {
                grid[row + i][col] = word[i];
            }
        }
    } else if (direction === 2) { // Diagonal
        if (row + wordLength > gridSize || col + wordLength > gridSize) return false; // Se sale del tablero
        for (let i = 0; i < wordLength; i++) {
            if (grid[row + i][col + i] !== null) {
                canPlace = false;
                break;
            }
        }
        if (canPlace) {
            for (let i = 0; i < wordLength; i++) {
                grid[row + i][col + i] = word[i];
            }
        }
    }

    return canPlace;
}

function handleSelectionStart(e) {
    isSelecting = true;
    startCell = e.target;
    selectedCells = [startCell];
    startCell.classList.add('selected');
    selectionDirection = null; // Resetear la dirección al inicio de la selección
}

function handleSelection(e) {
    if (!isSelecting) return;

    const currentCell = e.target;
    const [startRow, startCol] = startCell.dataset.index.split('-').map(Number);
    const [currentRow, currentCol] = currentCell.dataset.index.split('-').map(Number);

    const deltaRow = currentRow - startRow;
    const deltaCol = currentCol - startCol;

    // Detectar la dirección de la selección al mover el ratón por primera vez
    if (!selectionDirection) {
        if (deltaRow === 0 && deltaCol !== 0) {
            selectionDirection = 'horizontal';  // Moverse horizontalmente
        } else if (deltaCol === 0 && deltaRow !== 0) {
            selectionDirection = 'vertical';    // Moverse verticalmente
        } else if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
            selectionDirection = 'diagonal';    // Moverse diagonalmente
        } else {
            return; // No es una dirección válida
        }
    }

    // Verificar que las siguientes selecciones sigan en la misma dirección
    if (
        (selectionDirection === 'horizontal' && deltaRow === 0) ||
        (selectionDirection === 'vertical' && deltaCol === 0) ||
        (selectionDirection === 'diagonal' && Math.abs(deltaRow) === Math.abs(deltaCol))
    ) {
        if (!selectedCells.includes(currentCell)) {
            selectedCells.push(currentCell);
            currentCell.classList.add('selected');
        }
    }
}

function handleSelectionEnd() {
    isSelecting = false;
    validateSelection();
}

function validateSelection() {
  const selectedWord = selectedCells.map(cell => cell.innerHTML).join('');
  if (words.includes(selectedWord)) {
      selectedCells.forEach(cell => {
          cell.classList.add('correct');
      });
      document.getElementById(`word-${selectedWord}`).style.textDecoration = 'line-through';
      document.getElementById(`word-${selectedWord}`).style.color = 'green';
      
      // Reproducir sonido de éxito
      correctSound.play();
  } else {
      selectedCells.forEach(cell => {
          cell.classList.remove('selected');
      });

      // Reproducir sonido de error
      errorSound.play();
  }
  selectedCells = [];
}


// Soporte para dispositivos móviles
function handleSelectionStartMobile(e) {
    e.preventDefault();
    handleSelectionStart(e.touches[0]);
}

function handleSelectionMobile(e) {
    e.preventDefault();
    handleSelection(e.touches[0]);
}

function handleSelectionEndMobile(e) {
    e.preventDefault();
    handleSelectionEnd();
}

// Inicializar el juego
createGrid();
displayWords();

