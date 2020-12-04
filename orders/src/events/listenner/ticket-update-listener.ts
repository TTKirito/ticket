import { Listener, NotFoundError, Subject, TicketUpdatedEvent } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";




export class TicketUpdateLitener extends Listener<TicketUpdatedEvent>{
    subject: Subject.TicketUpdated = Subject.TicketUpdated
    queryGroupName = queueGroupName
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent(data)
        if(!ticket){
            throw new NotFoundError()
        }

        const {title, price} = data
        ticket.set({
            title,
            price
        })
        await ticket.save()
        msg.ack()
    }
}