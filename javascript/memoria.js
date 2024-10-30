const cardsArray = [
    { name: 'oso', img: 'imagenes/animales/oso.png' },
    { name: 'leon', img: 'imagenes/animales/leon.avif' },
    { name: 'jirafa', img: 'imagenes/animales/jirafa.jpg' },
    { name: 'caballo', img: 'imagenes/animales/caballo.avif' },
    { name: 'panda', img: 'imagenes/animales/panda.avif' },
    { name: 'cebra', img: 'imagenes/animales/sebra.avif' },
    { name: 'suricata', img: 'imagenes/animales/suricata.webp' },
    { name: 'panda_rojo', img: 'imagenes/animales/panda_rojo.avif' },
    // Duplicar cada imagen para formar pares
    { name: 'oso', img: 'imagenes/animales/oso.png' },
    { name: 'leon', img: 'imagenes/animales/leon.avif' },
    { name: 'jirafa', img: 'imagenes/animales/jirafa.jpg' },
    { name: 'caballo', img: 'imagenes/animales/caballo.avif' },
    { name: 'panda', img: 'imagenes/animales/panda.avif' },
    { name: 'cebra', img: 'imagenes/animales/sebra.avif' },
    { name: 'suricata', img: 'imagenes/animales/suricata.webp' },
    { name: 'panda_rojo', img: 'imagenes/animales/panda_rojo.avif' },
];

// Arrays adicionales para Herramientas y Plantas
const toolsArray = [
    { name: 'martillo', img: 'imagenes/herramientas/martillo.jpg' },
    { name: 'destornillador', img: 'imagenes/herramientas/destornillador.avif' },
    { name: 'escuadra', img: 'imagenes/herramientas/escuadra.jpg' },
    { name: 'formon', img: 'imagenes/herramientas/formon.webp' },
    { name: 'huincha', img: 'imagenes/herramientas/huincha.png' },
    { name: 'lapiz', img: 'imagenes/herramientas/lapiz.jpg' },
    { name: 'laser', img: 'imagenes/herramientas/laser.webp' },
    { name: 'serrucho', img: 'imagenes/herramientas/serrucho.jpg' },
    // Duplicar para formar pares
    { name: 'martillo', img: 'imagenes/herramientas/martillo.jpg' },
    { name: 'destornillador', img: 'imagenes/herramientas/destornillador.avif' },
    { name: 'escuadra', img: 'imagenes/herramientas/escuadra.jpg' },
    { name: 'formon', img: 'imagenes/herramientas/formon.webp' },
    { name: 'huincha', img: 'imagenes/herramientas/huincha.png' },
    { name: 'lapiz', img: 'imagenes/herramientas/lapiz.jpg' },
    { name: 'laser', img: 'imagenes/herramientas/laser.webp' },
    { name: 'serrucho', img: 'imagenes/herramientas/serrucho.jpg' },
];

const plantsArray = [
    { name: 'rosa', img: 'imagenes/plantas/rosa.webp' },
    { name: 'girasol', img: 'imagenes/plantas/girasol.webp' },
    { name: 'cactus', img: 'imagenes/plantas/cactus.avif' },
    { name: 'tulipan', img: 'imagenes/plantas/tulipan.avif' },
    { name: 'orquidea', img: 'imagenes/plantas/orquidea.jpg' },
    { name: 'lirio', img: 'imagenes/plantas/lirio.jpg' },
    { name: 'bonsai', img: 'imagenes/plantas/bonsai.webp' },
    { name: 'lavanda', img: 'imagenes/plantas/lavanda.avif' },
    // Duplicar para formar pares
    { name: 'rosa', img: 'imagenes/plantas/rosa.webp' },
    { name: 'girasol', img: 'imagenes/plantas/girasol.webp' },
    { name: 'cactus', img: 'imagenes/plantas/cactus.avif' },
    { name: 'tulipan', img: 'imagenes/plantas/tulipan.avif' },
    { name: 'orquidea', img: 'imagenes/plantas/orquidea.jpg' },
    { name: 'lirio', img: 'imagenes/plantas/lirio.jpg' },
    { name: 'bonsai', img: 'imagenes/plantas/bonsai.webp' },
    { name: 'lavanda', img: 'imagenes/plantas/lavanda.avif' },
];

// Función para cambiar el conjunto de cartas
function changeCards(categoryArray) {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Limpiar la cuadrícula
    shuffleCards(categoryArray); // Barajar las cartas

    categoryArray.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardImage = document.createElement('img');
        cardImage.src = card.img;
        cardElement.appendChild(cardImage);

        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });

    // Reiniciar el estado del juego
    matchedPairs = 0;
    resetBoard();
}

// Eventos de los botones de cada Arrays
document.getElementById('btn-animals').addEventListener('click', () => changeCards(cardsArray));
document.getElementById('btn-tools').addEventListener('click', () => changeCards(toolsArray));
document.getElementById('btn-plants').addEventListener('click', () => changeCards(plantsArray));


let firstCard = null;
let secondCard = null;
let lockBoard = false;

function shuffleCards(array) {
    array.sort(() => 0.5 - Math.random());
}

function createBoard() {
    const board = document.getElementById('game-board');
    shuffleCards(cardsArray);

    cardsArray.forEach((card) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardImage = document.createElement('img');
        cardImage.src = card.img;
        cardElement.appendChild(cardImage);

        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}


function flipCard() {
    if (lockBoard) return;
    this.classList.add('revealed');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

// Variables y carga de sonidos
const correctSound = new Audio('sounds/correct_2.mp3');
const wrongSound = new Audio('sounds/error_2.mp3');
const winSound = new Audio('sounds/victoria.mp3');

let matchedPairs = 0; // Contador de pares encontrados


function checkForMatch() {
    if (firstCard.dataset.name === secondCard.dataset.name) {
        // Par correcto
        correctSound.play();
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchedPairs++; // Incrementa el contador de pares encontrados

        // Revisar si el jugador ha encontrado todos los pares
        if (matchedPairs === cardsArray.length / 2) {
            winSound.play();
            showConfetti();
        }

        resetBoard(); // Reiniciar las variables para el siguiente par
    } else {
        // Par incorrecto
        lockBoard = true; // Bloquear mientras las cartas se dan vuelta
        wrongSound.play();

        // Ocultar las cartas después de un breve tiempo y desbloquear
        setTimeout(() => {
            firstCard.classList.remove('revealed');
            secondCard.classList.remove('revealed');
            resetBoard(); // Reiniciar las variables para el siguiente par
        }, 1000);
    }
}

function resetBoard() {
    // Reiniciar el estado de las cartas seleccionadas y desbloquear el tablero
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function flipCard() {
    if (lockBoard || this.classList.contains('revealed')) return; // Evitar interacción si el tablero está bloqueado
    this.classList.add('revealed');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true; // Bloquear el tablero hasta que se verifique el par
    checkForMatch();
}

// Confeti
function showConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}


document.addEventListener('DOMContentLoaded', createBoard);

function resetGame() {
    location.reload(); // Recarga la página para reiniciar el juego
}

function goToHome() {
    window.location.href = 'index.html'; // Redirige a index.html
}


