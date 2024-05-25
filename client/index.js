const textBox = document.getElementById("input");
const sendButton = document.getElementsByTagName("button")[0];
const messages = document.getElementById("messages");


sendButton.addEventListener("click",(e)=>{
    e.preventDefault();
    const message = textBox.value;
    const chatMessagePayload = {message, senderId: userId, senderName: userName};
    socket.send(JSON.stringify({
        gameEventType: GameEventType.CHAT_MESSAGE,
        chatMessagePayload
    }));
    textBox.value = "";
});

canvas.addEventListener("mousemove", (e) => {
    handlePlayerDrawing(e);
});

canvas.addEventListener("mouseup", (e) => {
    handleMouseUp();
    socket.send(JSON.stringify({
        gameEventType: GameEventType.MOUSE_UP
    }));
});

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
        case GameEventType.GAME_OVER:
            handleGameOver();
            break;
        case GameEventType.USER_DRAW:
            handleSentDraw(communicationInterface.drawPayload);
            break;
        case GameEventType.MOUSE_UP:
            handleSentMouseUp();
            break;
        default:
            console.error("Invalid game event type",communicationInterface);

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

function handlePlayerDrawing(e){
    if(!canDrawCanvas()){
        return;
    }

    if(!isPlayerPainting()){return;}

    draw(e);

    const gameEventType = GameEventType.USER_DRAW;
    const x = e.clientX - canvasOffsetX;
    const y = e.clientY;
    const drawPayload = {x,y};

    socket.send(JSON.stringify({
        gameEventType,
        drawPayload
    }));
}

function handleSentDraw(userDrawPayload){
    if(isPlayerInTurn()){return;}

    const {x,y} = userDrawPayload;
    ctx.lineTo(x,y);
    ctx.stroke();
}

function handleSentMouseUp(){
    if(isPlayerInTurn()){return;}
    handleMouseUp();
}

function handleGameOver(){
    removeChatMessages();
    closeConnection();
    alert("Game has finished");
}


