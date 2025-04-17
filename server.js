import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'

dotenv.config()
const app = express()
const port = proccess.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api', routes)

app.listen(port, ()=>{
    console.log(`Servidor rodando em: http://localhost:${port} `)
})