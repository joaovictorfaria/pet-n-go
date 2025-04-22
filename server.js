import express from 'express'
import path from 'path'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';



dotenv.config()
const app = express()
const port = process.env.PORT || 3006

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('pet-n-go/public'))
app.use('/api', routes)

app.listen(port, ()=>{
    console.log(`Servidor rodando em: http://localhost:${port} `)
})