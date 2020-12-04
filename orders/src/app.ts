import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import 'express-async-errors'


import { currentUser, errorHandler, NotFoundError } from '@sgticket1thuan/common'
import { deleteOrdersRouter } from './routes/delete'
import { indexOrderRouter } from './routes'
import { showOrdersRouter } from './routes/show'
import { createdOrderRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())


app.use(currentUser)

app.use(deleteOrdersRouter)
app.use(indexOrderRouter)
app.use(showOrdersRouter)
app.use(createdOrderRouter)


app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export {app}