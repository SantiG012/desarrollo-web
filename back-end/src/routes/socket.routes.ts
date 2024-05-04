import { Router } from "express";
import { SocketUseCases } from "../use-cases/socket.use-cases";
import { Player } from "../interfaces";

const express = require('express');
const router = express.Router();

module.exports = (expressWs:any) =>{
    expressWs.applyTo(router);

    const socketUseCases = new SocketUseCases();

    router.ws('/room/:roomId',(ws:any,req:any)=>{
        const roomId = req.params.roomId;
        const player:Player = JSON.parse(req.headers['player']);
        player.ws = ws;
    
        socketUseCases.joinPlayRoom(player,roomId,ws)
    })

    return router;

}