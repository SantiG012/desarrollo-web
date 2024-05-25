const playerInTurn = {"userId": "", "userName": "", "userAvatar": ""};
let canDraw = false;

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

function setPlayerInTurn(roundInfo){
    if(!roundInfo){return;}
    playerInTurn = roundInfo.playerInTurn;
}

function isPlayerInTurn(userId){
    return playerInTurn.userId === userId;
}

function setCanDrawCanvas(canDrawCanvas){
    canDraw = canDrawCanvas;
}

function canDrawCanvas(){
    return canDraw;
}