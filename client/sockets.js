const url = window.location.href; // Get the current URL
const urlObj = new URL(url);  // Create a URL object
const queryParams = new URLSearchParams(urlObj.search); // Get the query parameters
const { userId, userName, userAvatar } = Object.fromEntries(queryParams.entries()); // Get the userId, name, and avatar from the query parameters
const socket = new WebSocket(`ws://localhost:3000/ws/room/1?userId=${userId}&name=${userName}&avatar=${userAvatar}`);

socket.onopen = function(communicationInterface) {
    console.log("WebSocket connection open.");
    requestEntryToGameRoom();
};

socket.onmessage = function(event) {
    handleEventType(JSON.parse(event.data));
};

socket.onerror = function(error) {
    console.error("WebSocket error:", error);
};

socket.onclose = function(){
    socket.close()
}

function sendMessage(gameEventType){
    const message = textBox.value
    socket.send(JSON.stringify({
        gameEventType,
        chatMessagePayload: {
            message,
            senderId: userId,
            senderName: userName,
        }
    }));
}

function closeConnection(){
    socket.close();
}

function requestEntryToGameRoom(){
    socket.send(JSON.stringify({
        gameEventType: GameEventType.JOIN_GAME,
        payload: {}
    }));
}