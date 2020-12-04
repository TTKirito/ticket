import express, { Request,Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, requestValidate } from '@sgticket1thuan/common'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signup',
[
    body('email')
        .isEmail()
        .withMessage("Email must be valid"),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage("Password between 4 to 20")
],
requestValidate,
async (req: Request, res: Response)=>{
    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if(existingUser){
        throw new BadRequestError('Email in use')
    }

    const user = User.build({
        email,
        password
    })

    await user.save()

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    },process.env.JWT_KEY!)

    req.session = {
        jwt: userJwt
    }
    
    res.status(201).send(user)

})

export { router as signupRouter }