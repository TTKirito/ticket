import { NotAuthorizedError, NotFoundError, requestValidate, requiredAuth, upload } from '@sgticket1thuan/common'
import express ,{ Request, Response} from 'express'
import { body } from 'express-validator'
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.put('/api/tickets/:id',requiredAuth,[
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title must be required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be greated than 0')
],
requestValidate,
async (req: Request, res: Response) =>{
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        throw new NotFoundError()
    }

    if(ticket.userId !== req.currentUser.id){
        throw new NotAuthorizedError()
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price

    })
    await ticket.save()

    res.send(ticket)
    new TicketUpdatedPublisher(natsWrapper.client).Publish({
        id: ticket.id,
        version: ticket.version,
        userId: ticket.userId,
        price: ticket.price,
        title: ticket.title
    })
})

export { router as updateTicketRouter }