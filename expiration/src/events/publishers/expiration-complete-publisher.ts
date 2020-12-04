import { ExpirationCompleteEvent, Publisher, Subject } from "@sgticket1thuan/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subject.ExpirationComplete = Subject.ExpirationComplete
}