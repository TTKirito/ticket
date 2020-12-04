import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdateLitener } from "../ticket-update-listener"
import mongoose from 'mongoose'
import { TicketUpdatedEvent } from "@sgticket1thuan/common"
import { Message } from "node-nats-streaming"


const setup = async () =>{
    
    const listener = new TicketUpdateLitener(natsWrapper.client)

    const ticket = Ticket.build({
        version: 0,
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })

    await ticket.save()

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 999,
        userId: 'adfad'
    }

    //@ts-ignore
    const msg:Message={
        ack: jest.fn()
    }

    return { listener, ticket, data, msg}
}

it('finds,updates,save,ack a ticket', async ()=>{
    const { listener, ticket, data, msg } = await setup()
    
    await listener.onMessage(data,msg)
    const updatedTicket = await Ticket.findById(ticket.id)
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
    expect(msg.ack).toHaveBeenCalled();
})