import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '../../models/order'
import {  natsWrapper } from '../../nats-wrapper'


it('returns a 404 if not orderId', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post(`/api/orders/${id}`)
        .set('Cookie',global.signin())
        .send()
        .expect(404)
})

it('return a 401 if not authorized', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'test',
        price: 20
    })
    await ticket.save()
    const {body:response} = await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    await request(app)
        .delete(`/api/orders/${response.id}`)
        .set('Cookie',global.signin())
        .send()
        .expect(401)
})

it('return a 200 if valid input', async ()=>{
    const user = global.signin()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'test',
        price: 20
    })
    await ticket.save()
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    const {body:response} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200)
    expect(response.status).toEqual(OrderStatus.Cancelled)
    
})

it('publish event', async ()=>{
    const user = global.signin()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'test',
        price: 20
    })
    await ticket.save()
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)
    const {body:response} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const data = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    console.log(data)
    
})