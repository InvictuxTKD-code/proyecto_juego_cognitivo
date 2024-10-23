const grid = document.getElementById('grid');
const objectiveButton = document.getElementById('objective');
const messageDiv = document.getElementById('message');
const newChallengeButton = document.getElementById('newChallenge');
const menuButton = document.getElementById('menu');
const errorSound = new Audio('sounds/error.ogg'); // Ruta al archivo de sonido
const successSound = new Audio('sounds/correct.wav'); // Ruta al archivo de sonido de éxito


let currentObjective;
const gridSize = 10; // 10 filas y 10 columnas, o sea, 100 celdas

// Generar la cuadrícula
function generateGrid() {
    grid.innerHTML = '';
    const characters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '3', '4',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        '5', '6', '7', '8', '9', '0', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'I', 'J', '2', 'L', 'M', 'N', '7', 'P', 'Q', 'R', 'P',
    ];

    characters.sort(() => Math.random() - 0.5); // Mezclar los caracteres

    characters.slice(0, gridSize * gridSize).forEach(char => {
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
        case "Encontrar Letras Mayúsculas":
            return char => char === char.toUpperCase() && isNaN(char);
        case "Encontrar Todas las Letras":
            return char => isNaN(char);
        case "Encontrar Todos los Números":
            return char => !isNaN(char);
        case "Encontrar todas las minúsculas": // Lógica para el nuevo objetivo
            return char => char === char.toLowerCase() && isNaN(char);
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
            if (evenCount === 9) { // Cambia 9 por el número total de pares en la cuadrícula
                showWinMessage();
            }
            break;
        case "Encontrar Letras Mayúsculas":
            const uppercaseCount = [...highlightedCells].filter(cell => cell.textContent === cell.textContent.toUpperCase()).length;
            if (uppercaseCount === 12) { // Cambia 12 por el número total de letras mayúsculas
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
        case "Encontrar todas las minúsculas": // Nueva condición de victoria para minúsculas
            const lowercaseCount = [...highlightedCells].filter(cell => cell.textContent === cell.textContent.toLowerCase() && isNaN(cell.textContent)).length;
            const totalLowercase = [...document.querySelectorAll('.cell')].filter(cell => cell.textContent === cell.textContent.toLowerCase() && isNaN(cell.textContent)).length;
            if (lowercaseCount === totalLowercase) {
                showWinMessage();
            }
            break;
    }
}

// Función para resaltar celdas y manejar errores o éxitos
function highlightCell(cell, char) {
    const checkFunction = getCheckFunction(currentObjective);

    if (checkFunction(char)) {
        if (!cell.classList.contains('highlight')) { // Solo marcar si aún no ha sido resaltada
            cell.classList.add('success'); // Marcar en verde si es correcto
            cell.classList.add('highlight'); // Añadir la clase highlight para la lógica del juego
            successSound.play(); // Reproducir sonido de éxito
        }
        checkWinCondition(); // Verificar si se ha ganado
    } else {
        cell.classList.add('error'); // Marcar en rojo si es incorrecto
        errorSound.play(); // Reproducir sonido de error
        setTimeout(() => {
            cell.classList.remove('error'); // Quitar la clase de error después de un breve momento
        }, 1000); // Mantener el rojo por 1 segundo
    }
}

function showWinMessage() {
    // Estilos personalizados para el mensaje de victoria
    messageDiv.innerHTML = `
        <div class="message-content" style="background-color: rgba(0, 0, 0, 0.7); border-radius: 10px; padding: 2% 1%; text-align: center;"> 
            <h2 style="font-family: 'Courier New', Courier, monospace; color: gold; font-size: 1.4rem;">¡Felicidades, lo haz conseguido! Pero aún quedan más objetivos por completar...</h2>
            <button id="more-words-btn" style="background-color: #28a745; color: white; font-weight: bold; font-family: 'Courier New', Courier, monospace; font-size: 1.1rem; border-radius: 5px; padding: 10px 20px; cursor: pointer;">Dame otro reto</button>
            <button id="restart-btn" style="background-color: #007BFF; color: white; font-weight: bold; font-family: 'Courier New', Courier, monospace; font-size: 1rem; border-radius: 5px; padding: 10px 20px; cursor: pointer; margin-left: 10px;">Volver al Inicio</button>
        </div>
    `;
    messageDiv.classList.remove('hidden');

    // Mostrar botones adicionales
    newChallengeButton.classList.remove('hidden');
    menuButton.classList.remove('hidden');
    grid.classList.add('hidden'); // Ocultar la cuadrícula
    objectiveButton.classList.add('hidden'); // Ocultar el botón de objetivo

    // Evento para el botón "Dame más palabras"
    document.getElementById('more-words-btn').addEventListener('click', () => {
        messageDiv.classList.add('hidden');
        newChallengeButton.classList.add('hidden');
        menuButton.classList.add('hidden');
        grid.classList.remove('hidden');
        objectiveButton.classList.remove('hidden');
        changeObjective(); // Generar un nuevo reto
    });

    // Evento para el botón "Volver al Inicio"
    document.getElementById('restart-btn').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirigir al menú de inicio
    });

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
        "Encontrar Todas las Letras",
        "Encontrar Todos los Números",
        "Encontrar todas las minúsculas", // Nuevo objetivo añadido
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

