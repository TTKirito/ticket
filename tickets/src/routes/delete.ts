import { NotAuthorizedError, NotFoundError, requiredAuth } from '@sgticket1thuan/common'
import express ,{ Request, Response} from 'express'
import { Ticket } from '../models/ticket'


const router = express.Router()

router.delete('/api/tickets/:id',requiredAuth,
async (req: Request, res: Response) =>{
   const ticket = await Ticket.findByIdAndDelete(req.params.id)
   if(!ticket){
       throw new NotFoundError()
   }

   if(ticket.userId !== req.currentUser.id){
       throw new NotAuthorizedError()
   }


})

export { router as deleteTicketRouter }