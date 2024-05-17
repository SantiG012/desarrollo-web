const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];
const url = window.location.href; // Get the current URL
const urlObj = new URL(url);  // Create a URL object
const queryParams = new URLSearchParams(urlObj.search); // Get the query parameters
const { userId, userName, userAvatar } = Object.fromEntries(queryParams.entries()); // Get the userId, name, and avatar from the query parameters
const socket = new WebSocket(`ws://localhost:3000/ws/room/1?userId=${userId}&name=${userName}&avatar=${userAvatar}`);


sendButton.addEventListener("click",(e)=>{
    e.preventDefault();
    sendMessage();
    textBox.value = "";
});

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