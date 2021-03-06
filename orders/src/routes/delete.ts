import { NotAuthorizedError, NotFoundError, OrderStatus, requiredAuth } from '@sgticket1thuan/common'
import express, {Request, Response} from 'express'
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher'
import { Order } from '../models/order'
import { natsWrapper } from '../nats-wrapper'


const router = express.Router()

router.delete('/api/orders/:id',requiredAuth, async (req: Request, res: Response) =>{
    const order = await Order.findById(req.params.id).populate('ticket')

    if(!order){
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser.id){
        throw new NotAuthorizedError()
    }

    order.set({
        status: OrderStatus.Cancelled
    })

    await order.save()


    new OrderCancelledPublisher(natsWrapper.client).Publish({
        id: order.id,
        version: order.version,
        ticket:{
            id: order.ticket.id
        }
    })

    res.send(order)

})


export { router as deleteOrdersRouter }