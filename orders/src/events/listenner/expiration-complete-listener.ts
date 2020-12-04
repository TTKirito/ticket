import { BadRequestError, ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subject } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";



export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete
    queryGroupName = queueGroupName
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
       
        const order = await Order.findById(data.orderId)

        if(!order){
            throw new BadRequestError('Order not found')
        }
        
        if(order.status === OrderStatus.Complete){
            return msg.ack()
        }

        order.set({
            status: OrderStatus.Cancelled
        })
        await order.save()

        await new OrderCancelledPublisher(this.client).Publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket._id
            }
        })

        msg.ack()
    }
}