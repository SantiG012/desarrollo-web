const canvas = document.getElementById("drawing-board");
const toolbar = document.getElementById("toolbar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

toolbar.addEventListener("change", (e) => {
  if (e.target.id === "color") {
    ctx.strokeStyle = e.target.value;
  }

  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

const draw = (e) => {
  if (!isPainting) {
    return;
  }

  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";

  ctx.lineTo(e.clientX - canvasOffsetX, e.clientY);
  ctx.stroke();
};

canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mouseup", (e) => {
  isPainting = false;
  ctx.stroke();
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

// Lista de palabras aleatorias
const words = ['Manzana', 'Banana', 'Cereza', 'Damasco', 'Fresa', 'Granada', 'Kiwi', 'Limon', 'Mango', 'Naranja', 'Pera', 'Uva'];

function showRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  const word = words[randomIndex];
  
  const popup = document.getElementById('popup');
  const popupWord = document.getElementById('popupWord');
  
  popupWord.textContent = word;
  popup.style.display = 'block';
  
  setTimeout(() => {
    popup.style.display = 'none';
  }, 5000); // 5 segundos
}

// Llamar a la función para mostrar la palabra aleatoria cuando la página se carga
window.addEventListener('DOMContentLoaded', () => {
  showRandomWord();
});


// Temporizador
let timeLeft = 180; // 180 segundos

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  document.getElementById('timer').textContent = `${formattedMinutes}:${formattedSeconds}`;

  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    alert('Tiempo finalizado');
  }
}

updateTimer(); // Iniciar el temporizador al cargar la página

// Chat
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

document.getElementById('send-message').addEventListener('click', function() {
  const message = chatInput.value;
  if (message.trim() !== '') {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatInput.value = '';
  }
});

chatInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById('send-message').click();
  }
});
