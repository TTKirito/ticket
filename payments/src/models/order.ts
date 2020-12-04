import { OrderStatus } from '@sgticket1thuan/common';
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttrs {
    id: string,
    version: number,
    status: OrderStatus,
    userId: string,
    price: number
}

interface OrderDoc extends mongoose.Document{
    userId: string,
    price: number,
    version: number,
    status: OrderStatus
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc
}

const orderSchema = new mongoose.Schema({
    status:{
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.created,
        required: true
    },
    userId:{
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

orderSchema.set('versionKey','version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        userId: attrs.userId,
        version: attrs.version,
        status: attrs.status,
        price: attrs.price
    })
}




const Order = mongoose.model<OrderDoc,OrderModel>('Order',orderSchema)
export {Order}