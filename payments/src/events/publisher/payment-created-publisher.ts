import { PaymentCreatedEvent, Publisher, Subject } from "@sgticket1thuan/common";



export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subject.PaymentCreated = Subject.PaymentCreated
}