import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

//Registro
router.post('/register', async(req, res)=>{
    const {nome, sobrenome, email, password} = req.body
    try{
        const [existing] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ?', [email]
        )
        if(existing.length > 0) return res.status(400).send('Usuário já existe')
        const hashed = await bcrypt.hash(password, 10)
        await db.execute(
            'INSERT INTO usuarios(nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)',
            [nome, sobrenome, email , hashed]
        )
        res.redirect('/login.html')
    } catch (err){
        console.error(err)
        res.status(500).send('Erro ao registrar usuário')
    }
})

//Login
router.post('/login', async(req, res)=>{
    const {email, password} = req.body
    try{
        const [users] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        )
        const user = users[0]
        if(!user) return res.status(400).send('Usuário não encontrado!')
        const valid = await bcrypt.compare(password, user.senha)
        if(!valid) return res.status(401).send('Senha incorreta!')
        const token = jwt.sign(
        {id: user.idUsuario, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    res.json({token})
    } catch (err) {
        console.error(err) 
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

//Rotas Privadas
router.get('/private', authMiddleware, (req, res)=>{
    res.json({message: `Bem-Vindo, ${req.user.username}`})
})

//Buscar Usuário
router.get('/usuario', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT nome FROM usuarios WHERE idUsuario = ?',
            [req.user.id]
        )
        const usuario = rows[0];
        res.json({ nome: usuario.nome });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar usuário');
    }
})

//Agendar
router.post('/agendar', authMiddleware, async (req, res) => {
    const {nomePet, servico, data, hora, fkImagem} = req.body
    const userId = req.user.id

    try{
        console.log({ userId, nomePet, servico, data, hora, fkImagem })
        await db.execute(
            'INSERT INTO agendamentos (fkUsuario, nomePet, servico, data_agendada, horario, fkImagem) VALUES (?, ?, ?, ?, ?, ?)', [userId, nomePet, servico, data, hora, fkImagem]
        )
        res.status(201).send('Agendamento realizado com sucesso!')
    } catch (err){
        console.error(err)
        res.status(500).send('Erro ao realizar agendamento')
    }
})

//Buscar agendamentos
router.get('/agendamentos', authMiddleware, async (req, res) =>{
    const userId = req.user.id

    try{
        const [rows] = await db.execute(
            `SELECT agendamentos.*, images.filepath AS fotoPet
            FROM agendamentos
            LEFT JOIN images ON agendamentos.fkImagem = images.id
            WHERE agendamentos.fkUsuario = ?`,
            [userId]
        )
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).send('Erro ao buscar agendamentos')
    }
})

//Upload de Imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads'
        if (!fs.existsSync(dir)) fs.mkdirSync(dir)
            cb(null, dir)
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

const upload = multer({storage})

router.post('/upload', authMiddleware, upload.single('foto'), async (req, res) => {
    console.log('req.file =>', req.file)
    const file = req.file
    if (!file) return res.status(400).send('Nenhum arquivo enviado.')

      try{
        const [result] = await db.execute(
            'INSERT INTO images (filename, filepath) VALUES (?, ?)',
            [file.filename, file.path]
        )
        res.status(201).json({imageId: result.insertId})
      } catch (err){
        console.error(err)
        res.status(500).send('Erro ao salvar imagem no banco')
      }
})

//Deletar agendamento
router.delete('/agendamentos/:id', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const agendamentoId = req.params.id;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM agendamentos WHERE idAgendamento = ? AND fkUsuario = ?', [agendamentoId, userId]
        )

        if (rows.length === 0){
            return res.status(404).send('Agendamento não encontrado ou acesso negado')
        }

        await db.execute(
            'DELETE FROM agendamentos WHERE idAgendamento = ?',
            [agendamentoId]
        )

        res.status(200).send('Agendamento excluído com sucesso!')
    } catch (err) {
        console.error(err)
        res.status(500).send('Erro ao excluir agendamento')
    }
})

//Editar agendamento
router.put('/agendamentos/:id', authMiddleware, async (req, res) => {
    const {id} = req.params
    const {nomePet, servico, data, hora, fkImagem} = req.body
    const userId = req.user.id

    try {
        const [result] = await db.execute(
            'UPDATE agendamentos SET nomePet = ?, servico = ?, data_agendada = ?, horario = ?, fkImagem = ? WHERE idAgendamento = ? AND fkUsuario = ?',
            [nomePet, servico, data, hora, fkImagem, id, userId]
        )

        if (result.affectedRows === 0) {
            return res.status(404).send('Agendamento não encontrado')
        }  else {
            res.send('Agendamento atualizado com sucesso!')
        }
        
    } catch (err) {
        console.error(err)
        res.status(500).send('Erro ao atualizar agendamento')
    }
})


export default router