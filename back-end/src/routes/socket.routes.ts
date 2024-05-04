import { Router } from "express";
import { SocketUseCases } from "../use-cases/socket.use-cases";
import { Player } from "../interfaces";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const socketUseCases = new SocketUseCases();

    router.ws('/room/:roomId',async (ws:any,req:any)=>{
        const roomId:number =  parseInt(req.params.roomId);
        const player:Player = JSON.parse(req.headers['player']);
        player.ws = ws;

        if(!socketUseCases.roomsInfo[roomId]){await socketUseCases.initializeEmptyRoomsInfo(roomId,player)} else{await socketUseCases.joinPlayRoom(player,roomId);}

        const joinMessage=`${player.name} has joined`;
        socketUseCases.send(joinMessage,ws,roomId);

        if(socketUseCases.roomsInfo[roomId]["roomPlayers"].length > 1 && socketUseCases.roomsInfo[roomId]["player"] === undefined){socketUseCases.startGame(roomId);}
    
        ws.on(WebScoketEventTypes.Message, async function (message:any){
            const test = JSON.parse(message);
            console.log(test.message);
            await socketUseCases.send(`${player.name}: ${message}`,ws,roomId);
        })
    })

    return router;

}