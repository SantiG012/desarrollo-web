import { GameEventTypes } from "../Enums/game-event-types.enum"
import { ChatMessagePayload } from "./chat-message-payload.interface"
import { ResultsPayload } from "./results-payload.interface"
import { RoundNotificationPayload } from "./round-notification-payload.interface"

export interface Communication {
    gameEventType: GameEventTypes,
    chatMessagePayload?: ChatMessagePayload,
    resultsPayload?: ResultsPayload[],
    roundNotificationPayload?: RoundNotificationPayload
}