import { WebSocket } from 'ws';
import { Communication, Player } from '../interfaces';

export class WebSocketUseCases {

    constructor(){}

    public handleMessages(players:Player[], communication:Communication):void{
        players.forEach(player=>{
            if(!player.ws){return;}
            player.ws.send(JSON.stringify(communication));
        });
    }

    public closeConnections(players:Player[]):void{
        players.forEach(player=>{
            if(!player.ws){return;}
            player.ws.close();
        });
    }

}