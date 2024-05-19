import { Player } from "./player.interface";
import { SendPlayerInterface } from "./send-player.interface";

export interface RoundInfo {
    playerInTurn: SendPlayerInterface;
    guessers: SendPlayerInterface[];
    word: string;
}