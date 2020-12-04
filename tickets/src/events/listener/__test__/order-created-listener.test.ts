import { OrderCreatedEvent, OrderStatus } from "@sgticket1thuan/common"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from "../../../models/ticket"


const setup = async () =>{
    const listener = new OrderCreatedListener(natsWrapper.client)
    
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save()


    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: new Date(),
        status: OrderStatus.created,
        userId: 'adsf',
        ticket:{
            id: ticket.id,
            price: ticket.price
        }
    }


    //@ts-ignore
    const msg:Message={
        ack: jest.fn()
    }
    return {listener,ticket,data,msg}
}


it('created,save,ack a orders', async ()=>{
    const {listener,ticket,data,msg}= await setup()

    await listener.onMessage(data,msg)

    const ticketUpdate = await Ticket.findById(ticket.id)
    expect(ticketUpdate?.orderId).toEqual(data.id)
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    const dataPublish = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    console.log(dataPublish)
})
