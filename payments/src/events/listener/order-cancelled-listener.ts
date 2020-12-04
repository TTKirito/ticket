import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subject } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { QueueGroupName } from "./queue-group-name";



export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subject.OrderCancelled = Subject.OrderCancelled
    queryGroupName=QueueGroupName
    async onMessage(data: OrderCancelledEvent['data'],msg: Message){
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })

        if(!order){
            throw new NotFoundError()
        }

        order.set({status: OrderStatus.Cancelled})
        await order.save()
        msg.ack()
    }
}