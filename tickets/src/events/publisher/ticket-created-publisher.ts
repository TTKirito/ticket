import { Publisher, Subject, TicketCreatedEvent } from "@sgticket1thuan/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subject.TicketCreated = Subject.TicketCreated
}