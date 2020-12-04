import { response } from 'express'
import request from 'supertest'
import { app }  from '../../app'



 const ticket = async () => {
    const path = `${__dirname}/fixtures/new.png`
    return  request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .attach('image',path)
        .field('title','3333')
        .field('price',20)
        .expect(201) 
}



it('get all tickets', async () =>{
    await ticket()
    await ticket()
    await ticket()

    const responseTicket = await request(app)
        .get(`/api/tickets`)
        .send()
        .expect(200)
    expect(responseTicket.body.ticket.length).toEqual(3)
})