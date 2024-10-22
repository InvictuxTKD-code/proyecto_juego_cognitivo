// script.js
const grid = document.getElementById('grid');
const objectiveButton = document.getElementById('objective');
const messageDiv = document.getElementById('message');
const newChallengeButton = document.getElementById('newChallenge');
const menuButton = document.getElementById('menu');

let currentObjective;

// Generar la cuadrícula
function generateGrid() {
    grid.innerHTML = '';
    const characters = ['A', 'B', 'C', '1', '2', '3', 'D', 'E', '4', 'F', 'G', '5', 'H', 'I', '6', 'J', '1', 'A', 'Z', '3'];
    characters.sort(() => Math.random() - 0.5); // Mezclar los caracteres

    characters.forEach(char => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = char;
        cell.addEventListener('click', () => highlightCell(cell, char));
        grid.appendChild(cell);
    });
}

// Función para resaltar celdas
function highlightCell(cell, char) {
    const checkFunction = getCheckFunction(currentObjective);
    if (checkFunction(char)) {
        cell.classList.toggle('highlight');
        checkWinCondition();
    }
}

// Función para obtener la lógica del reto actual
function getCheckFunction(objective) {
    switch (objective) {
        case "Identificar Números":
            return char => !isNaN(char);
        case "Encontrar Números Pares":
            return char => char % 2 === 0;
        case "Encontrar solo el 1":
            return char => char === '1';
        case "Encontrar Letras Mayúsculas":
            return char => char === char.toUpperCase() && isNaN(char);
        case "Encontrar solo la letra A":
            return char => char === 'A';
        case "Encontrar Todas las Letras":
            return char => isNaN(char);
        case "Encontrar Todos los Números":
            return char => !isNaN(char);
        default:
            return () => false;
    }
}

// Comprobar si el jugador ha ganado
function checkWinCondition() {
    const highlightedCells = document.querySelectorAll('.cell.highlight');

    switch (currentObjective) {
        case "Identificar Números":
            if (highlightedCells.length === document.querySelectorAll('.cell').length) {
                showWinMessage();
            }
            break;
        case "Encontrar Números Pares":
            const evenCount = [...highlightedCells].filter(cell => cell.textContent % 2 === 0).length;
            if (evenCount === 3) { // Cambia 3 por el número total de pares en la cuadrícula
                showWinMessage();
            }
            break;
        case "Encontrar solo el 1":
            if (highlightedCells.length === 1 && highlightedCells[0].textContent === '1') {
                showWinMessage();
            }
            break;
        case "Encontrar Letras Mayúsculas":
            const uppercaseCount = [...highlightedCells].filter(cell => cell.textContent === cell.textContent.toUpperCase()).length;
            if (uppercaseCount === 12) { // Cambia 3 por el número total de letras mayúsculas en la cuadrícula
                showWinMessage();
            }
            break;
        case "Encontrar solo la letra A":
            if (highlightedCells.length === 1 && highlightedCells[0].textContent === 'A') {
                showWinMessage();
            }
            break;
        case "Encontrar Todas las Letras":
            const letterCount = highlightedCells.length;
            const totalLetters = [...document.querySelectorAll('.cell')].filter(cell => isNaN(cell.textContent)).length;
            if (letterCount === totalLetters) {
                showWinMessage();
            }
            break;
        case "Encontrar Todos los Números":
            const numberCount = highlightedCells.length;
            const totalNumbers = [...document.querySelectorAll('.cell')].filter(cell => !isNaN(cell.textContent)).length;
            if (numberCount === totalNumbers) {
                showWinMessage();
            }
            break;
    }
}

// Mostrar mensaje de éxito y confeti
function showWinMessage() {
    messageDiv.textContent = "¡Lo has conseguido!";
    messageDiv.classList.remove('hidden');
    newChallengeButton.classList.remove('hidden');
    menuButton.classList.remove('hidden');
    grid.classList.add('hidden'); // Ocultar la cuadrícula
    objectiveButton.classList.add('hidden'); // Ocultar el botón de objetivo

    // Efecto de confeti
    const duration = 3 * 1000; // Duración en milisegundos
    const animationEnd = Date.now() + duration;
    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        gravity: 0.3,
        scalar: 1,
    };

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        const particleCount = 50 * (timeLeft / duration);
        confetti({
            ...defaults,
            particleCount: Math.floor(particleCount),
            origin: {
                x: Math.random(),
                y: Math.random() - 0.2,
            },
        });

        requestAnimationFrame(frame);
    })();
}

// Cambiar objetivo al hacer clic
function changeObjective() {
    const objectives = [
        "Encontrar Números Pares",
        "Encontrar solo el 1",
        "Encontrar Letras Mayúsculas",
        "Encontrar solo la letra A",
        "Encontrar Todas las Letras",
        "Encontrar Todos los Números"
    ];
    currentObjective = objectives[Math.floor(Math.random() * objectives.length)];
    objectiveButton.textContent = currentObjective;
    generateGrid();
}

// Botón de nuevo reto
newChallengeButton.addEventListener('click', () => {
    messageDiv.classList.add('hidden');
    newChallengeButton.classList.add('hidden');
    menuButton.classList.add('hidden');
    grid.classList.remove('hidden');
    objectiveButton.classList.remove('hidden');
    changeObjective();
});

// Botón de menú
menuButton.addEventListener('click', () => {
    window.location.href = 'index.html'; // Cambia a tu archivo de menú
});

// Inicializar el juego
changeObjective();
