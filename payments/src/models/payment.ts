import { OrderStatus } from '@sgticket1thuan/common';
import mongoose from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface OrderAttrs {
    orderId: string,
    stripeId: string
}

interface OrderDoc extends mongoose.Document{
   orderId: string,
   stripeId: string
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc
}

const paymentSchema = new mongoose.Schema({
    orderId:{
        type: String,
        required: true
    },
    stripeId:{
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    },timestamps: true
})

paymentSchema.set('versionKey','version')
paymentSchema.plugin(updateIfCurrentPlugin)

paymentSchema.statics.build = (attrs: OrderAttrs) => {
    return new Payment(attrs)
}




const Payment = mongoose.model<OrderDoc,OrderModel>('Payment',paymentSchema)
export {Payment}