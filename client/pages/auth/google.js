import react, {useState,useEffect} from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'
import GoogleLogin from 'react-google-login'


const google = () => {
    const { doRequest , errors } = useRequest({
        url: '/api/users/googlelogin',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    })
    

    return <div>
        <GoogleLogin 
            clientId="919523538975-d30ovbeosvqjqo76t2fim3ojp0a3gbim.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={(user) => doRequest({email:user.profileObj.email,password:user.googleId})}
        />
        {errors}
    </div>
}


export default google