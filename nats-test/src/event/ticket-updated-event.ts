import { Subject } from "./subject";

export interface TicketUpdatedEvent{
    subject: Subject.TicketUpdated,
    data: {
        id: string,
        userId: string,
        title: string,
        price: number,
        version: number
    }
}