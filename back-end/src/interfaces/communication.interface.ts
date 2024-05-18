import { GameEventTypes } from "../Enums/game-event-types.enum"

export interface Communication {
    gameEventType: GameEventTypes,
    payload: any
}