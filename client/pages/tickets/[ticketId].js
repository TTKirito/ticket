
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const showTicket = ({ticket}) => {
    const {errors, doRequest} = useRequest({
        url: '/api/orders',
        method: 'post',
        body:{
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]',`/orders/${order.id}`)    })


    return (
        <div className="container">
            <div>
                <h4>Title: {ticket.title}</h4>
                <h4>Price: {ticket.price}</h4>
                <img src={`/api/tickets/${ticket.id}/image`} alt={ticket.image} style={{width:350,height:350}} />
            </div>
            <button className="btn btn-primary" onClick={() => {doRequest()}}>Purchare</button>
            {errors}
        </div>
    )
}


showTicket.getInitialProps = async (context,client,currentUser) =>{
    const {ticketId} = context.query
    const { data } = await client.get(`/api/tickets/${ticketId}`)

    return {ticket: data}
}

export default showTicket