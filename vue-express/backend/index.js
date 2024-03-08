import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import FriendsRouter from './routes/friends.js';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';



config();

import { addUser,checkUser, getFriends } from './models/database.js';

const PORT = process.env.PORT ||  3466;

const app = express()

const authen = (req,res,next) =>{
    let {cookie} = req.headers
    let tokenInHeader = cookie && cookie.split('=')[1]
    if(tokenInHeader===null) res.sendStatus(401)
    jwt.verify(tokenInHeader,process.env.SECRET_KEY,(err,user)=>{
        if (err) return     res.sendStatus(403)
           req.user = user
            next()
    })
    console.log(cookie);
}

app.use(cors({
    origin:'http://localhost:8081',
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use (express.static('public'))
app.use('/friends', authen,FriendsRouter)

app.get('/friends',authen, async (req,res)=>{
    res.send(await getFriends())
})


app.post('/login', (req,res)=>{
    res.json({message:'You have logged in!!'})
})
app.post('/users', (req, res)=>{
    const {username, password }= req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
        if(err) throw err
    await addUser(username, hash)
        res.send({
            msg: "You have created an account"
        })
    })
})

const auth= async(req,res,next)=>{ 
    const {username, password} = req.body
    const hashpassword = await checkUser(username)
    bcrypt.compare(password,hashpassword,(err, result)=>{
        if(err) throw err
        if(result === true){
            const {username} = req.body
            const token = jwt.sign({username:username},
            process.env.SECRET_KEY,{expiresIn: '1hr'})
            // true only backend user can access no frontend
            // res.cookie('jwt',token,{ httpOnly:true })
                res.send({
                    token:token,
                    msg:'You have logged out'
                })
            next()
        }
        else{
            res.send({
                msg:'Passwords doesn\'t match'
            })
        }
})
} 
app.post('/login',auth, (req,res)=>{
})

app.delete('/logout',(req,res)=>{
    res.clearCookie("jwt")
    // res.send({
    //     msg:'You have logged out'
    // })
})

app.listen(PORT, () =>
console.log(`Server is running on http://localhost:${PORT}`))
