import 'bootstrap/dist/css/bootstrap.min.css'
import buildClient from '../api/build-client'
import Header from '../components/header'

const AppComponent = ({Component, pageProps,currentUser}) => {
    return (
        <div className="container">
            <Header currentUser={currentUser}/>
            <Component currentUser={ currentUser } {...pageProps}/>
        </div>
    )
}


AppComponent.getInitialProps = async (appContext,currentUser) =>{
    const client = buildClient(appContext.ctx)
    const { data } = await client.get('/api/users/currentUser')

    let pageProps = {}

    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,currentUser)
    }

    return {
        pageProps,
        ...data
    }
}

export default AppComponent