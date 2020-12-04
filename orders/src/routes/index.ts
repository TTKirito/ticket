import { requiredAuth } from '@sgticket1thuan/common'
import express, {Request, Response} from 'express'
import { Order } from '../models/order'



const router = express.Router()

router.get('/api/orders',requiredAuth, async (req: Request, res: Response) =>{
    const order = await Order.find({userId:req.currentUser.id}).populate('ticket')

    res.send(order)
})


export { router as indexOrderRouter }