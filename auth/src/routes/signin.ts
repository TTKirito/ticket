import express, { Request,Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, requestValidate } from '@sgticket1thuan/common'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password must be supply')
],
requestValidate,
async (req: Request, res: Response)=>{
    const { email, password } = req.body
    const existingUser = await User.findOne({email})

    if(!existingUser){
        throw new BadRequestError('Invalid creditian')
    }

    const isMatch = await Password.comparePassword(existingUser.password, password)

    if(!isMatch){
        throw new BadRequestError('Invalid creditian')
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },process.env.JWT_KEY!)
    
    req.session = {
        jwt: userJwt
    }

    res.send(existingUser)
    
})

export { router as signinRouter }