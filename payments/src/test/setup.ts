import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'


declare global{
    namespace NodeJS{
        interface Global{
            signin(id?:string): string[]
        }
    }
}

jest.setTimeout(30000)
jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51HTXtMBXnrusYhf0YsWb8Xpu2nZhqmwWOmPH8IhZc6hruJUyYTdNnAC52ji4jFQYIeyiS75seS8o204s1JgYaGLk00fbD8YIcS'

let mongo:any
beforeAll(async ()=>{
    process.env.JWT_KEY = 'thuan'
    process.env.NODE_TLS_EJECT_UNAUTHORIZED = '0'
    mongo = new MongoMemoryServer()
    const mongoUri = await mongo.getUri()
    await mongoose.connect(mongoUri,{
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
})

beforeEach(async ()=>{
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for(let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll(async ()=>{
    await mongo.stop()
    await mongoose.connection.close()
})

global.signin =  (id?:string) =>{
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com' 
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!)

    const session = { jwt: token}

    const sessionJSON = JSON.stringify(session)

    const base64 = Buffer.from(sessionJSON).toString('base64')

    return [`express:sess=${base64}`]
}