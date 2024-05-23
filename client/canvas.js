const canvas = document.getElementById("drawing-board");
const ctx = canvas.getContext("2d");

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