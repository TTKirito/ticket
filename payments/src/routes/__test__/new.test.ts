import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@sgticket1thuan/common'
import { stripe } from '../../stipe'
import { Payment } from '../../models/payment'


it('returns a 400 if invalid orderId', async ()=>{
    
    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            orderId: '123123',
            token: 'tok_visa'
        })
        .expect(400)
})


it('returns a 404 if orderId not found', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            orderId: id,
            token: 'tok_visa'
        })
        .expect(404)
})

it('returns a 401 if not authorized', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        userId,
        version: 0,
        status: OrderStatus.created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(401)
})

it('returns a 400 if order canceler', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        userId,
        version: 0,
        status: OrderStatus.Cancelled
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(400)
})

it('returns a 200 if invalid input', async ()=>{
    const userId = new mongoose.Types.ObjectId().toHexString()
    const price = 20
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        price,
        userId,
        version: 0,
        status: OrderStatus.created
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            orderId: order.id,
            token: 'tok_visa'
        })
        .expect(201)


    const charges = await stripe.charges.list({limit:50})
    const charge = charges.data.find((no)=>{
        return no.amount === price * 100
    })

    expect(charge).toBeDefined()
    expect(charge?.currency).toEqual('usd')

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: charge?.id
    })

    expect(payment).not.toBeNull()
})