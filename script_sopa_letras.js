// Cargar los sonidos
const correctSound = new Audio('sounds/correct.wav'); // Sonido para cuando se encuentra una palabra
const errorSound = new Audio('sounds/error.ogg'); // Sonido para cuando la selección es incorrecta
const startSound = new Audio('sounds/start.mp3'); // Sonido al inicio del juego

const wordsList = [
    ['MANZANA', 'PLATANO', 'NARANJA', 'UVA', 'PERA'],
    ['ZANAHORIA', 'LECHUGA', 'PEPINO', 'TOMATE', 'AJO'],
    ['ROJO', 'AZUL', 'VERDE', 'AMARILLO', 'NARANJA'],
    ['PERRO', 'GATO', 'ELEFANTE', 'LEON', 'TIGRE'],
    ['MESA', 'SILLA', 'CAMA', 'ESPEJO', 'RELOJ'],
    ['CABEZA', 'BRAZO', 'PIERNA', 'MANO', 'PIE'],
    ['DOCTOR', 'MAESTRO', 'ENFERMERO', 'ABOGADO', 'INFORMATICO'],
    ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'],
    ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'JUNIO'],
    ['COCHE', 'BICICLETA', 'AUTOBUS', 'TREN', 'AVION'],
    ['GUITARRA', 'PIANO', 'VIOLIN', 'FLAUTA', 'TROMPETA'],
    ['FUTBOL', 'TENIS', 'VOLEIBOL', 'BASQUETBOL', 'CICLISMO'],
    ['CHILE', 'ARGENTINA', 'BRASIL', 'COLOMBIA', 'ESPAÑA'],
    ['SANTIAGO', 'LIMA', 'BOGOTA', 'ROMA', 'PARIS'],
    ['VENUS', 'MERCURIO', 'TIERRA', 'MARTE', 'JUPITER'],
    ['PRIMAVERA', 'VERANO', 'INVIERNO', 'OTOÑO'],
    ['LLUVIA', 'NIEVE', 'VIENTO', 'TORMENTA', 'TORNADO'],
    ['AMAZONAS', 'NILO', 'MISISIPI', 'VOLGA', 'GANGES'],
    ['EVEREST', 'ACONCAGUA', 'DENALI', 'VINSON', 'KILIMANJARO'],
    ['ATLANTICO', 'PACIFICO', 'INDICO', 'ARTICO', 'ANTARTICO'],
    ['TITICACA', 'VICTORIA', 'SUPERIOR', 'BAIKAL', 'MARACAIBO'],
    ['PASCUA', 'MALVINAS', 'MADAGASCAR', 'BALI', 'HAWAI'],
    ['PIZZA', 'PASTA', 'SUSHI', 'TACOS', 'EMPANADA'],
    ['AGUA', 'JUGO', 'BEBIDA', 'CAFE', 'TE'],
    ['HELADO', 'PASTEL', 'TARTA', 'FLAN', 'BROWNIE'],
];

let words = [...wordsList[0]]; // Inicializamos con la primera lista de palabras
const gridSize = 11;
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

// Función para verificar si todas las palabras han sido encontradas
function checkAllWordsFound() {
    const foundWords = document.querySelectorAll('li[style*="line-through"]').length;
    if (foundWords === words.length) {
        showCompletionMessage();
        confettiCelebration(); // Activar confeti
    }
}


// Función para mezclar un array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función para cargar una lista de palabras aleatoria
function loadRandomWordList() {
    // Seleccionamos una lista de palabras aleatoria
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    words = [...wordsList[randomIndex]]; // Copiar la lista aleatoria seleccionada
    shuffleArray(words); // Mezclar las palabras aleatoriamente
    createGrid(); // Regenerar la cuadrícula con las nuevas palabras
    displayWords(); // Mostrar las nuevas palabras en la lista
}

// Mostrar el mensaje de finalización con los 2 botones
function showCompletionMessage() {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'completion-message';
    messageContainer.innerHTML = `
        <div class="message-content" style="background-color: rgba(0, 0, 0, 0.7); border-radius: 10px; padding: 2% 1%">

            <h2 style="font-family: 'Courier New', Courier, monospace; color: gold; font-size: 1.4rem">¡Felicidades completaste la Sopa de Letras! Pero aún quedan más por completar...</h2>
            <button id="more-words-btn" style="background-color: #28a745; color: white; font-weight: bold; font-family: 'Courier New', Courier, monospace; font-size: 1.1rem; border-radius: 5px; cursor: pointer;">Dame más palabras</button>
            <button id="restart-btn" style="background-color: #007BFF; color: white; font-weight: bold; font-family: 'Courier New', Courier, monospace; font-size: 1rem; border-radius: 5px; cursor: pointer;">Volver al Inicio</button>
        </div>
    `;
    
    document.body.appendChild(messageContainer);
    
    // Eventos de los botones
    document.getElementById('more-words-btn').addEventListener('click', () => {
        // Llamar a la función para cargar una lista de palabras aleatoria
        loadRandomWordList();
        document.body.removeChild(messageContainer); // Remover el mensaje de completado
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirigir al usuario a index.html
    });
}

// Función para mostrar las palabras en la lista <ul>
function displayWords() {
    const wordList = document.getElementById('words-to-find');
    wordList.innerHTML = ''; // Limpiar la lista existente
    words.forEach(word => {
        const li = document.createElement('li');
        li.id = `word-${word}`;  // Asignar un ID a cada palabra
        li.textContent = word;
        wordList.appendChild(li);
    });
}

// Reproducción del confeti
function confettiCelebration() {
    // Librería de confeti básica, ej. confetti.js o confetti de canvas
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Llamar a checkAllWordsFound después de validar la selección
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
      
      // Verificar si todas las palabras han sido encontradas
      checkAllWordsFound();
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

