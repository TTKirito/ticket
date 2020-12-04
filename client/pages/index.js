import Link from 'next/link'
import {useState} from 'react'

const LandingPage = ({currentUser,tickets, totalPage, page}) =>{

    const ticketList = tickets.map((ticket) => {
           return( <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                  <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                  </Link>
                </td>
            </tr>)
        })
    
        const pagination = (totalPage, page) => {
            let pageNumber = []
            for(let i = 1 ; i <= totalPage ; i ++){
              pageNumber.push(i)
            }
            return (
              <div className="container">
                <button className="btn btn-primary" disabled={page <= 1} onClick={() => parseInt(page)===1 ? Router.push('/') : Router.push(`/?page=${page - 1}`)}>Previous</button>
                {pageNumber.map((pages) => (
                  <button 
                    disabled={page === pages}
                    key={pages}
                    className="btn btn-primary"
                    onClick={() => { 
                      parseInt(pages) === 1
                        ? Router.push('/')
                        : Router.push(`/?page=${pages}`)
                    }}
                  >{pages} 
                  </button>
                ))}
                <button className="btn btn-primary" disabled={page >= totalPage} onClick={() => Router.push(`/?page=${page + 1}`)}>Next</button>
              </div>
            )
          }
          const selectFile = (page) => {
            const [sort, setSort] = useState('')
            const handleChange = (e) => {
              e.preventDefault()
              setSort(e.target.value)
              page === 1 
                ? Router.push(`/?sort=${e.target.value}`)
                : Router.push(`/?page=${page}&sort=${e.target.value}`)
            }
            
            return (
             <div>
                <select 
                value={sort}
                onChange={handleChange} 
                >
                  <option value="-createdAt">Date</option>
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                </select>
             </div>
            )
          }
        

    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
            {totalPage > 1 && pagination(totalPage, page)}
            {selectFile(page)}
        </div>
    )


}

LandingPage.getInitialProps = async (context,client) =>{
    const limit = 5
    const page = parseInt(context.query.page)|| 1
    const sort = context.query.sort || '-createdAt'
    const { data } = await client.get(`/api/tickets?page=${page}&limit=${limit}&sort=${sort}`)
    return {tickets: data.ticket, totalPage:data.pagination.totalPage, page}
}


export default LandingPage