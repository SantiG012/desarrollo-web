import { WebSocket } from 'ws';
import { Player } from '../interfaces';

export class WebSocketUseCases {

    constructor(){}

    public handleChatMessages(players:Player[], message:string):void{
        players.forEach(player=>{
            if(!player.ws){return;}
            player.ws.send(message);
        });
    }

}