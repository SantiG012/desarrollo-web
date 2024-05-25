const url = window.location.href; // Get the current URL
const urlObj = new URL(url);  // Create a URL object
const queryParams = new URLSearchParams(urlObj.search); // Get the query parameters
const { userId, userName, userAvatar } = Object.fromEntries(queryParams.entries()); // Get the userId, name, and avatar from the query parameters


let playerInTurn = {"userId": "", "userName": "", "userAvatar": ""};
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

function isPlayerInTurn(){
    return playerInTurn.userId === userId;
}

function setCanDrawCanvas(canDrawCanvas){
    canDraw = canDrawCanvas;
}

function canDrawCanvas(){
    return canDraw;
}