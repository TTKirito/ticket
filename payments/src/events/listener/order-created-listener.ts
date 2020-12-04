import { Listener, OrderCreatedEvent, Subject } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QueueGroupName } from "./queue-group-name";



export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated
    queryGroupName=QueueGroupName
    async onMessage(data: OrderCreatedEvent['data'],msg: Message){
        const order = Order.build({
            id: data.id,
            version: data.version,
            price: data.ticket.price,
            userId: data.userId,
            status: data.status
        })


        await order.save()
        msg.ack()
    }
}