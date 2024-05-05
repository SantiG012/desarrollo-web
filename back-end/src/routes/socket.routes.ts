import { Router } from "express";
import { GameUseCases } from "../use-cases/games.use-cases";
import { Player } from "../interfaces";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const gameUseCases = new GameUseCases();

    router.ws('/room/:roomId',async (ws:any,req:any)=>{
        const roomId:number =  parseInt(req.params.roomId);
        const player:Player = JSON.parse(req.headers['player']);
        player.ws = ws;

        if(!gameUseCases.roomsInfo[roomId]){await gameUseCases.initializeEmptyRoomsInfo(roomId,player)} else{await gameUseCases.joinPlayRoom(player,roomId);}

        const joinMessage=`${player.name} has joined`;
        gameUseCases.send(joinMessage,ws,roomId);

        if(gameUseCases.roomsInfo[roomId]["roomPlayers"].length > 1 && gameUseCases.roomsInfo[roomId]["player"] === undefined){gameUseCases.startGame(roomId);}
    
        ws.on(WebScoketEventTypes.Message, async function (message:string){
            if(gameUseCases.isDrawing(player,roomId)){return;}

            if(gameUseCases.alreadyWon(player, roomId)){return;}

            if(!gameUseCases.wordGuessed(roomId,message)){await gameUseCases.send(`${player.name}: ${message}`,ws,roomId);return;}

            gameUseCases.updateScore(roomId,player);

            const scoreMessage = `${player.name} ha acertado la palabra!`;

            gameUseCases.send(scoreMessage,undefined,roomId);

            if (!gameUseCases.allWon(roomId)){return;}

            

        })
    })

    return router;

}