import { OrderCreatedEvent, Publisher, Subject } from "@sgticket1thuan/common";



export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subject.OrderCreated = Subject.OrderCreated
}