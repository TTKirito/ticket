import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from 'mongoose'
import { OrderCancelledEvent } from "@sgticket1thuan/common"
import { Message }  from 'node-nats-streaming'

const setup = async () =>{
    const listener = new OrderCancelledListener(natsWrapper.client)
    const orderId = mongoose.Types.ObjectId().toHexString();
    const ticket=  Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        price:20,
        title: '20',
    })
    ticket.set({
        orderId: orderId
    })
    await ticket.save()




    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket:{
            id: ticket.id
        }

    }

    //@ts-ignore
    const msg: Message ={
        ack:jest.fn()
    }

    return {listener,ticket,data,msg}
}

it('cancelled,ask,the order', async ()=>{
    const {listener,ticket,data,msg} = await setup()
    await listener.onMessage(data,msg)

    const ticketUpdate = await Ticket.findById(ticket.id)
    expect(ticketUpdate?.orderId).not.toBeDefined()
    expect(msg.ack).toHaveBeenCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const dataPublish = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    console.log(dataPublish)
})

