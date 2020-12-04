import { Listener, Subject, TicketCreatedEvent } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";



export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subject.TicketCreated = Subject.TicketCreated
    queryGroupName = queueGroupName
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const ticket =  Ticket.build({
            id: data.id,
            title: data.title,
            price: data.price,
            version: data.version
        })
        await ticket.save()
        msg.ack()
    }
}