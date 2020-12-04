import request from 'supertest'
import { app }  from '../../app'
import mongoose from 'mongoose'


it('returns 404 if not titcket id', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString() 
    await request(app)
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404)
})

it('returns ticket if valid ticket id', async () =>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .send({
            title: 'test',
            price: 20
        })
        .expect(201)

    const responseTicket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
        .expect(200)
    expect(responseTicket.body.title).toEqual('test')
})