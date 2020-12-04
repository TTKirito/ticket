import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order'


interface TicketAttrs {
    title: string,
    price: number,
    id: string
    version: number
}

export interface TicketDoc extends mongoose.Document{
    title: string,
    price: number,
    version: number,
    isReverved(): Promise<boolean>
}


export interface TicketModel extends mongoose.Model<TicketDoc>{
    build(attrs: TicketAttrs): TicketDoc
    findByEvent(event:{
        id: string,
        version: number
    }
    ):Promise<TicketDoc | null>
}

const ticketShema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    },timestamps: true
})

ticketShema.set('versionKey','version')
ticketShema.plugin(updateIfCurrentPlugin)

ticketShema.statics.findByEvent = async (event: {id:string,version: number}) =>{
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}


ticketShema.methods.isReverved = async function(){
    const existingOrder = await Order.findOne({
        ticket: this,
        status:{
            $in:[
                OrderStatus.Complete,
                OrderStatus.created,
                OrderStatus.AwaitingPayment
            ]
        }
    })


    return !!existingOrder
}

ticketShema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price:attrs.price,
        version: attrs.version
    })
}

const Ticket = mongoose.model<TicketDoc,TicketModel>('Ticket',ticketShema)
export { Ticket }