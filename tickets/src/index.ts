import mongoose from 'mongoose'
import { app } from './app'
import { OrderCancelledListener } from './events/listener/order-cancelled-listener'
import { OrderCreatedListener } from './events/listener/order-created-listener'
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
        console.log('ticket')
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
        new OrderCreatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()
        
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