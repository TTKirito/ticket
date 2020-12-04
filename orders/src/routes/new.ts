import { BadRequestError, NotFoundError, OrderStatus, requestValidate, requiredAuth } from '@sgticket1thuan/common'
import express, {Request, Response} from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
const EXPIRATION_WINDOW_SECONDS = 1 * 60
const router = express.Router()

router.post('/api/orders', requiredAuth,[
    body('ticketId')
        .not()
        .isEmpty()
        .custom((value:string) => mongoose.Types.ObjectId.isValid(value))
        .withMessage('orderId is required')
],
requestValidate,
async (req: Request, res: Response) =>{
    const { ticketId } = req.body
    
    const ticket = await Ticket.findById(ticketId)

    if(!ticket){
        throw new NotFoundError()
    }

    const isReverved = await ticket.isReverved()

    if(isReverved){
        throw new BadRequestError('Ticket is reverved')
    }

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
        status: OrderStatus.created,
        userId: req.currentUser.id,
        expiresAt:  expiration,
        ticket
    })
    

    await order.save()

   new OrderCreatedPublisher(natsWrapper.client).Publish({
    id: order.id,
    userId: order.userId,
    version: order.version,
    expiresAt: order.expiresAt.toISOString(),
    status: order.status,
    ticket:{
        id: order.ticket.id,
        price: order.ticket.price
    }
    

    })

   res.status(201).send(order)

})


export { router as createdOrderRouter }