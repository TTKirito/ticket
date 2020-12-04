import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import 'express-async-errors'

import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { currentUserRouter } from './routes/current-user'
import { signoutRouter } from './routes/signout'
import { errorHandler, NotFoundError } from '@sgticket1thuan/common'
import { googleRouter } from './routes/google'

const app = express()
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))


app.use(signupRouter)
app.use(signinRouter)
app.use(currentUserRouter)
app.use(signoutRouter)
app.use(googleRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export {app}