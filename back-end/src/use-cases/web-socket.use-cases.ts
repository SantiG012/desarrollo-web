import { WebSocket } from 'ws';
import { Communication, Player } from '../interfaces';

export class WebSocketUseCases {

    constructor(){}

    public handleChatMessages(players:Player[], communication:Communication):void{
        players.forEach(player=>{
            if(!player.ws){return;}
            player.ws.send(JSON.stringify(communication));
        });
    }

}