import { NotAuthorizedError, NotFoundError, requiredAuth } from '@sgticket1thuan/common'
import express, {Request, Response} from 'express'
import { Order } from '../models/order'


const router = express.Router()

router.get('/api/orders/:id',requiredAuth, async (req: Request, res: Response) =>{
    const order = await Order.findById(req.params.id).populate('ticket')

    if(!order){
        throw new NotFoundError()
    }

    if(order.userId !== req.currentUser.id){
        throw new NotAuthorizedError()
    }

    res.send(order)

})


export { router as showOrdersRouter }