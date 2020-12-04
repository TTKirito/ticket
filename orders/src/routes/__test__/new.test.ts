import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'

it('return 400 if invalid ticketid', async ()=>{
    const ticket = Ticket.build({
       id: new mongoose.Types.ObjectId().toHexString(),
       title: 'test',
       price: 20,
       version: 0
    })
    await ticket.save()

    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({
            ticketId: '123'
        })
        .expect(400)

})

it('return 404 if not ticketId', async ()=>{
    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({
            ticketId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

it('return 401 if not authorized', async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version: 0
     })
     await ticket.save()
 
     await request(app)
         .post('/api/orders')
         .send({
             ticketId: ticket.id
         })
         .expect(401)
})

it('return 400 if order reverved', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version: 0
     })
     await ticket.save()
     const order = Order.build({
        status: OrderStatus.created,
        ticket: ticket,
        expiresAt: new Date(),
        userId: '123'
     })
     await order.save()
     await request(app)
         .post('/api/orders')
         .set('Cookie',global.signin())
         .send({
             ticketId: ticket.id
         })
         .expect(400)
})

it('return 201 if valid input', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version: 0
     })
     await ticket.save()

    const response = await request(app)
         .post('/api/orders')
         .set('Cookie',global.signin())
         .send({
             ticketId: ticket.id
         })
         .expect(201)
    expect(response.body.ticket.id).toEqual(ticket.id)
})

it('publish event', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version: 0
     })
     await ticket.save()

    const response = await request(app)
         .post('/api/orders')
         .set('Cookie',global.signin())
         .send({
             ticketId: ticket.id
         })
         .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const data = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )

    console.log(data)
})