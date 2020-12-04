import request from 'supertest'
import { app }  from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if invalid ticketId', async () =>{
    const id = new mongoose.Types.ObjectId().toHexString()
    const image = `${__dirname}/fixtures/new.png`
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',global.signin())
        .send({
            title: 'test2',
            price: 20
        })
        .expect(404)
})

it('return 401 if not authorized', async () => {
    const path = `${__dirname}/fixtures/new.png`
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .attach('image',path)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'dddd',
            price: 55
        })
        .expect(401)
    
})

it('returns 200 if valid input ', async ()=>{
    const path = `${__dirname}/fixtures/new.png`
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .attach('image',path)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'dddd',
            price: 55
        })
        .expect(200)
    
})
it('Publish Event', async ()=>{
    const path = `${__dirname}/fixtures/new.png`
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .attach('image',path)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'dddd',
            price: 55
        })
        .expect(200)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
    

    const data = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    console.log(data)
})