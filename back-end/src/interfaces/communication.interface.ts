import { GameEventTypes } from "../Enums/game-event-types.enum"
import { ChatMessagePayload } from "./chat-message-payload.interface"

export interface Communication {
    gameEventType: GameEventTypes,
    payload: ChatMessagePayload | any
}