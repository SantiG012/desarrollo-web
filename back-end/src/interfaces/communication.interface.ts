import { GameEventTypes } from "../Enums/game-event-types.enum"
import { ChatMessagePayload } from "./chat-message-payload.interface"
import { ResultsPayload } from "./results-payload.interface"

export interface Communication {
    gameEventType: GameEventTypes,
    chatMessagePayload?: ChatMessagePayload,
    resultsPayload?: ResultsPayload[]
}