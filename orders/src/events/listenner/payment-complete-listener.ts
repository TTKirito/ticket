import { Listener, NotFoundError, OrderStatus, PaymentCreatedEvent, Subject } from "@sgticket1thuan/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";


export class PaymentsCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subject.PaymentCreated = Subject.PaymentCreated
    queryGroupName = queueGroupName
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId)
        if(!order) {
            throw new NotFoundError()
        }
        

        order.set({status: OrderStatus.Complete})
        await order.save()

        msg.ack()
    }   
}