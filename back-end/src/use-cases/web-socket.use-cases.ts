import { WebSocket } from 'ws';
import { Communication, Player } from '../interfaces';

export class WebSocketUseCases {

    constructor(){}

    public handleMessages(webSockets:WebSocket[], communication:Communication):void{
        webSockets.forEach(ws=>{
           ws.send(JSON.stringify(communication));
        });
    }

    public closeConnections(webSockets:WebSocket[]):void{
        webSockets.forEach(ws=>{
            ws.close();
        });
    }

}