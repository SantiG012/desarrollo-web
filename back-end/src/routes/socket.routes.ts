import { Router } from "express";
import { GameUseCases } from "../use-cases/games.use-cases";
import { Player } from "../interfaces";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";
import { PlayRoomStatus } from "../Enums/play-room-status.enum";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const gameUseCases = new GameUseCases();

    router.ws('/room/:roomId',async (ws:any,req:any)=>{
        const roomId:number =  parseInt(req.params.roomId);
        const player:Player = JSON.parse(req.headers['player']);
        player.ws = ws;


        if(!gameUseCases.roomsInfo[roomId]){await gameUseCases.initializeEmptyRoomsInfo(roomId,player);} 
        else if(gameUseCases.roomsInfo[roomId]["state"] === PlayRoomStatus.Waiting){await gameUseCases.initializeEmptyRoomsInfo(roomId,player)}
        else{await gameUseCases.joinPlayRoom(player,roomId);}

        const joinMessage=`${player.name} has joined`;
        gameUseCases.send(joinMessage,ws,roomId);

        if(gameUseCases.hasEnoughPlayers(roomId) && !gameUseCases.hasSelectedPlayer(roomId)){gameUseCases.startGame(roomId);}
    
        ws.on(WebScoketEventTypes.Message, async function (message:string){
            if(gameUseCases.isDrawing(player,roomId)){return;}

            if(gameUseCases.alreadyWon(player, roomId)){return;}

            if(!gameUseCases.wordGuessed(roomId,message)){await gameUseCases.send(`${player.name}: ${message}`,ws,roomId);return;}

            gameUseCases.updateScore(roomId,player);

            const scoreMessage = `${player.name} ha acertado la palabra!`;

            gameUseCases.send(scoreMessage,undefined,roomId);

            if (!gameUseCases.allWon(roomId)){return;}

            if(gameUseCases.isGameOver(roomId)){
                await gameUseCases.sendResults(roomId);
                await gameUseCases.closeConnections(roomId);
                return;
            }

            gameUseCases.deleteGuessedWord(roomId);

            gameUseCases.resetGame(roomId);
        })

        ws.on(WebScoketEventTypes.Close,async function(){
            if(gameUseCases.isGameOver(roomId)){await gameUseCases.changeRoomStatus(roomId);return;}
        })
    })

    return router;

}