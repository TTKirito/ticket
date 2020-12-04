import { useEffect, useState } from "react"
import StripCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const showOrder = ({order, currentUser}) =>{
   const [timeLeft, setTimeLeft] = useState(0)
   const { doRequest , errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: () => Router.push('/orders')
    })
    useEffect(() => {
        const findTimeLeft = () =>{
            const msLeft = new Date(order.expiresAt)- new Date()
            setTimeLeft(Math.round(msLeft/1000))
        }
        findTimeLeft()

        const timeId = setInterval(findTimeLeft, 1000)
        
        return () => {
            clearInterval(timeId)
        }
    },[order])
    
    if(timeLeft<0) {
        return <div>Order Expired</div>
    }

    return <div>
        Time Left to pay: {timeLeft} seconds
        <StripCheckout
            token={({id}) => doRequest({token: id})}
            stripeKey="pk_test_51HTXtMBXnrusYhf0BVJhYfVa4eEzvb1LemAOhhbqSDCq8RpbX3RcGCUcDyETBdX1umBASsopML0j562lRhq57wVo008pwB4eSj"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
}


showOrder.getInitialProps = async (context, client,currentUser) => {
    const {orderId} = context.query
    const { data } = await client.get(`/api/orders/${orderId}`)
    return {order: data}
}

export default showOrder