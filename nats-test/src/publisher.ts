import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './event/ticket-created-publisher'


console.clear()

const stan = nats.connect('ticketing', 'abc',{
    url:'http://localhost:4222'
})

stan.on('connect', async ()=>{
    console.log('Publisher connected to NATS')

    const publish = new TicketCreatedPublisher(stan)
    try{
        publish.Publish({
            id: 'ad2323',
            userId: 'adsf',
            title: 'money',
            price: 20,
            version: 0
        })
    }catch(err){
        console.error()
    }
})