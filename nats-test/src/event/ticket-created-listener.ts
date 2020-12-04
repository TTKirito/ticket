import { Message } from "node-nats-streaming";
import { Listener } from "./base-litener";
import { Subject } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-event";


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject: Subject.TicketCreated = Subject.TicketCreated
    queueGroupName = 'payment-service'
    async onMessage(data: TicketCreatedEvent['data'], msg: Message){
        console.log(data)
        msg.ack()
    }
}