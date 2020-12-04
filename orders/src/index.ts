import mongoose from 'mongoose'
import { app } from './app'
import { ExpirationCompleteListener } from './events/listenner/expiration-complete-listener'
import { PaymentsCreatedListener } from './events/listenner/payment-complete-listener'
import { TicketCreatedListener } from './events/listenner/ticket-created-listener'
import { TicketUpdateLitener } from './events/listenner/ticket-update-listener'

import { natsWrapper } from './nats-wrapper'

const start = async () => {

    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined')
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined')
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('CLUSTER_ID must be defined')
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('CLIENT_ID must be defined')
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined')
    }


    try {

        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        )
        
        natsWrapper.client.on('close',() => {
            console.log('NATS connection closed!')
            process.exit()
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        

        new TicketCreatedListener(natsWrapper.client).listen()
        new TicketUpdateLitener(natsWrapper.client).listen()
        new ExpirationCompleteListener(natsWrapper.client).listen()
        new PaymentsCreatedListener(natsWrapper.client).listen()
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        console.log('MongDB connected!')
    
    } catch(err){
        console.error(err)
    }


    app.listen(3000, () => {
        console.log(`Server is running at 3000`)
    })
}


start()