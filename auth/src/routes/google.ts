import express, { Request, Response } from 'express'
import {body} from 'express-validator'
import jwt from 'jsonwebtoken'
import { requestValidate} from '@sgticket1thuan/common'
import { User } from '../models/user'

const router = express.Router()

router.post('/api/users/googlelogin', [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()//
        .notEmpty()
        .withMessage('password must be supply')
],
requestValidate,
async (req: Request, res: Response) => {
    const { email, password } = req.body
    console.clear()
    const existingUser = await User.findOne({ email })
    if(!existingUser) {
        const user = User.build({
            email: req.body.email,
            password: req.body.password
        })
        await user.save()

        const userJwt = jwt.sign({
            email: user.email,
            id: user.id
        }, process.env.JWT_KEY!)
    
        req.session = {
            jwt: userJwt
        }
        return res.status(201).send(user)
    }else{
        existingUser.set({
            email:req.body.email,
            password: req.body.password
        })
        await existingUser.save()
        const userJwt = jwt.sign({
            email: existingUser.email,
            id: existingUser.id
        }, process.env.JWT_KEY!)
    
        req.session = {
            jwt: userJwt
        }
        return res.status(200).send(existingUser)
    }
    
})


export { router as googleRouter }