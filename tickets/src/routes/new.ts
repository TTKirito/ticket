import { requestValidate, requiredAuth, upload } from '@sgticket1thuan/common'
import express ,{ Request, Response} from 'express'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import sharp from 'sharp'
import { TicketCreatedPublisher } from '../events/publisher/ticket-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post('/api/tickets',requiredAuth,
upload.single('image'),
[
    body('title')
        .not()
        .isEmpty()
        .withMessage('title must be required'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('price must be greate 0')
],
requestValidate,
async (req: Request, res: Response) =>{
    const { title, price } = req.body
    const ticket = Ticket.build({
        userId: req.currentUser.id,
        title,
        price
    })

    if(req.file){
        const buffer = await sharp(req.file.buffer).resize({width: 350,height: 350}).png().toBuffer()
        ticket.set({
            image: buffer
        })
    }

    await ticket.save()

    res.status(201).send(ticket)

    new TicketCreatedPublisher(natsWrapper.client).Publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
})

export { router as createTicketRouter }