import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requestValidate, requiredAuth } from '@sgticket1thuan/common'
import express ,{Request, Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stipe'
import nodemailer from 'nodemailer'
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/payments',requiredAuth,[
    body('orderId')
        .not()
        .isEmpty()
        .custom((value:string) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('OrderId must be required')
],
requestValidate,
async (req: Request, res: Response)=>{
    const { orderId, token } = req.body

    const order = await Order.findById(orderId)

    if(!order){
        throw new NotFoundError()
    }


    if(order.userId !== req.currentUser.id){
        throw new NotAuthorizedError()
    }

    if(order.status === OrderStatus.Cancelled){
        throw new BadRequestError('cannot pay for an cancelled order')
    }


    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price*100,
        source: token
    })

    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })

    await payment.save()

    const smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth:{
            user:'thuanton98@gmail.com',
            pass:'thuan123321'
        }
    })

    smtpTransport.sendMail({
        from:'thuanton98@gmail.com',
        to: req.currentUser.email,
        subject:'hi',
        text: `you orderId: ${payment.orderId},price:${order.price*100}`
    })

    

    res.status(201).send({user: req.currentUser.email})
    new PaymentCreatedPublisher(natsWrapper.client).Publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
})

export {router as createPaymentRouter}