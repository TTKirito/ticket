import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import 'express-async-errors'


import { currentUser, errorHandler, NotFoundError } from '@sgticket1thuan/common'
import { deleteTicketRouter } from './routes/delete'
import { imageTicketRouter } from './routes/image'
import { indexTicketRouter } from './routes'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { updateTicketRouter } from './routes/update'

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


app.use(deleteTicketRouter)
app.use(imageTicketRouter)
app.use(indexTicketRouter)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export {app}