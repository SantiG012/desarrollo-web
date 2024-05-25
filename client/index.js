const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];
const messages = document.getElementById("messages");
const url = window.location.href; // Get the current URL
const urlObj = new URL(url);  // Create a URL object
const queryParams = new URLSearchParams(urlObj.search); // Get the query parameters
const { userId, userName, userAvatar } = Object.fromEntries(queryParams.entries()); // Get the userId, name, and avatar from the query parameters




sendButton.addEventListener("click",(e)=>{
    e.preventDefault();
    const message = textBox.value;
    sendMessage(chatMessagePayload,GameEventType.CHAT_MESSAGE);
    textBox.value = "";
});


socket.onopen = function() {
    console.log("WebSocket connection open.");
    requestEntryToGameRoom();
};

socket.onmessage = function(event) {
    handleEventType(JSON.parse(event.data));
};

function requestEntryToGameRoom(){
    sendMessage({},GameEventType.ENTER_GAME_ROOM);
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
    setPlayerInTurn(payload.roundInfo);
    const isPlayerInTurn = isPlayerInTurn(userId);
    setCanDrawCanvas(isPlayerInTurn);
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


