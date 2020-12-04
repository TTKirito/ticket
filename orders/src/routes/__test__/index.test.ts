import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const ticket = async () =>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test',
        price: 29,
        version: 0
    })

    await ticket.save()

    return ticket
}

it('fetch all order', async ()=>{
    const ticketOne = await ticket()
    const ticketTwo = await ticket()
    const TicketThree = await ticket()


    const userOne = global.signin()
    const userTwo = global.signin()


    const {body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie',userOne)
        .send({
            ticketId: ticketOne.id
        })
        .expect(201)
    const {body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie',userOne)
        .send({
            ticketId: ticketTwo.id
        })
        .expect(201)
    await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({
            ticketId: TicketThree.id
        })
        .expect(201)

    const response = await request(app) 
            .get('/api/orders')
            .set('Cookie',userOne)
            .send({})
            .expect(200)
    expect(response.body.length).toEqual(2)
    expect(response.body[0].ticket.id).toEqual(ticketOne.id)
    expect(response.body[1].ticket.id).toEqual(ticketTwo.id)
    expect(response.body[0].id).toEqual(orderOne.id)
    expect(response.body[1].id).toEqual(orderTwo.id)
})