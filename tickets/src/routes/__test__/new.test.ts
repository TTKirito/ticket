import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'



it('returns 400 if invalid input', async () => {
    const path = `${__dirname}/fixtures/new.png`
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .attach('image',path)
        .field('title','')
        .field('price',20)
        .expect(400)  
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .attach('image',path)
        .field('title','3333')
        .field('price','')
        .expect(400) 
    await request(app)
        .post('/api/tickets')
        .set('Cookie',global.signin())
        .field('title','')
        .field('price',20)
        .expect(400) 

})

it('returns 401 if not authorized', async () => {
    const path = `${__dirname}/fixtures/new.png`
    await request(app)
        .post('/api/tickets')
        .attach('image',path)
        .field('title','3333')
        .field('price',20)
        .expect(401)  
})

it('returns 201 if valid input', async () => {
    const dd = `${__dirname}/fixtures/new.png`
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .attach('image',dd)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
    const ticket = await Ticket.findById(response.body.id)
    expect(ticket?.image).toEqual(expect.any(Buffer))
})

it('Publish Event', async () => {
    const dd = `${__dirname}/fixtures/new.png`
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .attach('image',dd)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const data = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    )
    console.log(data)
})
