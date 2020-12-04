import { randomBytes } from 'crypto'
import nats, { Message } from 'node-nats-streaming'
import { TicketCreatedListener } from './event/ticket-created-listener'


const stan = nats.connect('ticketing', randomBytes(4).toString('hex'),{
    url: 'http://localhost:4222'
})

stan.on('connect', async () => {
    
    console.log('Listener connection NATS')

    stan.on('close', ()=>{
        console.log('Nats connection close!')
        process.exit()
    })

    new TicketCreatedListener(stan).listen()

})

process.on('SIGINT', ()=> stan.close())
process.on('SIGTERM', ()=> stan.close())