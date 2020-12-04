import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'


it('returns a 404 if not orderId', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app) 
        .get(`/api/orders/${id}`)
        .set('Cookie',global.signin())
        .send()
        .expect(404)
})

it('returns a 401 if not authorized', async ()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version:0
    })
    await ticket.save()
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({
            ticketId: ticket.id
        })
    await request(app) 
        .get(`/api/orders/${order.id}`)
        .set('Cookie',global.signin())
        .send()
        .expect(401)
})

it('returns a 201 if valid input', async ()=>{
    const user = global.signin()
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 20,
        version:0
    })
    await ticket.save()
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({
            ticketId: ticket.id
        })
    const {body:response} = await request(app) 
        .get(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200)
    expect(response.ticket.id).toEqual(ticket.id)
})