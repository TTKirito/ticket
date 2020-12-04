import { OrderStatus } from '@sgticket1thuan/common'
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { TicketDoc } from './ticket'

export {OrderStatus}


interface OrderAttrs {
    userId: string
    ticket: TicketDoc
    status: OrderStatus
    expiresAt: Date
}

interface OrderDoc extends mongoose.Document{
    ticket: TicketDoc,
    userId: string,
    version: number
    status: OrderStatus
    expiresAt: Date
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    ticket:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    userId:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.created

    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    }
},{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    },
    timestamps: true
})

orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)
orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema)
export { Order}