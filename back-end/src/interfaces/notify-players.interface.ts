import { Player } from "./player.interface";

export interface NotifyPlayers {
    playerInTurn: Player;
    guessers: Player[];
    word: string;
}