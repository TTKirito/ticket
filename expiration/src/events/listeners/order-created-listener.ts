import { Listener, OrderCreatedEvent, Subject } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated
    queryGroupName = queueGroupName
    async onMessage(data:OrderCreatedEvent['data'], msg: Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('waiting this many milliseconds to process the job', delay)
        console.log(data.ticket)
        await expirationQueue.add({
            orderId: data.id
        },{
            delay
        })
        msg.ack()
    }

}