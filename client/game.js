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