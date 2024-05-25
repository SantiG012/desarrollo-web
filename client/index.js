const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];
const messages = document.getElementById("messages");


sendButton.addEventListener("click",(e)=>{
    e.preventDefault();
    const message = textBox.value;
    const chatMessagePayload = {message, senderId: userId, senderName: userName};
    sendMessage(chatMessagePayload,GameEventType.CHAT_MESSAGE);
    textBox.value = "";
});

canvas.addEventListener("mousemove", handlePlayerDrawing);

socket.onmessage = function(event) {
    handleEventType(JSON.parse(event.data));
};


socket.onopen = function() {
    console.log("WebSocket connection open.");
    requestEntryToGameRoom();
};

socket.onmessage = function(event) {
    handleEventType(JSON.parse(event.data));
};

function requestEntryToGameRoom(){
    sendMessage({},GameEventType.JOIN_GAME);
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
        case GameEventType.USER_DRAW:
            handleSentDraw(communicationInterface.userDrawPayload);
            break;
    }
}

function handleRoundNotification(payload){
    setPlayerInTurn(payload.roundInfo);
    setCanDrawCanvas(isPlayerInTurn());
    alert(payload.message);
}

function handleChatMessage(chatMessagePayload){ 
    const senderName = getSenderName(chatMessagePayload);
    const item = document.createElement('li');
    item.textContent = `${senderName}: ${chatMessagePayload.message}`
    messages.appendChild(item);
}

function handlePlayerDrawing(){
    if(!canDrawCanvas()){
        return;
    }

    draw();

    const gameEventType = GameEventType.USER_DRAW;
    const x = e.clientX - canvasOffsetX;
    const y = e.clientY;
    const userDrawPayload = {x,y};

    sendMessage(userDrawPayload, gameEventType);
}

function handleSentDraw(userDrawPayload){
    const {x,y} = userDrawPayload;
    ctx.lineTo(x,y);
    ctx.stroke();
}

function handleFinishGame(){
    removeChatMessages();
    //closeConnection();
    alert("Game has finished");
}


