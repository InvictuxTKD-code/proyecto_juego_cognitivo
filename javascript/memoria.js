const cardsArray = [
    { name: 'oso', img: 'imagenes/oso.avif' },
    { name: 'leon', img: 'imagenes/leon.avif' },
    { name: 'jirafa', img: 'imagenes/jirafa.jpg' },
    { name: 'caballo', img: 'imagenes/caballo.avif' },
    { name: 'panda', img: 'imagenes/panda.avif' },
    { name: 'sebra', img: 'imagenes/sebra.avif' },
    { name: 'suricata', img: 'imagenes/suricata.webp' },
    { name: 'panda_rojo', img: 'imagenes/panda_rojo.avif' },
    { name: 'oso', img: 'imagenes/oso.avif' },
    { name: 'leon', img: 'imagenes/leon.avif' },
    { name: 'jirafa', img: 'imagenes/jirafa.jpg' },
    { name: 'caballo', img: 'imagenes/caballo.avif' },
    { name: 'panda', img: 'imagenes/panda.avif' },
    { name: 'sebra', img: 'imagenes/sebra.avif' },
    { name: 'suricata', img: 'imagenes/suricata.webp' },
    { name: 'panda_rojo', img: 'imagenes/panda_rojo.avif' },
    // Agrega más pares de imágenes
];

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


