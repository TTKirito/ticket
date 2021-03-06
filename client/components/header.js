import Link from 'next/link'
import google from '../pages/auth/google'
const header = ({currentUser}) =>{

    const links = [
        !currentUser && { label: 'Sign Up', href:"/auth/signup"},
        !currentUser && { label: 'Sign In', href:"/auth/signin"},
        currentUser && { label: 'New Tickets', href: '/tickets/new' },
        currentUser && { label: 'My Orders', href: '/orders' },
        currentUser && { label: 'Sign Out', href:"/auth/signout"}

    
    
    ]
    .filter(linkConfig => linkConfig)
    .map(({label,href}) => {
        return (
            <li key={href} className="nav-item">
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </li>
        )
    })




    return (
        <nav className="navbar navbar-light bg-light ">
            <Link href="/">
                <a className="navbar-brand">Tixket</a>
            </Link>
            <div className="d-flex justify-context-end">
                <ul className="nav align-items-center">
                    {links}
                    {!currentUser && google()}
                </ul>
            </div>
        </nav>
    )
}


export default header