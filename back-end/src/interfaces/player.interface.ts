import { WebSocket } from 'ws';

export interface Player {
    id:string;
    playRoomId:number;
    name:string;
    avatar:string;
    ws:WebSocket | undefined;
    score:number;
}