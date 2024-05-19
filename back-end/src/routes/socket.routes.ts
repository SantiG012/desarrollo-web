import { NextFunction, Router } from "express";
import { ChatMessagePayload, Communication, Player, ResultsPayload, RoundInfo } from "../interfaces";
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
    
    
        
            ws.on(WebScoketEventTypes.Message, async function (communicationInterface:Communication){
                const gameEventType = communicationInterface.gameEventType;
                let players:Player[];
                let message:string;
                let roundInfo:RoundInfo;
                let communication:Communication;
                


                switch(gameEventType){
                    case GameEventTypes.CHAT_MESSAGE:
                        const payload = communicationInterface.chatMessagePayload;
                        message = `${player.name}: ${payload?.message}`;
                        players = gameUseCases.getPlayers(roomId);
                        const chatMessagePayload:ChatMessagePayload = {message,senderId:player.id,senderName:player.name};
                        communication = {gameEventType:GameEventTypes.CHAT_MESSAGE,chatMessagePayload:chatMessagePayload};

                        if (!gameUseCases.canSendMessages(player, roomId)){return;}

                        if(!gameUseCases.wordGuessed(roomId,message)){ webSocketUseCases.handleMessages(players,communication);return;}
                        
                        chatMessagePayload.message = `${player.name} ha acertado la palabra!`;
                        gameUseCases.updateScore(roomId,player);
                        webSocketUseCases.handleMessages(players,communication);


                        if(gameUseCases.isGameOver(roomId)){
                            const resultsPayload:ResultsPayload[] = gameUseCases.getResults(roomId);

                            communication.gameEventType = GameEventTypes.GAME_OVER;
                            communication.resultsPayload = resultsPayload;
    
                            webSocketUseCases.handleMessages(players,communication);
    
                            webSocketUseCases.closeConnections(players);
    
                            gameUseCases.handleGameOver(roomId);
                            return;
                        }

                        if(!gameUseCases.isRoundOver(roomId)){return;}

                        gameUseCases.handleRoundOver(roomId);
                        roundInfo = gameUseCases.getRoundInfo(roomId);

                        message = `La palabra a adivinar es: ${roundInfo.word}`;

                        communication.gameEventType = GameEventTypes.ROUND_NOTIFICATION;
                        communication.roundNotificationPayload = {message,roundInfo};

                        webSocketUseCases.handleMessages([roundInfo.playerInTurn],communication);

                        message = `Es el turno de ${roundInfo.playerInTurn.name}`;

                        communication.roundNotificationPayload.message = message;

                        webSocketUseCases.handleMessages(roundInfo.guessers,communication);

                    case GameEventTypes.JOIN_GAME:
                        const joinCommunication:Communication = {gameEventType:GameEventTypes.CHAT_MESSAGE,chatMessagePayload:undefined};

                        gameUseCases.handleNewPlayer(player,roomId);
                        
                        if(!gameUseCases.gameCanStart(roomId)){return;}

                        gameUseCases.startGame(roomId);

                        roundInfo = gameUseCases.getRoundInfo(roomId);

                        message = `La palabra a adivinar es: ${roundInfo.word}`;

                        joinCommunication.gameEventType = GameEventTypes.ROUND_NOTIFICATION;
                        joinCommunication.roundNotificationPayload = {message,roundInfo};

                        webSocketUseCases.handleMessages([roundInfo.playerInTurn],joinCommunication);

                        message = `Es el turno de ${roundInfo.playerInTurn.name}`;

                        joinCommunication.roundNotificationPayload.message = message;

                        webSocketUseCases.handleMessages(roundInfo.guessers,joinCommunication);
                        



                }
            })
    
            ws.on(WebScoketEventTypes.Close,async function(){
                if(gameUseCases.isGameOver(roomId)){await gameUseCases.changeRoomStatus(roomId);return;}

                const message = `${player.name} ha abandonado la partida, la sala se cerrará.`;
                //await gameUseCases.send(message,player.ws,roomId);
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