import { Player } from "./player.interface";

export interface RoundInfo {
    playerInTurn: Player;
    guessers: Player[];
    word: string;
}