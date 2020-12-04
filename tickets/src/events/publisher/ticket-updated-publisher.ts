import { Publisher, Subject, TicketUpdatedEvent } from "@sgticket1thuan/common";



export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subject.TicketUpdated = Subject.TicketUpdated
}