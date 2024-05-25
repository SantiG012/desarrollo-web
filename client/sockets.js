const socket = new WebSocket(`ws://localhost:3000/ws/room/1?userId=${userId}&name=${userName}&avatar=${userAvatar}`);



socket.onerror = function(error) {
    console.error("WebSocket error:", error);
};

socket.onclose = function(){
    socket.close()
}

function closeConnection(){
    socket.close();
}

function sendMessage(payload, gameEventType){
    socket.send(JSON.stringify({
        gameEventType,
        payload
    }));
}