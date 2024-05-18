import { NextFunction, Router } from "express";
import { ChatMessagePayload, Communication, Player, ResultsPayload } from "../interfaces";
import { WebScoketEventTypes } from "../Enums/ws-events-types.enum";
import { PlayRoomStatus } from "../Enums/play-room-status.enum";
import { ApiError } from "../Errors";
import { WebSocketUseCases, GameUseCases } from "../use-cases";
import { WebSocket } from "ws";
import schemaValidator from "../middleware/schema.validator";
import { GameEventTypes } from "../Enums/game-event-types.enum";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const gameUseCases = new GameUseCases();
    const webSocketUseCases = new WebSocketUseCases();

    router.ws('/room/:roomId',
    //TODO: Add schema validator
    async (ws:WebSocket,req:any, next:NextFunction)=>{
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
        
            ws.on(WebScoketEventTypes.Message, async function (communicationInterface:Communication){
                const gameEventType = communicationInterface.gameEventType;
                


                switch(gameEventType){
                    case GameEventTypes.CHAT_MESSAGE:
                        const payload = communicationInterface.chatMessagePayload;
                        let message = `${player.name}: ${payload?.message}`;
                        const players:Player[] = gameUseCases.getPlayers(roomId);
                        const chatMessagePayload:ChatMessagePayload = {message,senderId:player.id,senderName:player.name};
                        const communication:Communication = {gameEventType:GameEventTypes.CHAT_MESSAGE,chatMessagePayload:chatMessagePayload};

                        if (!gameUseCases.canSendMessages(player, roomId)){return;}

                        if(!gameUseCases.wordGuessed(roomId,message)){ webSocketUseCases.handleMessages(players,communication);return;}
                        
                        chatMessagePayload.message = `${player.name} ha acertado la palabra!`;
                        gameUseCases.updateScore(roomId,player);
                        webSocketUseCases.handleMessages(players,communication);
                            

                        if(!gameUseCases.isGameOver(roomId)){return;}

                        const resultsPayload:ResultsPayload[] = gameUseCases.getResults(roomId);

                        communication.gameEventType = GameEventTypes.GAME_OVER;
                        communication.resultsPayload = resultsPayload;

                        webSocketUseCases.handleMessages(players,communication);

                        webSocketUseCases.closeConnections(players);

                        gameUseCases.handleGameOver(roomId);


                    }
            })
    
            ws.on(WebScoketEventTypes.Close,async function(){
                if(gameUseCases.isGameOver(roomId)){await gameUseCases.changeRoomStatus(roomId);return;}

                const message = `${player.name} ha abandonado la partida, la sala se cerrará.`;
                await gameUseCases.send(message,player.ws,roomId);
                await gameUseCases.changeRoomStatus(roomId);
                //await gameUseCases.closeConnections(roomId);
            })
        } catch(error:ApiError | any){
            ws.send(JSON.stringify({status:error.statusCode,message:error.message}));
            next(error);
        }
    })

    return router;

}