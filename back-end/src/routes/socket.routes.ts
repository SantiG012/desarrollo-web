import { NextFunction, Router, json } from "express";
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
            const player:Player = gameUseCases.generateNewPlayer(userId, name, avatar, roomId,ws);
    
    
        
            ws.on(WebScoketEventTypes.Message, async function (communicationInterface:Communication){
                communicationInterface = JSON.parse(communicationInterface.toString());
                const gameEventType = communicationInterface.gameEventType;
                let roomPlayersWebsockets:WebSocket[];
                let playerInTurnWebsocket:WebSocket;
                let guessersWebsockets:WebSocket[];
                let message:string;
                let roundInfo:RoundInfo;
                let communication:Communication = {gameEventType:GameEventTypes.CHAT_MESSAGE};

                switch(gameEventType){
                    case GameEventTypes.CHAT_MESSAGE:{
                        const payload = communicationInterface.chatMessagePayload;
                        message = `${player.name}: ${payload?.message}`;
                        roomPlayersWebsockets = gameUseCases.getPlayersWebSocket(roomId);
                        const chatMessagePayload:ChatMessagePayload = {message,senderId:player.id,senderName:player.name};
                        communication = {gameEventType:GameEventTypes.CHAT_MESSAGE,chatMessagePayload:chatMessagePayload};

                        if (!gameUseCases.canSendMessages(player, roomId)){return;}

                        if(!gameUseCases.wordGuessed(roomId,message)){ webSocketUseCases.handleMessages(roomPlayersWebsockets,communication);return;}
                        
                        chatMessagePayload.message = `${player.name} ha acertado la palabra!`;
                        gameUseCases.updateScore(roomId,player);
                        webSocketUseCases.handleMessages(roomPlayersWebsockets,communication);


                        if(gameUseCases.isGameOver(roomId)){
                            const resultsPayload:ResultsPayload[] = gameUseCases.getResults(roomId);

                            communication.gameEventType = GameEventTypes.GAME_OVER;
                            communication.resultsPayload = resultsPayload;
    
                            webSocketUseCases.handleMessages(roomPlayersWebsockets,communication);
    
                            webSocketUseCases.closeConnections(roomPlayersWebsockets);
    
                            gameUseCases.handleGameOver(roomId); // TODO: Check if this is necessary
                            return;
                        }

                        if(!gameUseCases.isRoundOver(roomId)){return;}

                        gameUseCases.handleRoundOver(roomId);

                        roundInfo = gameUseCases.getRoundInfo(roomId);

                        message = `La palabra a adivinar es: ${roundInfo.word}`;

                        communication.gameEventType = GameEventTypes.ROUND_NOTIFICATION;
                        communication.roundNotificationPayload = {message,roundInfo};

                        playerInTurnWebsocket = gameUseCases.getPlayerInTurnWebSocket(roomId);
                        
                        webSocketUseCases.handleMessages([playerInTurnWebsocket],communication);

                        message = `Es el turno de ${roundInfo.playerInTurn.name}`;

                        communication.roundNotificationPayload.message = message;

                        guessersWebsockets = gameUseCases.getGuessersWebSocket(roomId);

                        webSocketUseCases.handleMessages(guessersWebsockets,communication);

                        break;
                    }


                    case GameEventTypes.JOIN_GAME:{
                        communication.gameEventType = GameEventTypes.ROUND_NOTIFICATION;
                        
                        await gameUseCases.handleNewPlayer(player,roomId);
                        
                        if(!gameUseCases.gameCanStart(roomId)){
                            message = 'Esperando a que se unan más jugadores...'
                            communication.roundNotificationPayload = {message, roundInfo:undefined};
                            webSocketUseCases.handleMessages([player.ws],communication);
                            return;
                        }

                        gameUseCases.startGame(roomId);

                        roundInfo = gameUseCases.getRoundInfo(roomId);

                        message = `La palabra a adivinar es: ${roundInfo.word}`;

                        communication.roundNotificationPayload = {message,roundInfo};

                        playerInTurnWebsocket = gameUseCases.getPlayerInTurnWebSocket(roomId);
                        
                        webSocketUseCases.handleMessages([playerInTurnWebsocket],communication);

                        message = `Es el turno de ${roundInfo.playerInTurn.name}`;

                        communication.roundNotificationPayload.message = message;

                        guessersWebsockets = gameUseCases.getGuessersWebSocket(roomId);

                        webSocketUseCases.handleMessages(guessersWebsockets,communication);
                    
                        break;
                    }

                    default:{
                        console.log('Default');
                        break;
                    }
                    
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