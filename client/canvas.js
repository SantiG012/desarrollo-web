const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");


const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let isPainting = false;
let startX;
let startY;

const draw = (e) => {
    console.log("Drawing");
    if (!isPainting) {
      return;
    }
  
    ctx.lineWidth = 5;
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