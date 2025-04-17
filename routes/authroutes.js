import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Registro
router.post('/register', async(req, res)=>{
    const {username, password} = req.body
    try{
        const [existing] = await db.execute(
            'SELECT * FROM users WHERE username = ?', [username]
        )
        if(existing.length > 0) return res.status(400).send('Usuário já existe')
        const hashed = await bcrypt.hash(password, 10)
        await db.execute(
            'INSERT INTO users(username, password) VALUES (?, ?)',
            [username, hashed]
        )
        res.redirect('/login.html')
    } catch{
        res.status(500).send('Erro ao registrar usuário')
    }
})

//Login
router.post('/login', async(req, res)=>{
    const {username, password} = req.body
    try{
        const [users] = await db.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        )
        const user = users[0]
        if(!user) return res.status(400).send('Usuário não encontrado')
        const valid = await bcrypt.compare(password, user.password)
        if(!valid) return res.status(401).send('Senha incorreta')
        const token = jwt.sign(
        {id: user.id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({token})
    } catch {
        res.status(500).send('Erro ao fazer login')
    }
})

//Middlewares
function authMiddleware(req, res, next){
    const auth = req.headers.authorization
    if(!auth) return res.status(401).send('Token Ausente')
    const token = auth.split(' ')[1]
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch{
        res.status(403).send('Token inválido ou expirado')
    }
}
