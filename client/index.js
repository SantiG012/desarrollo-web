const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];
const messages = document.getElementById("messages");
const url = window.location.href; // Get the current URL
const urlObj = new URL(url);  // Create a URL object
const queryParams = new URLSearchParams(urlObj.search); // Get the query parameters
const { userId, userName, userAvatar } = Object.fromEntries(queryParams.entries()); // Get the userId, name, and avatar from the query parameters
const socket = new WebSocket(`ws://localhost:3000/ws/room/1?userId=${userId}&name=${userName}&avatar=${userAvatar}`);


sendButton.addEventListener("click",(e)=>{
    e.preventDefault();
    sendMessage(GameEventType.CHAT_MESSAGE);
    textBox.value = "";
});

canvas.addEventListener("mousemove",draw);

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


function requestEntryToGameRoom(){
    socket.send(JSON.stringify({
        gameEventType: GameEventType.JOIN_GAME,
        payload: {}
    }));
}

function handleEventType(communicationInterface){
    switch(communicationInterface.gameEventType){
        case GameEventType.ROUND_NOTIFICATION:
            handleRoundNotification(communicationInterface.roundNotificationPayload);
            break;
        case GameEventType.CHAT_MESSAGE:
            handleChatMessage(communicationInterface.chatMessagePayload);
            break;
        case GameEventType.FINISH_GAME:
            handleFinishGame();
            break;
    }
}

function handleRoundNotification(payload){
    alert(payload.message);
}

function handleChatMessage(chatMessagePayload){ 
    const senderName = getSenderName(chatMessagePayload);
    const item = document.createElement('li');
    item.textContent = `${senderName}: ${chatMessagePayload.message}`
    messages.appendChild(item);
}

function handleFinishGame(){
    removeChatMessages();
    //closeConnection();
    alert("Game has finished");
}

function closeConnection(){
    socket.close();
}

function removeChatMessages(){
    while(messages.firstChild){
        messages.removeChild(messages.firstChild);
    }
}

function getSenderName(chatMessagePayload){
    if(userId === chatMessagePayload.senderId){
        return 'Tú';
    }

    return chatMessagePayload.senderName;
}



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