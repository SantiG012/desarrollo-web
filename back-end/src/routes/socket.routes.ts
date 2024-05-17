import { NextFunction, Router } from "express";
import { Player } from "../interfaces";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";
import { PlayRoomStatus } from "../Enums/play-room-status.enum";
import { ApiError } from "../Errors";
import { WebSocketUseCases, GameUseCases } from "../use-cases";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const gameUseCases = new GameUseCases();
    const webSocketUseCases = new WebSocketUseCases();

    router.ws('/room/:roomId',async (ws:any,req:any, next:NextFunction)=>{
        try{
            const roomId:number =  parseInt(req.params.roomId);
            const {userId,name, avatar} = req.query;
            const player:Player = gameUseCases.generateNewPlayer(userId, name, avatar, roomId);
            player.ws = ws;
    
    
            if(!gameUseCases.roomsInfo[roomId]){await gameUseCases.initializeEmptyRoomsInfo(roomId,player);} 
            else if(gameUseCases.roomsInfo[roomId]["state"] === PlayRoomStatus.Waiting){await gameUseCases.initializeEmptyRoomsInfo(roomId,player)}
            else{await gameUseCases.joinPlayRoom(player,roomId);}
    
            const joinMessage=`${player.name} has joined`;
            gameUseCases.send(joinMessage,ws,roomId);
    
            if(gameUseCases.hasEnoughPlayers(roomId) && !gameUseCases.hasSelectedPlayer(roomId)){gameUseCases.startGame(roomId);}
        
            ws.on(WebScoketEventTypes.Message, async function (message:any){
                switch(message){
                    case WebScoketEventTypes.Message:
                        if (!gameUseCases.candSendMessages(player, roomId)){return;}

    
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

                const message = `${player.name} ha abandonado la partida, la sala se cerrará.`;
                await gameUseCases.send(message,player.ws,roomId);
                await gameUseCases.changeRoomStatus(roomId);
                await gameUseCases.closeConnections(roomId);
            })
        } catch(error:ApiError | any){
            ws.send(JSON.stringify({status:error.statusCode,message:error.message}));
            next(error);
        }
    })

    return router;

}