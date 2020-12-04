import { Listener, NotFoundError, OrderCreatedEvent, Subject } from "@sgticket1thuan/common";
import { queueGroupName } from "./queue-group-name";
import { Message }  from 'node-nats-streaming'
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "../publisher/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated
    queryGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'],msg: Message){
        const ticket = await Ticket.findById(data.ticket.id)

        if(!ticket){
            throw new NotFoundError()
        }

        ticket.set({
            orderId: data.id
        })

        await ticket.save()


        await new TicketUpdatedPublisher(natsWrapper.client).Publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        })

        msg.ack()
    }
}