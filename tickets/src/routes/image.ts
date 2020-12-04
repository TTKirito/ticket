import { NotAuthorizedError, NotFoundError, requestValidate, requiredAuth } from '@sgticket1thuan/common'
import express ,{ Request, Response} from 'express'
import { Ticket } from '../models/ticket'


const router = express.Router()

router.get('/api/tickets/:id/image',
async (req: Request, res: Response) =>{
   const ticket = await Ticket.findById(req.params.id)
   if(!ticket){
       throw new NotFoundError()
   }

   res.set('Content-Type','image/png')
   res.send(ticket.image)


})

export { router as imageTicketRouter }