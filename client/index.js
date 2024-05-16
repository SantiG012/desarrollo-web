const socket = new WebSocket("ws://localhost:3000/ws/room/1?userId=s1r&name=santi&avatar=s");
const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];




sendButton.addEventListener("click",sendMessage);

function sendMessage(){
    const message = textBox.value
    socket.send(message);
}



socket.onopen = function(event) {
    console.log("WebSocket connection established.");
};

socket.onmessage = function(event) {
    console.log("Message received:", event.data);
};

socket.onerror = function(error) {
    console.error("WebSocket error:", error);
};