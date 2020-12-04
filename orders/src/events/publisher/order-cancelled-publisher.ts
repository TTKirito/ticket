import { OrderCancelledEvent, Publisher, Subject } from "@sgticket1thuan/common";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subject.OrderCancelled = Subject.OrderCancelled
}