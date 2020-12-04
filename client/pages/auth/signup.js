import { useState, useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const signup = () =>{
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const {errors,doRequest} = useRequest({
        url:'/api/users/signup',
        method: 'post',
        body:{
            email,
            password
        },
        onSuccess: () => Router.push('/')
    })
    const onSubmit = async (event) =>{
        event.preventDefault()
        await doRequest()
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email:</label>
                <input
                    className="form-control"
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input
                    className="form-control"
                    onChange={(e)=>setPassword(e.target.value)}
                    type="password"
                />
            </div>
            <button className="btn btn-primary">Sign Up</button>
            {errors}
        </form>
    )
}



export default signup